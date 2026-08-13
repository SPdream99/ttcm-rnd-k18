import Link from 'next/link';
import { getContainer } from '@/infrastructure/di/container';
import ClassroomClient from './ClassroomClient';

export default async function ClassroomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await getContainer();

  // Fetch initial course classroom data
  const course = await c.courseRepo.getCourseById(id);
  const lessons = await c.lessonRepo.getLessonsByCourse(id);
  const announcements = await c.announcementRepo.getAnnouncementsByCourse(id);
  const resources = await c.resourceRepo.getResourcesByCourse(id);
  const discussions = await c.discussionRepo.getDiscussionsByCourse(id);

  // Fallback if course not found in DB
  const displayCourse = course || {
    id: 'course-001',
    title: 'Lập Trình Python AI & Machine Learning',
    japaneseTitle: 'コース概要',
    subtitle: 'Hệ Sinh Thái E-V-E Cosmic Knowledge Class',
    description: 'Chinh phục trí tuệ nhân tạo từ nền tảng Python với sự hỗ trợ 24/7 từ Trợ Lý E-V-E Mentor. Lộ trình cá nhân hóa 100%.',
    instructorId: 'user-002',
    isPublished: true,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFzxfRc4zu_S4KnQjuHKNY8ZHA_W1eNLJR2iXGJJg8nGFU3FODX9yH_sOsgXUVrbX4-9Q6s5uHBXbOI7OGXYjw4SKXaGl99gDdDatnZQBRjo51CYqKYFrV-5vD5N6w18NU8WRcjrn1KpkjsZOXDHoDgTSTMTcyHoKJ1TKAY_3dVAbYnujaJFw8TtiwcwHllZybE8ID_yd_e4qrzwMJfil_a6zPQiYZPtMV5sWYokBtB7iy1AVC0S2S',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX3K7vGdyDUJvI340aetIU0MVajGsT-e6ecJWTX_bifO55kIvgYhItv47FSH5gOlBt4WXUH320SbsaApEiFfNdG66AoUaUjk7G5Nq2aNt68S2ryprglwBXkwjP-dZTcTo4W9-bhhwQxUNBz7Ab_4QpfnZ2OdXoMk-oGfmsIb2lzhbUotG-TIe2LGsotqgod8fmizYQiYz2IWyCnHT5k1cs7W0nk68sUTOd6qV65B-dNJH1vAu6ysgZ',
    tags: ['python', 'ai', 'lập trình', 'machine learning'],
    totalDuration: '24 Giờ 30 Phút',
    studentsCount: 128,
    price: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <ClassroomClient
      initialCourse={JSON.parse(JSON.stringify(displayCourse))}
      initialLessons={JSON.parse(JSON.stringify(lessons))}
      initialAnnouncements={JSON.parse(JSON.stringify(announcements))}
      initialResources={JSON.parse(JSON.stringify(resources))}
      initialDiscussions={JSON.parse(JSON.stringify(discussions))}
    />
  );
}
