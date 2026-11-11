import type { SetOperationsResult } from '../../types';

export function parseSetInput(input: string): string[] {
  if (!input) return [];
  const cleaned = input.replace(/[{}]/g, '');
  const tokens = cleaned
    .split(/[,;\n]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  return Array.from(new Set(tokens));
}

export function formatSet(elements: string[]): string {
  if (elements.length === 0) return '∅ (vacío)';
  return `{ ${elements.join(', ')} }`;
}

export function calculateSetOperations(
  universeRaw: string[],
  setARaw: string[],
  setBRaw: string[],
  setCRaw?: string[]
): SetOperationsResult {
  const hasC = Array.isArray(setCRaw);
  const rawPool = hasC ? [...setARaw, ...setBRaw, ...(setCRaw || [])] : [...setARaw, ...setBRaw];

  let universe = [...universeRaw];
  if (universe.length === 0) {
    universe = Array.from(new Set(rawPool));
  } else {
    universe = Array.from(new Set([...universe, ...rawPool]));
  }

  const setA = setARaw.filter(x => universe.includes(x));
  const setB = setBRaw.filter(x => universe.includes(x));
  const setC = hasC ? (setCRaw || []).filter(x => universe.includes(x)) : undefined;

  const setASet = new Set(setA);
  const setBSet = new Set(setB);
  const setCSet = new Set(setC || []);

  if (hasC && setC) {
    // 3 sets operations
    const union = Array.from(new Set([...setA, ...setB, ...setC]));

    const allThree = setA.filter(x => setBSet.has(x) && setCSet.has(x));

    const onlyAB = setA.filter(x => setBSet.has(x) && !setCSet.has(x));
    const onlyAC = setA.filter(x => setCSet.has(x) && !setBSet.has(x));
    const onlyBC = setB.filter(x => setCSet.has(x) && !setASet.has(x));

    const onlyA = setA.filter(x => !setBSet.has(x) && !setCSet.has(x));
    const onlyB = setB.filter(x => !setASet.has(x) && !setCSet.has(x));
    const onlyC = setC.filter(x => !setASet.has(x) && !setBSet.has(x));

    const unionSet = new Set(union);
    const outsideAll = universe.filter(x => !unionSet.has(x));

    const intersectionAB = setA.filter(x => setBSet.has(x));
    const intersectionAC = setA.filter(x => setCSet.has(x));
    const intersectionBC = setB.filter(x => setCSet.has(x));

    const differenceAB = setA.filter(x => !setBSet.has(x));
    const differenceBA = setB.filter(x => !setASet.has(x));
    const symmetricDiff = Array.from(new Set([...differenceAB, ...differenceBA]));

    const complementA = universe.filter(x => !setASet.has(x));
    const complementB = universe.filter(x => !setBSet.has(x));
    const complementC = universe.filter(x => !setCSet.has(x));

    return {
      universe,
      setA,
      setB,
      setC,
      hasC: true,
      union,
      intersection: allThree,
      differenceAB,
      differenceBA,
      symmetricDiff,
      complementA,
      complementB,
      complementC,
      onlyA,
      onlyB,
      onlyC,
      onlyAB,
      onlyAC,
      onlyBC,
      allThree,
      outsideAll,
      intersectionAB,
      intersectionAC,
      intersectionBC
    };
  }

  // 2 sets operations
  const union = Array.from(new Set([...setA, ...setB]));
  const intersection = setA.filter(x => setBSet.has(x));
  const differenceAB = setA.filter(x => !setBSet.has(x));
  const differenceBA = setB.filter(x => !setASet.has(x));
  const symmetricDiff = Array.from(new Set([...differenceAB, ...differenceBA]));

  const complementA = universe.filter(x => !setASet.has(x));
  const complementB = universe.filter(x => !setBSet.has(x));

  const onlyA = differenceAB;
  const onlyB = differenceBA;
  const onlyAB = intersection;

  const unionSet = new Set(union);
  const outsideAll = universe.filter(x => !unionSet.has(x));

  return {
    universe,
    setA,
    setB,
    hasC: false,
    union,
    intersection,
    differenceAB,
    differenceBA,
    symmetricDiff,
    complementA,
    complementB,
    onlyA,
    onlyB,
    onlyAB,
    outsideAll
  };
}
