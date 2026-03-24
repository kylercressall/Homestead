const { formatDate } = require('../../src/build');

describe('formatDate', () => {
  test('formats a valid date string', () => {
    expect(formatDate('2025-01-15')).toBe('January 15, 2025');
  });

  test('returns null for a missing value', () => {
    expect(formatDate(null)).toBeNull();
    expect(formatDate(undefined)).toBeNull();
  });

  test('returns the raw value for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});
