import { ViewportProvider } from '@/contexts/ViewportContext';
import FarmMapWrapper from '@/components/FarmMapWrapper';
import LocationButton from '@/components/LocationButton';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';

export default async function Home() {
  return (
    <main className="">
      <Header />
      <ViewportProvider>
        <div className="flex min-h-screen flex-col items-center justify-between p-2">
          <SearchBar />
          <LocationButton />
          <FarmMapWrapper />
        </div>
      </ViewportProvider>
    </main>
  );
}
