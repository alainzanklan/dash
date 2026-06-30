import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone } = await request.json();

    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: name || currentUser.name,
        // phone stored in a separate field if you add it to the schema,
        // otherwise just update name for now
      },
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
