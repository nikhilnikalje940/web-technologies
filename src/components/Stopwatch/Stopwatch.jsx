import React, { useEffect, useMemo, useRef, useState } from 'react';

function formatTime(milliseconds) {
  const totalMilliseconds = Math.max(0, milliseconds);
  const hours = Math.floor(totalMilliseconds / 3600000);
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const ms = Math.floor(totalMilliseconds % 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

function Stopwatch({ hidden = false }) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startTimeRef = useRef(0);
  const rafRef = useRef(0);

  const tick = () => {
    setElapsedMs(Date.now() - startTimeRef.current);
    rafRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => () => window.cancelAnimationFrame(rafRef.current), []);

  const start = () => {
    if (isRunning) {
      return;
    }

    startTimeRef.current = Date.now() - elapsedMs;
    setIsRunning(true);
    rafRef.current = window.requestAnimationFrame(tick);
  };

  const pause = () => {
    window.cancelAnimationFrame(rafRef.current);
    setIsRunning(false);
  };

  const reset = () => {
    window.cancelAnimationFrame(rafRef.current);
    setElapsedMs(0);
    setIsRunning(false);
    setLaps([]);
  };

  const recordLap = () => {
    setLaps((current) => [formatTime(elapsedMs), ...current]);
  };

  const statusLabel = useMemo(() => {
    if (isRunning) {
      return 'Running';
    }
    return elapsedMs > 0 ? 'Paused' : 'Ready';
  }, [elapsedMs, isRunning]);

  return (
    <div className={`stopwatch-panel glass-panel ${hidden ? 'is-hidden' : ''}`}>
      <div className="stopwatch-panel__display">{formatTime(elapsedMs)}</div>
      <p className="helper-text">Status: {statusLabel}</p>
      <div className="control-row">
        <button type="button" className="button" onClick={start}>
          Start
        </button>
        <button type="button" className="button button--ghost" onClick={pause}>
          Pause
        </button>
        <button type="button" className="button button--ghost" onClick={start}>
          Resume
        </button>
        <button type="button" className="button button--ghost" onClick={reset}>
          Reset
        </button>
        <button type="button" className="button button--ghost" onClick={recordLap} disabled={!elapsedMs}>
          Lap
        </button>
      </div>
      <div className="lap-list">
        {laps.length === 0 ? <p className="empty-state">Lap times will appear here.</p> : null}
        {laps.map((lap, index) => (
          <div key={`${lap}-${index}`} className="lap-list__item">
            <span>Lap {laps.length - index}</span>
            <strong>{lap}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Stopwatch);
