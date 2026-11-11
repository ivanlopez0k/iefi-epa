import type { CombinatoricsResult } from '../../types';

export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function formatProductRange(start: number, end: number): string {
  if (start < end) return '1';
  const factors: number[] = [];
  for (let i = start; i >= end; i--) {
    factors.push(i);
  }
  return factors.join(' × ');
}

// 1. Permutación Simple: P_n = n!
export function calculatePermutationSimple(n: number): CombinatoricsResult {
  const result = factorial(n);
  const steps = [
    `Fórmula teórica: P(n) = n!`,
    `Reemplazo con n = ${n}: P(${n}) = ${n}!`,
    `Desarrollo factorial: ${n}! = ${formatProductRange(n, 1)} = ${result.toLocaleString()}`,
    `Resultado: Existen ${result.toLocaleString()} formas distintas de ordenar ${n} elementos.`
  ];

  return {
    type: 'permutation_simple',
    title: 'Permutación Simple (Sin Repetición)',
    formula: 'P_n = n!',
    n,
    result,
    steps,
    explanation: `Se toman todos los ${n} elementos disponibles, SÍ importa el orden en que se coloquen, y ningún elemento se repite.`
  };
}

// 2. Permutación con Repetición: P_n^{a,b,...} = n! / (a! * b! * ...)
export function calculatePermutationRepetition(n: number, repetitions: number[]): CombinatoricsResult {
  const numerator = factorial(n);
  let denominator = 1;
  const repTerms: string[] = [];
  const repValues: string[] = [];

  const validReps = repetitions.filter(r => r > 1);
  for (const r of validReps) {
    const f = factorial(r);
    denominator *= f;
    repTerms.push(`${r}!`);
    repValues.push(`${f}`);
  }

  const result = denominator > 0 ? Math.round(numerator / denominator) : 0;
  const repLabel = validReps.length > 0 ? validReps.join(', ') : 'ninguna';

  const steps = [
    `Fórmula teórica: P_n^{a, b, ...} = n! / (a! × b! × ...)`,
    `Reemplazo: n = ${n}, repeticiones = [${repLabel}]`,
    `Numerador: ${n}! = ${formatProductRange(n, 1)} = ${numerator.toLocaleString()}`,
    `Denominador: ${repTerms.length > 0 ? repTerms.join(' × ') + ' = ' + repValues.join(' × ') + ' = ' + denominator.toLocaleString() : '1'}`,
    `División: ${numerator.toLocaleString()} / ${denominator.toLocaleString()} = ${result.toLocaleString()}`,
    `Resultado: Existen ${result.toLocaleString()} ordenaciones posibles considerando las repeticiones.`
  ];

  return {
    type: 'permutation_rep',
    title: 'Permutación con Repetición',
    formula: 'P_n^{a,b,...} = n! / (a! · b! · ...)',
    n,
    repetitions: validReps,
    result,
    steps,
    explanation: `Se usan los ${n} elementos y SÍ importa el orden, pero algunos elementos se repiten indistinguibles entre sí.`
  };
}

// 3. Permutación Circular: PC_n = (n - 1)!
export function calculatePermutationCircular(n: number): CombinatoricsResult {
  const nMinus1 = Math.max(0, n - 1);
  const result = factorial(nMinus1);
  const steps = [
    `Fórmula teórica: PC(n) = (n - 1)!`,
    `Reemplazo con n = ${n}: PC(${n}) = (${n} - 1)! = ${nMinus1}!`,
    `Desarrollo factorial: ${nMinus1}! = ${formatProductRange(nMinus1, 1)} = ${result.toLocaleString()}`,
    `Resultado: Existen ${result.toLocaleString()} formas de ordenar ${n} elementos alrededor de un círculo cerrado.`
  ];

  return {
    type: 'permutation_circular',
    title: 'Permutación Circular',
    formula: 'PC_n = (n - 1)!',
    n,
    result,
    steps,
    explanation: `Elementos distribuidos en círculo cerrado. Como no hay un primer ni último lugar fijo, fijamos uno de referencia y ordenamos los (n - 1) restantes.`
  };
}

// 4. Variación Simple: V_n^k = n! / (n - k)!
export function calculateVariationSimple(n: number, k: number): CombinatoricsResult {
  if (k > n) {
    return {
      type: 'variation_simple',
      title: 'Variación Simple (Sin Repetición)',
      formula: 'V_n^k = n! / (n - k)!',
      n,
      r: k,
      result: 0,
      steps: [`Error: El tamaño del grupo (k = ${k}) no puede ser mayor que el total de elementos disponibles (n = ${n}) sin repetición.`],
      explanation: 'No se pueden elegir más elementos de los que existen si no se pueden repetir.'
    };
  }

  const diff = n - k;
  const num = factorial(n);
  const den = factorial(diff);
  const result = Math.round(num / den);

  const productExpansion = formatProductRange(n, diff + 1);

  const steps = [
    `Fórmula teórica: V(n, k) = n! / (n - k)!`,
    `Reemplazo con n = ${n} y k = ${k}: V(${n}, ${k}) = ${n}! / (${n} - ${k})! = ${n}! / ${diff}!`,
    `Simplificación de factoriales: (${formatProductRange(n, 1)}) / (${formatProductRange(diff, 1)})`,
    `Cancelando ${diff}!: quedan los k factores superiores: ${productExpansion || '1'} = ${result.toLocaleString()}`,
    `Resultado: Se pueden formar ${result.toLocaleString()} arreglos ordenados de ${k} elementos tomados de ${n}.`
  ];

  return {
    type: 'variation_simple',
    title: 'Variación Simple (Sin Repetición)',
    formula: 'V_n^k = n! / (n - k)!',
    n,
    r: k,
    result,
    steps,
    explanation: `SÍ importa el orden de los elementos, pero NO se toman todos a la vez (se eligen ${k} de un total de ${n}), y no se repiten.`
  };
}

