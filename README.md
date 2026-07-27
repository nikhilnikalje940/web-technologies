# Advanced Real-Time World Clock Dashboard

A modern React 19 + Vite dashboard for live clocks, time zone tools, alarms, stopwatch, and countdown timer controls.

## Features

- Analog clock with hour, minute, and second hands
- Digital clock with date, day, and AM/PM display
- World clock cards for major cities
- Time zone selector with search and UTC offset preview
- Alarm system with multiple alarms, sound, snooze, and stop
- Stopwatch with milliseconds and lap times
- Countdown timer with pause, resume, reset, and finish alert
- Theme modes: light, dark, and auto
- Dynamic controls for visibility, accent color, clock size, font size, and animation speed
- Responsive glassmorphism UI with animated cards
- Local storage persistence for theme, settings, favorites, and alarms

## Tech Stack

- React 19
- Vite
- JavaScript
- Plain CSS
- Functional components and React hooks

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

```text
src/
  components/
    AnalogClock/
    Alarm/
    DigitalClock/
    Navbar/
    SettingsPanel/
    Sidebar/
    Stopwatch/
    ThemeSwitcher/
    Timer/
    TimezoneSelector/
    WorldClock/
    common/
  hooks/
  utils/
  assets/
  styles/
  App.jsx
  main.jsx
```

## Notes

- World clocks and time zone formatting use the built-in `Intl.DateTimeFormat` API.
- Theme preferences and dashboard settings are stored in `localStorage`.
- The app is responsive and designed to work across desktop, tablet, and mobile layouts.

## Validation

The project was verified with:

```bash
npm run build
```