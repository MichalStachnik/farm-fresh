import Link from 'next/link';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import prisma from '@/utils/prisma';
import { Farm, User } from '@prisma/client';

const Header = async () => {
  const session = await getServerSession(options);

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

  return (
    <header className="w-full h-auto bg-black p-2 flex justify-between items-center">
      <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600">
        FarmFresh
      </p>
      <div className="flex justify-end gap-2">
        {session ? (
          <>
            {farm ? (
              <Link
                href={{
                  pathname: `/farm/${farm.id}`,
                }}
              >
                <button className="bg-green-500/50 hover:bg-emerald-500/50 px-4 py-2 rounded-lg text-l">
                  My Farm
                </button>
              </Link>
            ) : (
              <Link href="/farm/add">
                <button className="bg-green-500/50 hover:bg-emerald-500/50 px-4 py-2 rounded-lg text-l">
                  Post My Farm
                </button>
              </Link>
            )}
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
