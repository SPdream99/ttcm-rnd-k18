import { Announcement } from '../entities/Announcement';

export interface AnnouncementRepository {
  getAnnouncementsByCourse(courseId: string): Promise<Announcement[]>;
  saveAnnouncement(announcement: Announcement): Promise<void>;
  deleteAnnouncement(id: string): Promise<void>;
}
