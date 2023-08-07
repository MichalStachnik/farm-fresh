import Link from 'next/link';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import prisma from '@/utils/prisma';
import { Farm } from '@prisma/client';

const Header = async () => {
  const session = await getServerSession(options);

  let farm: Farm | null = null;
  if (session?.user && session.user.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    farm = await prisma.farm.findUnique({
      where: { userId: user?.id },
    });
  }

  return (
    <header className="w-full h-auto bg-black p-2 flex justify-between items-center">
      <p>FarmFresh</p>
      <div className="flex justify-end gap-2">
        {session ? (
          <>
            <button className="bg-green-500/50 hover:bg-emerald-500/50 px-4 py-2 rounded-lg text-l">
              {farm ? (
                <Link href={`/farm/${farm.id}`}>My Farm</Link>
              ) : (
                <Link href="/farm/add">Post My Farm</Link>
              )}
            </button>
            <button className="bg-green-800/50 hover:bg-emerald-500/50 px-4 py-2 rounded-lg text-l">
              <Link href="/api/auth/signout">Sign Out</Link>
            </button>
          </>
        ) : (
          <>
            <button className="bg-green-900 hover:bg-emerald-500/50 px-4 py-2 rounded-lg text-l ">
              <Link href="/api/auth/signin">Sign In</Link>
            </button>
            <button className="bg-green-600 hover:bg-emerald-500/50 px-4 py-2 rounded-lg text-l">
              <Link href="/sign-up">Sign Up</Link>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
