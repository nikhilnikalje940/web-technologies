import React, { useMemo } from 'react';
import { getGreeting, getLocalDate } from '../../utils/time';

function DigitalClock({ now }) {
  const timeParts = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const parts = formatter.formatToParts(now).reduce((accumulator, part) => {
      if (part.type !== 'literal') {
        accumulator[part.type] = part.value;
      }
      return accumulator;
    }, {});

    return parts;
  }, [now]);

  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const greeting = getGreeting(now, localZone);

  return (
    <div className="digital-clock">
      <div className="digital-clock__greeting">{greeting}</div>
      <div className="digital-clock__time">
        <span>{timeParts.hour}</span>
        <span>:</span>
        <span>{timeParts.minute}</span>
        <span>:</span>
        <span>{timeParts.second}</span>
        <span className="digital-clock__period">{timeParts.dayPeriod}</span>
      </div>
      <div className="digital-clock__date">{getLocalDate(now)}</div>
    </div>
  );
}

export default React.memo(DigitalClock);
