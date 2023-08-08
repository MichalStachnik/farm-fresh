import prisma from '@/utils/prisma';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { options } from '../auth/[...nextauth]/options';
import { User } from '@prisma/client';
import { analyze } from '@/utils/ai';
// import { revalidatePath } from 'next/cache';

interface Analysis {
  price: string;
  type: string;
  recipe: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) return NextResponse.redirect('/');

  const user: User | null = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
  });
  if (!user) return;

  const body = await req.json();
  const { name, about, latitude, longitude, products } = body;

  let analysisPromises: Promise<Analysis | undefined>[] = [];

  products.forEach(async (product: any) => {
    analysisPromises.push(analyze(product.about));
  });

  const resolved = await Promise.allSettled(analysisPromises);

  const productsWithAnalysis = products.map((product: any, index: number) => {
    if (resolved[index].status === 'fulfilled') {
      const analysis = (
        resolved[index] as PromiseFulfilledResult<Analysis | undefined>
      ).value;
      return {
        ...product,
        analysis: {
          ...analysis,
        },
      };
    }
    return {
      ...product,
    };
  });

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
      products: productsWithAnalysis,
    },
    create: {
      name,
      about,
      latitude,
      longitude,
      userId: user.id,
      products: productsWithAnalysis,
    },
  });

  // revalidatePath('/farm/[farm]');

  return NextResponse.json({ message: 'created', farm });
}
