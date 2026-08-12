/**
 * DEPENDENCY INJECTION CONTAINER
 *
 * "Ổ cắm tổng" — nơi DUY NHẤT lắp ráp toàn bộ hệ thống.
 * Đồng bộ với schema Firestore thực tế (instructor, isPublished, lessons subcollection...)
 *
 * ┌─────────────────────────────────────────────────┐
 * │  USE_MOCK_DB=true  → Mock (dev offline)         │
 * │  USE_MOCK_DB=false → Firebase Firestore thật    │
 * └─────────────────────────────────────────────────┘
 */

import { GetPublishedCoursesUseCase } from '@/core/use-cases/course/GetPublishedCourses';
import { CreateCourseUseCase } from '@/core/use-cases/course/CreateCourse';
import { GetUserProfileUseCase } from '@/core/use-cases/user/GetUserProfile';
import { RegisterUserUseCase } from '@/core/use-cases/user/RegisterUser';
import { EnrollInCourseUseCase } from '@/core/use-cases/enrollment/EnrollInCourse';
import { GetMyEnrollmentsUseCase } from '@/core/use-cases/enrollment/GetMyEnrollments';

import { UserRepository } from '@/core/ports/UserRepository';
import { CourseRepository } from '@/core/ports/CourseRepository';
import { EnrollmentRepository } from '@/core/ports/EnrollmentRepository';
import { LessonRepository } from '@/core/ports/LessonRepository';

export type AppContainer = {
  // User
  getUserProfileUseCase: GetUserProfileUseCase;
  registerUserUseCase: RegisterUserUseCase;
  // Course
  getPublishedCoursesUseCase: GetPublishedCoursesUseCase;
  createCourseUseCase: CreateCourseUseCase;
  // Enrollment
  enrollInCourseUseCase: EnrollInCourseUseCase;
  getMyEnrollmentsUseCase: GetMyEnrollmentsUseCase;
  // Repos exposed (cho API routes cần truy vấn linh hoạt)
  lessonRepo: LessonRepository;
};

let _container: AppContainer | null = null;

async function buildContainer(): Promise<AppContainer> {
  let userRepo: UserRepository;
  let courseRepo: CourseRepository;
  let enrollmentRepo: EnrollmentRepository;
  let lessonRepo: LessonRepository;

  const useMock = process.env.USE_MOCK_DB === 'true';

  if (useMock) {
    const { MockUserRepo } = await import('@/infrastructure/repositories/mock/MockUserRepo');
    const { MockCourseRepo } = await import('@/infrastructure/repositories/mock/MockCourseRepo');
    const { MockEnrollmentRepo } = await import('@/infrastructure/repositories/mock/MockEnrollmentRepo');
    // Lesson mock đơn giản — trả về rỗng
    lessonRepo = {
      getLessonsByCourse: async () => [],
      getLessonById: async () => null,
      saveLesson: async () => {},
      deleteLesson: async () => {},
    };

    userRepo = new MockUserRepo();
    courseRepo = new MockCourseRepo();
    enrollmentRepo = new MockEnrollmentRepo();
  } else {
    const { FirebaseUserRepo } = await import('@/infrastructure/repositories/firebase/FirebaseUserRepo');
    const { FirebaseCourseRepo } = await import('@/infrastructure/repositories/firebase/FirebaseCourseRepo');
    const { FirebaseEnrollmentRepo } = await import('@/infrastructure/repositories/firebase/FirebaseEnrollmentRepo');
    const { FirebaseLessonRepo } = await import('@/infrastructure/repositories/firebase/FirebaseLessonRepo');

    userRepo = new FirebaseUserRepo();
    courseRepo = new FirebaseCourseRepo();
    enrollmentRepo = new FirebaseEnrollmentRepo();
    lessonRepo = new FirebaseLessonRepo();
  }

  return {
    getUserProfileUseCase: new GetUserProfileUseCase(userRepo),
    registerUserUseCase: new RegisterUserUseCase(userRepo),
    getPublishedCoursesUseCase: new GetPublishedCoursesUseCase(courseRepo),
    createCourseUseCase: new CreateCourseUseCase(courseRepo, userRepo),
    enrollInCourseUseCase: new EnrollInCourseUseCase(enrollmentRepo, courseRepo),
    getMyEnrollmentsUseCase: new GetMyEnrollmentsUseCase(enrollmentRepo),
    lessonRepo,
  };
}

export async function getContainer(): Promise<AppContainer> {
  if (!_container) {
    _container = await buildContainer();
  }
  return _container;
}
