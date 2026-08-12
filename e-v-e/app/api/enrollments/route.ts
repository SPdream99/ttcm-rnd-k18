/**
 * PRIMARY ADAPTER: API Route — Enrollments
 *
 * GET  /api/enrollments?studentId=xxx   → Lấy danh sách đăng ký của học sinh
 * POST /api/enrollments                  → Đăng ký vào khóa học
 */

import { NextRequest, NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/di/container';

// GET /api/enrollments?studentId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu query param: studentId' },
        { status: 400 },
      );
    }

    const c = await getContainer();
    const enrollments = await c.getMyEnrollmentsUseCase.execute(studentId);
    return NextResponse.json({ success: true, data: enrollments });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/enrollments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, courseId } = body;

    if (!studentId || !courseId) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc: studentId, courseId' },
        { status: 400 },
      );
    }

    const c = await getContainer();
    const enrollment = await c.enrollInCourseUseCase.execute({
      studentId,
      courseId,
    });

    return NextResponse.json({ success: true, data: enrollment }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    const status = message.includes('đã đăng ký') ? 409 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
