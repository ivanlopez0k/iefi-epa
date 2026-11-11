import type { DescriptiveStatsResult, FrequencyRow } from '../../types';

export function parseNumberList(input: string): number[] {
  if (!input) return [];
  // Split by comma, semicolon, space, newline
  const tokens = input
    .trim()
    .split(/[\s,;\t\n]+/)
    .filter(t => t.length > 0);

  const numbers: number[] = [];
  for (const token of tokens) {
    const clean = token.replace(',', '.');
    const val = Number(clean);
    if (!isNaN(val)) {
      numbers.push(val);
    }
  }
  return numbers;
}

export function calculateDescriptiveStats(data: number[]): DescriptiveStatsResult {
  if (data.length === 0) {
    return {
      count: 0,
      data: [],
      sortedData: [],
      frequencies: [],
      totalFi: 0,
      totalHi: 0,
      totalPi: 0,
      mean: 0,
      median: 0,
      mode: [],
      modeType: 'amodal',
      min: 0,
      max: 0,
      range: 0,
      variance: 0,
      stdDev: 0,
      meanSteps: ['No hay datos ingresados.'],
      medianSteps: ['No hay datos ingresados.'],
      modeSteps: ['No hay datos ingresados.']
    };
  }

  const n = data.length;
  const sortedData = [...data].sort((a, b) => a - b);
  const min = sortedData[0];
  const max = sortedData[sortedData.length - 1];
  const range = max - min;

  // 1. Frequency Map
  const freqMap = new Map<number, number>();
  for (const num of sortedData) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // 2. Frequency Table Rows
  const frequencies: FrequencyRow[] = [];
  let cumFi = 0;
  let cumHi = 0;
  let cumPi = 0;

  for (const [xi, fi] of freqMap.entries()) {
    cumFi += fi;
    const hi = fi / n;
    cumHi += hi;
    const pi = hi * 100;
    cumPi += pi;

    frequencies.push({
      xi,
      fi,
      Fi: cumFi,
      hi: Number(hi.toFixed(4)),
      Hi: Number(cumHi.toFixed(4)),
      pi: Number(pi.toFixed(2)),
      Pi: Number(cumPi.toFixed(2))
    });
  }

  // 3. Media Aritmética
  const sum = data.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / n;

  // Detailed step for Mean using xi * fi
  const xiFiTerms = frequencies.map(f => `(${f.xi} · ${f.fi})`);
  const xiFiProducts = frequencies.map(f => Number(f.xi) * f.fi);
  const meanSteps = [
    `Fórmula: x̄ = Σ x_i / n = Σ (x_i · f_i) / n`,
    `Suma ponderada: ${xiFiTerms.join(' + ')}`,
    `Productos: ${xiFiProducts.join(' + ')} = ${sum}`,
    `División por n = ${n}: ${sum} / ${n} = ${mean.toFixed(4)}`,
    `Resultado: La media aritmética (promedio) es ${Number(mean.toFixed(4))}.`
  ];

  // 4. Mediana (Me)
  let median = 0;
  const medianSteps: string[] = [
    `Paso 1: Se ordenan los ${n} datos de menor a mayor:`,
    `[ ${sortedData.join(', ')} ]`
  ];

  if (n % 2 !== 0) {
    // Impar
    const midIndex = Math.floor(n / 2);
    median = sortedData[midIndex];
    medianSteps.push(`Como n = ${n} es IMPAR, la mediana se ubica en la posición central (n + 1) / 2 = (${n} + 1) / 2 = ${midIndex + 1}.`);
    medianSteps.push(`Valor en la posición ${midIndex + 1}: Me = ${median}`);
  } else {
    // Par
    const mid1 = n / 2 - 1;
    const mid2 = n / 2;
    const val1 = sortedData[mid1];
    const val2 = sortedData[mid2];
    median = (val1 + val2) / 2;
    medianSteps.push(`Como n = ${n} es PAR, la mediana es el promedio de los dos valores centrales:`);
    medianSteps.push(`Posición n / 2 (${mid1 + 1}): valor ${val1}`);
    medianSteps.push(`Posición (n / 2) + 1 (${mid2 + 1}): valor ${val2}`);
    medianSteps.push(`Cálculo: Me = (${val1} + ${val2}) / 2 = ${median}`);
  }

  // 5. Moda (Mo)
  let maxFi = 0;
  for (const row of frequencies) {
    if (row.fi > maxFi) maxFi = row.fi;
  }

  const modeCandidates = frequencies.filter(f => f.fi === maxFi).map(f => Number(f.xi));
  let mode: number[] = [];
  let modeType: 'amodal' | 'unimodal' | 'bimodal' | 'multimodal' = 'amodal';
  const modeSteps: string[] = [
    `Frecuencia máxima observada: f_max = ${maxFi}.`
  ];

  if (maxFi === 1 || modeCandidates.length === frequencies.length) {
    // All frequencies are equal or 1
    mode = [];
    modeType = 'amodal';
    modeSteps.push(`Todos los datos tienen la misma frecuencia (${maxFi}). Por lo tanto, la serie es AMODAL (no existe moda).`);
  } else if (modeCandidates.length === 1) {
    mode = modeCandidates;
    modeType = 'unimodal';
    modeSteps.push(`El único valor que alcanza la máxima frecuencia es ${mode[0]} (se repite ${maxFi} veces). Serie UNIMODAL: Mo = ${mode[0]}.`);
  } else if (modeCandidates.length === 2) {
    mode = modeCandidates;
    modeType = 'bimodal';
    modeSteps.push(`Hay dos valores que empatan en la máxima frecuencia (${maxFi}): [ ${mode.join(', ')} ]. Serie BIMODAL.`);
  } else {
    mode = modeCandidates;
    modeType = 'multimodal';
    modeSteps.push(`Hay ${modeCandidates.length} valores con la máxima frecuencia (${maxFi}): [ ${mode.join(', ')} ]. Serie MULTIMODAL.`);
  }

  // 6. Varianza y Desvío Estándar (poblacional / muestral)
  const squaredDiffs = data.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
  const variance = n > 1 ? squaredDiffs / (n - 1) : 0;
  const stdDev = Math.sqrt(variance);

  return {
    count: n,
    data,
    sortedData,
    frequencies,
    totalFi: n,
    totalHi: 1,
    totalPi: 100,
    mean: Number(mean.toFixed(4)),
    median: Number(median.toFixed(4)),
    mode,
    modeType,
    min,
    max,
    range,
    variance: Number(variance.toFixed(4)),
    stdDev: Number(stdDev.toFixed(4)),
    meanSteps,
    medianSteps,
    modeSteps
  };
}
