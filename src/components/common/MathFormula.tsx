import React from 'react';
import styles from './MathFormula.module.css';

interface FractionProps {
  num: React.ReactNode;
  den: React.ReactNode;
}

export const Fraction: React.FC<FractionProps> = ({ num, den }) => (
  <span className={styles.fraction}>
    <span className={styles.numerator}>{num}</span>
    <span className={styles.denominator}>{den}</span>
  </span>
);

interface FormulaCardProps {
  label?: string;
  children: React.ReactNode;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({ label, children }) => (
  <div className={styles.mathBlock}>
    {label && <span style={{ color: '#94a3b8', marginRight: '0.75rem', fontSize: '0.85rem' }}>{label}</span>}
    <div className={styles.mathDisplay}>{children}</div>
  </div>
);
