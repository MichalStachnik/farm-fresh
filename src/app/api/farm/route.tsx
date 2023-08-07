import prisma from '@/utils/prisma';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { options } from '../auth/[...nextauth]/options';
import { User } from '@prisma/client';

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) return NextResponse.redirect('/');

  const user: User | null = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
  });
  if (!user) return;

  const body = await req.json();
  const { name, about, latitude, longitude } = body;

  const farm = await prisma.farm.create({
    data: {
      name,
      about,
      latitude,
      longitude,
      userId: user.id,
    },
  });

  return NextResponse.json({ message: 'created', farm });
}
