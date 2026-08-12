/**
 * ENTITY: Resource
 *
 * Tài liệu bài giảng, Slide, PDF, Code mẫu, Press Kit... trong lớp học
 */

export type ResourceType = 'pdf' | 'zip' | 'code' | 'link';

export interface Resource {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: ResourceType;
  fileSize?: string;      // Ví dụ: '14.2 MB'
  downloadCount: number;
  uploadedAt: Date;
}
