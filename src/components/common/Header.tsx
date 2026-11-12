import React from 'react';
import styles from './Header.module.css';
import { Calculator } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <div className={styles.iconWrapper}>
            <Calculator size={28} />
          </div>
          <div>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>EPA • Calculadora Integral</h1>
            </div>
            <p className={styles.subtitle}>
              Estadística y Probabilidad Aplicada - Angel Ivan Lopez y Eliana Neira
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
