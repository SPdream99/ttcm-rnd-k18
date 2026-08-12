import { adminDb } from '@/infrastructure/firebase/firebaseAdmin';
import { Resource, ResourceType } from '@/core/entities/Resource';
import { ResourceRepository } from '@/core/ports/ResourceRepository';

const COLLECTION = 'resources';

function toResource(id: string, data: FirebaseFirestore.DocumentData): Resource {
  return {
    id,
    courseId: data.courseId ?? '',
    title: data.title ?? '',
    description: data.description ?? undefined,
    fileUrl: data.fileUrl ?? '#',
    fileType: (data.fileType ?? 'pdf') as ResourceType,
    fileSize: data.fileSize ?? '1.0 MB',
    downloadCount: data.downloadCount ?? 0,
    uploadedAt: data.uploadedAt?.toDate() ?? new Date(),
  };
}

export class FirebaseResourceRepo implements ResourceRepository {
  async getResourcesByCourse(courseId: string): Promise<Resource[]> {
    const snapshot = await adminDb
      .collection(COLLECTION)
      .where('courseId', '==', courseId)
      .get();
    return snapshot.docs.map((doc) => toResource(doc.id, doc.data()));
  }

  async saveResource(resource: Resource): Promise<void> {
    await adminDb.collection(COLLECTION).doc(resource.id).set({
      courseId: resource.courseId,
      title: resource.title,
      description: resource.description ?? null,
      fileUrl: resource.fileUrl,
      fileType: resource.fileType,
      fileSize: resource.fileSize ?? null,
      downloadCount: resource.downloadCount,
      uploadedAt: resource.uploadedAt,
    });
  }

  async deleteResource(id: string): Promise<void> {
    await adminDb.collection(COLLECTION).doc(id).delete();
  }
}
