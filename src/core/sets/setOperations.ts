import type { SetOperationsResult } from '../../types';

export function parseSetInput(input: string): string[] {
  if (!input) return [];
  // Strip curly braces if any, split by comma or space or semicolon
  const cleaned = input.replace(/[{}]/g, '');
  const tokens = cleaned
    .split(/[,;\n]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  // Return unique elements preserving first appearance order
  return Array.from(new Set(tokens));
}

export function formatSet(elements: string[]): string {
  if (elements.length === 0) return '∅ (vacío)';
  return `{ ${elements.join(', ')} }`;
}

export function calculateSetOperations(universeRaw: string[], setARaw: string[], setBRaw: string[]): SetOperationsResult {
  // Ensure sets only contain items from universe, or universe contains all if empty
  let universe = [...universeRaw];
  if (universe.length === 0) {
    universe = Array.from(new Set([...setARaw, ...setBRaw]));
  } else {
    // If universe is defined, items in A and B must strictly belong or are added
    universe = Array.from(new Set([...universe, ...setARaw, ...setBRaw]));
  }

  const setA = setARaw.filter(x => universe.includes(x));
  const setB = setBRaw.filter(x => universe.includes(x));

  const setASet = new Set(setA);
  const setBSet = new Set(setB);

  // Union A ∪ B
  const union = Array.from(new Set([...setA, ...setB]));

  // Intersection A ∩ B
  const intersection = setA.filter(x => setBSet.has(x));

  // Difference A - B
  const differenceAB = setA.filter(x => !setBSet.has(x));

  // Difference B - A
  const differenceBA = setB.filter(x => !setASet.has(x));

  // Symmetric Difference A △ B = (A - B) ∪ (B - A)
  const symmetricDiff = Array.from(new Set([...differenceAB, ...differenceBA]));

  // Complement A^c = U - A
  const complementA = universe.filter(x => !setASet.has(x));

  // Complement B^c = U - B
  const complementB = universe.filter(x => !setBSet.has(x));

  return {
    universe,
    setA,
    setB,
    union,
    intersection,
    differenceAB,
    differenceBA,
    symmetricDiff,
    complementA,
    complementB
  };
}
