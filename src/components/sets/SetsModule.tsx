import React, { useState } from 'react';
import styles from './SetsModule.module.css';
import { parseSetInput, formatSet, calculateSetOperations } from '../../core/sets/setOperations';
import { Layers, Plus, Trash2, AlertCircle, Info } from 'lucide-react';

export const SetsModule: React.FC = () => {
  // Sets inputs
  const [universeInput, setUniverseInput] = useState<string>('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
  const [setAInput, setSetAInput] = useState<string>('1, 2, 3, 4, 5');
  const [setBInput, setSetBInput] = useState<string>('4, 5, 6, 7, 8');
  
  // Optional Set C
  const [hasSetC, setHasSetC] = useState<boolean>(false);
  const [setCInput, setSetCInput] = useState<string>('5, 6, 7, 9');

  const universe = parseSetInput(universeInput);
  const setA = parseSetInput(setAInput);
  const setB = parseSetInput(setBInput);
  const setC = hasSetC ? parseSetInput(setCInput) : undefined;

  const ops = calculateSetOperations(universe, setA, setB, setC);
  const areDisjointAB = ops.differenceAB.length === ops.setA.length && ops.differenceBA.length === ops.setB.length;

  // Helper to format short element preview inside SVG
  const formatSvgPreview = (list?: string[]) => {
    if (!list || list.length === 0) return '∅';
    if (list.length <= 3) return list.join(', ');
    return `${list.slice(0, 2).join(', ')}... (${list.length})`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Left: Input Form for Sets */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Layers size={20} className={styles.iconAccent} /> Definición de Conjuntos
            </h2>
            <div className={styles.setActions}>
              {!hasSetC ? (
                <button
                  type="button"
                  onClick={() => setHasSetC(true)}
                  className="btn btn-primary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <Plus size={14} /> Agregar Conjunto C
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setHasSetC(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', color: 'var(--accent-rose)' }}
                >
                  <Trash2 size={14} /> Quitar Conjunto C
                </button>
              )}
            </div>
          </div>

          <p className={styles.intro}>
            Ingresá los elementos separados por comas, espacios o saltos de línea. Los elementos repetidos se unifican automáticamente:
          </p>

          <div className={styles.inputStack}>
            {/* Universe */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span>Conjunto Universo (U / Ω):</span>
                <span className={styles.cardinalityText}>|U| = {ops.universe.length}</span>
              </label>
              <textarea
                rows={2}
                value={universeInput}
                onChange={e => setUniverseInput(e.target.value)}
                placeholder="ej: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
              />
            </div>

            {/* Set A */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span style={{ color: '#a5b4fc' }}>Conjunto A:</span>
                <span className={styles.cardinalityText}>|A| = {ops.setA.length}</span>
              </label>
              <textarea
                rows={2}
                value={setAInput}
                onChange={e => setSetAInput(e.target.value)}
                placeholder="ej: 1, 2, 3, 4, 5"
              />
            </div>

            {/* Set B */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <span style={{ color: '#5eead4' }}>Conjunto B:</span>
                <span className={styles.cardinalityText}>|B| = {ops.setB.length}</span>
              </label>
              <textarea
                rows={2}
                value={setBInput}
                onChange={e => setSetBInput(e.target.value)}
                placeholder="ej: 4, 5, 6, 7, 8"
              />
            </div>

            {/* Set C (Optional) */}
            {hasSetC && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span style={{ color: '#fcd34d' }}>Conjunto C:</span>
                  <span className={styles.cardinalityText}>|C| = {ops.setC ? ops.setC.length : 0}</span>
                </label>
                <textarea
                  rows={2}
                  value={setCInput}
                  onChange={e => setSetCInput(e.target.value)}
                  placeholder="ej: 5, 6, 7, 9"
                />
              </div>
            )}
          </div>

          {/* Disjoint alert */}
          <div className={`${styles.statusAlert} ${areDisjointAB ? styles.statusDisjoint : styles.statusIntersect}`}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>
                {areDisjointAB ? '¡A y B son Mutuamente Excluyentes / Disjuntos!' : 'Conjuntos con Elementos en Común'}
              </strong>
              <p>
                {areDisjointAB
                  ? 'No comparten ningún elemento entre sí (A ∩ B = ∅).'
                  : `Comparten elementos en su intersección: ${formatSet(ops.onlyAB)}.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Clean Diagram without formula clutter */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              Diagrama de Venn ({hasSetC ? '3 Conjuntos' : '2 Conjuntos'})
            </h2>
            <span className="badge badge-teal">Representación Gráfica</span>
          </div>

          {/* Clean Venn SVG without formula clutter */}
          <div className={styles.vennContainer}>
            {!hasSetC ? (
              // 2 Sets Venn SVG
              <svg viewBox="0 0 460 260" className={styles.vennSvg}>
                {/* Universe Rect */}
                <rect x="10" y="10" width="440" height="240" rx="12" className={styles.universeRect} />
                <text x="25" y="34" className={styles.universeLabel}>U ({ops.universe.length})</text>

                {/* Circles */}
                <circle cx="180" cy="130" r="85" className={styles.circleA} />
                <circle cx="280" cy="130" r="85" className={styles.circleB} />

                {/* Circle Labels outside */}
                <text x="135" y="42" className={styles.circleLabelA}>Conjunto A ({ops.setA.length})</text>
                <text x="325" y="42" className={styles.circleLabelB}>Conjunto B ({ops.setB.length})</text>

                {/* Region: Only A */}
                <g className={styles.regionGroup}>
                  <text x="135" y="125" className={styles.regionCount}>{ops.onlyA.length}</text>
                  <text x="135" y="145" className={styles.regionElements}>{formatSvgPreview(ops.onlyA)}</text>
                  <text x="135" y="162" className={styles.regionHint}>Solo en A</text>
                </g>

                {/* Region: Center (A ∩ B) */}
                <g className={styles.regionGroup}>
                  <text x="230" y="125" className={styles.regionCountHighlight}>{ops.onlyAB.length}</text>
                  <text x="230" y="145" className={styles.regionElementsHighlight}>{formatSvgPreview(ops.onlyAB)}</text>
                  <text x="230" y="162" className={styles.regionHintHighlight}>A ∩ B</text>
                </g>

                {/* Region: Only B */}
                <g className={styles.regionGroup}>
                  <text x="325" y="125" className={styles.regionCount}>{ops.onlyB.length}</text>
                  <text x="325" y="145" className={styles.regionElements}>{formatSvgPreview(ops.onlyB)}</text>
                  <text x="325" y="162" className={styles.regionHint}>Solo en B</text>
                </g>

                {/* Region: Outside (U - (A ∪ B)) */}
                <text x="410" y="235" className={styles.outsideText}>
                  Fuera: {ops.outsideAll.length} {ops.outsideAll.length > 0 && `(${formatSvgPreview(ops.outsideAll)})`}
                </text>
              </svg>
            ) : (
              // 3 Sets Venn SVG
              <svg viewBox="0 0 480 360" className={styles.vennSvg}>
                {/* Universe Rect */}
                <rect x="10" y="10" width="460" height="340" rx="12" className={styles.universeRect} />
                <text x="25" y="34" className={styles.universeLabel}>U ({ops.universe.length})</text>

                {/* 3 Circles */}
                <circle cx="185" cy="140" r="80" className={styles.circleA} />
                <circle cx="295" cy="140" r="80" className={styles.circleB} />
                <circle cx="240" cy="225" r="80" className={styles.circleC} />

                {/* Labels */}
                <text x="120" y="55" className={styles.circleLabelA}>Conjunto A ({ops.setA.length})</text>
                <text x="360" y="55" className={styles.circleLabelB}>Conjunto B ({ops.setB.length})</text>
                <text x="240" y="325" className={styles.circleLabelC}>Conjunto C ({ops.setC?.length || 0})</text>

                {/* Only A */}
                <text x="145" y="120" className={styles.regionCount}>{ops.onlyA.length}</text>
                <text x="145" y="136" className={styles.regionElements}>{formatSvgPreview(ops.onlyA)}</text>

                {/* Only B */}
                <text x="335" y="120" className={styles.regionCount}>{ops.onlyB.length}</text>
                <text x="335" y="136" className={styles.regionElements}>{formatSvgPreview(ops.onlyB)}</text>

                {/* Only C */}
                <text x="240" y="270" className={styles.regionCount}>{ops.onlyC?.length || 0}</text>
                <text x="240" y="286" className={styles.regionElements}>{formatSvgPreview(ops.onlyC)}</text>

                {/* A ∩ B only */}
                <text x="240" y="105" className={styles.regionCountHighlight}>{ops.onlyAB.length}</text>
                <text x="240" y="120" className={styles.regionElementsHighlight}>{formatSvgPreview(ops.onlyAB)}</text>

                {/* A ∩ C only */}
                <text x="180" y="195" className={styles.regionCountHighlight}>{ops.onlyAC?.length || 0}</text>
                <text x="180" y="209" className={styles.regionElementsHighlight}>{formatSvgPreview(ops.onlyAC)}</text>

                {/* B ∩ C only */}
                <text x="300" y="195" className={styles.regionCountHighlight}>{ops.onlyBC?.length || 0}</text>
                <text x="300" y="209" className={styles.regionElementsHighlight}>{formatSvgPreview(ops.onlyBC)}</text>

                {/* A ∩ B ∩ C Center */}
                <text x="240" y="160" className={styles.regionCountTriple}>{ops.allThree?.length || 0}</text>
                <text x="240" y="174" className={styles.regionElementsTriple}>{formatSvgPreview(ops.allThree)}</text>

                {/* Outside */}
                <text x="420" y="330" className={styles.outsideText}>
                  Fuera: {ops.outsideAll.length}
                </text>
              </svg>
            )}
          </div>

          <p className={styles.diagramNotice}>
            <Info size={14} /> El gráfico muestra la cantidad de elementos en cada región disjunta. Las fórmulas completas y el desglose de elementos se detallan abajo:
          </p>
        </div>
      </div>

      {/* Operations & Formulas displayed cleanly BELOW the diagram */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Fórmulas y Operaciones Analíticas de Conjuntos</h3>
          <span className="badge badge-primary">Desarrollo Matemático</span>
        </div>

        {/* Inclusion-Exclusion Principle Formula */}
        <div className={styles.inclusionFormulaBox}>
          <span className={styles.formulaTitle}>Principio de Inclusión-Exclusión:</span>
          {!hasSetC ? (
            <div className={styles.formulaText}>
              |A ∪ B| = |A| + |B| - |A ∩ B| = {ops.setA.length} + {ops.setB.length} - {ops.onlyAB.length} = <strong>{ops.union.length} elementos</strong>
            </div>
          ) : (
            <div className={styles.formulaText}>
              |A ∪ B ∪ C| = |A| + |B| + |C| - (|A ∩ B| + |A ∩ C| + |B ∩ C|) + |A ∩ B ∩ C| = <strong>{ops.union.length} elementos</strong>
            </div>
          )}
        </div>

        {/* Grid of All Calculated Set Operations */}
        <div className={styles.opsGrid}>
          {/* Unión */}
          <div className={styles.opCard}>
            <div className={styles.opHeader}>
              <span className={styles.opSymbol}>{!hasSetC ? 'A ∪ B' : 'A ∪ B ∪ C'}</span>
              <span className={styles.opBadge}>Unión ({ops.union.length})</span>
            </div>
            <div className={styles.opValue}>{formatSet(ops.union)}</div>
            <span className={styles.opFormula}>Todos los elementos presentes en al menos uno de los conjuntos</span>
          </div>

          {/* Intersección */}
          <div className={styles.opCard}>
            <div className={styles.opHeader}>
              <span className={styles.opSymbol}>{!hasSetC ? 'A ∩ B' : 'A ∩ B ∩ C'}</span>
              <span className={styles.opBadge}>
                Intersección ({!hasSetC ? ops.onlyAB.length : (ops.allThree?.length || 0)})
              </span>
            </div>
            <div className={styles.opValue}>
              {!hasSetC ? formatSet(ops.onlyAB) : formatSet(ops.allThree || [])}
            </div>
            <span className={styles.opFormula}>
              {!hasSetC ? 'Elementos comunes a A y B' : 'Elementos presentes en los tres conjuntos a la vez'}
            </span>
          </div>

          {/* Diferencia A - B */}
          <div className={styles.opCard}>
            <div className={styles.opHeader}>
              <span className={styles.opSymbol}>A - B</span>
              <span className={styles.opBadge}>Diferencia ({ops.differenceAB.length})</span>
            </div>
            <div className={styles.opValue}>{formatSet(ops.differenceAB)}</div>
            <span className={styles.opFormula}>Pertenecen al conjunto A pero NO al conjunto B</span>
          </div>

          {/* Diferencia B - A */}
          <div className={styles.opCard}>
            <div className={styles.opHeader}>
              <span className={styles.opSymbol}>B - A</span>
              <span className={styles.opBadge}>Diferencia ({ops.differenceBA.length})</span>
            </div>
            <div className={styles.opValue}>{formatSet(ops.differenceBA)}</div>
            <span className={styles.opFormula}>Pertenecen al conjunto B pero NO al conjunto A</span>
          </div>

          {/* Complemento de A */}
          <div className={styles.opCard}>
            <div className={styles.opHeader}>
              <span className={styles.opSymbol}>Aᶜ</span>
              <span className={styles.opBadge}>Complemento de A</span>
            </div>
            <div className={styles.opValue}>{formatSet(ops.complementA)}</div>
            <span className={styles.opFormula}>U - A = Todo lo que pertenece al Universo pero no a A</span>
          </div>

          {/* Complemento de B */}
          <div className={styles.opCard}>
            <div className={styles.opHeader}>
              <span className={styles.opSymbol}>Bᶜ</span>
              <span className={styles.opBadge}>Complemento de B</span>
            </div>
            <div className={styles.opValue}>{formatSet(ops.complementB)}</div>
            <span className={styles.opFormula}>U - B = Todo lo que pertenece al Universo pero no a B</span>
          </div>

          {/* Operations when C is enabled */}
          {hasSetC && (
            <>
              <div className={styles.opCard}>
                <div className={styles.opHeader}>
                  <span className={styles.opSymbol}>Cᶜ</span>
                  <span className={styles.opBadge}>Complemento de C</span>
                </div>
                <div className={styles.opValue}>{formatSet(ops.complementC || [])}</div>
                <span className={styles.opFormula}>U - C = Elementos del Universo que no están en C</span>
              </div>

              <div className={styles.opCard}>
                <div className={styles.opHeader}>
                  <span className={styles.opSymbol}>A ∩ C</span>
                  <span className={styles.opBadge}>Intersección ({ops.intersectionAC?.length || 0})</span>
                </div>
                <div className={styles.opValue}>{formatSet(ops.intersectionAC || [])}</div>
                <span className={styles.opFormula}>Elementos comunes a A y C</span>
              </div>

              <div className={styles.opCard}>
                <div className={styles.opHeader}>
                  <span className={styles.opSymbol}>B ∩ C</span>
                  <span className={styles.opBadge}>Intersección ({ops.intersectionBC?.length || 0})</span>
                </div>
                <div className={styles.opValue}>{formatSet(ops.intersectionBC || [])}</div>
                <span className={styles.opFormula}>Elementos comunes a B y C</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
