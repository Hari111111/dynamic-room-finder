import styles from './home.module.css';
import type { RoomsResponse } from '../../types';

type Props = {
  filters: {
    search: string;
    city: string;
    roomType: string;
    occupancy: string;
    maxPrice: string;
    featuredOnly: boolean;
  };
  onChange: (key: string, value: string | boolean) => void;
  options?: RoomsResponse['filters'];
};

export function FilterBar({ filters, onChange, options }: Props) {
  return (
    <section className={styles.filters}>
      <div className={styles.filterRow}>
        <label className={styles.searchField}>
          <span>Search locality or amenity</span>
          <input
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
            placeholder="BTM Layout, Wi-Fi, studio..."
          />
        </label>

        <label>
          <span>City</span>
          <select value={filters.city} onChange={(event) => onChange('city', event.target.value)}>
            <option value="">All cities</option>
            {options?.cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Room type</span>
          <select value={filters.roomType} onChange={(event) => onChange('roomType', event.target.value)}>
            <option value="">All types</option>
            {options?.roomTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Occupancy</span>
          <select value={filters.occupancy} onChange={(event) => onChange('occupancy', event.target.value)}>
            <option value="">Any</option>
            {options?.occupancy.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Budget up to</span>
          <input
            type="number"
            min="5000"
            step="500"
            value={filters.maxPrice}
            onChange={(event) => onChange('maxPrice', event.target.value)}
          />
        </label>
      </div>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={filters.featuredOnly}
          onChange={(event) => onChange('featuredOnly', event.target.checked)}
        />
        <span>Only show curated featured rooms</span>
      </label>
    </section>
  );
}
