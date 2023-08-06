import Link from 'next/link';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';

const Header = async () => {
  const session = await getServerSession(options);
  return (
    <header className="w-full h-auto bg-black p-2 flex justify-between items-center">
      <p>FarmFresh</p>
      <div className="flex justify-end gap-2">
        {session ? (
          <button className="bg-green-800/50 px-4 py-2 rounded-lg text-xl">
            <Link href="/api/auth/signout">Sign Out</Link>
          </button>
        ) : (
          <>
            <button className="bg-green-900 px-4 py-2 rounded-lg text-l">
              <Link href="/api/auth/signin">Sign In</Link>
            </button>
            <button className="bg-green-600 px-4 py-2 rounded-lg text-l">
              <Link href="/sign-up">Sign Up</Link>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
