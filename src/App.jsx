import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AnalogClock from './components/AnalogClock/AnalogClock';
import Alarm from './components/Alarm/Alarm';
import DashboardCard from './components/common/DashboardCard';
import DigitalClock from './components/DigitalClock/DigitalClock';
import Navbar from './components/Navbar/Navbar';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import Sidebar from './components/Sidebar/Sidebar';
import Stopwatch from './components/Stopwatch/Stopwatch';
import TimezoneSelector from './components/TimezoneSelector/TimezoneSelector';
import Timer from './components/Timer/Timer';
import WorldClock from './components/WorldClock/WorldClock';
import useClockTick from './hooks/useClockTick';
import useLocalStorageState from './hooks/useLocalStorageState';
import useThemeMode from './hooks/useThemeMode';
import {
  DEFAULT_VISIBLE_SECTIONS,
  formatDateInZone,
  formatTimeInZone,
  formatUtcOffset,
  getGreeting,
  getLocalDate,
  getLocalTime,
  getUtcTime,
} from './utils/time';

function App() {
  const now = useClockTick(1000);
  const { themeMode, setThemeMode, resolvedTheme } = useThemeMode();
  const [selectedTimezone, setSelectedTimezone] = useLocalStorageState('clock-dashboard-timezone', 'UTC');
  const [visibleSections, setVisibleSections] = useLocalStorageState(
    'clock-dashboard-visible-sections',
    DEFAULT_VISIBLE_SECTIONS,
  );
  const [accentColor, setAccentColor] = useLocalStorageState('clock-dashboard-accent', '#38bdf8');
  const [clockSize, setClockSize] = useLocalStorageState('clock-dashboard-clock-size', 320);
  const [fontSize, setFontSize] = useLocalStorageState('clock-dashboard-font-size', 16);
  const [animationSpeed, setAnimationSpeed] = useLocalStorageState('clock-dashboard-animation-speed', 1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      setIsFullscreen((current) => !current);
    }
  }, []);

  const toggleSection = useCallback((sectionKey) => {
    setVisibleSections((current) => ({
      ...current,
      [sectionKey]: !current[sectionKey],
    }));
  }, [setVisibleSections]);

  const dashboardStyles = useMemo(
    () => ({
      '--accent': accentColor,
      '--clock-size': `${clockSize}px`,
      '--base-font-size': `${fontSize}px`,
      '--animation-speed': `${animationSpeed}s`,
    }),
    [accentColor, animationSpeed, clockSize, fontSize],
  );

  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const greeting = getGreeting(now, localZone);

  return (
    <div className="app-shell" style={dashboardStyles}>
      <Navbar now={now} onFullscreenToggle={toggleFullscreen} isFullscreen={isFullscreen} />

      <main className="dashboard-layout">
        <Sidebar now={now} themeMode={themeMode} setThemeMode={setThemeMode}>
          <div className="sidebar__summary">
            <div className="summary-card">
              <span>Live Greeting</span>
              <strong>{greeting}</strong>
            </div>
            <div className="summary-card">
              <span>Resolved Theme</span>
              <strong>{resolvedTheme}</strong>
            </div>
          </div>
        </Sidebar>

        <div className="dashboard-grid">
          <DashboardCard
            title="Analog Clock"
            subtitle="Smooth animated hands with a clean circular face."
            hidden={!visibleSections.analog}
          >
            <AnalogClock now={now} size={clockSize} accentColor={accentColor} animationSpeed={animationSpeed} />
          </DashboardCard>

          <DashboardCard
            title="Digital Clock"
            subtitle="Current time, date, and day details updated every second."
            hidden={!visibleSections.digital}
          >
            <DigitalClock now={now} />
          </DashboardCard>

          <DashboardCard
            title="World Clock"
            subtitle="Live clocks for global cities using Intl.DateTimeFormat."
            hidden={!visibleSections.world}
          >
            <WorldClock now={now} />
          </DashboardCard>

          <DashboardCard
            title="Time Zone Selector"
            subtitle="Search and preview any supported IANA timezone."
            hidden={!visibleSections.timezone}
          >
            <TimezoneSelector now={now} selectedTimezone={selectedTimezone} onTimezoneChange={setSelectedTimezone} />
            <div className="timezone-footer">
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
          </DashboardCard>

          <DashboardCard
            title="Alarm System"
            subtitle="Multiple alarms with sound, snooze, and stop controls."
            hidden={!visibleSections.alarm}
          >
            <Alarm now={now} />
          </DashboardCard>

          <DashboardCard
            title="Stopwatch"
            subtitle="High precision stopwatch with laps and milliseconds."
            hidden={!visibleSections.stopwatch}
          >
            <Stopwatch />
          </DashboardCard>

          <DashboardCard
            title="Countdown Timer"
            subtitle="Start, pause, resume, and reset a configurable timer."
            hidden={!visibleSections.timer}
          >
            <Timer />
          </DashboardCard>

          <DashboardCard title="Dashboard Controls" subtitle="Customize the display and feel of the clock suite.">
            <SettingsPanel
              visibleSections={visibleSections}
              onToggleSection={toggleSection}
              accentColor={accentColor}
              onAccentChange={setAccentColor}
              clockSize={clockSize}
              onClockSizeChange={setClockSize}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              animationSpeed={animationSpeed}
              onAnimationSpeedChange={setAnimationSpeed}
            />
          </DashboardCard>
        </div>
      </main>

      <footer className="footer-bar">
        <span>Current UTC Time: {getUtcTime(now)}</span>
        <span>Local Time: {getLocalTime(now)}</span>
        <span>{getLocalDate(now)}</span>
      </footer>
    </div>
  );
}

export default App;
