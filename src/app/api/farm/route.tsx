import prisma from '@/utils/prisma';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { options } from '../auth/[...nextauth]/options';
import { User } from '@prisma/client';
// import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) return NextResponse.redirect('/');

  const user: User | null = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
  });
  if (!user) return;

  const body = await req.json();
  const { name, about, latitude, longitude, products } = body;

  const farm = await prisma.farm.upsert({
    where: {
      userId: user.id,
    },
    update: {
      name,
      about,
      latitude,
      longitude,
      userId: user.id,
      products,
    },
    create: {
      name,
      about,
      latitude,
      longitude,
      userId: user.id,
      products,
    },
  });

  // revalidatePath('/farm/[farm]');

  return NextResponse.json({ message: 'created', farm });
}
