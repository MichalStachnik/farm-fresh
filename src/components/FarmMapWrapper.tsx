'use client';
import { useEffect, useState } from 'react';
import FarmFilters from './FarmFilters';
import FarmMap from './FarmMap';
import { Farm } from '@prisma/client';

export interface Filter {
  [key: string]: boolean;
}

const FarmMapWrapper = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [filters, setFilters] = useState<Set<string>>(new Set());

  // TODO: fetch server side and pass down
  const fetchFarms = async () => {
    const res: Response = await fetch('/api');
    const data = await res.json();
    setFarms(data.farms);
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleFilterSelect = (newFilter: string) => {
    if (filters.has(newFilter)) {
      filters.delete(newFilter);
    } else {
      filters.add(newFilter);
    }
    setFilters(new Set(filters));
  };

  return (
    <div className="flex w-full">
      <FarmFilters filters={filters} handleFilterSelect={handleFilterSelect} />
      <FarmMap farms={farms} filters={filters} />
    </div>
  );
};

export default FarmMapWrapper;
