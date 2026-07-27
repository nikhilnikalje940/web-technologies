import React, { useMemo, useState } from 'react';
import { formatDateInZone, formatTimeInZone, formatUtcOffset, getTimezoneOptions } from '../../utils/time';

function TimezoneSelector({ now, selectedTimezone, onTimezoneChange }) {
  const [searchValue, setSearchValue] = useState('');
  const timezones = useMemo(() => getTimezoneOptions(), []);

  const filteredTimezones = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return timezones;
    }
    const filtered = timezones.filter((zone) => zone.toLowerCase().includes(query));
    return filtered.includes(selectedTimezone) ? filtered : [selectedTimezone, ...filtered];
  }, [searchValue, selectedTimezone, timezones]);

  return (
    <div className="timezone-selector">
      <div className="timezone-selector__controls">
        <label>
          <span>Search Timezone</span>
          <input
            type="search"
            placeholder="Type a city or region"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </label>
        <label>
          <span>Select Timezone</span>
          <select value={selectedTimezone} onChange={(event) => onTimezoneChange(event.target.value)}>
            {filteredTimezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="timezone-selector__summary">
        <div>
          <span>Current Time</span>
          <strong>{formatTimeInZone(now, selectedTimezone)}</strong>
        </div>
        <div>
          <span>Current Date</span>
          <strong>{formatDateInZone(now, selectedTimezone)}</strong>
        </div>
        <div>
          <span>UTC Offset</span>
          <strong>{formatUtcOffset(now, selectedTimezone)}</strong>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TimezoneSelector);
