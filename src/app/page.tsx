import FarmMap from '@/components/FarmMap';
import LocationButton from '@/components/LocationButton';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-8">farm fresh</div>
      <LocationButton />
      <FarmMap />
    </main>
  );
}
