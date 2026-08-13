import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  collection,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/core/entities/Course";
import { CoursePort } from "@/core/ports/CoursePort";

function mapDocToCourse(docId: string, data: any): Course {
  return {
    id: docId,
    courseId: data.course_id || data.id || docId,
    title: data.title || "",
    japaneseTitle: data.japanese_title || "",
    subtitle: data.subtitle || "",
    description: data.description || "",
    instructorId: data.instructor_id || data.author_id || "",
    authorId: data.author_id || data.instructor_id || "",
    isPublished: data.is_published ?? true,
    isAccepted: data.is_accepted ?? false,
    thumbnailUrl: data.thumbnail_url || "",
    bannerUrl: data.banner_url || "",
    tags: data.tags || [],
    categoryId: data.category_id || "",
    price: data.price || 0,
    totalDuration: data.total_duration || "",
    studentsCount: data.students_count || 0,
    contentData: data.content_data || [],
    createdAt:
      data.created_at instanceof Timestamp
        ? data.created_at.toDate()
        : new Date(data.created_at || Date.now()),
    updatedAt:
      data.updated_at instanceof Timestamp
        ? data.updated_at.toDate()
        : new Date(data.updated_at || Date.now()),
  };
}

function mapCourseToDoc(
  course: Omit<Course, "id" | "createdAt" | "updatedAt"> & {
    createdAt?: Date;
    updatedAt?: Date;
  }
) {
  const cid = course.courseId || `crs_${Date.now()}`;
  return {
    id: cid,
    _id: cid,
    course_id: cid,
    title: course.title,
    japanese_title: course.japaneseTitle || "",
    subtitle: course.subtitle || "",
    description: course.description || "",
    instructor_id: course.instructorId || course.authorId || "",
    author_id: course.authorId || course.instructorId || "",
    is_published: course.isPublished,
    is_accepted: course.isAccepted,
    thumbnail_url: course.thumbnailUrl || "",
    banner_url: course.bannerUrl || "",
    tags: course.tags || [],
    category_id: course.categoryId || "",
    price: course.price || 0,
    total_duration: course.totalDuration || "",
    students_count: course.studentsCount || 0,
    content_data: course.contentData || [],
    created_at: course.createdAt
      ? Timestamp.fromDate(course.createdAt)
      : Timestamp.now(),
    updated_at: Timestamp.now(),
  };
}

export class FirestoreCourseRepo implements CoursePort {
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const docRef = doc(db, "courses", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return mapDocToCourse(docSnap.id, docSnap.data());
    } catch (error) {
      console.error("Firestore getCourseById error:", error);
      return null;
    }
  }

  async getCourseByCustomId(courseId: string): Promise<Course | null> {
    try {
      const docRef = doc(db, "courses", courseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return mapDocToCourse(docSnap.id, docSnap.data());
      }
      const q = query(
        collection(db, "courses"),
        where("course_id", "==", courseId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      const snap = querySnapshot.docs[0];
      return mapDocToCourse(snap.id, snap.data());
    } catch (error) {
      console.error("Firestore getCourseByCustomId error:", error);
      return null;
    }
  }

  async createCourse(
    course: Omit<Course, "id" | "createdAt" | "updatedAt">
  ): Promise<Course> {
    const docData = mapCourseToDoc(course);
    const cid = docData.course_id;
    await setDoc(doc(db, "courses", cid), docData);
    const docSnap = await getDoc(doc(db, "courses", cid));
    return mapDocToCourse(docSnap.id, docSnap.data()!);
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const docRef = doc(db, "courses", id);
    const updateData: any = {};
    if (course.courseId !== undefined) {
      updateData.course_id = course.courseId;
      updateData.id = course.courseId;
      updateData._id = course.courseId;
    }
    if (course.title !== undefined) updateData.title = course.title;
    if (course.japaneseTitle !== undefined)
      updateData.japanese_title = course.japaneseTitle;
    if (course.subtitle !== undefined) updateData.subtitle = course.subtitle;
    if (course.description !== undefined)
      updateData.description = course.description;
    if (course.instructorId !== undefined)
      updateData.instructor_id = course.instructorId;
    if (course.authorId !== undefined) updateData.author_id = course.authorId;
    if (course.isPublished !== undefined)
      updateData.is_published = course.isPublished;
    if (course.isAccepted !== undefined)
      updateData.is_accepted = course.isAccepted;
    if (course.thumbnailUrl !== undefined)
      updateData.thumbnail_url = course.thumbnailUrl;
    if (course.bannerUrl !== undefined)
      updateData.banner_url = course.bannerUrl;
    if (course.tags !== undefined) updateData.tags = course.tags;
    if (course.categoryId !== undefined)
      updateData.category_id = course.categoryId;
    if (course.price !== undefined) updateData.price = course.price;
    if (course.totalDuration !== undefined)
      updateData.total_duration = course.totalDuration;
    if (course.studentsCount !== undefined)
      updateData.students_count = course.studentsCount;
    if (course.contentData !== undefined)
      updateData.content_data = course.contentData;
    updateData.updated_at = Timestamp.now();

    await updateDoc(docRef, updateData);
    const updatedSnap = await getDoc(docRef);
    return mapDocToCourse(updatedSnap.id, updatedSnap.data()!);
  }

  async deleteCourse(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, "courses", id));
      return true;
    } catch (error) {
      console.error("Firestore deleteCourse error:", error);
      return false;
    }
  }

  async getTeacherCourses(teacherId: string): Promise<Course[]> {
    try {
      const q = query(
        collection(db, "courses"),
        where("author_id", "==", teacherId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) =>
        mapDocToCourse(doc.id, doc.data())
      );
    } catch (error) {
      console.error("Firestore getTeacherCourses error:", error);
      return [];
    }
  }

  async getAllCourses(onlyAccepted?: boolean): Promise<Course[]> {
    try {
      let q = query(collection(db, "courses"));
      if (onlyAccepted) {
        q = query(collection(db, "courses"), where("is_accepted", "==", true));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) =>
        mapDocToCourse(doc.id, doc.data())
      );
    } catch (error) {
      console.error("Firestore getAllCourses error:", error);
      return [];
    }
  }

  async approveCourse(id: string, approve: boolean): Promise<boolean> {
    try {
      const docRef = doc(db, "courses", id);
      await updateDoc(docRef, {
        is_accepted: approve,
        updated_at: Timestamp.now(),
      });
      return true;
    } catch (error) {
      console.error("Firestore approveCourse error:", error);
      return false;
    }
  }
}
