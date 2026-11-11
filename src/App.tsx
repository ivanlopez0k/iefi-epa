import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { TabNav, type ActiveTab } from './components/common/TabNav';
import { CombinatoricsModule } from './components/combinatorics/CombinatoricsModule';
import { SetsModule } from './components/sets/SetsModule';
import { ProbabilityModule } from './components/probability/ProbabilityModule';
import { StatisticsModule } from './components/statistics/StatisticsModule';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('combinatorics');

  return (
    <div className="app-layout">
      <Header />

      <main className="main-content">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'combinatorics' && <CombinatoricsModule />}
        {activeTab === 'sets' && <SetsModule />}
        {activeTab === 'probability' && <ProbabilityModule />}
        {activeTab === 'statistics' && <StatisticsModule />}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        borderTop: '1px solid var(--border-subtle)',
        color: 'var(--text-dim)',
        fontSize: '0.85rem'
      }}>
        <p>
          <strong>Estadística y Probabilidad Aplicada (EPA)</strong> • Herramienta de aprendizaje y cálculo para IEFI
        </p>
        <p style={{ marginTop: '0.35rem', fontSize: '0.8rem' }}>
          Construido con React, TypeScript y CSS puro (Box Model &amp; Custom Properties nativas).
        </p>
      </footer>
    </div>
  );
};

export default App;
