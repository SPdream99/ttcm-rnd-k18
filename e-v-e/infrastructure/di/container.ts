/**
 * DEPENDENCY INJECTION CONTAINER
 *
 * "Ổ cắm tổng" — nơi DUY NHẤT lắp ráp toàn bộ hệ thống.
 * Đồng bộ với schema Firestore thực tế (instructor, isPublished, lessons, announcements, resources, discussions...)
 */

import { GetPublishedCoursesUseCase } from '@/core/use-cases/course/GetPublishedCourses';
import { CreateCourseUseCase } from '@/core/use-cases/course/CreateCourse';
import { GetUserProfileUseCase } from '@/core/use-cases/user/GetUserProfile';
import { RegisterUserUseCase } from '@/core/use-cases/user/RegisterUser';
import { EnrollInCourseUseCase } from '@/core/use-cases/enrollment/EnrollInCourse';
import { GetMyEnrollmentsUseCase } from '@/core/use-cases/enrollment/GetMyEnrollments';
import { CreateUserAccount } from '@/core/use-cases/CreateUserAccount';

import { UserRepository } from '@/core/ports/UserRepository';
import { CourseRepository } from '@/core/ports/CourseRepository';
import { EnrollmentRepository } from '@/core/ports/EnrollmentRepository';
import { LessonRepository } from '@/core/ports/LessonRepository';
import { AnnouncementRepository } from '@/core/ports/AnnouncementRepository';
import { ResourceRepository } from '@/core/ports/ResourceRepository';
import { DiscussionRepository } from '@/core/ports/DiscussionRepository';

export type AppContainer = {
  // User
  getUserProfileUseCase: GetUserProfileUseCase;
  registerUserUseCase: RegisterUserUseCase;
  createUserAccountUseCase: CreateUserAccount;
  userRepo: UserRepository;
  // Course
  getPublishedCoursesUseCase: GetPublishedCoursesUseCase;
  createCourseUseCase: CreateCourseUseCase;
  courseRepo: CourseRepository;
  // Enrollment
  enrollInCourseUseCase: EnrollInCourseUseCase;
  getMyEnrollmentsUseCase: GetMyEnrollmentsUseCase;
  // Repos
  lessonRepo: LessonRepository;
  announcementRepo: AnnouncementRepository;
  resourceRepo: ResourceRepository;
  discussionRepo: DiscussionRepository;
};

let _container: AppContainer | null = null;

async function buildContainer(): Promise<AppContainer> {
  let userRepo: UserRepository;
  let courseRepo: CourseRepository;
  let enrollmentRepo: EnrollmentRepository;
  let lessonRepo: LessonRepository;
  let announcementRepo: AnnouncementRepository;
  let resourceRepo: ResourceRepository;
  let discussionRepo: DiscussionRepository;

  const useMock = process.env.USE_MOCK_DB === 'true';

  if (useMock) {
    const { MockUserRepo } = await import('@/infrastructure/repositories/mock/MockUserRepo');
    const { MockCourseRepo } = await import('@/infrastructure/repositories/mock/MockCourseRepo');
    const { MockEnrollmentRepo } = await import('@/infrastructure/repositories/mock/MockEnrollmentRepo');
    
    lessonRepo = {
      getLessonsByCourse: async () => [],
      getLessonById: async () => null,
      saveLesson: async () => {},
      deleteLesson: async () => {},
    };
    announcementRepo = {
      getAnnouncementsByCourse: async () => [],
      saveAnnouncement: async () => {},
      deleteAnnouncement: async () => {},
    };
    resourceRepo = {
      getResourcesByCourse: async () => [],
      saveResource: async () => {},
      deleteResource: async () => {},
    };
    discussionRepo = {
      getDiscussionsByCourse: async () => [],
      saveDiscussion: async () => {},
      deleteDiscussion: async () => {},
    };

    userRepo = new MockUserRepo();
    courseRepo = new MockCourseRepo();
    enrollmentRepo = new MockEnrollmentRepo();
  } else {
    const { FirebaseUserRepo } = await import('@/infrastructure/repositories/firebase/FirebaseUserRepo');
    const { FirebaseCourseRepo } = await import('@/infrastructure/repositories/firebase/FirebaseCourseRepo');
    const { FirebaseEnrollmentRepo } = await import('@/infrastructure/repositories/firebase/FirebaseEnrollmentRepo');
    const { FirebaseLessonRepo } = await import('@/infrastructure/repositories/firebase/FirebaseLessonRepo');
    const { FirebaseAnnouncementRepo } = await import('@/infrastructure/repositories/firebase/FirebaseAnnouncementRepo');
    const { FirebaseResourceRepo } = await import('@/infrastructure/repositories/firebase/FirebaseResourceRepo');
    const { FirebaseDiscussionRepo } = await import('@/infrastructure/repositories/firebase/FirebaseDiscussionRepo');

    userRepo = new FirebaseUserRepo();
    courseRepo = new FirebaseCourseRepo();
    enrollmentRepo = new FirebaseEnrollmentRepo();
    lessonRepo = new FirebaseLessonRepo();
    announcementRepo = new FirebaseAnnouncementRepo();
    resourceRepo = new FirebaseResourceRepo();
    discussionRepo = new FirebaseDiscussionRepo();
  }

  return {
    getUserProfileUseCase: new GetUserProfileUseCase(userRepo),
    registerUserUseCase: new RegisterUserUseCase(userRepo),
    createUserAccountUseCase: new CreateUserAccount(userRepo),
    userRepo,
    getPublishedCoursesUseCase: new GetPublishedCoursesUseCase(courseRepo),
    createCourseUseCase: new CreateCourseUseCase(courseRepo, userRepo),
    courseRepo,
    enrollInCourseUseCase: new EnrollInCourseUseCase(enrollmentRepo, courseRepo),
    getMyEnrollmentsUseCase: new GetMyEnrollmentsUseCase(enrollmentRepo),
    lessonRepo,
    announcementRepo,
    resourceRepo,
    discussionRepo,
  };
}

export async function getContainer(): Promise<AppContainer> {
  if (!_container) {
    _container = await buildContainer();
  }
  return _container;
}
