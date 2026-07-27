import React, { useEffect, useMemo, useRef, useState } from 'react';

function toMilliseconds(hours, minutes, seconds) {
  return ((Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60 + (Number(seconds) || 0)) * 1000;
}

function formatDuration(milliseconds) {
  const totalMilliseconds = Math.max(0, milliseconds);
  const hours = Math.floor(totalMilliseconds / 3600000);
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function Timer({ hidden = false }) {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('1');
  const [seconds, setSeconds] = useState('0');
  const [remainingMs, setRemainingMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [message, setMessage] = useState('');
  const targetEndRef = useRef(0);
  const intervalRef = useRef(0);

  const clearTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = 0;
    }
  };

  const tick = () => {
    const nextRemaining = Math.max(0, targetEndRef.current - Date.now());
    setRemainingMs(nextRemaining);

    if (nextRemaining === 0) {
      clearTimer();
      setIsRunning(false);
      setIsPaused(false);
      setMessage('Timer completed');
      window.alert('Countdown timer finished');
    }
  };

  useEffect(() => () => clearTimer(), []);

  const start = () => {
    const duration = remainingMs || toMilliseconds(hours, minutes, seconds);
    if (duration <= 0) {
      setMessage('Enter a valid duration first');
      return;
    }

    targetEndRef.current = Date.now() + duration;
    setRemainingMs(duration);
    setIsRunning(true);
    setIsPaused(false);
    setMessage('Timer running');
    clearTimer();
    intervalRef.current = window.setInterval(tick, 250);
  };

  const pause = () => {
    if (!isRunning) {
      return;
    }

    clearTimer();
    setIsRunning(false);
    setIsPaused(true);
    setMessage('Timer paused');
  };

  const resume = () => {
    if (!isPaused || remainingMs <= 0) {
      return;
    }

    targetEndRef.current = Date.now() + remainingMs;
    setIsRunning(true);
    setIsPaused(false);
    setMessage('Timer resumed');
    clearTimer();
    intervalRef.current = window.setInterval(tick, 250);
  };

  const reset = () => {
    clearTimer();
    setRemainingMs(0);
    setIsRunning(false);
    setIsPaused(false);
    setMessage('Timer reset');
  };

  const display = useMemo(() => {
    return remainingMs > 0 ? formatDuration(remainingMs) : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [hours, minutes, remainingMs, seconds]);

  return (
    <div className={`timer-panel glass-panel ${hidden ? 'is-hidden' : ''}`}>
      <div className="timer-panel__inputs">
        <label>
          <span>Hours</span>
          <input type="number" min="0" value={hours} onChange={(event) => setHours(event.target.value)} />
        </label>
        <label>
          <span>Minutes</span>
          <input type="number" min="0" max="59" value={minutes} onChange={(event) => setMinutes(event.target.value)} />
        </label>
        <label>
          <span>Seconds</span>
          <input type="number" min="0" max="59" value={seconds} onChange={(event) => setSeconds(event.target.value)} />
        </label>
      </div>
      <div className="timer-panel__display">{display}</div>
      <div className="control-row">
        <button type="button" className="button" onClick={start}>
          Start
        </button>
        <button type="button" className="button button--ghost" onClick={pause}>
          Pause
        </button>
        <button type="button" className="button button--ghost" onClick={resume}>
          Resume
        </button>
        <button type="button" className="button button--ghost" onClick={reset}>
          Reset
        </button>
      </div>
      <p className="helper-text">{message || 'Enter a countdown duration and start the timer.'}</p>
    </div>
  );
}

export default React.memo(Timer);
