import React, { useMemo } from 'react';

function AnalogClock({ now, size = 320, accentColor = '#7c3aed', animationSpeed = 1 }) {
  const timeAngles = useMemo(() => {
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return {
      hour: hours * 30 + minutes * 0.5,
      minute: minutes * 6 + seconds * 0.1,
      second: seconds * 6,
    };
  }, [now]);

  const numbers = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <div className="analog-clock" style={{ '--clock-size': `${size}px`, '--accent': accentColor, '--animation-speed': `${animationSpeed}s` }}>
      <div className="analog-clock__face">
        {numbers.map((number) => {
          const rotation = number * 30;
          return (
            <span
              key={number}
              className="analog-clock__number"
              style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(calc(var(--clock-size) * -0.42)) rotate(${-rotation}deg)` }}
            >
              {number}
            </span>
          );
        })}
        <span className="analog-clock__hand analog-clock__hand--hour" style={{ transform: `translate(-50%, -100%) rotate(${timeAngles.hour}deg)` }} />
        <span className="analog-clock__hand analog-clock__hand--minute" style={{ transform: `translate(-50%, -100%) rotate(${timeAngles.minute}deg)` }} />
        <span className="analog-clock__hand analog-clock__hand--second" style={{ transform: `translate(-50%, -100%) rotate(${timeAngles.second}deg)` }} />
        <span className="analog-clock__center" />
      </div>
    </div>
  );
}

export default React.memo(AnalogClock);
