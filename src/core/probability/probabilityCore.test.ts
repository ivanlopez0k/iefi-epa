import { describe, it, expect } from 'vitest';
import { PRESET_EXPERIMENTS, buildEvent, simplifyFraction } from './probabilityCore';

describe('Probability Core & Presets', () => {
  it('simplifies fractions correctly', () => {
    expect(simplifyFraction(4, 6)).toBe('2/3');
    expect(simplifyFraction(0, 8)).toBe('0');
    expect(simplifyFraction(6, 6)).toBe('1');
  });

  it('evaluates Cooperativa Directiva experiment accurately', () => {
    const coop = PRESET_EXPERIMENTS.find(e => e.id === 'cooperativa')!;
    expect(coop.omega).toHaveLength(6);
    expect(coop.omega).toEqual(['JA', 'JS', 'AS', 'AJ', 'SJ', 'SA']);

    // Event M (Solo mujeres)
    const evM = buildEvent('ev-m', 'Evento M', 'Solo mujeres', [], coop.omega);
    expect(evM.classification).toBe('imposible');
    expect(evM.probability).toBe(0);

    // Event N (Un hombre y una mujer)
    const evN = buildEvent('ev-n', 'Evento N', 'Hombre y mujer', ['JS', 'SJ', 'AS', 'SA'], coop.omega);
    expect(evN.classification).toBe('compuesto');
    expect(evN.fraction).toBe('2/3');
    expect(evN.percentage).toBe('66.67%');

    // Event Seguro
    const evAll = buildEvent('ev-all', 'Evento Seguro', 'Cualquier combinación', coop.omega, coop.omega);
    expect(evAll.classification).toBe('seguro');
    expect(evAll.probability).toBe(1);
  });
});
