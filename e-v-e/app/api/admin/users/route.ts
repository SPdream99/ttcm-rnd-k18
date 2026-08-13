import { NextResponse } from 'next/server';
import { getContainer } from '@/infrastructure/di/container';

export async function GET() {
  try {
    const c = await getContainer();
    const users = await c.userRepo.listUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const c = await getContainer();
    const newUser = await c.createUserAccountUseCase.execute({
      displayName: body.displayName,
      email: body.email,
      role: body.role || 'student',
      avatarUrl: body.avatarUrl,
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
