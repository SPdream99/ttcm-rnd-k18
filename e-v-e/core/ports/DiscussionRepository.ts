import { Discussion } from '../entities/Discussion';

export interface DiscussionRepository {
  getDiscussionsByCourse(courseId: string): Promise<Discussion[]>;
  saveDiscussion(discussion: Discussion): Promise<void>;
  deleteDiscussion(id: string): Promise<void>;
}
