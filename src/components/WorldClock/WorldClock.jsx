import React, { useMemo, useState } from 'react';
import { CITY_DATA, formatDateInZone, formatTimeInZone, formatUtcOffset } from '../../utils/time';
import useLocalStorageState from '../../hooks/useLocalStorageState';

function WorldClock({ now, hidden = false }) {
  const [searchValue, setSearchValue] = useState('');
  const [favoriteZones, setFavoriteZones] = useLocalStorageState(
    'clock-dashboard-favorites',
    CITY_DATA.filter((city) => city.favorite).map((city) => city.timeZone),
  );

  const visibleCities = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    return CITY_DATA.filter((city) => {
      const matchesSearch = !query || `${city.city} ${city.country}`.toLowerCase().includes(query);
      return matchesSearch;
    }).sort((left, right) => {
      const leftFavorite = favoriteZones.includes(left.timeZone) ? 1 : 0;
      const rightFavorite = favoriteZones.includes(right.timeZone) ? 1 : 0;
      return rightFavorite - leftFavorite || left.city.localeCompare(right.city);
    });
  }, [favoriteZones, searchValue]);

  const toggleFavorite = (timeZone) => {
    setFavoriteZones((current) =>
      current.includes(timeZone) ? current.filter((zone) => zone !== timeZone) : [...current, timeZone],
    );
  };

  return (
    <div className={`world-clock ${hidden ? 'is-hidden' : ''}`}>
      <div className="world-clock__toolbar">
        <input
          type="search"
          placeholder="Search city or country"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
      <div className="world-clock__grid">
        {visibleCities.map((city) => {
          const isFavorite = favoriteZones.includes(city.timeZone);
          return (
            <article key={city.timeZone} className="world-clock__card glass-panel">
              <div className="world-clock__card-header">
                <div>
                  <h3>{city.city}</h3>
                  <p>{city.country}</p>
                </div>
                <button type="button" className="icon-button" onClick={() => toggleFavorite(city.timeZone)}>
                  {isFavorite ? '★' : '☆'}
                </button>
              </div>
              <div className="world-clock__time">{formatTimeInZone(now, city.timeZone)}</div>
              <div className="world-clock__meta">{formatDateInZone(now, city.timeZone)}</div>
              <div className="world-clock__meta world-clock__meta--accent">{formatUtcOffset(now, city.timeZone)}</div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(WorldClock);
