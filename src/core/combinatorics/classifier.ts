import type { CombinatoricsType } from '../../types';

export interface DecisionCriteria {
  orderMatters: boolean;
  usesAllElements: boolean;
  allowsRepetition: boolean;
}

export interface Recommendation {
  type: CombinatoricsType;
  title: string;
  reason: string;
  example: string;
}

export function classifyCombinatorics(criteria: DecisionCriteria): Recommendation {
  const { orderMatters, usesAllElements, allowsRepetition } = criteria;

  if (orderMatters) {
    if (usesAllElements) {
      if (allowsRepetition) {
        return {
          type: 'permutation_rep',
          title: 'Permutación con Repetición',
          reason: 'Importa el orden y se toman todos los elementos (n), pero algunos se repiten.',
          example: '¿Cuántas palabras con o sin sentido se pueden formar con las letras de "CASA"? (n=4 letras, la "A" se repite 2 veces).'
        };
      } else {
        return {
          type: 'permutation_simple',
          title: 'Permutación Simple (Sin Repetición)',
          reason: 'Importa el orden, se usan absolutamente todos los elementos disponibles y no hay repetición.',
          example: '¿De cuántas formas distintas pueden sentarse 6 personas en una fila de 6 butacas? P_6 = 6! = 720.'
        };
      }
    } else {
      // Order matters, subset of elements => Variación Simple
      return {
        type: 'variation_simple',
        title: 'Variación Simple (Sin Repetición)',
        reason: 'Importa el orden, se eligen k elementos de n posibles (k < n) y ningún elemento se puede repetir.',
        example: 'En una carrera de 8 atletas, ¿de cuántas formas pueden repartirse el oro, plata y bronce? V_8^3 = 8! / (8-3)! = 336.'
      };
    }
  } else {
    // Order does NOT matter => Combinación Simple
    return {
      type: 'combination_simple',
      title: 'Combinación Simple (Sin Repetición)',
      reason: 'NO importa el orden de selección, solo quiénes integran el grupo, y no se repiten.',
      example: '¿Cuántos grupos de 3 estudiantes pueden formarse a partir de una clase de 10 alumnos? C_10^3 = 10! / [3!(10-3)!] = 120.'
    };
  }
}
