const currencyFormatters = new Map<string, Intl.NumberFormat>();
const percentFormatters = new Map<string, Intl.NumberFormat>();
const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();

function fractionDigitsFor(value: number): number {
  const absolute = Math.abs(value);
  if (absolute >= 1) return 2;
  if (absolute >= 0.01) return 4;
  return 6;
}

function getCurrencyFormatter(currency: string, locale: string, digits: number): Intl.NumberFormat {
  const key = `${locale}:${currency}:${digits}`;
  const cached = currencyFormatters.get(key);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  });
  currencyFormatters.set(key, formatter);
  return formatter;
}

function getPercentFormatter(locale: string, digits: number): Intl.NumberFormat {
  const key = `${locale}:${digits}`;
  const cached = percentFormatters.get(key);
  if (cached) return cached;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    signDisplay: 'exceptZero',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  percentFormatters.set(key, formatter);
  return formatter;
}

function getDateTimeFormatter(locale: string): Intl.DateTimeFormat {
  const cached = dateTimeFormatters.get(locale);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  dateTimeFormatters.set(locale, formatter);
  return formatter;
}

export function formatCurrency(
  value: number | null | undefined,
  currency = 'USD',
  locale = 'en-US',
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return getCurrencyFormatter(currency, locale, fractionDigitsFor(value)).format(value);
}

export function formatCompactCurrency(
  value: number | null | undefined,
  currency = 'USD',
  locale = 'en-US',
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

export function formatPercent(
  value: number | null | undefined,
  digits = 2,
  locale = 'en-US',
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return getPercentFormatter(locale, digits).format(value / 100);
}

export function formatDateTime(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined) return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return getDateTimeFormatter('es-AR').format(date);
}

export function firstLetter(value: string | null | undefined): string {
  const match = value?.trim().match(/[a-zA-Z0-9áéíóúñ]/);
  return match ? match[0].toUpperCase() : '?';
}

export function estimateReadingMinutes(
  text: string | null | undefined,
  wordsPerMinute = 200,
): number {
  if (!text) return 1;

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function splitTags(tags: string | null | undefined, limit = 3): string[] {
  if (!tags) return [];

  return tags
    .split('|')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, limit);
}

export function initialsFrom(value: string | null | undefined): string {
  if (!value) return '?';

  const base = value.includes('@') ? (value.split('@')[0] ?? '') : value;
  const parts = base
    .split(/[\s._-]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const first = parts[0] ?? '';
  const second = parts[1] ?? '';

  if (!first) return '?';
  if (!second) return first.slice(0, 2).toUpperCase();
  return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase();
}
