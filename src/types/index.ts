// Core data types for EPA Calculator

// Combinatorics
export type CombinatoricsType = 
  | 'permutation_simple'
  | 'permutation_rep'
  | 'permutation_circular'
  | 'variation_simple'
  | 'variation_rep'
  | 'combination_simple'
  | 'combination_rep';

export interface CombinatoricsResult {
  type: CombinatoricsType;
  title: string;
  formula: string;
  n: number;
  r?: number;
  repetitions?: number[];
  result: number;
  steps: string[];
  explanation: string;
}

// Sets
export interface SetResult {
  name: string;
  elements: string[];
  cardinality: number;
  representation: string;
}

export interface SetOperationsResult {
  universe: string[];
  setA: string[];
  setB: string[];
  union: string[];
  intersection: string[];
  differenceAB: string[];
  differenceBA: string[];
  symmetricDiff: string[];
  complementA: string[];
  complementB: string[];
}

// Probability
export type EventClassification = 
  | 'elemental' // simple
  | 'compuesto'
  | 'imposible'
  | 'seguro';

export interface ProbabilityEvent {
  id: string;
  name: string;
  description: string;
  points: string[];
  classification: EventClassification;
  favorableCases: number;
  totalCases: number;
  probability: number;
  fraction: string;
  percentage: string;
}

export interface SampleSpacePreset {
  id: string;
  title: string;
  description: string;
  omega: string[];
  presetEvents: {
    name: string;
    description: string;
    filter: (point: string) => boolean;
  }[];
}

// Statistics
export interface FrequencyRow {
  xi: number | string;
  fi: number;     // Frecuencia absoluta
  Fi: number;     // Frecuencia absoluta acumulada
  hi: number;     // Frecuencia relativa
  Hi: number;     // Frecuencia relativa acumulada
  pi: number;     // Frecuencia porcentual (%)
  Pi: number;     // Frecuencia porcentual acumulada (%)
}

export interface DescriptiveStatsResult {
  count: number;
  data: number[];
  sortedData: number[];
  frequencies: FrequencyRow[];
  totalFi: number;
  totalHi: number;
  totalPi: number;
  mean: number;
  median: number;
  mode: number[];
  modeType: 'amodal' | 'unimodal' | 'bimodal' | 'multimodal';
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
  meanSteps: string[];
  medianSteps: string[];
  modeSteps: string[];
}
