import React from 'react';
import styles from './Header.module.css';
import { Calculator, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <div className={styles.iconWrapper}>
            <Calculator className={styles.icon} size={28} />
          </div>
          <div>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>EPA • Calculadora Integral</h1>
              <span className={styles.tag}>
                <Sparkles size={12} /> IEFI
              </span>
            </div>
            <p className={styles.subtitle}>
              Estadística y Probabilidad Aplicada — Motores de cálculo, clasificación y resolución paso a paso
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
