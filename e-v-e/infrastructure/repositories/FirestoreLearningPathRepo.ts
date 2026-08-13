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
    try {
      const docRef = doc(db, COLLECTION_NAME, lpathId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return this.mapDocToLearningPath(snap.id, snap.data());
    } catch (error) {
      console.error("Error getting learning path by ID:", error);
      return null;
    }
  }

  async getAllLearningPaths(): Promise<LearningPath[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTION_NAME));
      return snap.docs.map((d) => this.mapDocToLearningPath(d.id, d.data()));
    } catch (error) {
      console.error("Error getting all learning paths:", error);
      return [];
    }
  }

  async getAcceptedLearningPaths(): Promise<LearningPath[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("is_accepted", "==", true)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => this.mapDocToLearningPath(d.id, d.data()));
    } catch (error) {
      console.error("Error getting accepted learning paths:", error);
      return [];
    }
  }

  async getLearningPathsByAuthor(authorId: string): Promise<LearningPath[]> {
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
  }

  async createLearningPath(input: CreateLearningPathInput): Promise<LearningPath> {
    const newDocRef = doc(collection(db, COLLECTION_NAME));
    const lpathId = newDocRef.id;

    const payload = {
      id: lpathId,
      title: input.title,
      description: input.description,
      author_id: input.authorId,
      courses: input.courses,
      is_accepted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setDoc(newDocRef, payload);

    return this.mapDocToLearningPath(lpathId, payload);
  }

  async updateLearningPath(
    lpathId: string,
    data: Partial<LearningPath>
  ): Promise<LearningPath> {
    const docRef = doc(db, COLLECTION_NAME, lpathId);

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.courses !== undefined) updatePayload.courses = data.courses;
    if (data.isAccepted !== undefined) updatePayload.is_accepted = data.isAccepted;

    await updateDoc(docRef, updatePayload);

    const updatedSnap = await getDoc(docRef);
    return this.mapDocToLearningPath(updatedSnap.id, updatedSnap.data());
  }

  async approveLearningPath(lpathId: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, lpathId);
      await updateDoc(docRef, {
        is_accepted: true,
        updated_at: new Date().toISOString(),
      });
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
      return true;
    } catch (error) {
      console.error("Error deleting learning path:", error);
      return false;
    }
  }
}
