import { adminDb } from '@/infrastructure/firebase/firebaseAdmin';
import { Announcement } from '@/core/entities/Announcement';
import { AnnouncementRepository } from '@/core/ports/AnnouncementRepository';

const COLLECTION = 'announcements';

function toAnnouncement(id: string, data: FirebaseFirestore.DocumentData): Announcement {
  return {
    id,
    courseId: data.courseId ?? '',
    authorId: data.authorId ?? '',
    authorName: data.authorName ?? 'Giảng viên',
    authorAvatar: data.authorAvatar ?? undefined,
    title: data.title ?? '',
    content: data.content ?? '',
    isImportant: data.isImportant ?? false,
    createdAt: data.createdAt?.toDate() ?? new Date(),
  };
}

export class FirebaseAnnouncementRepo implements AnnouncementRepository {
  async getAnnouncementsByCourse(courseId: string): Promise<Announcement[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where('courseId', '==', courseId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => toAnnouncement(doc.id, doc.data()));
  }

  async saveAnnouncement(announcement: Announcement): Promise<void> {
    await adminDb.collection(COLLECTION).doc(announcement.id).set({
      courseId: announcement.courseId,
      authorId: announcement.authorId,
      authorName: announcement.authorName,
      authorAvatar: announcement.authorAvatar ?? null,
      title: announcement.title,
      content: announcement.content,
      isImportant: announcement.isImportant,
      createdAt: announcement.createdAt,
    });
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await adminDb.collection(COLLECTION).doc(id).delete();
  }
}
