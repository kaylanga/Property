'use client';

import { SearchFilters } from './property-search';

interface FilterControlsProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}

export function FilterControls({ filters, setFilters }: FilterControlsProps) {
  const handleBedroomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setFilters({
        ...filters,
        bedrooms: value
      });
    } else {
      setFilters({
        ...filters,
        bedrooms: 0 // Reset to default or empty value if the input is invalid
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="bedrooms">Bedrooms</label>
          <input
            id="bedrooms"
            type="number"
            min="0"
            value={filters.bedrooms || 0}
            onChange={handleBedroomChange}
            className="border px-4 py-2"
          />
        </div>
        {/* You can add other filter controls here similarly */}
      </div>
    </div>
  );
}
