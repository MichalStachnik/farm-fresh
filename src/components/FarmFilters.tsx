import { MouseEvent } from 'react';

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
        value="vegetable"
        className={filters.has('vegetable') ? `text-emerald-500` : 'initial'}
      >
        vegetables
      </button>
      <button
        onClick={handleFilterClick}
        value="fruit"
        className={filters.has('fruit') ? `text-emerald-500` : 'initial'}
      >
        fruit
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
        value="poultry"
        className={filters.has('poultry') ? `text-emerald-500` : 'initial'}
      >
        poultry
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
