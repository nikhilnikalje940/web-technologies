import React from 'react';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import { getLocalDate, getLocalTime, getUtcTime } from '../../utils/time';

function Sidebar({ now, themeMode, setThemeMode, children }) {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar__section">
        <p className="eyebrow">Control Center</p>
        <h2>Dashboard Settings</h2>
      </div>
      <ThemeSwitcher themeMode={themeMode} onChange={setThemeMode} />
      <div className="sidebar__stack">
        <div className="mini-card">
          <span>Local Time</span>
          <strong>{getLocalTime(now)}</strong>
          <small>{getLocalDate(now)}</small>
        </div>
        <div className="mini-card">
          <span>UTC Time</span>
          <strong>{getUtcTime(now)}</strong>
          <small>Reference clock</small>
        </div>
        <div className="mini-card mini-card--accent">
          <span>Weather Placeholder</span>
          <strong>Partly Cloudy</strong>
          <small>72 F | 22 C | Demo card</small>
        </div>
      </div>
      {children}
    </aside>
  );
}

export default React.memo(Sidebar);
