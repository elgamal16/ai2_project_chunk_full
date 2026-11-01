import { describe, it, expect } from 'vitest';
import { formatDate, formatPercent, formatNumber, formatCharge } from '../format';
import { getRiskLevel, getRiskBadgeClasses, getRiskBarColor } from '../risk';
import { getContactType, isReachable } from '../contact';

describe('format utilities', () => {
  it('formats percentages correctly', () => {
    expect(formatPercent(45.678)).toBe('45.7%');
    expect(formatPercent(NaN)).toBe('0%');
  });

  it('formats charges correctly', () => {
    expect(formatCharge(79.85)).toBe('79.85');
    expect(formatCharge(NaN)).toBe('0.00');
  });

  it('formats numbers correctly', () => {
    expect(formatNumber(1000, 'en')).toBe('1,000');
  });

  it('formats dates safely', () => {
    const formatted = formatDate('2026-11-01T12:00:00Z', 'en');
    expect(formatted).toBeTruthy();
    expect(formatDate('')).toBe('');
  });
});

describe('risk utilities', () => {
  it('determines risk level based on thresholds (<30, 30-49, >=50)', () => {
    expect(getRiskLevel(25)).toBe('low');
    expect(getRiskLevel(29)).toBe('low');
    expect(getRiskLevel(30)).toBe('medium');
    expect(getRiskLevel(49)).toBe('medium');
    expect(getRiskLevel(50)).toBe('high');
    expect(getRiskLevel(85)).toBe('high');
  });

  it('returns valid badge classes', () => {
    expect(getRiskBadgeClasses('high')).toContain('bg-risk-high-bg');
    expect(getRiskBadgeClasses('medium')).toContain('bg-risk-medium-bg');
    expect(getRiskBadgeClasses('low')).toContain('bg-risk-low-bg');
  });

  it('returns correct progress bar color', () => {
    expect(getRiskBarColor(60)).toBe('bg-[#bd3b3b]');
    expect(getRiskBarColor(35)).toBe('bg-[#b46e1b]');
    expect(getRiskBarColor(15)).toBe('bg-[#2e7d5b]');
  });
});

describe('contact utilities', () => {
  it('identifies contact channels accurately', () => {
    expect(getContactType('+201234567890', 'user@example.com')).toBe('both');
    expect(getContactType('+201234567890', null)).toBe('phone');
    expect(getContactType(null, 'user@example.com')).toBe('email');
    expect(getContactType(null, null)).toBe('none');
  });

  it('checks reachability', () => {
    expect(isReachable('+201234567890', '')).toBe(true);
    expect(isReachable('', 'user@example.com')).toBe(true);
    expect(isReachable('', '')).toBe(false);
  });
});

