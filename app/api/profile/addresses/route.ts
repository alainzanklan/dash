import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';

// GET — fetch all saved addresses for current user
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const addresses = await prisma.savedAddress.findMany({
      where: { userId: currentUser.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ addresses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a new saved address
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
      label,
      name,
      phone,
      line1,
      line2,
      city,
      state,
      country,
      isDefault,
    } = body;

    if (!label || !name || !phone || !line1 || !city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // If setting as default, unset all others first
    if (isDefault) {
      await prisma.savedAddress.updateMany({
        where: { userId: currentUser.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.savedAddress.create({
      data: {
        userId: currentUser.id,
        label,
        name,
        phone,
        line1,
        line2: line2 || '',
        city,
        state: state || 'Greater Accra',
        country: country || 'Ghana',
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — update or set default
export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, isDefault, ...fields } = body;

    if (!id)
      return NextResponse.json(
        { error: 'Missing address id' },
        { status: 400 },
      );

    // Verify ownership
    const existing = await prisma.savedAddress.findFirst({
      where: { id, userId: currentUser.id },
    });
    if (!existing)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (isDefault) {
      await prisma.savedAddress.updateMany({
        where: { userId: currentUser.id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.savedAddress.update({
      where: { id },
      data: { ...fields, ...(isDefault !== undefined ? { isDefault } : {}) },
    });

    return NextResponse.json({ address: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const existing = await prisma.savedAddress.findFirst({
      where: { id, userId: currentUser.id },
    });
    if (!existing)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.savedAddress.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
