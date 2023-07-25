import Link from 'next/link';

const Header = async () => {
  return (
    <header className="w-full h-auto bg-black p-2 flex justify-between items-center">
      <p>FarmFresh</p>
      <div className="flex justify-end gap-2">
        <button className="bg-green-700 px-4 py-2 rounded-lg text-xl">
          <Link href="/api/auth/signin">Sign In</Link>
        </button>
        <button className="bg-green-800/50 px-4 py-2 rounded-lg text-xl">
          <Link href="/api/auth/signout">Sign Out</Link>
        </button>
      </div>
    </header>
  );
};

export default Header;
