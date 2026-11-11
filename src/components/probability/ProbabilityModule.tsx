import React, { useState } from 'react';
import styles from './ProbabilityModule.module.css';
import { PRESET_EXPERIMENTS, buildEvent } from '../../core/probability/probabilityCore';
import { parseSetInput, formatSet } from '../../core/sets/setOperations';
import { Dices, Sparkles, Check, Info, Plus, Trash2 } from 'lucide-react';
import type { ProbabilityEvent } from '../../types';

export const ProbabilityModule: React.FC = () => {
  // Active experiment preset or custom
  const [selectedPresetId, setSelectedPresetId] = useState<string>('cooperativa');

  // Custom experiment states
  const [customTitle, setCustomTitle] = useState<string>('Mi Experimento Aleatorio');
  const [customOmegaInput, setCustomOmegaInput] = useState<string>('R1, R2, R3, R4, R5, R6');

  // Active omega points
  const activePreset = PRESET_EXPERIMENTS.find(p => p.id === selectedPresetId);
  const omega: string[] = activePreset 
    ? activePreset.omega 
    : parseSetInput(customOmegaInput);

  // User-created events list
  const [events, setEvents] = useState<ProbabilityEvent[]>(() => {
    const defaultExp = PRESET_EXPERIMENTS[0];
    return defaultExp.sampleEvents.map((se, idx) => 
      buildEvent(`ev-${idx}`, se.name, se.description, se.points, defaultExp.omega)
    );
  });

  // Builder for new event
  const [newEventName, setNewEventName] = useState<string>('Nuevo Evento');
  const [newEventDesc, setNewEventDesc] = useState<string>('Descripción del evento');
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);

  // Switch preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setSelectedPoints([]);
    const exp = PRESET_EXPERIMENTS.find(p => p.id === presetId);
    if (exp) {
      setEvents(exp.sampleEvents.map((se, idx) => 
        buildEvent(`ev-${idx}`, se.name, se.description, se.points, exp.omega)
      ));
    }
  };

  const handleSelectCustom = () => {
    setSelectedPresetId('custom');
    setSelectedPoints([]);
    setEvents([]);
  };

  // Toggle point selection in new event builder
  const togglePoint = (pt: string) => {
    if (selectedPoints.includes(pt)) {
      setSelectedPoints(selectedPoints.filter(p => p !== pt));
    } else {
      setSelectedPoints([...selectedPoints, pt]);
    }
  };

  const selectAllPoints = () => {
    setSelectedPoints([...omega]);
  };

  const clearSelectedPoints = () => {
    setSelectedPoints([]);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) return;

    const created = buildEvent(
      `user-ev-${Date.now()}`,
      newEventName.trim(),
      newEventDesc.trim() || 'Definido interactivamente',
      selectedPoints,
      omega
    );

    setEvents([created, ...events]);
    setNewEventName('Evento ' + String.fromCharCode(65 + events.length));
    setNewEventDesc('');
    setSelectedPoints([]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

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
      {/* Preset Selector Bar */}
      <div className={styles.presetBar}>
        <span className={styles.presetTitle}>
          <Sparkles size={16} /> Experimentos Predefinidos:
        </span>
        {PRESET_EXPERIMENTS.map(p => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p.id)}
            className={`${styles.presetBtn} ${selectedPresetId === p.id ? styles.presetActive : ''}`}
          >
            {p.title}
          </button>
        ))}
        <button
          onClick={handleSelectCustom}
          className={`${styles.presetBtn} ${selectedPresetId === 'custom' ? styles.presetActive : ''}`}
        >
          ✏️ Crear Experimento Libre
        </button>
      </div>

      {/* Theoretical Context Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Dices className={styles.iconAccent} size={20} />
            {activePreset ? activePreset.title : customTitle}
          </h2>
          <span className="badge badge-teal">
            |Ω| = {omega.length} Puntos Muestrales
          </span>
        </div>

        <p className={styles.experimentDesc}>
          {activePreset ? activePreset.description : 'Definí los puntos que componen el espacio muestral Ω:'}
        </p>

        {selectedPresetId === 'custom' && (
          <div className={styles.customInputs}>
            <input
              type="text"
              placeholder="Nombre del experimento"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              className={styles.titleInput}
            />
            <textarea
              rows={2}
              placeholder="Puntos muestrales de Ω (separados por coma): ej: Cara, Sello"
              value={customOmegaInput}
              onChange={e => setCustomOmegaInput(e.target.value)}
            />
          </div>
        )}

        {/* Display Sample Space Omega */}
        <div className={styles.omegaBox}>
          <div className={styles.omegaHeader}>
            <span className={styles.omegaSymbol}>Espacio Muestral (Ω):</span>
            <span className={styles.omegaCount}>{omega.length} resultados posibles</span>
          </div>
          <div className={styles.pointsList}>
            {omega.map((point, i) => (
              <span key={i} className={styles.pointTag}>
                {point}
              </span>
            ))}
          </div>
          {activePreset && (
            <p className={styles.omegaExplanation}>
              <Info size={14} /> {activePreset.explanation}
            </p>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left: Interactive Event Builder */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Plus size={18} className={styles.iconAccent} /> Constructor de Eventos
            </h3>
            <span className="badge badge-primary">Regla de Laplace</span>
          </div>

          <form onSubmit={handleCreateEvent} className={styles.builderForm}>
            <div className={styles.inputRow}>
              <div className={styles.formGroup} style={{ flex: '1 1 140px' }}>
                <label className={styles.label}>Nombre:</label>
                <input
                  type="text"
                  placeholder="ej: Evento E"
                  value={newEventName}
                  onChange={e => setNewEventName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup} style={{ flex: '2 1 200px' }}>
                <label className={styles.label}>Descripción / Condición:</label>
                <input
                  type="text"
                  placeholder="ej: Sale al menos un presidente hombre"
                  value={newEventDesc}
                  onChange={e => setNewEventDesc(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.pointSelectorSection}>
              <div className={styles.selectorHeader}>
                <label className={styles.label}>
                  Seleccionar Puntos Favorables ({selectedPoints.length} de {omega.length}):
                </label>
                <div className={styles.quickSelectBtns}>
                  <button type="button" onClick={selectAllPoints} className={styles.miniBtn}>
                    Todos (Seguro)
                  </button>
                  <button type="button" onClick={clearSelectedPoints} className={styles.miniBtn}>
                    Ninguno (Imposible)
                  </button>
                </div>
              </div>

              <div className={styles.pointButtonsGrid}>
                {omega.map((point, idx) => {
                  const isSelected = selectedPoints.includes(point);
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => togglePoint(point)}
                      className={`${styles.pointPickBtn} ${isSelected ? styles.pointPicked : ''}`}
                    >
                      {point} {isSelected && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Laplace Preview */}
            <div className={styles.laplacePreview}>
              <div className={styles.previewFormula}>
                P(E) = Casos Favorables / Casos Totales = {selectedPoints.length} / {omega.length}
              </div>
              <div className={styles.previewProb}>
                {omega.length > 0 ? ((selectedPoints.length / omega.length) * 100).toFixed(2) : 0}%
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Plus size={16} /> Agregar Evento a la Lista
            </button>
          </form>
        </div>

        {/* Right: Events Table & Classifications */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Eventos Evaluados &amp; Clasificación</h3>
            <span className="badge badge-teal">{events.length} Eventos</span>
          </div>

          <div className={styles.eventsStack}>
            {events.length === 0 ? (
              <p className={styles.emptyNotice}>
                No hay eventos agregados. Creá uno seleccionando puntos muestrales a la izquierda.
              </p>
            ) : (
              events.map(ev => (
                <div key={ev.id} className={styles.eventCard}>
                  <div className={styles.eventTop}>
                    <div>
                      <div className={styles.eventTitleRow}>
                        <h4 className={styles.eventName}>{ev.name}</h4>
                        <span className={`badge ${getBadgeClass(ev.classification)}`}>
                          Evento {ev.classification}
                        </span>
                      </div>
                      <p className={styles.eventDescText}>{ev.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className={styles.deleteBtn}
                      title="Eliminar evento"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className={styles.eventPointsRow}>
                    <span className={styles.pointsLabel}>Puntos muestrales:</span>
                    <span className={styles.pointsSet}>{formatSet(ev.points)}</span>
                  </div>

                  <div className={styles.eventMetrics}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Casos Favorables:</span>
                      <span className={styles.metricVal}>{ev.favorableCases}</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Fracción Laplace:</span>
                      <span className={styles.metricVal}>{ev.fraction}</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Probabilidad:</span>
                      <span className={styles.metricValHighlight}>{ev.percentage}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
