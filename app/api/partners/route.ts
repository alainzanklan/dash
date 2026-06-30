import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ partners });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, logo, description, phone, whatsapp, email, isActive } = body;

    if (!name)
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const slug = toSlug(name);

    const partner = await prisma.partner.create({
      data: {
        name,
        slug,
        logo,
        description,
        phone,
        whatsapp,
        email,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ partner }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A partner with this name already exists' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, logo, description, phone, whatsapp, email, isActive } =
      body;

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const data: any = { logo, description, phone, whatsapp, email };
    if (isActive !== undefined) data.isActive = isActive;
    if (name) {
      data.name = name;
      data.slug = toSlug(name);
    }

    const partner = await prisma.partner.update({ where: { id }, data });
    return NextResponse.json({ partner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // Unlink products before deleting
    await prisma.product.updateMany({
      where: { partnerId: id },
      data: { partnerId: null },
    });
    await prisma.partner.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
