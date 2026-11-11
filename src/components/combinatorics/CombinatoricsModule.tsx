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
import { HelpCircle, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

export const CombinatoricsModule: React.FC = () => {
  // Decision Helper state
  const [orderMatters, setOrderMatters] = useState<boolean>(true);
  const [usesAllElements, setUsesAllElements] = useState<boolean>(true);
  const [allowsRepetition, setAllowsRepetition] = useState<boolean>(false);

  // Selected calculation type
  const [calcType, setCalcType] = useState<CombinatoricsType>('permutation_simple');

  // Input states
  const [n, setN] = useState<number>(6);
  const [r, setR] = useState<number>(3);
  const [repetitionsInput, setRepetitionsInput] = useState<string>('2, 2');

  const recommendation = classifyCombinatorics({
    orderMatters,
    usesAllElements,
    allowsRepetition
  });

  const applyRecommendation = () => {
    setCalcType(recommendation.type);
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
      result = calculateVariationSimple(n, r);
      break;
    case 'variation_rep':
      result = calculateVariationRepetition(n, r);
      break;
    case 'combination_simple':
      result = calculateCombinationSimple(n, r);
      break;
    case 'combination_rep':
      result = calculateCombinationRepetition(n, r);
      break;
    default:
      result = calculatePermutationSimple(n);
  }

  const loadExampleButacas = () => {
    setOrderMatters(true);
    setUsesAllElements(true);
    setAllowsRepetition(false);
    setCalcType('permutation_simple');
    setN(6);
  };

  const loadExampleComite = () => {
    setOrderMatters(false);
    setUsesAllElements(false);
    setAllowsRepetition(false);
    setCalcType('combination_simple');
    setN(10);
    setR(3);
  };

  const loadExamplePodio = () => {
    setOrderMatters(true);
    setUsesAllElements(false);
    setAllowsRepetition(false);
    setCalcType('variation_simple');
    setN(8);
    setR(3);
  };

  return (
    <div className={styles.container}>
      {/* Educational Banner with Quick Examples */}
      <div className={styles.exampleBar}>
        <div className={styles.exampleTitle}>
          <BookOpen size={16} /> Ejemplos de la Cátedra:
        </div>
        <div className={styles.exampleChips}>
          <button className={styles.chip} onClick={loadExampleButacas}>
            🪑 6 Personas en Fila (P₆ = 720)
          </button>
          <button className={styles.chip} onClick={loadExamplePodio}>
            🥇 Podio de 3 entre 8 atletas (V₈³)
          </button>
          <button className={styles.chip} onClick={loadExampleComite}>
            👥 Comisión de 3 entre 10 personas (C₁₀³)
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Column: Decision Helper Tree */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <HelpCircle className={styles.accentIcon} size={20} />
              Asistente: ¿Qué fórmula aplicar?
            </h2>
            <span className="badge badge-primary">Guía Conceptual</span>
          </div>

          <p className={styles.helperIntro}>
            Respondé estas 3 preguntas fundamentales para determinar sin error la técnica de conteo aplicable:
          </p>

          <div className={styles.questionsContainer}>
            {/* Q1 */}
            <div className={styles.questionBlock}>
              <label className={styles.questionLabel}>
                1. ¿Importa el orden en que se colocan los elementos?
              </label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${orderMatters ? styles.toggleActive : ''}`}
                  onClick={() => setOrderMatters(true)}
                >
                  SÍ (Permutación / Variación)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${!orderMatters ? styles.toggleActive : ''}`}
                  onClick={() => setOrderMatters(false)}
                >
                  NO (Combinación)
                </button>
              </div>
            </div>

            {/* Q2 */}
            <div className={styles.questionBlock}>
              <label className={styles.questionLabel}>
                2. ¿Intervienen TODOS los elementos del conjunto?
              </label>
              <div className={styles.toggleRow}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${usesAllElements ? styles.toggleActive : ''}`}
                  onClick={() => setUsesAllElements(true)}
                >
                  SÍ (Se usan todos: n = r)
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${!usesAllElements ? styles.toggleActive : ''}`}
                  onClick={() => setUsesAllElements(false)}
                >
                  NO (Se toma un subconjunto r &lt; n)
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

          {/* Diagnosis Box */}
          <div className={styles.diagnosisBox}>
            <div className={styles.diagHeader}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              <span className={styles.diagTitle}>Diagnóstico Matemático:</span>
            </div>
            <h3 className={styles.diagResult}>{recommendation.title}</h3>
            <p className={styles.diagReason}>{recommendation.reason}</p>
            <div className={styles.diagExample}>
              <strong>Ejemplo práctico:</strong> {recommendation.example}
            </div>
            <button className="btn btn-primary" onClick={applyRecommendation} style={{ marginTop: '0.75rem', width: '100%' }}>
              Cargar esta fórmula en la calculadora <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Calculator & Step-by-Step */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              Calculadora &amp; Resolución Paso a Paso
            </h2>
            <span className="badge badge-teal">{result.formula}</span>
          </div>

          {/* Formula Selector Tabs */}
          <div className={styles.formulaSelector}>
            <button
              className={`${styles.formulaBtn} ${calcType === 'permutation_simple' ? styles.formulaBtnActive : ''}`}
              onClick={() => setCalcType('permutation_simple')}
            >
              Permutación Simple
            </button>
            <button
              className={`${styles.formulaBtn} ${calcType === 'permutation_rep' ? styles.formulaBtnActive : ''}`}
              onClick={() => setCalcType('permutation_rep')}
            >
              Permutación c/ Repetición
            </button>
            <button
              className={`${styles.formulaBtn} ${calcType === 'permutation_circular' ? styles.formulaBtnActive : ''}`}
              onClick={() => setCalcType('permutation_circular')}
            >
              Permutación Circular
            </button>
            <button
              className={`${styles.formulaBtn} ${calcType === 'variation_simple' ? styles.formulaBtnActive : ''}`}
              onClick={() => setCalcType('variation_simple')}
            >
              Variación Simple
            </button>
            <button
              className={`${styles.formulaBtn} ${calcType === 'variation_rep' ? styles.formulaBtnActive : ''}`}
              onClick={() => setCalcType('variation_rep')}
            >
              Variación c/ Repetición
            </button>
            <button
              className={`${styles.formulaBtn} ${calcType === 'combination_simple' ? styles.formulaBtnActive : ''}`}
              onClick={() => setCalcType('combination_simple')}
            >
              Combinación Simple
            </button>
            <button
              className={`${styles.formulaBtn} ${calcType === 'combination_rep' ? styles.formulaBtnActive : ''}`}
              onClick={() => setCalcType('combination_rep')}
            >
              Combinación c/ Repetición
            </button>
          </div>

          {/* Form Inputs */}
          <div className={styles.inputsRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Total de elementos (n):</label>
              <input
                type="number"
                min="0"
                max="30"
                value={n}
                onChange={e => setN(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>

            {calcType !== 'permutation_simple' && calcType !== 'permutation_circular' && calcType !== 'permutation_rep' && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Elementos a tomar (r):</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={r}
                  onChange={e => setR(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            )}

            {calcType === 'permutation_rep' && (
              <div className={styles.inputGroup} style={{ flex: '2 1 180px' }}>
                <label className={styles.label}>Repeticiones (separadas por coma):</label>
                <input
                  type="text"
                  placeholder="ej: 2, 2 o 3, 1"
                  value={repetitionsInput}
                  onChange={e => setRepetitionsInput(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Result Highlight Banner */}
          <div className={styles.resultBanner}>
            <div className={styles.resultLabel}>Resultado Final:</div>
            <div className={styles.resultValue}>{result.result.toLocaleString()}</div>
            <div className={styles.resultDesc}>{result.explanation}</div>
          </div>

          {/* Step-by-Step Box */}
          <div className="step-box">
            <h4 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              Desarrollo Analítico Paso a Paso:
            </h4>
            <ol>
              {result.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
