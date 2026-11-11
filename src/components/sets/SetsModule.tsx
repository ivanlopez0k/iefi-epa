import React, { useState } from 'react';
import styles from './SetsModule.module.css';
import { parseSetInput, formatSet, calculateSetOperations } from '../../core/sets/setOperations';
import { Layers, Sparkles, AlertCircle } from 'lucide-react';

export const SetsModule: React.FC = () => {
  const [universeInput, setUniverseInput] = useState<string>('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
  const [setAInput, setSetAInput] = useState<string>('1, 2, 3, 4, 5');
  const [setBInput, setSetBInput] = useState<string>('4, 5, 6, 7, 8');

  const universe = parseSetInput(universeInput);
  const setA = parseSetInput(setAInput);
  const setB = parseSetInput(setBInput);

  const ops = calculateSetOperations(universe, setA, setB);
  const areDisjoint = ops.intersection.length === 0;

  // Preset buttons
  const loadNumericPreset = () => {
    setUniverseInput('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
    setSetAInput('1, 2, 3, 4, 5');
    setSetBInput('4, 5, 6, 7, 8');
  };

  const loadCooperativaPreset = () => {
    setUniverseInput('Jorge, Alberto, Sara, Maria, Pedro');
    setSetAInput('Jorge, Alberto, Sara');
    setSetBInput('Sara, Maria, Pedro');
  };

  const loadDisjointPreset = () => {
    setUniverseInput('1, 2, 3, 4, 5, 6, 7, 8');
    setSetAInput('1, 3, 5, 7');
    setSetBInput('2, 4, 6, 8');
  };

  return (
    <div className={styles.container}>
      {/* Preset bar */}
      <div className={styles.presetBar}>
        <span className={styles.presetTitle}>
          <Sparkles size={16} /> Cargar Casos de Prueba:
        </span>
        <button className={styles.presetBtn} onClick={loadNumericPreset}>
          1️⃣ Números del 1 al 10 con intersección {`{4, 5}`}
        </button>
        <button className={styles.presetBtn} onClick={loadDisjointPreset}>
          ⚡ Mutuamente Excluyentes / Disjuntos (Pares vs Impares)
        </button>
        <button className={styles.presetBtn} onClick={loadCooperativaPreset}>
          👥 Nombres / Candidatos Cooperativa
        </button>
      </div>

      <div className={styles.grid}>
        {/* Left: Input Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Layers size={20} className={styles.iconAccent} /> Definición de Conjuntos
            </h2>
            <span className="badge badge-primary">Álgebra de Conjuntos</span>
          </div>

          <p className={styles.intro}>
            Ingresá los elementos separados por comas, espacios o saltos de línea. Los duplicados se filtran automáticamente.
          </p>

          <div className={styles.inputStack}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Conjunto Universo (U / Ω):
                <span className={styles.labelHint}>Totalidad de elementos de referencia</span>
              </label>
              <textarea
                rows={2}
                value={universeInput}
                onChange={e => setUniverseInput(e.target.value)}
                placeholder="ej: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
              />
              <span className={styles.cardinalityText}>
                Cardinalidad |U| = {ops.universe.length} elementos
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Conjunto A:
                <span className={styles.labelHint}>Primer subconjunto</span>
              </label>
              <textarea
                rows={2}
                value={setAInput}
                onChange={e => setSetAInput(e.target.value)}
                placeholder="ej: 1, 2, 3, 4, 5"
              />
              <span className={styles.cardinalityText}>
                Cardinalidad |A| = {ops.setA.length} elementos
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>
                Conjunto B:
                <span className={styles.labelHint}>Segundo subconjunto</span>
              </label>
              <textarea
                rows={2}
                value={setBInput}
                onChange={e => setSetBInput(e.target.value)}
                placeholder="ej: 4, 5, 6, 7, 8"
              />
              <span className={styles.cardinalityText}>
                Cardinalidad |B| = {ops.setB.length} elementos
              </span>
            </div>
          </div>

          {/* Mutually exclusive status */}
          <div className={`${styles.statusAlert} ${areDisjoint ? styles.statusDisjoint : styles.statusIntersect}`}>
            <AlertCircle size={18} />
            <div>
              <strong>
                {areDisjoint ? '¡Conjuntos Mutuamente Excluyentes (Disjuntos)!' : 'Conjuntos con Elementos en Común'}
              </strong>
              <p>
                {areDisjoint
                  ? 'La intersección es vacía (A ∩ B = ∅). No comparten ningún elemento.'
                  : `Comparten ${ops.intersection.length} elemento(s) en la intersección: ${formatSet(ops.intersection)}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Visual Venn & Operations Results */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Operaciones &amp; Diagrama de Venn</h2>
            <span className="badge badge-teal">Resultados</span>
          </div>

          {/* SVG Venn Representation */}
          <div className={styles.vennContainer}>
            <svg viewBox="0 0 400 220" className={styles.vennSvg}>
              {/* Universe Rect */}
              <rect x="10" y="10" width="380" height="200" rx="10" className={styles.universeRect} />
              <text x="25" y="32" className={styles.universeLabel}>U ({ops.universe.length})</text>

              {/* Circle A */}
              <circle cx="150" cy="115" r="75" className={styles.circleA} />
              <text x="100" y="70" className={styles.circleLabelA}>Conjunto A</text>

              {/* Circle B */}
              <circle cx="250" cy="115" r="75" className={styles.circleB} />
              <text x="265" y="70" className={styles.circleLabelB}>Conjunto B</text>

              {/* Items in A only */}
              <text x="125" y="115" className={styles.vennText}>
                |A - B| = {ops.differenceAB.length}
              </text>
              <text x="125" y="135" className={styles.vennSubtext}>
                {ops.differenceAB.slice(0, 3).join(', ')}{ops.differenceAB.length > 3 ? '...' : ''}
              </text>

              {/* Items in Intersection */}
              <text x="200" y="115" className={styles.vennTextCenter}>
                |A ∩ B| = {ops.intersection.length}
              </text>
              <text x="200" y="135" className={styles.vennSubtextCenter}>
                {ops.intersection.slice(0, 3).join(', ')}{ops.intersection.length > 3 ? '...' : ''}
              </text>

              {/* Items in B only */}
              <text x="275" y="115" className={styles.vennText}>
                |B - A| = {ops.differenceBA.length}
              </text>
              <text x="275" y="135" className={styles.vennSubtext}>
                {ops.differenceBA.slice(0, 3).join(', ')}{ops.differenceBA.length > 3 ? '...' : ''}
              </text>
            </svg>
          </div>

          {/* Operation Cards Grid */}
          <div className={styles.opsGrid}>
            {/* Unión */}
            <div className={styles.opCard}>
              <div className={styles.opHeader}>
                <span className={styles.opSymbol}>A ∪ B</span>
                <span className={styles.opBadge}>Unión ({ops.union.length})</span>
              </div>
              <div className={styles.opValue}>{formatSet(ops.union)}</div>
              <span className={styles.opFormula}>|A ∪ B| = |A| + |B| - |A ∩ B| = {ops.setA.length} + {ops.setB.length} - {ops.intersection.length} = {ops.union.length}</span>
            </div>

            {/* Intersección */}
            <div className={styles.opCard}>
              <div className={styles.opHeader}>
                <span className={styles.opSymbol}>A ∩ B</span>
                <span className={styles.opBadge}>Intersección ({ops.intersection.length})</span>
              </div>
              <div className={styles.opValue}>{formatSet(ops.intersection)}</div>
              <span className={styles.opFormula}>Elementos comunes a ambos conjuntos</span>
            </div>

            {/* Diferencia A - B */}
            <div className={styles.opCard}>
              <div className={styles.opHeader}>
                <span className={styles.opSymbol}>A - B</span>
                <span className={styles.opBadge}>Diferencia ({ops.differenceAB.length})</span>
              </div>
              <div className={styles.opValue}>{formatSet(ops.differenceAB)}</div>
              <span className={styles.opFormula}>Pertenecen a A pero no a B</span>
            </div>

            {/* Diferencia B - A */}
            <div className={styles.opCard}>
              <div className={styles.opHeader}>
                <span className={styles.opSymbol}>B - A</span>
                <span className={styles.opBadge}>Diferencia ({ops.differenceBA.length})</span>
              </div>
              <div className={styles.opValue}>{formatSet(ops.differenceBA)}</div>
              <span className={styles.opFormula}>Pertenecen a B pero no a A</span>
            </div>

            {/* Diferencia Simétrica */}
            <div className={styles.opCard}>
              <div className={styles.opHeader}>
                <span className={styles.opSymbol}>A △ B</span>
                <span className={styles.opBadge}>Dif. Simétrica ({ops.symmetricDiff.length})</span>
              </div>
              <div className={styles.opValue}>{formatSet(ops.symmetricDiff)}</div>
              <span className={styles.opFormula}>(A - B) ∪ (B - A)</span>
            </div>

            {/* Complemento de A */}
            <div className={styles.opCard}>
              <div className={styles.opHeader}>
                <span className={styles.opSymbol}>Aᶜ</span>
                <span className={styles.opBadge}>Complemento de A ({ops.complementA.length})</span>
              </div>
              <div className={styles.opValue}>{formatSet(ops.complementA)}</div>
              <span className={styles.opFormula}>U - A (todo lo que no está en A)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
