/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DetectiveProvider, useDetective } from './context/DetectiveContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { CaseFilesDashboard } from './components/CaseFilesDashboard';
import { InvestigationScreen } from './components/InvestigationScreen';
import { MisconceptionRadar } from './components/MisconceptionRadar';
import { ThinkingPattern } from './components/ThinkingPattern';
import { PracticeLab } from './components/PracticeLab';
import { AchievementsView } from './components/AchievementsView';
import { ProfileView } from './components/ProfileView';
import { ActiveTab } from './types';
import { CASES_DATA } from './data/casesData';

function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [investigatingCaseId, setInvestigatingCaseId] = useState<string | null>(null);
  const { setActiveCaseId } = useDetective();

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setInvestigatingCaseId(caseId);
    setActiveTab('cases');
  };

  const handleBackFromCase = () => {
    setInvestigatingCaseId(null);
  };

  const handleNextCase = () => {
    if (!investigatingCaseId) return;
    const currentIndex = CASES_DATA.findIndex((c) => c.id === investigatingCaseId);
    if (currentIndex >= 0 && currentIndex < CASES_DATA.length - 1) {
      const nextId = CASES_DATA[currentIndex + 1].id;
      setActiveCaseId(nextId);
      setInvestigatingCaseId(nextId);
    } else {
      setInvestigatingCaseId(null);
      setActiveTab('cases');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e1b] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'cases') {
            setInvestigatingCaseId(null);
          }
          setActiveTab(tab);
        }}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={(tab) => {
              if (tab === 'cases') {
                setInvestigatingCaseId(null);
              }
              setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'cases' && (
          <>
            {investigatingCaseId ? (
              <InvestigationScreen
                caseId={investigatingCaseId}
                onBack={handleBackFromCase}
                onNextCase={handleNextCase}
              />
            ) : (
              <CaseFilesDashboard
                onSelectCase={handleOpenCase}
                setActiveTab={setActiveTab}
              />
            )}
          </>
        )}

        {activeTab === 'radar' && (
          <MisconceptionRadar
            setActiveTab={setActiveTab}
            onSelectCase={handleOpenCase}
          />
        )}

        {activeTab === 'confidence' && (
          <ThinkingPattern
            setActiveTab={setActiveTab}
            onSelectCase={handleOpenCase}
          />
        )}

        {activeTab === 'practice' && <PracticeLab />}

        {activeTab === 'achievements' && <AchievementsView />}

        {activeTab === 'profile' && <ProfileView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DetectiveProvider>
      <MainApp />
    </DetectiveProvider>
  );
}
