import { describe, it, expect } from 'vitest';
import { calculateDescriptiveStats, parseNumberList } from './descriptive';

describe('Descriptive Statistics Core', () => {
  it('parses input numbers with various separators', () => {
    const parsed = parseNumberList('12, 15; 18 20\n15');
    expect(parsed).toEqual([12, 15, 18, 20, 15]);
  });

  it('calculates mean, median (odd sample), and unimodal mode', () => {
    // Data: 4, 6, 7, 7, 8 (n = 5, impar)
    // Mean: (4+6+7+7+8)/5 = 32/5 = 6.4
    // Median: 7 (3rd element)
    // Mode: 7 (frequency 2)
    const stats = calculateDescriptiveStats([4, 6, 7, 7, 8]);
    expect(stats.count).toBe(5);
    expect(stats.mean).toBe(6.4);
    expect(stats.median).toBe(7);
    expect(stats.mode).toEqual([7]);
    expect(stats.modeType).toBe('unimodal');
    expect(stats.totalFi).toBe(5);
    expect(stats.totalHi).toBe(1);
    expect(stats.totalPi).toBe(100);
  });

  it('calculates median for even sample correctly', () => {
    // Data: 10, 12, 14, 16 (n = 4, par)
    // Central elements: 12 and 14 -> Median = 13
    const stats = calculateDescriptiveStats([10, 12, 14, 16]);
    expect(stats.median).toBe(13);
  });

  it('identifies bimodal and amodal distributions', () => {
    // Bimodal: 2, 2, 4, 6, 6
    const bimodal = calculateDescriptiveStats([2, 2, 4, 6, 6]);
    expect(bimodal.modeType).toBe('bimodal');
    expect(bimodal.mode).toEqual([2, 6]);

    // Amodal: 1, 2, 3, 4, 5 (all frequency 1)
    const amodal = calculateDescriptiveStats([1, 2, 3, 4, 5]);
    expect(amodal.modeType).toBe('amodal');
    expect(amodal.mode).toEqual([]);
  });
});
