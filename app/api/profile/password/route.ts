import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';
import bcrypt from 'bcrypt';

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user?.hashedPassword) {
      return NextResponse.json(
        { error: 'No password set on this account' },
        { status: 400 },
      );
    }

    const isCorrect = await bcrypt.compare(
      currentPassword,
      user.hashedPassword,
    );
    if (!isCorrect) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { hashedPassword: hashed },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Password update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
