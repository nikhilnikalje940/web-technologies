import React, { useEffect, useMemo, useRef, useState } from 'react';
import useLocalStorageState from '../../hooks/useLocalStorageState';

function createAlarmId() {
  return `alarm-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatAlarmTime(time) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(`2020-01-01T${time}:00`));
}

function getNowTimeKey(now) {
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function Alarm({ now, hidden = false }) {
  const [alarms, setAlarms] = useLocalStorageState('clock-dashboard-alarms', []);
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [alarmLabel, setAlarmLabel] = useState('Morning alarm');
  const [activeAlarmId, setActiveAlarmId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('');
  const audioContextRef = useRef(null);
  const timerRef = useRef(null);
  const firedKeysRef = useRef(new Set());

  const activeAlarm = useMemo(
    () => alarms.find((alarm) => alarm.id === activeAlarmId) || null,
    [activeAlarmId, alarms],
  );

  useEffect(() => {
    const currentTimeKey = getNowTimeKey(now);
    const currentDateKey = now.toDateString();

    alarms.forEach((alarm) => {
      const triggerKey = `${alarm.id}:${currentDateKey}:${currentTimeKey}`;
      if (alarm.enabled && alarm.time === currentTimeKey && now.getSeconds() === 0 && !firedKeysRef.current.has(triggerKey)) {
        firedKeysRef.current.add(triggerKey);
        setActiveAlarmId(alarm.id);
        setCurrentStatus(`Alarm triggered: ${alarm.label || 'Untitled alarm'}`);
        startTone();
      }
    });
  }, [alarms, now]);

  useEffect(() => {
    if (!activeAlarmId) {
      stopTone();
    }
  }, [activeAlarmId]);

  useEffect(() => () => stopTone(), []);

  const startTone = () => {
    if (audioContextRef.current) {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    try {
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.05;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();

      timerRef.current = window.setInterval(() => {
        oscillator.frequency.value = oscillator.frequency.value === 880 ? 660 : 880;
      }, 500);

      audioContextRef.current = { audioContext, oscillator, gainNode };
    } catch {
      audioContextRef.current = null;
    }
  };

  const stopTone = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (audioContextRef.current) {
      const { oscillator, audioContext } = audioContextRef.current;
      try {
        oscillator.stop();
      } catch {
        // Ignore stale oscillator shutdown errors.
      }
      audioContext.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const addAlarm = () => {
    if (!alarmTime) {
      return;
    }

    setAlarms((current) => [
      ...current,
      {
        id: createAlarmId(),
        time: alarmTime,
        label: alarmLabel.trim() || 'Alarm',
        enabled: true,
      },
    ]);
    setCurrentStatus(`Added alarm for ${formatAlarmTime(alarmTime)}`);
  };

  const deleteAlarm = (alarmId) => {
    setAlarms((current) => current.filter((alarm) => alarm.id !== alarmId));
    if (activeAlarmId === alarmId) {
      dismissAlarm();
    }
  };

  const toggleAlarm = (alarmId) => {
    setAlarms((current) =>
      current.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, enabled: !alarm.enabled } : alarm,
      ),
    );
  };

  const snoozeAlarm = () => {
    if (!activeAlarm) {
      return;
    }

    const snoozedDate = new Date(now.getTime() + 5 * 60 * 1000);
    const snoozedTime = `${String(snoozedDate.getHours()).padStart(2, '0')}:${String(snoozedDate.getMinutes()).padStart(2, '0')}`;

    setAlarms((current) =>
      current.map((alarm) =>
        alarm.id === activeAlarm.id ? { ...alarm, time: snoozedTime, enabled: true } : alarm,
      ),
    );
    dismissAlarm(`Snoozed for 5 minutes`);
  };

  const dismissAlarm = (message = 'Alarm stopped') => {
    stopTone();
    setActiveAlarmId(null);
    setCurrentStatus(message);
  };

  return (
    <div className={`alarm-panel ${hidden ? 'is-hidden' : ''}`}>
      <div className="alarm-panel__form glass-panel">
        <div className="alarm-panel__inputs">
          <label>
            <span>Alarm Time</span>
            <input type="time" value={alarmTime} onChange={(event) => setAlarmTime(event.target.value)} />
          </label>
          <label>
            <span>Label</span>
            <input
              type="text"
              placeholder="Morning routine"
              value={alarmLabel}
              onChange={(event) => setAlarmLabel(event.target.value)}
            />
          </label>
        </div>
        <button type="button" className="button" onClick={addAlarm}>
          Add Alarm
        </button>
        {currentStatus ? <p className="helper-text">{currentStatus}</p> : null}
      </div>

      <div className="alarm-panel__list">
        {alarms.length === 0 ? <p className="empty-state">No alarms created yet.</p> : null}
        {alarms.map((alarm) => (
          <article key={alarm.id} className="alarm-item glass-panel">
            <div>
              <h3>{alarm.label}</h3>
              <p>{formatAlarmTime(alarm.time)}</p>
            </div>
            <div className="alarm-item__actions">
              <button type="button" className="button button--ghost button--small" onClick={() => toggleAlarm(alarm.id)}>
                {alarm.enabled ? 'Disable' : 'Enable'}
              </button>
              <button type="button" className="button button--ghost button--small" onClick={() => deleteAlarm(alarm.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {activeAlarm ? (
        <div className="alarm-popup glass-panel">
          <h3>Alarm Ringing</h3>
          <p>{activeAlarm.label}</p>
          <div className="alarm-popup__actions">
            <button type="button" className="button" onClick={snoozeAlarm}>
              Snooze 5 Min
            </button>
            <button type="button" className="button button--ghost" onClick={() => dismissAlarm()}>
              Stop
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default React.memo(Alarm);
