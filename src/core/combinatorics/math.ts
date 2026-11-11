import type { CombinatoricsResult } from '../../types';

// Helper for factorial
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function formatFactorialChain(n: number): string {
  if (n <= 1) return '1';
  if (n > 8) {
    return `${n} × ${n - 1} × ... × 2 × 1`;
  }
  const parts: number[] = [];
  for (let i = n; i >= 1; i--) parts.push(i);
  return parts.join(' × ');
}

// 1. Permutación Simple: P_n = n!
export function calculatePermutationSimple(n: number): CombinatoricsResult {
  const result = factorial(n);
  const steps = [
    `Fórmula: P_n = n!`,
    `Sustitución con n = ${n}: P_${n} = ${n}!`,
    `Desarrollo: ${n}! = ${formatFactorialChain(n)} = ${result}`,
    `Respuesta: Existen ${result.toLocaleString()} formas distintas.`
  ];

  return {
    type: 'permutation_simple',
    title: 'Permutación Simple (Sin Repetición)',
    formula: 'P_n = n!',
    n,
    result,
    steps,
    explanation: 'Se utilizan todos los elementos del conjunto y SÍ importa el orden. Ningún elemento se repite.'
  };
}

// 2. Permutación con Repetición: P_n^{a,b,c...} = n! / (a! * b! * c! ...)
export function calculatePermutationRepetition(n: number, repetitions: number[]): CombinatoricsResult {
  const numerator = factorial(n);
  let denominator = 1;
  const repTerms: string[] = [];
  const repValues: string[] = [];

  for (const r of repetitions) {
    const f = factorial(r);
    denominator *= f;
    repTerms.push(`${r}!`);
    repValues.push(`${f}`);
  }

  const result = denominator > 0 ? Math.round(numerator / denominator) : 0;
  const steps = [
    `Fórmula: P_n^{k_1, k_2, ...} = n! / (k_1! × k_2! × ...)`,
    `Total de elementos (n): ${n}. Repeticiones: [${repetitions.join(', ')}]`,
    `Numerador: ${n}! = ${numerator}`,
    `Denominador: ${repTerms.join(' × ')} = ${repValues.join(' × ')} = ${denominator}`,
    `Cociente: ${numerator} / ${denominator} = ${result}`,
    `Respuesta: Existen ${result.toLocaleString()} formas posibles.`
  ];

  return {
    type: 'permutation_rep',
    title: 'Permutación con Repetición',
    formula: 'P_n^{a,b,...} = n! / (a! · b! · ...)',
    n,
    repetitions,
    result,
    steps,
    explanation: 'Se usan todos los elementos, importa el orden, pero algunos elementos se repiten a, b, c veces.'
  };
}

// 3. Permutación Circular: PC_n = (n - 1)!
export function calculatePermutationCircular(n: number): CombinatoricsResult {
  const nMinus1 = Math.max(0, n - 1);
  const result = factorial(nMinus1);
  const steps = [
    `Fórmula: PC_n = (n - 1)!`,
    `Sustitución con n = ${n}: PC_${n} = (${n} - 1)! = ${nMinus1}!`,
    `Desarrollo: ${nMinus1}! = ${formatFactorialChain(nMinus1)} = ${result}`,
    `Respuesta: Se pueden ordenar de ${result.toLocaleString()} formas en disposición circular.`
  ];

  return {
    type: 'permutation_circular',
    title: 'Permutación Circular',
    formula: 'PC_n = (n - 1)!',
    n,
    result,
    steps,
    explanation: 'Elementos ordenados alrededor de un círculo cerrado. Al rotar las posiciones relativas se consideran idénticas.'
  };
}

