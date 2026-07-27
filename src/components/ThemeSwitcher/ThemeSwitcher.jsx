import React from 'react';

function ThemeSwitcher({ themeMode, onChange }) {
  return (
    <div className="control-group">
      <label htmlFor="theme-mode">Theme</label>
      <select id="theme-mode" value={themeMode} onChange={(event) => onChange(event.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
      </select>
    </div>
  );
}

export default React.memo(ThemeSwitcher);
