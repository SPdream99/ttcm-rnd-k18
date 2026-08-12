/**
 * PRIMARY ADAPTER: API Route — Courses
 *
 * GET  /api/courses          → Lấy danh sách khóa học đã published
 * POST /api/courses          → Tạo khóa học mới (teacher/admin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/di/container';

// GET /api/courses
export async function GET() {
  try {
    const c = await getContainer();
    const courses = await c.getPublishedCoursesUseCase.execute();
    return NextResponse.json({ success: true, data: courses });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/courses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, teacherId, thumbnailUrl, tags } = body;

    if (!title || !description || !teacherId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc: title, description, teacherId' },
        { status: 400 },
      );
    }

    const c = await getContainer();
    const course = await c.createCourseUseCase.execute({
      title,
      description,
      teacherId,
      thumbnailUrl,
      tags,
    });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    const status = message.includes('Chỉ giáo viên') ? 403 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
