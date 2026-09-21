/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CASES_DATA } from '../data/casesData';
import { CaseFile, ActiveTab } from '../types';
import { useDetective } from '../context/DetectiveContext';
import { sounds } from '../utils/soundEffects';
import {
  FolderKanban,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  Zap,
  Star,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CaseFilesDashboardProps {
  onSelectCase: (caseId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const CaseFilesDashboard: React.FC<CaseFilesDashboardProps> = ({
  onSelectCase,
  setActiveTab,
}) => {
  const { userProfile } = useDetective();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');

  const filteredCases = CASES_DATA.filter((caseItem) => {
    if (filterDifficulty === 'ALL') return true;
    return caseItem.difficulty.toUpperCase() === filterDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getCaseDot = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '🟢';
      case 'Intermediate':
        return '🟡';
      case 'Advanced':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const isCaseCompleted = (caseId: string) => userProfile.completedCases.includes(caseId);
  const isCaseUnlocked = (caseFile: CaseFile) => {
    // Check if unlocked in userProfile, or if previous case is completed
    if (userProfile.unlockedCases.includes(caseFile.id)) return true;
    if (!caseFile.requiredPrevCaseId) return true;
    return userProfile.completedCases.includes(caseFile.requiredPrevCaseId);
  };

  const handleCaseClick = (caseFile: CaseFile) => {
    const unlocked = isCaseUnlocked(caseFile);
    if (!unlocked) {
      sounds.playMisconceptionAlert();
      return;
    }
    sounds.playClick();
    onSelectCase(caseFile.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header & Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>CRIME SCENE DOSSIERS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>🗂️</span> CASE FILES
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Choose an investigation file. Predict the output, observe the animated execution, and
            fix your mental model if code behaves differently than you imagined!
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl self-start md:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
            <button
              key={level}
              onClick={() => {
                sounds.playClick();
                setFilterDifficulty(level);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterDifficulty === level
                  ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Adventure Progression Trail Overview Banner */}
      <div className="my-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 text-xl font-bold">
            🗺️
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 font-medium">ADVENTURE MAP STATUS</div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{userProfile.completedCases.length} of {CASES_DATA.length} Cases Solved</span>
              <span className="text-xs font-normal text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Next: {CASES_DATA.find((c) => !userProfile.completedCases.includes(c.id))?.title || 'All Solved!'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick jump to Misconception Radar */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('radar');
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700 transition-colors"
        >
          <span>View Misconception Radar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCases.map((caseFile, idx) => {
          const completed = isCaseCompleted(caseFile.id);
          const unlocked = isCaseUnlocked(caseFile);

          return (
            <motion.div
              key={caseFile.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleCaseClick(caseFile)}
              className={`relative group rounded-2xl p-5 border-2 transition-all select-none flex flex-col justify-between ${
                !unlocked
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                  : completed
                  ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 shadow-[0_4px_0_#065f46] cursor-pointer hover:translate-y-[-2px]'
                  : 'bg-slate-900/90 border-slate-700/80 hover:border-amber-400 shadow-[0_4px_0_#1e293b] hover:shadow-[0_4px_0_#b45309] cursor-pointer hover:translate-y-[-2px]'
              }`}
            >
              {/* Top Row: Case Code + Badges */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getCaseDot(caseFile.difficulty)}</span>
                    <span className="font-mono text-xs font-black text-slate-300 tracking-wider">
                      {caseFile.caseCode}
                    </span>
                    <span className="text-slate-600 font-bold">•</span>
                    <span className="font-mono text-[11px] font-bold text-amber-300">
                      {caseFile.concept}
                    </span>
                  </div>

                  {/* Status indicator */}
                  {completed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> SOLVED
                    </span>
                  ) : unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                      <Unlock className="w-3 h-3" /> OPEN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                  {caseFile.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {caseFile.shortDescription}
                </p>
              </div>

              {/* Card Footer: Difficulty, XP & CTA */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getDifficultyColor(
                      caseFile.difficulty
                    )}`}
                  >
                    {caseFile.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Zap className="w-3 h-3" /> +{caseFile.xpReward} XP
                  </span>
                </div>

                <div className="flex items-center gap-1 font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>{unlocked ? (completed ? 'Review' : 'Investigate') : 'Locked'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Locked overlay lock watermark */}
              {!unlocked && (
                <div className="absolute inset-0 bg-slate-950/40 rounded-2xl flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
                  <div className="flex flex-col items-center text-slate-400 text-xs font-mono font-bold bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg">
                    <Lock className="w-4 h-4 mb-1 text-slate-400" />
                    <span>SOLVE PREVIOUS CASE TO UNLOCK</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
