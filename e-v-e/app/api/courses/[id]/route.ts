/**
 * API ROUTE: /api/courses/[id]
 *
 * Lấy chi tiết thông tin Lớp Học (Course, Lessons, Announcements, Resources, Discussions)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/di/container';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const c = await getContainer();

    const course = await c.courseRepo.getCourseById(id);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy khóa học.' },
        { status: 404 },
      );
    }

    // Parallel fetch for speed
    const [lessons, announcements, resources, discussions] = await Promise.all([
      c.lessonRepo.getLessonsByCourse(id),
      c.announcementRepo.getAnnouncementsByCourse(id),
      c.resourceRepo.getResourcesByCourse(id),
      c.discussionRepo.getDiscussionsByCourse(id),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        course,
        lessons,
        announcements,
        resources,
        discussions,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi hệ thống';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
