import FarmMap from '@/components/FarmMap';
import FarmMapWrapper from '@/components/FarmMapWrapper';
import LocationButton from '@/components/LocationButton';
import SearchBar from '@/components/SearchBar';
import { ViewportProvider } from '@/contexts/ViewportContext';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-8">farm fresh</div>
      {/* TODO: add request form and header */}
      <ViewportProvider>
        <SearchBar />
        <LocationButton />
        <FarmMapWrapper />
      </ViewportProvider>
    </main>
  );
}
