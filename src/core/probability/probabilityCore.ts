import type { EventClassification, ProbabilityEvent } from '../../types';

// Greatest Common Divisor for fraction reduction
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function simplifyFraction(numerator: number, denominator: number): string {
  if (denominator === 0) return 'Indefinido';
  if (numerator === 0) return '0';
  if (numerator === denominator) return '1';
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

export function classifyEvent(favorableCount: number, totalCount: number): EventClassification {
  if (favorableCount === 0) return 'imposible';
  if (favorableCount === 1) return 'elemental';
  if (favorableCount === totalCount && totalCount > 1) return 'seguro';
  return 'compuesto';
}

export function buildEvent(
  id: string,
  name: string,
  description: string,
  selectedPoints: string[],
  totalOmega: string[]
): ProbabilityEvent {
  // Ensure points exist in omega
  const points = selectedPoints.filter(p => totalOmega.includes(p));
  const favorableCases = points.length;
  const totalCases = totalOmega.length;
  const prob = totalCases > 0 ? favorableCases / totalCases : 0;
  const classification = classifyEvent(favorableCases, totalCases);

  return {
    id,
    name,
    description,
    points,
    classification,
    favorableCases,
    totalCases,
    probability: prob,
    fraction: simplifyFraction(favorableCases, totalCases),
    percentage: `${(prob * 100).toFixed(2)}%`
  };
}

// Preset experiments for standard curriculum
export interface ExperimentPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  omega: string[];
  explanation: string;
  sampleEvents: {
    name: string;
    description: string;
    points: string[];
  }[];
}

export const PRESET_EXPERIMENTS: ExperimentPreset[] = [
  {
    id: 'cooperativa',
    title: 'Elección Directiva de Cooperativa (IEFI)',
    category: 'Permutación / Asignación de Roles',
    description: 'Se elige Presidente y Secretario entre Jorge (J), Alberto (A) y Sara (S). La primera letra indica Presidente y la segunda Secretario.',
    omega: ['JA', 'JS', 'AS', 'AJ', 'SJ', 'SA'],
    explanation: 'El orden sí importa porque el primer cargo es Presidente y el segundo Secretario. Como no se puede duplicar una persona, son permutaciones de 3 candidatos tomados de a 2: V_3^2 = 6 posibles parejas.',
    sampleEvents: [
      {
        name: 'Evento M (Solo mujeres)',
        description: 'Que sean elegidas solo mujeres en ambos cargos.',
        points: [] // Imposible: solo Sara es mujer y se eligen 2 cargos
      },
      {
        name: 'Evento N (Un hombre y una mujer)',
        description: 'Que el equipo esté integrado por un hombre y una mujer (en cualquier cargo).',
        points: ['JS', 'SJ', 'AS', 'SA'] // Compuesto (4 puntos)
      },
      {
        name: 'Evento H (Solo hombres)',
        description: 'Que ambos cargos sean ocupados por hombres.',
        points: ['JA', 'AJ'] // Compuesto (2 puntos)
      },
      {
        name: 'Evento S (Sara es Presidenta)',
        description: 'Que Sara quede elegida como Presidenta.',
        points: ['SJ', 'SA'] // Compuesto (2 puntos)
      }
    ]
  },
  {
    id: 'monedas-3',
    title: 'Lanzamiento de 3 Monedas Simultáneas',
    category: 'Experimento Clásico',
    description: 'Se lanzan tres monedas al aire al mismo tiempo. Se anota Cara (C) o Sello (S).',
    omega: ['CCC', 'CCS', 'CSC', 'CSS', 'SSS', 'SSC', 'SCS', 'SCC'],
    explanation: 'Por el principio de multiplicación, cada moneda tiene 2 resultados posibles: 2 × 2 × 2 = 2³ = 8 puntos muestrales.',
    sampleEvents: [
      {
        name: 'Evento A (Exactamente 3 caras)',
        description: 'Obtener cara en las tres monedas {CCC}.',
        points: ['CCC'] // Elemental
      },
      {
        name: 'Evento B (Exactamente 2 caras y 1 sello)',
        description: 'Obtener dos caras y un sello en cualquier orden.',
        points: ['CCS', 'CSC', 'SCC'] // Compuesto
      },
      {
        name: 'Evento C (Al menos 1 sello)',
        description: 'Obtener uno, dos o tres sellos.',
        points: ['CCS', 'CSC', 'CSS', 'SSS', 'SSC', 'SCS', 'SCC'] // Compuesto
      },
      {
        name: 'Evento D (Obtener 4 caras)',
        description: 'Obtener 4 caras al lanzar 3 monedas.',
        points: [] // Imposible
      }
    ]
  },
  {
    id: 'dado-6',
    title: 'Lanzamiento de un Dado Común (6 caras)',
    category: 'Experimento Clásico',
    description: 'Se lanza un dado equilibrado de seis caras numeradas del 1 al 6.',
    omega: ['1', '2', '3', '4', '5', '6'],
    explanation: 'Espacio muestral simple y equiprobable con 6 puntos muestrales.',
    sampleEvents: [
      {
        name: 'Evento Par (Número par)',
        description: 'Que salga 2, 4 o 6.',
        points: ['2', '4', '6']
      },
      {
        name: 'Evento Primo (Número primo)',
        description: 'Que salga 2, 3 o 5.',
        points: ['2', '3', '5']
      },
      {
        name: 'Evento Menor a 7',
        description: 'Que salga un número menor a 7.',
        points: ['1', '2', '3', '4', '5', '6'] // Seguro
      },
      {
        name: 'Evento As (Sale el número 1)',
        description: 'Obtener un uno.',
        points: ['1'] // Elemental
      }
    ]
  }
];
