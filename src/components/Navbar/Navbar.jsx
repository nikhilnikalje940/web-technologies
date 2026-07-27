import React from 'react';
import { getGreeting, getLocalTime, getUtcTime } from '../../utils/time';

function Navbar({ now, onFullscreenToggle, isFullscreen }) {
  const greeting = getGreeting(now, Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <header className="navbar glass-panel">
      <div>
        <p className="eyebrow">Advanced Real-Time World Clock Dashboard</p>
        <h1>{greeting}</h1>
        <p className="navbar__subtext">A production-style time control center for global schedules and personal timing.</p>
      </div>
      <div className="navbar__meta">
        <div className="stat-pill">
          <span>Local</span>
          <strong>{getLocalTime(now)}</strong>
        </div>
        <div className="stat-pill">
          <span>UTC</span>
          <strong>{getUtcTime(now)}</strong>
        </div>
        <button type="button" className="button button--ghost" onClick={onFullscreenToggle}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
        </button>
      </div>
    </header>
  );
}

export default React.memo(Navbar);
