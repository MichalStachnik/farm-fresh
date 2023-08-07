import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import prisma from '@/utils/prisma';
import { Farm } from '@prisma/client';
import FarmForm from '@/components/FarmForm';
import { analyze } from '@/utils/ai';

// import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
const Farm = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) => {
  const session = await getServerSession(options);

  let farm: Farm | null = null;
  let user: any = null;
  if (session?.user && session.user.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    farm = await prisma.farm.findUnique({
      where: { userId: user?.id },
    });
  }

  await analyze('write me a poem');

  return (
    <div className="h-full bg-white">
      {farm ? <FarmForm farm={farm} /> : null}
    </div>
  );
};

export default Farm;
