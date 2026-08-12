/**
 * PRIMARY ADAPTER: API Route — User Profile
 *
 * GET /api/users/[id]    → Lấy thông tin người dùng theo ID
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
    const user = await c.getUserProfileUseCase.execute(id);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lỗi không xác định';
    const status = message.includes('Không tìm thấy') ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
