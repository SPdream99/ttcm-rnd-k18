import { adminDb } from '@/infrastructure/firebase/firebaseAdmin';
import { Discussion } from '@/core/entities/Discussion';
import { DiscussionRepository } from '@/core/ports/DiscussionRepository';

const COLLECTION = 'discussions';

function toDiscussion(id: string, data: FirebaseFirestore.DocumentData): Discussion {
  return {
    id,
    courseId: data.courseId ?? '',
    lessonId: data.lessonId ?? undefined,
    authorId: data.authorId ?? '',
    authorName: data.authorName ?? 'Thành viên E-V-E',
    authorRole: data.authorRole ?? 'student',
    authorAvatar: data.authorAvatar ?? undefined,
    title: data.title ?? '',
    content: data.content ?? '',
    replyCount: data.replyCount ?? 0,
    isResolved: data.isResolved ?? false,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  };
}

export class FirebaseDiscussionRepo implements DiscussionRepository {
  async getDiscussionsByCourse(courseId: string): Promise<Discussion[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where('courseId', '==', courseId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => toDiscussion(doc.id, doc.data()));
  }

  async saveDiscussion(discussion: Discussion): Promise<void> {
    await adminDb.collection(COLLECTION).doc(discussion.id).set({
      courseId: discussion.courseId,
      lessonId: discussion.lessonId ?? null,
      authorId: discussion.authorId,
      authorName: discussion.authorName,
      authorRole: discussion.authorRole,
      authorAvatar: discussion.authorAvatar ?? null,
      title: discussion.title,
      content: discussion.content,
      replyCount: discussion.replyCount,
      isResolved: discussion.isResolved,
      createdAt: discussion.createdAt,
      updatedAt: new Date(),
    });
  }

  async deleteDiscussion(id: string): Promise<void> {
    await adminDb.collection(COLLECTION).doc(id).delete();
  }
}
