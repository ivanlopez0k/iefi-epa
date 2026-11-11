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
      // Doesn't use all elements, but order matters => Variación
      if (allowsRepetition) {
        return {
          type: 'variation_rep',
          title: 'Variación con Repetición',
          reason: 'Importa el orden, se eligen r elementos de un total n, y los elementos pueden repetirse.',
          example: '¿Cuántos números de 3 cifras se pueden formar con los dígitos 1, 2, 3, 4, 5 pudiendo repetir dígitos? VR_5^3 = 5³ = 125.'
        };
      } else {
        return {
          type: 'variation_simple',
          title: 'Variación Simple (Sin Repetición)',
          reason: 'Importa el orden, se eligen r elementos de n posibles (r < n) y ningún elemento se puede repetir.',
          example: 'En una carrera de 8 atletas, ¿de cuántas formas pueden repartirse el oro, plata y bronce? V_8^3 = 8! / 5! = 336.'
        };
      }
    }
  } else {
    // Order does NOT matter => Combinación
    if (allowsRepetition) {
      return {
        type: 'combination_rep',
        title: 'Combinación con Repetición',
        reason: 'NO importa el orden de selección y los elementos pueden elegirse más de una vez.',
        example: 'En una heladería hay 5 gustos. ¿De cuántas formas puedo pedir un cucurucho de 3 bochas pudiendo repetir sabores? CR_5^3.'
      };
    } else {
      return {
        type: 'combination_simple',
        title: 'Combinación Simple (Sin Repetición)',
        reason: 'NO importa el orden de los elementos, solo quiénes integran el grupo, y no se repiten.',
        example: '¿Cuántos grupos de 3 estudiantes pueden formarse a partir de una clase de 10 alumnos? C_10^3 = 10! / (3! · 7!) = 120.'
      };
    }
  }
}
