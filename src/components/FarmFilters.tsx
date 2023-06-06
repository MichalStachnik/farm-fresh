import { MouseEvent, MouseEventHandler } from 'react';
import { Filter } from './FarmMapWrapper';

interface FarmFiltersProps {
  filters: Set<string>;
  handleFilterSelect: (newFilter: string) => void;
}

const FarmFilters = ({ filters, handleFilterSelect }: FarmFiltersProps) => {
  const handleFilterClick = (e: MouseEvent<HTMLButtonElement>) => {
    handleFilterSelect(e.currentTarget.value);
  };

  return (
    <div className="flex flex-col mr-10">
      <button
        onClick={handleFilterClick}
        value="vegetables"
        className={filters.has('vegetables') ? `text-emerald-500` : 'initial'}
      >
        vegetables
      </button>
      <button
        onClick={handleFilterClick}
        value="pork"
        className={filters.has('pork') ? `text-emerald-500` : 'initial'}
      >
        pork
      </button>
      <button
        onClick={handleFilterClick}
        value="beef"
        className={filters.has('beef') ? `text-emerald-500` : 'initial'}
      >
        beef
      </button>
    </div>
  );
};

export default FarmFilters;
