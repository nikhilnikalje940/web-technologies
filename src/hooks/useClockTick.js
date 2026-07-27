import { useEffect, useState } from 'react';

export default function useClockTick(interval = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, interval);

    return () => window.clearInterval(timerId);
  }, [interval]);

  return now;
}
