const MONTH_FORMATTER_CACHE = new Map();

export const CITY_DATA = [
  { city: 'New York', country: 'United States', timeZone: 'America/New_York', favorite: true },
  { city: 'London', country: 'United Kingdom', timeZone: 'Europe/London', favorite: true },
  { city: 'Paris', country: 'France', timeZone: 'Europe/Paris', favorite: false },
  { city: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai', favorite: false },
  { city: 'Mumbai', country: 'India', timeZone: 'Asia/Kolkata', favorite: true },
  { city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo', favorite: false },
  { city: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney', favorite: false },
];

export const FALLBACK_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export const DEFAULT_VISIBLE_SECTIONS = {
  analog: true,
  digital: true,
  world: true,
  alarm: true,
  stopwatch: true,
  timer: true,
  timezone: true,
};

export function pad(value) {
  return String(value).padStart(2, '0');
}

export function getTimeParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.formatToParts(date).reduce((parts, part) => {
    if (part.type !== 'literal') {
      parts[part.type] = part.value;
    }
    return parts;
  }, {});
}

export function formatTimeInZone(date, timeZone, hour12 = true) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12,
  }).format(date);
}

export function formatDateInZone(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatCompactDateInZone(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDayInZone(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
  }).format(date);
}

export function formatUtcOffset(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
    hour: '2-digit',
    minute: '2-digit',
  });
  const zoneName = formatter.formatToParts(date).find((part) => part.type === 'timeZoneName')?.value;
  return zoneName?.replace('GMT', 'UTC') || 'UTC';
}

export function getGreeting(date, timeZone) {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      hour12: false,
    })
      .formatToParts(date)
      .find((part) => part.type === 'hour')?.value || date.getHours(),
  );
  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 18) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
}

export function getUtcTime(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function getLocalTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

export function getLocalDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getShortTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function parseTimeToMinutes(value) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getTimezoneOptions() {
  if (typeof Intl.supportedValuesOf === 'function') {
    return Intl.supportedValuesOf('timeZone');
  }
  return FALLBACK_TIMEZONES;
}

export function getFormatterCacheKey(timeZone, options = {}) {
  return `${timeZone}:${JSON.stringify(options)}`;
}

export function getCachedFormatter(timeZone, options = {}) {
  const cacheKey = getFormatterCacheKey(timeZone, options);
  if (!MONTH_FORMATTER_CACHE.has(cacheKey)) {
    MONTH_FORMATTER_CACHE.set(
      cacheKey,
      new Intl.DateTimeFormat('en-US', {
        timeZone,
        ...options,
      }),
    );
  }
  return MONTH_FORMATTER_CACHE.get(cacheKey);
}