// 4. Variación Simple: V_n^r = n! / (n - r)!
export function calculateVariationSimple(n: number, r: number): CombinatoricsResult {
  if (r > n) {
    return {
      type: 'variation_simple',
      title: 'Variación Simple',
      formula: 'V_n^r = n! / (n - r)!',
      n,
      r,
      result: 0,
      steps: ['Error: El grupo elegido (r) no puede ser mayor que el total de elementos (n) en variaciones sin repetición.'],
      explanation: 'No se puede tomar más elementos de los que hay disponibles sin repetición.'
    };
  }

  const numerator = factorial(n);
  const denominator = factorial(n - r);
  const result = Math.round(numerator / denominator);

  const steps = [
    `Fórmula: V_n^r = n! / (n - r)!`,
    `Sustitución: V_${n}^${r} = ${n}! / (${n} - ${r})! = ${n}! / ${n - r}!`,
    `Cálculo: ${numerator} / ${denominator} = ${result}`,
    `Respuesta: Se pueden formar ${result.toLocaleString()} arreglos distintos.`
  ];

  return {
    type: 'variation_simple',
    title: 'Variación Simple (Sin Repetición)',
    formula: 'V_n^r = n! / (n - r)!',
    n,
    r,
    result,
    steps,
    explanation: 'Importa el orden, NO se toman todos los elementos (se toman r de un total de n), y no se repiten.'
  };
}

// 5. Variación con Repetición: VR_n^r = n^r
export function calculateVariationRepetition(n: number, r: number): CombinatoricsResult {
  const result = Math.pow(n, r);
  const steps = [
    `Fórmula: VR_n^r = n^r`,
    `Sustitución con n = ${n} y r = ${r}: VR_${n}^${r} = ${n}^${r}`,
    `Desarrollo: ${Array(r).fill(n).join(' × ')} = ${result}`,
    `Respuesta: Se pueden formar ${result.toLocaleString()} agrupaciones.`
  ];

  return {
    type: 'variation_rep',
    title: 'Variación con Repetición',
    formula: 'VR_n^r = n^r',
    n,
    r,
    result,
    steps,
    explanation: 'Importa el orden, se toman r elementos de n posibles, y se pueden repetir libremente.'
  };
}

// 6. Combinación Simple: C_n^r = n! / [ r! * (n - r)! ]
export function calculateCombinationSimple(n: number, r: number): CombinatoricsResult {
  if (r > n) {
    return {
      type: 'combination_simple',
      title: 'Combinación Simple',
      formula: 'C_n^r = n! / [r!(n - r)!]',
      n,
      r,
      result: 0,
      steps: ['Error: En una combinación sin repetición r no puede superar a n.'],
      explanation: 'No es posible seleccionar más elementos únicos de los disponibles.'
    };
  }

  const num = factorial(n);
  const den = factorial(r) * factorial(n - r);
  const result = Math.round(num / den);

  const steps = [
    `Fórmula: C_n^r = n! / [r! · (n - r)!]`,
    `Sustitución: C_${n}^${r} = ${n}! / [${r}! · (${n} - ${r})!]`,
    `Operaciones: ${num} / [${factorial(r)} · ${factorial(n - r)}] = ${num} / ${den} = ${result}`,
    `Respuesta: Se pueden formar ${result.toLocaleString()} combinaciones distintas.`
  ];

  return {
    type: 'combination_simple',
    title: 'Combinación Simple (Sin Repetición)',
    formula: 'C_n^r = n! / [r!(n - r)!]',
    n,
    r,
    result,
    steps,
    explanation: 'NO importa el orden en que se elijan los elementos, no se toman todos a la vez, y no se repiten.'
  };
}

// 7. Combinación con Repetición: CR_n^r = C_{n+r-1}^r = (n + r - 1)! / [ r! * (n - 1)! ]
export function calculateCombinationRepetition(n: number, r: number): CombinatoricsResult {
  const top = n + r - 1;
  const num = factorial(top);
  const den = factorial(r) * factorial(n - 1);
  const result = Math.round(num / den);

  const steps = [
    `Fórmula: CR_n^r = C_{n + r - 1}^r = (n + r - 1)! / [r! · (n - 1)!]`,
    `Sustitución: CR_${n}^${r} = (${n} + ${r} - 1)! / [${r}! · (${n} - 1)!] = ${top}! / [${r}! · ${n - 1}!]`,
    `Operaciones: ${num} / [${factorial(r)} · ${factorial(n - 1)}] = ${num} / ${den} = ${result}`,
    `Respuesta: Existen ${result.toLocaleString()} combinaciones con repetición.`
  ];

  return {
    type: 'combination_rep',
    title: 'Combinación con Repetición',
    formula: 'CR_n^r = (n + r - 1)! / [r!(n - 1)!]',
    n,
    r,
    result,
    steps,
    explanation: 'NO importa el orden, se seleccionan r elementos de un conjunto de n, y los elementos pueden repetirse.'
  };
}
