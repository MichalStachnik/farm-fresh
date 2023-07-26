import { options } from '../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

async function Admin() {
  const session = await getServerSession(options);

  console.log('session', session);
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/');
  }

  return <section className="flex flex-col gap-6">admin page</section>;
}

export default Admin;
