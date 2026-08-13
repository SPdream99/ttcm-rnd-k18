import { Resource } from '../entities/Resource';

export interface ResourceRepository {
  getResourcesByCourse(courseId: string): Promise<Resource[]>;
  saveResource(resource: Resource): Promise<void>;
  deleteResource(id: string): Promise<void>;
}
