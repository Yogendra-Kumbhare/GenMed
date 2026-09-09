/**
 * @file businessLogic.test.ts
 * Unit tests for core GenericMed business logic functions.
 * These are pure utility calculations that must remain accurate.
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Generic Savings Calculation
// savingsPercentage = ((priceBrand - priceGeneric) / priceBrand) × 100
// ---------------------------------------------------------------------------
function calcSavingsPercentage(priceGeneric: number, priceBrand: number): number {
  if (priceBrand <= 0) return 0;
  return Math.round(((priceBrand - priceGeneric) / priceBrand) * 100);
}

describe('calcSavingsPercentage', () => {
  it('returns 92% for generic=$11.40 vs brand=$140.00', () => {
    expect(calcSavingsPercentage(11.4, 140)).toBe(92);
  });

  it('returns 0% when generic equals brand price', () => {
    expect(calcSavingsPercentage(100, 100)).toBe(0);
  });

  it('returns 0% when brand price is 0 to avoid division by zero', () => {
    expect(calcSavingsPercentage(0, 0)).toBe(0);
  });

  it('returns 50% for generic=$50 brand=$100', () => {
    expect(calcSavingsPercentage(50, 100)).toBe(50);
  });

  it('returns 75% for generic=$25 brand=$100', () => {
    expect(calcSavingsPercentage(25, 100)).toBe(75);
  });
});

// ---------------------------------------------------------------------------
// Adherence Rate Calculation
// adherenceRate = (takenCount / totalScheduled) × 100
// ---------------------------------------------------------------------------
function calcAdherenceRate(taken: number, total: number): number {
  if (total === 0) return 100; // no doses scheduled = perfect by default
  return Math.round((taken / total) * 100);
}

describe('calcAdherenceRate', () => {
  it('returns 100% when all doses taken', () => {
    expect(calcAdherenceRate(30, 30)).toBe(100);
  });

  it('returns 0% when no doses taken', () => {
    expect(calcAdherenceRate(0, 30)).toBe(0);
  });

  it('returns 87% for 26 of 30 doses taken', () => {
    expect(calcAdherenceRate(26, 30)).toBe(87);
  });

  it('returns 100% when total is 0 (no doses scheduled)', () => {
    expect(calcAdherenceRate(0, 0)).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Low Supply Detection
// isLowSupply = daysSupplyLeft <= threshold (default 7)
// ---------------------------------------------------------------------------
function isLowSupply(daysLeft: number, threshold = 7): boolean {
  return daysLeft <= threshold;
}

describe('isLowSupply', () => {
  it('flags 0 days remaining as low supply', () => {
    expect(isLowSupply(0)).toBe(true);
  });

  it('flags 7 days as low supply (boundary)', () => {
    expect(isLowSupply(7)).toBe(true);
  });

  it('does NOT flag 8 days as low supply', () => {
    expect(isLowSupply(8)).toBe(false);
  });

  it('does NOT flag 30 days as low supply', () => {
    expect(isLowSupply(30)).toBe(false);
  });

  it('respects custom threshold of 14 days', () => {
    expect(isLowSupply(10, 14)).toBe(true);
    expect(isLowSupply(15, 14)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 90-day vs 30-day Cost Comparison
// annual30 = (price30 / 30) * 365
// annual90 = (price90 / 90) * 365
// ---------------------------------------------------------------------------
function annualCost(pricePerCycle: number, daysPerCycle: number): number {
  return Math.round((pricePerCycle / daysPerCycle) * 365 * 100) / 100;
}

describe('annualCost', () => {
  it('calculates annual cost for 30-day supply at $11.40', () => {
    // 11.40 / 30 * 365 = 138.70
    expect(annualCost(11.4, 30)).toBe(138.7);
  });

  it('calculates annual cost for 90-day supply at $28.50', () => {
    // 28.50 / 90 * 365 = 115.58...
    expect(annualCost(28.5, 90)).toBe(115.58);
  });

  it('90-day annual cost is less than 30-day for same medication', () => {
    const cost30 = annualCost(11.4, 30);
    const cost90 = annualCost(28.5, 90);
    expect(cost90).toBeLessThan(cost30);
  });
});
