import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LearningPath } from "@/core/entities/LearningPath";
import {
  LearningPathPort,
  CreateLearningPathInput,
} from "@/core/ports/LearningPathPort";
import { cacheService } from "@/lib/cacheService";

const COLLECTION_NAME = "learning_path";

export class FirestoreLearningPathRepo implements LearningPathPort {
  private mapDocToLearningPath(id: string, data: any): LearningPath {
    return {
      id,
      lpathId: data.id || id,
      title: data.title || "",
      description: data.description || "",
      authorId: data.author_id || "",
      courses: Array.isArray(data.courses) ? data.courses : [],
      isAccepted: Boolean(data.is_accepted),
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  }

  async getLearningPathById(lpathId: string): Promise<LearningPath | null> {
    return cacheService.getOrFetch(
      `learning_path_${lpathId}`,
      async () => {
        try {
          const docRef = doc(db, COLLECTION_NAME, lpathId);
          const snap = await getDoc(docRef);
          if (!snap.exists()) return null;
          return this.mapDocToLearningPath(snap.id, snap.data());
        } catch (error) {
          console.error("Error getting learning path by ID:", error);
          return null;
        }
      },
      { ttlMs: 60000 }
    );
  }

  async getAllLearningPaths(): Promise<LearningPath[]> {
    return cacheService.getOrFetch(
      "learning_paths_all",
      async () => {
        try {
          const snap = await getDocs(collection(db, COLLECTION_NAME));
          return snap.docs.map((d) => this.mapDocToLearningPath(d.id, d.data()));
        } catch (error) {
          console.error("Error getting all learning paths:", error);
          return [];
        }
      },
      { ttlMs: 60000 }
    );
  }

  async getAcceptedLearningPaths(): Promise<LearningPath[]> {
    return cacheService.getOrFetch(
      "learning_paths_accepted",
      async () => {
        try {
          const [pathsSnap, coursesSnap] = await Promise.all([
            getDocs(query(collection(db, COLLECTION_NAME), where("is_accepted", "==", true))),
            getDocs(collection(db, "courses")),
          ]);

          const acceptedCourseIds = new Set<string>();
          coursesSnap.docs.forEach((d) => {
            const cData = d.data();
            if (cData.isAccepted ?? cData.is_accepted) {
              acceptedCourseIds.add(d.id);
            }
          });

          const validPaths: LearningPath[] = [];
          pathsSnap.docs.forEach((d) => {
            const pathObj = this.mapDocToLearningPath(d.id, d.data());
            const courseList = Array.isArray(pathObj.courses) ? pathObj.courses : [];
            // Ràng buộc một chiều: Nếu có bất kỳ course nào chưa duyệt, ẩn cả lộ trình
            const allCoursesAccepted =
              courseList.length > 0 && courseList.every((cId: string) => acceptedCourseIds.has(cId));

            if (allCoursesAccepted) {
              validPaths.push(pathObj);
            }
          });

          return validPaths;
        } catch (error) {
          console.error("Error getting accepted learning paths:", error);
          return [];
        }
      },
      { ttlMs: 60000 }
    );
  }

  async getLearningPathsByAuthor(authorId: string): Promise<LearningPath[]> {
    return cacheService.getOrFetch(
      `learning_paths_author_${authorId}`,
      async () => {
        try {
          const q = query(
            collection(db, COLLECTION_NAME),
            where("author_id", "==", authorId)
          );
          const snap = await getDocs(q);
          return snap.docs.map((d) => this.mapDocToLearningPath(d.id, d.data()));
        } catch (error) {
          console.error("Error getting learning paths by author:", error);
          return [];
        }
      },
      { ttlMs: 60000 }
    );
  }

  async createLearningPath(input: CreateLearningPathInput): Promise<LearningPath> {
    try {
      const newDocRef = doc(collection(db, COLLECTION_NAME));
      const payload = {
        title: input.title,
        description: input.description,
        author_id: input.authorId,
        courses: input.courses,
        is_accepted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await setDoc(newDocRef, payload);
      cacheService.invalidate(/learning_path/);
      return this.mapDocToLearningPath(newDocRef.id, payload);
    } catch (error) {
      console.error("Error creating learning path:", error);
      throw error;
    }
  }

  async updateLearningPath(
    lpathId: string,
    data: Partial<LearningPath>
  ): Promise<LearningPath> {
    try {
      const docRef = doc(db, COLLECTION_NAME, lpathId);
      const updatePayload: any = {
        updated_at: new Date().toISOString(),
      };
      if (data.title !== undefined) updatePayload.title = data.title;
      if (data.description !== undefined) updatePayload.description = data.description;
      if (data.authorId !== undefined) updatePayload.author_id = data.authorId;
      if (data.courses !== undefined) updatePayload.courses = data.courses;
      if (data.isAccepted !== undefined) updatePayload.is_accepted = data.isAccepted;

      await updateDoc(docRef, updatePayload);
      cacheService.invalidate(/learning_path/);
      const updated = await this.getLearningPathById(lpathId);
      if (!updated) throw new Error("Learning path not found after update");
      return updated;
    } catch (error) {
      console.error("Error updating learning path:", error);
      throw error;
    }
  }

  async approveLearningPath(lpathId: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, lpathId);
      await updateDoc(docRef, {
        is_accepted: true,
        updated_at: new Date().toISOString(),
      });
      cacheService.invalidate(/learning_path/);
      return true;
    } catch (error) {
      console.error("Error approving learning path:", error);
      return false;
    }
  }

  async deleteLearningPath(lpathId: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, lpathId);
      await deleteDoc(docRef);
      cacheService.invalidate(/learning_path/);
      return true;
    } catch (error) {
      console.error("Error deleting learning path:", error);
      return false;
    }
  }
}
