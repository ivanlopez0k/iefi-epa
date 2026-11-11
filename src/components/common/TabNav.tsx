import React from 'react';
import styles from './TabNav.module.css';
import { GitBranch, Box, Dices, BarChart3 } from 'lucide-react';

export type ActiveTab = 'combinatorics' | 'sets' | 'probability' | 'statistics';

interface TabNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'combinatorics' as ActiveTab,
      label: 'Análisis Combinatorio',
      badge: 'Unidad 1',
      icon: GitBranch
    },
    {
      id: 'sets' as ActiveTab,
      label: 'Teoría de Conjuntos',
      badge: 'Unidad 2',
      icon: Box
    },
    {
      id: 'probability' as ActiveTab,
      label: 'Probabilidad y Eventos',
      badge: 'Unidad 3',
      icon: Dices
    },
    {
      id: 'statistics' as ActiveTab,
      label: 'Estadística Descriptiva',
      badge: 'Unidad 4',
      icon: BarChart3
    }
  ];

  return (
    <nav className={styles.navContainer}>
      <div className={styles.tabList}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${styles.tabButton} ${isActive ? styles.active : ''}`}
            >
              <Icon size={18} className={styles.tabIcon} />
              <div className={styles.tabTextGroup}>
                <span className={styles.tabBadge}>{tab.badge}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
