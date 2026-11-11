import React, { useState } from 'react';
import styles from './StatisticsModule.module.css';
import { parseNumberList, calculateDescriptiveStats } from '../../core/statistics/descriptive';
import { Fraction, FormulaCard } from '../common/MathFormula';
import { BarChart3, TrendingUp, Hash, Layers } from 'lucide-react';

export const StatisticsModule: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>(
    '12, 15, 12, 18, 20, 15, 12, 14, 18, 15, 16, 12, 15, 20, 18'
  );

  const rawData = parseNumberList(dataInput);
  const stats = calculateDescriptiveStats(rawData);

  // Find max fi for chart scaling
  const maxFi = stats.frequencies.reduce((acc, curr) => Math.max(acc, curr.fi), 1);

  return (
    <div className={styles.container}>
      {/* Input Data Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <BarChart3 className={styles.iconAccent} size={20} />
            Ingreso de Datos de la Muestra
          </h2>
          <span className="badge badge-primary">
            n = {stats.count} Datos Ingresados
          </span>
        </div>

        <p className={styles.intro}>
          Pegá o escribí la lista de valores de tu muestra separados por comas, espacios o renglones:
        </p>

        <textarea
          rows={3}
          value={dataInput}
          onChange={e => setDataInput(e.target.value)}
          placeholder="ej: 12, 15, 12, 18, 20, 15, 12, 14, 18"
          className={styles.dataTextarea}
        />

        <div className={styles.sortedPreview}>
          <span className={styles.sortedLabel}>Muestra ordenada de menor a mayor ({stats.count} elementos):</span>
          <span className={styles.sortedValues}>
            {stats.sortedData.length > 0 ? stats.sortedData.join(' ≤ ') : 'Sin datos válidos ingresados.'}
          </span>
        </div>
      </div>

      {/* Central Tendency Metrics Cards */}
      <div className={styles.metricsGrid}>
        {/* Media */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Media Aritmética (x̄)</span>
            <TrendingUp size={16} className={styles.metricIconTeal} />
          </div>
          <div className={styles.metricNumber}>{stats.mean}</div>
          <div className={styles.metricSub}>Suma ponderada dividida por n</div>
        </div>

        {/* Mediana */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Mediana (Me)</span>
            <Hash size={16} className={styles.metricIconIndigo} />
          </div>
          <div className={styles.metricNumber}>{stats.median}</div>
          <div className={styles.metricSub}>
            Valor central ({stats.count % 2 === 0 ? 'n par: promedio de 2 centros' : 'n impar: centro exacto'})
          </div>
        </div>

        {/* Moda */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Moda (Mo)</span>
            <Layers size={16} className={styles.metricIconAmber} />
          </div>
          <div className={styles.metricNumber}>
            {stats.mode.length > 0 ? stats.mode.join(', ') : 'Amodal'}
          </div>
          <div className={styles.metricSub}>
            Serie {stats.modeType.toUpperCase()}
          </div>
        </div>

        {/* Rango & Dispersión */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Rango &amp; Dispersión</span>
            <span className="badge badge-blue">R = {stats.range}</span>
          </div>
          <div className={styles.dispersionGrid}>
            <div>Mín: <strong>{stats.min}</strong></div>
            <div>Máx: <strong>{stats.max}</strong></div>
            <div>Varianza s²: <strong>{stats.variance}</strong></div>
            <div>Desvío s: <strong>{stats.stdDev}</strong></div>
          </div>
        </div>
      </div>

      {/* Formulas & Step-by-Step Box */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Fórmulas y Desarrollo Analítico Paso a Paso</h3>
          <span className="badge badge-teal">Demostración</span>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <FormulaCard label="Fórmula de la Media Aritmética:">
            <span>x̄</span>
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <Fraction
              num={<span>Σ (x<sub>i</sub> · f<sub>i</sub>)</span>}
              den={<span>n</span>}
            />
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <Fraction
              num={<span>{stats.data.reduce((a, b) => a + b, 0)}</span>}
              den={<span>{stats.count}</span>}
            />
            <span style={{ margin: '0 0.5rem' }}>=</span>
            <span>{stats.mean}</span>
          </FormulaCard>
        </div>

        <div className={styles.stepsColumns}>
          {/* Media Steps */}
          <div className="step-box" style={{ marginTop: 0 }}>
            <h4 style={{ color: '#ffffff', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              1. Cálculo de la Media Aritmética (x̄):
            </h4>
            <ol>
              {stats.meanSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Mediana Steps */}
          <div className="step-box" style={{ marginTop: 0 }}>
            <h4 style={{ color: '#ffffff', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              2. Determinación de la Mediana (Me):
            </h4>
            <ol>
              {stats.medianSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Moda Steps */}
          <div className="step-box" style={{ marginTop: 0 }}>
            <h4 style={{ color: '#ffffff', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              3. Análisis de la Moda (Mo):
            </h4>
            <ol>
              {stats.modeSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Complete Frequency Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Tabla de Distribución de Frecuencias Completa</h3>
          <span className="badge badge-primary">{stats.frequencies.length} Clases / Valores</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Variable (xᵢ)</th>
                <th>Frec. Absoluta (fᵢ)</th>
                <th>Frec. Abs. Acumulada (Fᵢ)</th>
                <th>Frec. Relativa (hᵢ)</th>
                <th>Frec. Rel. Acumulada (Hᵢ)</th>
                <th>Frec. Porcentual (fᵢ %)</th>
                <th>Frec. % Acumulada (Fᵢ %)</th>
              </tr>
            </thead>
            <tbody>
              {stats.frequencies.map((row, idx) => {
                const isMode = stats.mode.includes(Number(row.xi));
                return (
                  <tr key={idx} style={isMode ? { backgroundColor: 'rgba(245, 158, 11, 0.08)' } : {}}>
                    <td>
                      <strong>{row.xi}</strong>
                      {isMode && <span className={styles.modeTag}>Mo</span>}
                    </td>
                    <td>{row.fi}</td>
                    <td>{row.Fi}</td>
                    <td>{row.hi}</td>
                    <td>{row.Hi}</td>
                    <td>{row.pi}%</td>
                    <td>{row.Pi}%</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>Totales (Σ)</td>
                <td>n = {stats.totalFi}</td>
                <td>-</td>
                <td>{stats.totalHi}</td>
                <td>-</td>
                <td>{stats.totalPi}%</td>
                <td>-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Diagrama de Frecuencias Absolutas (Gráfico de Barras)</h3>
          <span className="badge badge-teal">Visualización Gráfica</span>
        </div>

        <div className={styles.chartContainer}>
          <div className={styles.barsContainer}>
            {stats.frequencies.map((row, idx) => {
              const heightPercent = maxFi > 0 ? (row.fi / maxFi) * 100 : 0;
              const isMode = stats.mode.includes(Number(row.xi));
              return (
                <div key={idx} className={styles.barColumn}>
                  <span className={styles.barValue}>{row.fi}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${isMode ? styles.barMode : ''}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className={styles.barLabel}>{row.xi}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
