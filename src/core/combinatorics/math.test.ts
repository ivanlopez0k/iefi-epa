import { describe, it, expect } from 'vitest';
import {
  calculatePermutationSimple,
  calculatePermutationRepetition,
  calculatePermutationCircular,
  calculateVariationSimple,
  calculateVariationRepetition,
  calculateCombinationSimple,
  calculateCombinationRepetition
} from './math';

describe('Combinatorics Core Math', () => {
  it('calculates 6 people sitting in theater seats (P_6 = 720)', () => {
    const res = calculatePermutationSimple(6);
    expect(res.result).toBe(720);
    expect(res.steps).toContain('Resultado: Existen 720 formas distintas de ordenar 6 elementos.');
  });

  it('calculates permutation with repetition for word CASA (n=4, A repeats 2)', () => {
    const res = calculatePermutationRepetition(4, [2]);
    expect(res.result).toBe(12);
  });

  it('calculates circular permutation for 5 people (PC_5 = 24)', () => {
    const res = calculatePermutationCircular(5);
    expect(res.result).toBe(24);
  });

  it('calculates variation of 8 athletes taking 3 medals (V_8^3 = 336)', () => {
    const res = calculateVariationSimple(8, 3);
    expect(res.result).toBe(336);
  });

  it('calculates variation with repetition (VR_5^3 = 125)', () => {
    const res = calculateVariationRepetition(5, 3);
    expect(res.result).toBe(125);
  });

  it('calculates combination of 10 students taking 3 (C_10^3 = 120)', () => {
    const res = calculateCombinationSimple(10, 3);
    expect(res.result).toBe(120);
  });

  it('calculates combination with repetition (CR_5^3 = 35)', () => {
    const res = calculateCombinationRepetition(5, 3);
    expect(res.result).toBe(35);
  });
});
