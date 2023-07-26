import bcrypt from 'bcrypt';
import prisma from '@/utils/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return new NextResponse('error', { status: 400 });
  }

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    throw new Error('email exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
