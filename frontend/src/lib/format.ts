export function formatDate(isoString: string, lang = 'en'): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatPercent(value: number, decimals = 1): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, lang = 'en'): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(value);
}

export function formatCharge(value: number): string {
  if (isNaN(value)) return '0.00';
  return value.toFixed(2);
}

