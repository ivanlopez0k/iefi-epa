import React, { useState } from 'react';
import styles from './ProbabilityModule.module.css';
import { buildEvent } from '../../core/probability/probabilityCore';
import { parseSetInput, formatSet } from '../../core/sets/setOperations';
import type { ProbabilityEvent } from '../../types';
import { Fraction, FormulaCard } from '../common/MathFormula';
import { Dices, Check, Plus, Trash2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const ProbabilityModule: React.FC = () => {
  // User enters their own sample space Ω
  const [omegaInput, setOmegaInput] = useState<string>('1, 2, 3, 4, 5, 6');
  const omega = parseSetInput(omegaInput);

  // New Event creation state
  const [eventName, setEventName] = useState<string>('Evento A');
  const [selectedPoints, setSelectedPoints] = useState<string[]>(['2', '4', '6']);

  // Saved events list
  const [events, setEvents] = useState<ProbabilityEvent[]>([]);

  // Mutually exclusive compare selection
  const [compareEv1Id, setCompareEv1Id] = useState<string>('');
  const [compareEv2Id, setCompareEv2Id] = useState<string>('');

  // Toggle a point selection
  const togglePoint = (pt: string) => {
    if (selectedPoints.includes(pt)) {
      setSelectedPoints(selectedPoints.filter(p => p !== pt));
    } else {
      setSelectedPoints([...selectedPoints, pt]);
    }
  };

  const selectAll = () => setSelectedPoints([...omega]);
  const selectNone = () => setSelectedPoints([]);
  const invertSelection = () => setSelectedPoints(omega.filter(p => !selectedPoints.includes(p)));

  // Current active event live calculation
  const activeEvent = buildEvent(
    'live-event',
    eventName.trim() || 'Evento',
    'Evento en evaluación',
    selectedPoints,
    omega
  );

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || omega.length === 0) return;

    const newEv = buildEvent(
      `ev-${Date.now()}`,
      eventName.trim(),
      `Puntos: ${formatSet(selectedPoints)}`,
      selectedPoints,
      omega
    );

    const updated = [newEv, ...events];
    setEvents(updated);
    setEventName(`Evento ${String.fromCharCode(65 + updated.length)}`);
    setSelectedPoints([]);

    // Auto set compare selectors if 2 events exist
    if (updated.length === 2) {
      setCompareEv1Id(updated[1].id);
      setCompareEv2Id(updated[0].id);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(ev => ev.id !== id));
    if (compareEv1Id === id) setCompareEv1Id('');
    if (compareEv2Id === id) setCompareEv2Id('');
  };

  // Check mutually exclusive between two selected events
  const ev1 = events.find(e => e.id === compareEv1Id);
  const ev2 = events.find(e => e.id === compareEv2Id);

  let intersectionPoints: string[] = [];
  let areMutuallyExclusive = false;
  if (ev1 && ev2 && ev1.id !== ev2.id) {
    intersectionPoints = ev1.points.filter(p => ev2.points.includes(p));
    areMutuallyExclusive = intersectionPoints.length === 0;
  }

  const getBadgeClass = (classification: string) => {
    switch (classification) {
      case 'elemental': return 'badge-primary';
      case 'compuesto': return 'badge-teal';
      case 'imposible': return 'badge-rose';
      case 'seguro': return 'badge-amber';
      default: return 'badge-primary';
    }
  };

  return (
    <div className={styles.container}>
      {/* Step 1: Input Sample Space Ω */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Dices className={styles.iconAccent} size={20} />
            1. Definí tu Espacio Muestral (Ω)
          </h2>
          <span className="badge badge-primary">
            Casos Totales: n(Ω) = {omega.length}
          </span>
        </div>

        <p className={styles.sectionHelp}>
          Ingresá todos los resultados posibles del experimento aleatorio, separados por coma o espacio:
        </p>

        <textarea
          rows={2}
          value={omegaInput}
          onChange={e => {
            setOmegaInput(e.target.value);
            // clean selection of points no longer in omega
            const newOmega = parseSetInput(e.target.value);
            setSelectedPoints(prev => prev.filter(p => newOmega.includes(p)));
          }}
          placeholder="ej: 1, 2, 3, 4, 5, 6  ó  A, B, C, D  ó  Cara, Sello"
          className={styles.omegaTextarea}
        />

        <div className={styles.omegaPreview}>
          <div className={styles.omegaHeaderRow}>
            <span className={styles.omegaLabel}>Puntos Muestrales Reconocidos ({omega.length}):</span>
            {omega.length === 0 && (
              <span style={{ color: 'var(--accent-rose)', fontSize: '0.82rem' }}>
                * Ingresá al menos 1 resultado posible.
              </span>
            )}
          </div>
          <div className={styles.pointChips}>
            {omega.map((point, idx) => (
              <span key={idx} className={styles.pointBadge}>
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2: Event Evaluator (Laplace Live) */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Sparkles className={styles.iconAccent} size={20} />
            2. Definición del Evento y Regla de Laplace
          </h2>
          <span className={`badge ${getBadgeClass(activeEvent.classification)}`}>
            Evento {activeEvent.classification.toUpperCase()}
          </span>
        </div>

        <div className={styles.eventBuilderGrid}>
          {/* Controls */}
          <div>
            <div className={styles.nameRow}>
              <label className={styles.label}>Nombre del Evento:</label>
              <input
                type="text"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                placeholder="ej: Evento A (Número Par)"
                className={styles.eventNameInput}
              />
            </div>

            <div className={styles.pointsSelectorBox}>
              <div className={styles.selectorHeader}>
                <span className={styles.label}>
                  Seleccioná los puntos favorables ({selectedPoints.length} de {omega.length}):
                </span>
                <div className={styles.quickActions}>
                  <button type="button" onClick={selectAll} className={styles.miniBtn}>
                    Todos (Seguro)
                  </button>
                  <button type="button" onClick={selectNone} className={styles.miniBtn}>
                    Ninguno (Imposible)
                  </button>
                  <button type="button" onClick={invertSelection} className={styles.miniBtn}>
                    Invertir
                  </button>
                </div>
              </div>

              {omega.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', padding: '1rem 0' }}>
                  Primero ingresá los puntos del espacio muestral en el paso 1.
                </p>
              ) : (
                <div className={styles.clickablePointsGrid}>
                  {omega.map((point, idx) => {
                    const isSelected = selectedPoints.includes(point);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => togglePoint(point)}
                        className={`${styles.pointToggleBtn} ${isSelected ? styles.pointSelected : ''}`}
                      >
                        {point} {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveEvent}
              disabled={omega.length === 0}
              className="btn btn-primary"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              <Plus size={16} /> Guardar Evento en la Lista de Análisis
            </button>
          </div>

          {/* Live Mathematical Formula & Result */}
          <div className={styles.calculationPanel}>
            <span className={styles.panelTitle}>Regla Clásica de Laplace:</span>

            {/* Formula display with real fraction */}
            <FormulaCard>
              <span>P({eventName || 'E'})</span>
              <span style={{ margin: '0 0.5rem' }}>=</span>
              <Fraction
                num={<span>Casos Favorables n(E)</span>}
                den={<span>Casos Posibles n(Ω)</span>}
              />
              <span style={{ margin: '0 0.5rem' }}>=</span>
              <Fraction
                num={<span>{activeEvent.favorableCases}</span>}
                den={<span>{activeEvent.totalCases}</span>}
              />
            </FormulaCard>

            <div className={styles.resultsMetricGrid}>
              <div className={styles.metricBox}>
                <span className={styles.metricName}>Fracción Simplificada</span>
                <span className={styles.metricPrimary}>{activeEvent.fraction}</span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.metricName}>Probabilidad Decimal</span>
                <span className={styles.metricPrimary}>{activeEvent.probability.toFixed(4)}</span>
              </div>
              <div className={styles.metricBox}>
                <span className={styles.metricName}>Porcentaje</span>
                <span className={styles.metricHighlight}>{activeEvent.percentage}</span>
              </div>
            </div>

            {/* Classification Reasoning */}
            <div className={styles.classificationExpl}>
              <ShieldCheck size={18} className={styles.iconAccent} />
              <div>
                <strong>Clasificación: Evento {activeEvent.classification}</strong>
                <p>
                  {activeEvent.classification === 'imposible' && 'El evento no contiene puntos muestrales favorables (f = 0). Su probabilidad es 0%.'}
                  {activeEvent.classification === 'elemental' && 'Contiene exactamente un solo punto muestral favorable (f = 1).'}
                  {activeEvent.classification === 'compuesto' && `Contiene ${activeEvent.favorableCases} puntos muestrales favorables (más de uno, sin abarcar todo el espacio).`}
                  {activeEvent.classification === 'seguro' && 'Contiene absolutamente todos los puntos del espacio muestral (f = n(Ω)). Su probabilidad es 100%.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Saved Events & Mutually Exclusive Evaluator */}
      {events.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              3. Eventos Guardados y Análisis de Exclusión Mutua
            </h2>
            <span className="badge badge-teal">{events.length} Eventos</span>
          </div>

          <div className={styles.savedEventsGrid}>
            {events.map(ev => (
              <div key={ev.id} className={styles.savedEventCard}>
                <div className={styles.savedEventHeader}>
                  <strong className={styles.savedName}>{ev.name}</strong>
                  <span className={`badge ${getBadgeClass(ev.classification)}`}>
                    {ev.classification}
                  </span>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className={styles.deleteMiniBtn}
                    title="Eliminar evento"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={styles.savedPointsRow}>
                  <span>Puntos favorables:</span>
                  <strong style={{ color: '#38bdf8' }}>{formatSet(ev.points)}</strong>
                </div>
                <div className={styles.savedStatsRow}>
                  <span>P = {ev.fraction} ({ev.percentage})</span>
                  <span>f = {ev.favorableCases} / {ev.totalCases}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Compare 2 events for Mutually Exclusive */}
          {events.length >= 2 && (
            <div className={styles.mutuallyExclusiveSection}>
              <h3 className={styles.compareTitle}>
                Evaluar si dos eventos son Mutuamente Excluyentes:
              </h3>
              <p className={styles.compareHelp}>
                Dos eventos son mutuamente excluyentes si su intersección es vacía (no tienen puntos en común: A ∩ B = ∅):
              </p>

              <div className={styles.selectorRow}>
                <select
                  value={compareEv1Id}
                  onChange={e => setCompareEv1Id(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Seleccionar Evento 1</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>

                <span style={{ fontWeight: 700, color: '#ffffff' }}>vs</span>

                <select
                  value={compareEv2Id}
                  onChange={e => setCompareEv2Id(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Seleccionar Evento 2</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              {ev1 && ev2 && ev1.id !== ev2.id && (
                <div className={`${styles.compareVerdict} ${areMutuallyExclusive ? styles.verdictExclusive : styles.verdictNotExclusive}`}>
                  <AlertCircle size={20} />
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '0.2rem' }}>
                      {areMutuallyExclusive
                        ? `¡${ev1.name} y ${ev2.name} SON MUTUAMENTE EXCLUYENTES!`
                        : `${ev1.name} y ${ev2.name} NO SON MUTUAMENTE EXCLUYENTES`}
                    </h4>
                    <p>
                      {areMutuallyExclusive
                        ? `Intersección vacía: ${ev1.name} ∩ ${ev2.name} = ∅. No pueden ocurrir simultáneamente. Regla de adición: P(A ∪ B) = P(A) + P(B) = ${ev1.fraction} + ${ev2.fraction}.`
                        : `Tienen ${intersectionPoints.length} punto(s) en común: { ${intersectionPoints.join(', ')} }. Regla de adición: P(A ∪ B) = P(A) + P(B) - P(A ∩ B).`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
