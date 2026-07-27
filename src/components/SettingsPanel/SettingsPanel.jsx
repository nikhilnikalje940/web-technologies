import React from 'react';
import { DEFAULT_VISIBLE_SECTIONS } from '../../utils/time';

const SECTION_LABELS = {
  analog: 'Analog Clock',
  digital: 'Digital Clock',
  world: 'World Clock',
  alarm: 'Alarm',
  stopwatch: 'Stopwatch',
  timer: 'Timer',
  timezone: 'Time Zone Selector',
};

function SettingsPanel({
  visibleSections,
  onToggleSection,
  accentColor,
  onAccentChange,
  clockSize,
  onClockSizeChange,
  fontSize,
  onFontSizeChange,
  animationSpeed,
  onAnimationSpeedChange,
}) {
  return (
    <div className="settings-panel">
      <div className="settings-panel__header">
        <h3>Display Controls</h3>
        <button type="button" className="button button--ghost button--small" onClick={DEFAULT_VISIBLE_SECTIONS ? undefined : undefined} style={{ display: 'none' }} />
      </div>
      <div className="settings-panel__grid">
        {Object.keys(SECTION_LABELS).map((sectionKey) => (
          <label key={sectionKey} className="toggle-row">
            <span>{SECTION_LABELS[sectionKey]}</span>
            <input
              type="checkbox"
              checked={Boolean(visibleSections[sectionKey])}
              onChange={() => onToggleSection(sectionKey)}
            />
          </label>
        ))}
      </div>
      <div className="settings-panel__controls">
        <label>
          <span>Accent Color</span>
          <input type="color" value={accentColor} onChange={(event) => onAccentChange(event.target.value)} />
        </label>
        <label>
          <span>Clock Size</span>
          <input
            type="range"
            min="220"
            max="420"
            step="5"
            value={clockSize}
            onChange={(event) => onClockSizeChange(Number(event.target.value))}
          />
          <small>{clockSize}px</small>
        </label>
        <label>
          <span>Font Size</span>
          <input
            type="range"
            min="14"
            max="20"
            step="1"
            value={fontSize}
            onChange={(event) => onFontSizeChange(Number(event.target.value))}
          />
          <small>{fontSize}px</small>
        </label>
        <label>
          <span>Animation Speed</span>
          <input
            type="range"
            min="0.4"
            max="2"
            step="0.1"
            value={animationSpeed}
            onChange={(event) => onAnimationSpeedChange(Number(event.target.value))}
          />
          <small>{animationSpeed.toFixed(1)}x</small>
        </label>
      </div>
    </div>
  );
}

export default React.memo(SettingsPanel);