// 5. Variación con Repetición: VR_n^k = n^k
export function calculateVariationRepetition(n: number, k: number): CombinatoricsResult {
  const result = Math.pow(n, k);
  const factorList = Array(k).fill(n).join(' × ');

  const steps = [
    `Fórmula teórica: VR(n, k) = n^k`,
    `Reemplazo: n = ${n} opciones disponibles para cada una de las k = ${k} posiciones`,
    `Cálculo de la potencia: ${n}^${k} = ${factorList || '1'} = ${result.toLocaleString()}`,
    `Resultado: Se pueden formar ${result.toLocaleString()} agrupaciones posibles con repetición permitida.`
  ];

  return {
    type: 'variation_rep',
    title: 'Variación con Repetición',
    formula: 'VR_n^k = n^k',
    n,
    r: k,
    result,
    steps,
    explanation: `SÍ importa el orden, se seleccionan ${k} elementos de ${n} disponibles, y cada posición puede repetir cualquiera de los ${n} elementos.`
  };
}

// 6. Combinación Simple: C_n^k = n! / [ k! * (n - k)! ]
export function calculateCombinationSimple(n: number, k: number): CombinatoricsResult {
  if (k > n) {
    return {
      type: 'combination_simple',
      title: 'Combinación Simple (Sin Repetición)',
      formula: 'C_n^k = n! / [k! · (n - k)!]',
      n,
      r: k,
      result: 0,
      steps: [`Error: En combinación sin repetición no podés elegir más elementos (k = ${k}) que el total existente (n = ${n}).`],
      explanation: 'No se pueden elegir más elementos sin repetición.'
    };
  }

  const diff = n - k;
  const num = factorial(n);
  const den = factorial(k) * factorial(diff);
  const result = Math.round(num / den);

  const topProduct = formatProductRange(n, diff + 1);
  const bottomProduct = formatProductRange(k, 1);

  const steps = [
    `Fórmula teórica: C(n, k) = n! / [k! × (n - k)!]`,
    `Reemplazo con n = ${n} y k = ${k}: C(${n}, ${k}) = ${n}! / [${k}! × (${n} - ${k})!] = ${n}! / [${k}! × ${diff}!]`,
    `Cancelando ${diff}! en numerador y denominador:`,
    `Numerador: ${topProduct} = ${factorial(n) / factorial(diff)}`,
    `Denominador: ${k}! = ${bottomProduct} = ${factorial(k)}`,
    `División final: (${topProduct}) / (${bottomProduct}) = ${result.toLocaleString()}`,
    `Resultado: Se pueden formar ${result.toLocaleString()} combinaciones distintas de ${k} elementos.`
  ];

  return {
    type: 'combination_simple',
    title: 'Combinación Simple (Sin Repetición)',
    formula: 'C_n^k = n! / [k!(n - k)!]',
    n,
    r: k,
    result,
    steps,
    explanation: `NO importa el orden en que se elijan los elementos (lo que importa es quiénes integran el grupo), y ningún elemento se repite.`
  };
}

// 7. Combinación con Repetición: CR_n^k = (n + k - 1)! / [ k! * (n - 1)! ]
export function calculateCombinationRepetition(n: number, k: number): CombinatoricsResult {
  if (n <= 0) {
    return {
      type: 'combination_rep',
      title: 'Combinación con Repetición',
      formula: 'CR_n^k = (n + k - 1)! / [k!(n - 1)!]',
      n,
      r: k,
      result: 0,
      steps: ['El número total de elementos n debe ser mayor a 0.'],
      explanation: 'Se requiere al menos un tipo de elemento.'
    };
  }

  const top = n + k - 1;
  const num = factorial(top);
  const den = factorial(k) * factorial(n - 1);
  const result = Math.round(num / den);

  const steps = [
    `Fórmula teórica: CR(n, k) = C(n + k - 1, k) = (n + k - 1)! / [k! × (n - 1)!]`,
    `Reemplazo con n = ${n} y k = ${k}: CR(${n}, ${k}) = (${n} + ${k} - 1)! / [${k}! × (${n} - 1)!] = ${top}! / [${k}! × ${n - 1}!]`,
    `Cálculo del numerador: ${top}! = ${num.toLocaleString()}`,
    `Cálculo del denominador: ${k}! × ${n - 1}! = ${factorial(k)} × ${factorial(n - 1)} = ${den.toLocaleString()}`,
    `División final: ${num.toLocaleString()} / ${den.toLocaleString()} = ${result.toLocaleString()}`,
    `Resultado: Existen ${result.toLocaleString()} combinaciones posibles pudiendo repetir elementos.`
  ];

  return {
    type: 'combination_rep',
    title: 'Combinación con Repetición',
    formula: 'CR_n^k = (n + k - 1)! / [k!(n - 1)!]',
    n,
    r: k,
    result,
    steps,
    explanation: `NO importa el orden de selección, y los elementos pueden repetirse cualquier cantidad de veces en el grupo de tamaño ${k}.`
  };
}
