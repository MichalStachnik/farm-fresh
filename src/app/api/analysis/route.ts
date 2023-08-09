import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { options } from '../auth/[...nextauth]/options';
import prisma from '@/utils/prisma';
import { Farm, User } from '@prisma/client';
import { getAnalysis } from '@/utils/ai';

export const POST = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session) return NextResponse.redirect('/');
  const { query } = await request.json();

  let farm: Farm | null = null;
  if (session?.user && session.user.email) {
    const user: User | null = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      farm = await prisma.farm.findUnique({
        where: { userId: user.id },
      });
    }
  }

  if (!farm) return NextResponse.redirect('/');

  const analysis = await getAnalysis(query, farm.products);
  return NextResponse.json({ analysis });
};
