import React, { useState } from 'react';
import styles from './CombinatoricsModule.module.css';
import {
  calculatePermutationSimple,
  calculatePermutationRepetition,
  calculatePermutationCircular,
  calculateVariationSimple,
  calculateVariationRepetition,
  calculateCombinationSimple,
  calculateCombinationRepetition
} from '../../core/combinatorics/math';
import { classifyCombinatorics } from '../../core/combinatorics/classifier';
import type { CombinatoricsType, CombinatoricsResult } from '../../types';
import { Fraction, FormulaCard } from '../common/MathFormula';
import { HelpCircle, CheckCircle2, ArrowRight, Settings2 } from 'lucide-react';

export const CombinatoricsModule: React.FC = () => {
  // Navigation between direct formula pick vs decision wizard
  const [activeMode, setActiveMode] = useState<'direct' | 'wizard'>('direct');

  // Decision wizard state
  const [orderMatters, setOrderMatters] = useState<boolean>(true);
  const [usesAllElements, setUsesAllElements] = useState<boolean>(true);
  const [allowsRepetition, setAllowsRepetition] = useState<boolean>(false);

  // Selected formula
  const [calcType, setCalcType] = useState<CombinatoricsType>('permutation_simple');

  // Inputs
  const [n, setN] = useState<number>(6);
  const [k, setK] = useState<number>(3);
  const [repetitionsInput, setRepetitionsInput] = useState<string>('2, 2');

  const recommendation = classifyCombinatorics({
    orderMatters,
    usesAllElements,
    allowsRepetition
  });

  const applyRecommendation = () => {
    setCalcType(recommendation.type);
    setActiveMode('direct');
  };

  // Perform calculation
  let result: CombinatoricsResult;
  switch (calcType) {
    case 'permutation_simple':
      result = calculatePermutationSimple(n);
      break;
    case 'permutation_rep': {
      const reps = repetitionsInput
        .split(/[,;\s]+/)
        .map(x => parseInt(x.trim()))
        .filter(x => !isNaN(x) && x > 0);
      result = calculatePermutationRepetition(n, reps);
      break;
    }
    case 'permutation_circular':
      result = calculatePermutationCircular(n);
      break;
    case 'variation_simple':
      result = calculateVariationSimple(n, k);
      break;
    case 'variation_rep':
      result = calculateVariationRepetition(n, k);
      break;
    case 'combination_simple':
      result = calculateCombinationSimple(n, k);
      break;
    case 'combination_rep':
      result = calculateCombinationRepetition(n, k);
      break;
    default:
      result = calculatePermutationSimple(n);
  }

  // Render proper math formula visually
  const renderVisualFormula = () => {
    switch (calcType) {
      case 'permutation_simple':
        return (
          <>
            <span>P<sub>{n}</sub></span>
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <span>{n}!</span>
          </>
        );
      case 'permutation_rep':
        return (
          <>
            <span>P<sub>{n}</sub><sup>{repetitionsInput || 'a,b'}</sup></span>
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <Fraction
              num={<span>{n}!</span>}
              den={<span>{repetitionsInput ? repetitionsInput.split(/[,;\s]+/).filter(Boolean).map(x => `${x}!`).join(' · ') : 'a! · b!'}</span>}
            />
          </>
        );
      case 'permutation_circular':
        return (
          <>
            <span>PC<sub>{n}</sub></span>
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <span>({n} - 1)!</span>
          </>
        );
      case 'variation_simple':
        return (
          <>
            <span>V<sub>{n}</sub><sup>{k}</sup></span>
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <Fraction
              num={<span>{n}!</span>}
              den={<span>({n} - {k})!</span>}
            />
          </>
        );
      case 'variation_rep':
        return (
          <>
            <span>VR<sub>{n}</sub><sup>{k}</sup></span>
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <span>{n}<sup>{k}</sup></span>
          </>
        );
      case 'combination_simple':
        return (
          <>
            <span>C<sub>{n}</sub><sup>{k}</sup></span>
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <Fraction
              num={<span>{n}!</span>}
              den={<span>{k}! · ({n} - {k})!</span>}
            />
          </>
        );
      case 'combination_rep':
        return (
          <>
            <span>CR<sub>{n}</sub><sup>{k}</sup></span>
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <Fraction
              num={<span>({n} + {k} - 1)!</span>}
              den={<span>{k}! · ({n} - 1)!</span>}
            />
          </>
        );
    }
  };

  return (
    <div className={styles.container}>
      {/* Mode switcher navigation */}
      <div className={styles.modeBar}>
        <button
          type="button"
          onClick={() => setActiveMode('direct')}
          className={`${styles.modeTab} ${activeMode === 'direct' ? styles.modeTabActive : ''}`}
        >
          <Settings2 size={16} /> 1. Elegir Fórmula Directamente
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('wizard')}
          className={`${styles.modeTab} ${activeMode === 'wizard' ? styles.modeTabActive : ''}`}
        >
          <HelpCircle size={16} /> 2. Asistente Conceptual: ¿Cuál debo usar?
        </button>
      </div>

      {/* Mode 2: Wizard */}
      {activeMode === 'wizard' && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">
              <HelpCircle className={styles.accentIcon} size={20} />
              Cuestionario de 3 Preguntas Clave
            </h3>
            <span className="badge badge-primary">Guía de Conteo</span>
          </div>

          <p className={styles.helperIntro}>
            Respondé según tu problema para identificar exactamente si corresponde Permutación, Variación o Combinación:
          </p>

          <div className={styles.questionsContainer}>
            {/* Q1 */}
            <div className={styles.questionBlock}>
              <label className={styles.questionLabel}>
                1. ¿Importa el orden en que se ubican los elementos?
              </label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${orderMatters ? styles.toggleActive : ''}`}
                  onClick={() => setOrderMatters(true)}
                >
                  SÍ (Permutaciones o Variaciones)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${!orderMatters ? styles.toggleActive : ''}`}
                  onClick={() => setOrderMatters(false)}
                >
                  NO (Combinaciones)
                </button>
              </div>
            </div>

            {/* Q2 */}
            <div className={styles.questionBlock}>
              <label className={styles.questionLabel}>
                2. ¿Intervienen TODOS los elementos disponibles a la vez?
              </label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${usesAllElements ? styles.toggleActive : ''}`}
                  onClick={() => setUsesAllElements(true)}
                >
                  SÍ (Se usan todos: n = k)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${!usesAllElements ? styles.toggleActive : ''}`}
                  onClick={() => setUsesAllElements(false)}
                >
                  NO (Se toma un subconjunto k &lt; n)
                </button>
              </div>
            </div>

            {/* Q3 */}
            <div className={styles.questionBlock}>
              <label className={styles.questionLabel}>
                3. ¿Se pueden REPETIR los elementos?
              </label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${allowsRepetition ? styles.toggleActive : ''}`}
                  onClick={() => setAllowsRepetition(true)}
                >
                  SÍ (Con Repetición)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${!allowsRepetition ? styles.toggleActive : ''}`}
                  onClick={() => setAllowsRepetition(false)}
                >
                  NO (Sin Repetición)
                </button>
              </div>
            </div>
          </div>

          <div className={styles.diagnosisBox}>
            <div className={styles.diagHeader}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              <span className={styles.diagTitle}>Fórmula Recomendada:</span>
            </div>
            <h3 className={styles.diagResult}>{recommendation.title}</h3>
            <p className={styles.diagReason}>{recommendation.reason}</p>
            <button className="btn btn-primary" onClick={applyRecommendation} style={{ marginTop: '0.85rem' }}>
              Aplicar y Cargar en la Calculadora <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Formula Selector Categorized */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Selección de Técnica y Parámetros</h2>
          <span className="badge badge-teal">Unidad 1</span>
        </div>

        {/* Categorized buttons */}
        <div className={styles.categoriesContainer}>
          {/* Permutaciones */}
          <div className={styles.categoryGroup}>
            <span className={styles.groupHeading}>Permutaciones (Orden SÍ • Todos SÍ):</span>
            <div className={styles.groupButtons}>
              <button
                type="button"
                className={`${styles.formulaPill} ${calcType === 'permutation_simple' ? styles.formulaPillActive : ''}`}
                onClick={() => setCalcType('permutation_simple')}
              >
                Simple: <strong>P(n) = n!</strong>
              </button>
              <button
                type="button"
                className={`${styles.formulaPill} ${calcType === 'permutation_rep' ? styles.formulaPillActive : ''}`}
                onClick={() => setCalcType('permutation_rep')}
              >
                Con Repetición: <strong>P<sub>n</sub><sup>a,b...</sup></strong>
              </button>
              <button
                type="button"
                className={`${styles.formulaPill} ${calcType === 'permutation_circular' ? styles.formulaPillActive : ''}`}
                onClick={() => setCalcType('permutation_circular')}
              >
                Circular: <strong>PC(n) = (n-1)!</strong>
              </button>
            </div>
          </div>

          {/* Variaciones */}
          <div className={styles.categoryGroup}>
            <span className={styles.groupHeading}>Variaciones (Orden SÍ • No entran todos):</span>
            <div className={styles.groupButtons}>
              <button
                type="button"
                className={`${styles.formulaPill} ${calcType === 'variation_simple' ? styles.formulaPillActive : ''}`}
                onClick={() => setCalcType('variation_simple')}
              >
                Simple: <strong>V(n, k) = n! / (n-k)!</strong>
              </button>
              <button
                type="button"
                className={`${styles.formulaPill} ${calcType === 'variation_rep' ? styles.formulaPillActive : ''}`}
                onClick={() => setCalcType('variation_rep')}
              >
                Con Repetición: <strong>VR(n, k) = n<sup>k</sup></strong>
              </button>
            </div>
          </div>

          {/* Combinaciones */}
          <div className={styles.categoryGroup}>
            <span className={styles.groupHeading}>Combinaciones (Orden NO importa):</span>
            <div className={styles.groupButtons}>
              <button
                type="button"
                className={`${styles.formulaPill} ${calcType === 'combination_simple' ? styles.formulaPillActive : ''}`}
                onClick={() => setCalcType('combination_simple')}
              >
                Simple: <strong>C(n, k) = n! / [k!(n-k)!]</strong>
              </button>
              <button
                type="button"
                className={`${styles.formulaPill} ${calcType === 'combination_rep' ? styles.formulaPillActive : ''}`}
                onClick={() => setCalcType('combination_rep')}
              >
                Con Repetición: <strong>CR(n, k)</strong>
              </button>
            </div>
          </div>
        </div>

        {/* Inputs section */}
        <div className={styles.inputsSection}>
          <div className={styles.inputCard}>
            <label className={styles.inputLabel}>
              Total de elementos disponibles (n):
            </label>
            <input
              type="number"
              min="0"
              max="25"
              value={n}
              onChange={e => setN(Math.max(0, parseInt(e.target.value) || 0))}
              className={styles.largeInput}
            />
            <span className={styles.inputHelp}>Cantidad total de elementos en el conjunto.</span>
          </div>

          {calcType !== 'permutation_simple' && calcType !== 'permutation_circular' && calcType !== 'permutation_rep' && (
            <div className={styles.inputCard}>
              <label className={styles.inputLabel}>
                Elementos que se seleccionan (k):
              </label>
              <input
                type="number"
                min="0"
                max={calcType.includes('rep') ? 25 : n}
                value={k}
                onChange={e => setK(Math.max(0, parseInt(e.target.value) || 0))}
                className={styles.largeInput}
              />
              <span className={styles.inputHelp}>Tamaño del subgrupo a ordenar o agrupar.</span>
            </div>
          )}

          {calcType === 'permutation_rep' && (
            <div className={styles.inputCard} style={{ flex: '2 1 240px' }}>
              <label className={styles.inputLabel}>
                Repeticiones de cada elemento repetido:
              </label>
              <input
                type="text"
                placeholder="ej: 2, 2 o 3, 1"
                value={repetitionsInput}
                onChange={e => setRepetitionsInput(e.target.value)}
                className={styles.largeInput}
              />
              <span className={styles.inputHelp}>Escribí cuántas veces se repite cada elemento, separadas por coma.</span>
            </div>
          )}
        </div>

        {/* Visual mathematical formula representation with fractions */}
        <div style={{ marginTop: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Fórmula matemática con tus valores:
          </span>
          <FormulaCard>
            {renderVisualFormula()}
          </FormulaCard>
        </div>

        {/* Big result highlight banner */}
        <div className={styles.resultBanner}>
          <div className={styles.resultLabel}>Resultado del Conteo:</div>
          <div className={styles.resultValue}>{result.result.toLocaleString()}</div>
          <p className={styles.resultExplanation}>{result.explanation}</p>
        </div>

        {/* Step-by-step resolution */}
        <div className="step-box">
          <h4 style={{ color: '#ffffff', marginBottom: '0.65rem', fontSize: '0.95rem' }}>
            Desarrollo Matemático Paso a Paso:
          </h4>
          <ol>
            {result.steps.map((step, idx) => (
              <li key={idx} style={{ padding: '0.2rem 0' }}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
