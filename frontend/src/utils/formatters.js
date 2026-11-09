/**
 * Compact Number & Currency Formatter
 * Formats numbers into compact notation: 1k, 500k, 1m, 5m, etc.
 */

export function formatCompact(value, prefix = '', uppercase = false) {
  if (value === null || value === undefined || isNaN(value)) {
    return `${prefix}0`;
  }

  const num = Number(value);
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  const k = uppercase ? 'K' : 'k';
  const m = uppercase ? 'M' : 'm';
  const b = uppercase ? 'B' : 'b';

  if (abs >= 1_000_000_000) {
    const formatted = parseFloat((abs / 1_000_000_000).toFixed(2));
    return `${sign}${prefix}${formatted}${b}`;
  }
  if (abs >= 1_000_000) {
    const formatted = parseFloat((abs / 1_000_000).toFixed(2));
    return `${sign}${prefix}${formatted}${m}`;
  }
  if (abs >= 1_000) {
    const formatted = parseFloat((abs / 1_000).toFixed(2));
    return `${sign}${prefix}${formatted}${k}`;
  }

  const formattedNum = Number.isInteger(abs)
    ? abs.toString()
    : abs.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return `${sign}${prefix}${formattedNum}`;
}

export function formatCompactCurrency(value, currency = '$', uppercase = false) {
  return formatCompact(value, currency, uppercase);
}

export function formatCompactNumber(value, uppercase = false) {
  return formatCompact(value, '', uppercase);
}

export function formatExactCurrency(value, currency = '$') {
  if (value === null || value === undefined || isNaN(value)) {
    return `${currency}0.00`;
  }
  return `${currency}${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
