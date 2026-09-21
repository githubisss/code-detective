/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDetective } from '../context/DetectiveContext';
import { ConceptCategory, ActiveTab } from '../types';
import { sounds } from '../utils/soundEffects';
import {
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Wrench,
} from 'lucide-react';
import { motion } from 'motion/react';

interface MisconceptionRadarProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectCase: (caseId: string) => void;
}

export const MisconceptionRadar: React.FC<MisconceptionRadarProps> = ({
  setActiveTab,
  onSelectCase,
}) => {
  const { conceptStats, investigations, thinkingAnalysis } = useDetective();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Strong Understanding':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Strong Understanding</span>
          </span>
        );
      case 'Needs Investigation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-500/40">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Needs Investigation</span>
          </span>
        );
      case 'Misconception Detected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/60 text-rose-400 border border-rose-500/40 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Misconception Detected</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getBarColor = (status: string) => {
    switch (status) {
      case 'Strong Understanding':
        return 'from-emerald-500 to-teal-400';
      case 'Needs Investigation':
        return 'from-amber-500 to-yellow-400';
      case 'Misconception Detected':
        return 'from-rose-500 to-red-400';
      default:
        return 'from-slate-500 to-slate-400';
    }
  };

  const conceptList: ConceptCategory[] = [
    'VARIABLES',
    'CONDITIONS',
    'LOOPS',
    'FUNCTIONS',
    'ARRAYS',
    'RECURSION',
  ];

  // Map concepts to sample case IDs for direct practice
  const conceptToCaseId: Record<ConceptCategory, string> = {
    VARIABLES: 'case-01',
    CONDITIONS: 'case-02',
    LOOPS: 'case-03',
    FUNCTIONS: 'case-04',
    ARRAYS: 'case-05',
    RECURSION: 'case-06',
    SCOPE: 'case-01',
    REFERENCES: 'case-01',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>COGNITIVE DIAGNOSTIC RADAR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>🧠</span> MY MISCONCEPTION RADAR
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            We don’t grade you with test scores. Instead, the radar maps your mental models,
            highlighting sound intuitions and isolating areas where code behaves contrary to your
            expectation.
          </p>
        </div>

        {/* Action jump */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('confidence');
          }}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-amber-300 border border-slate-700 transition-colors"
        >
          <span>View Thinking Pattern</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Radar Visual Bar Matrix */}
      <div className="mt-8 bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📊</span> Mental Model Accuracy by Concept
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Based on {investigations.length} real predictions
          </span>
        </div>

        <div className="space-y-6">
          {conceptList.map((concept, idx) => {
            const stat = conceptStats[concept];
            return (
              <motion.div
                key={concept}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-white w-28">
                      {concept}
                    </span>
                    {getStatusBadge(stat.status)}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-400">
                      {stat.correct}/{stat.total} accurate ({stat.percentage}%)
                    </span>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSelectCase(conceptToCaseId[concept]);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Investigate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.08 }}
                    className={`h-full bg-gradient-to-r ${getBarColor(stat.status)} rounded-full`}
                  />
                </div>

                {/* Recurring Misconception Banner if flagged */}
                {stat.recurringMisconception && stat.status !== 'Strong Understanding' && (
                  <div className="mt-3 bg-rose-950/40 border border-rose-500/30 rounded-lg p-2.5 flex items-start gap-2 text-xs text-rose-200">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold font-mono text-rose-300 mr-1">
                        🔴 RECURRING PATTERN:
                      </span>
                      <span>{stat.recurringMisconception}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Discovered Misconceptions & Repaired Clues Log */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active / Detected Clues */}
        <div className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Uncovered Misconceptions</span>
            </h3>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
              {investigations.filter((i) => !i.isCorrect && !i.repaired).length} Need Repair
            </span>
          </div>

          <div className="space-y-3">
            {investigations
              .filter((i) => !i.isCorrect)
              .slice(0, 4)
              .map((inv) => (
                <div
                  key={inv.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-400 font-bold">{inv.concept}</span>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                        inv.repaired
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {inv.repaired ? 'REPAIRED' : 'ACTIVE CLUE'}
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm">
                    {inv.misconceptionName || 'Divergent Deduction'}
                  </div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">
                    {inv.misconceptionDetail}
                  </div>
                </div>
              ))}

            {investigations.filter((i) => !i.isCorrect).length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs font-mono">
                No active misconceptions detected yet! Run some mystery cases to uncover clues.
              </div>
            )}
          </div>
        </div>

        {/* AI Cognitive Synthesis / Thinking Insights (Section 14) */}
        <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-base text-white">🤖 THINKING ANALYZER</h3>
              </div>
              <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                COGNITIVE PROFILE
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {thinkingAnalysis.summary}
            </p>

            {/* Blindspot list */}
            <div className="mb-4">
              <div className="text-[11px] font-mono text-amber-300 font-bold uppercase mb-2">
                Identified Cognitive Blindspots:
              </div>
              <div className="space-y-1.5">
                {thinkingAnalysis.blindspots.map((item, bIdx) => (
                  <div
                    key={bIdx}
                    className="text-xs text-slate-300 bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-start gap-2"
                  >
                    <span className="text-amber-400">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-xl text-xs text-indigo-200">
              💡 <strong>Detective Prescription:</strong> {thinkingAnalysis.recommendation}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Overconfidence Level:</span>
            <span
              className={`font-bold ${
                thinkingAnalysis.overconfidenceRating === 'High Alert'
                  ? 'text-rose-400'
                  : thinkingAnalysis.overconfidenceRating === 'Moderate'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {thinkingAnalysis.overconfidenceRating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
