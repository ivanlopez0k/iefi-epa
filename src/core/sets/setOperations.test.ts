import { describe, it, expect } from 'vitest';
import { parseSetInput, calculateSetOperations } from './setOperations';

describe('Set Operations Core', () => {
  it('parses formatted string with duplicates and extra spaces', () => {
    const parsed = parseSetInput(' 1, 2,  3, 2, 4, 1 ');
    expect(parsed).toEqual(['1', '2', '3', '4']);
  });

  it('calculates union, intersection, and differences correctly', () => {
    const universe = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const setA = ['1', '2', '3', '4'];
    const setB = ['3', '4', '5', '6'];

    const res = calculateSetOperations(universe, setA, setB);

    expect(res.union).toEqual(['1', '2', '3', '4', '5', '6']);
    expect(res.intersection).toEqual(['3', '4']);
    expect(res.differenceAB).toEqual(['1', '2']);
    expect(res.differenceBA).toEqual(['5', '6']);
    expect(res.symmetricDiff).toEqual(['1', '2', '5', '6']);
    expect(res.complementA).toEqual(['5', '6', '7', '8']);
  });

  it('calculates 3 sets correctly with triple intersection', () => {
    const universe = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const setA = ['1', '2', '4', '5'];
    const setB = ['2', '3', '5', '6'];
    const setC = ['4', '5', '6', '7'];

    const res = calculateSetOperations(universe, setA, setB, setC);

    expect(res.hasC).toBe(true);
    expect(res.allThree).toEqual(['5']);
    expect(res.onlyA).toEqual(['1']);
    expect(res.onlyB).toEqual(['3']);
    expect(res.onlyC).toEqual(['7']);
    expect(res.onlyAB).toEqual(['2']);
    expect(res.onlyAC).toEqual(['4']);
    expect(res.onlyBC).toEqual(['6']);
    expect(res.outsideAll).toEqual(['8', '9']);
  });
});
