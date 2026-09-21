/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDetective } from '../context/DetectiveContext';
import { ActiveTab, ConfidenceLevel } from '../types';
import { sounds } from '../utils/soundEffects';
import {
  Target,
  Flame,
  Smile,
  Meh,
  Glasses,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ThinkingPatternProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectCase: (caseId: string) => void;
}

export const ThinkingPattern: React.FC<ThinkingPatternProps> = ({
  setActiveTab,
  onSelectCase,
}) => {
  const { confidenceStats, investigations, thinkingAnalysis } = useDetective();

  const getConfidenceMeta = (level: ConfidenceLevel) => {
    switch (level) {
      case 100:
        return { emoji: '🔥', label: '100%', title: 'Absolute Certainty', color: 'text-amber-400' };
      case 75:
        return { emoji: '😎', label: '75%', title: 'Pretty Confident', color: 'text-cyan-400' };
      case 50:
        return { emoji: '🙂', label: '50%', title: 'Somewhat Sure', color: 'text-emerald-400' };
      case 25:
        return { emoji: '😐', label: '25%', title: 'Hunch / Guessing', color: 'text-slate-400' };
    }
  };

  // Check if student has high confidence failures (The famous Dunning-Kruger effect)
  const highConfErrors = investigations.filter(
    (inv) => inv.confidence >= 75 && !inv.isCorrect
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Target className="w-4 h-4" />
            <span>META-COGNITION & BIAS CALIBRATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>🎯</span> YOUR THINKING PATTERN
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Examine how your internal certainty matches actual runtime behavior. Discover if you
            suffer from overconfident blindspots or humble intuition!
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('cases');
          }}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-[0_3px_0_#b45309] transition-all"
        >
          <span>Test Another Mystery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Featured Insight Highlight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-5 sm:p-6 shadow-xl flex items-start gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 text-2xl shrink-0">
          💡
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">
            CORE PSYCHOLOGICAL INSIGHT
          </div>
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {highConfErrors > 0 ? (
              <span>
                “Interesting! You sometimes become{' '}
                <span className="text-amber-300 underline underline-offset-4 decoration-amber-400">
                  most confident
                </span>{' '}
                when your mental model needs another look.”
              </span>
            ) : (
              <span>
                “Your confidence calibration is sharp! When you feel 100% certain, your predictions
                hold up under runtime scrutiny.”
              </span>
            )}
          </p>
          <p className="text-xs text-slate-300 mt-2 font-mono">
            {highConfErrors > 0
              ? `You have made ${highConfErrors} predictions at 75%-100% confidence that diverged from actual output. This is not a failure—it reveals deep-seated cognitive shortcuts!`
              : 'Keep investigating deeper cases like Recursion and Array boundaries to verify if calibration stays aligned.'}
          </p>
        </div>
      </motion.div>

      {/* Matrix: Confidence Tier vs Result Table (Section 8) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Confidence Tiers Breakdown */}
        <div className="lg:col-span-7 bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Confidence vs Accuracy Matrix</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Calibration Breakdown</span>
          </div>

          <div className="space-y-4">
            {([100, 75, 50, 25] as ConfidenceLevel[]).map((lvl) => {
              const meta = getConfidenceMeta(lvl);
              const stat = confidenceStats.find((s) => s.confidence === lvl) || {
                confidence: lvl,
                total: 0,
                correct: 0,
                incorrect: 0,
                accuracy: 0,
              };

              return (
                <div
                  key={lvl}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meta.emoji}</span>
                    <div>
                      <div className="font-mono text-base font-black text-white flex items-center gap-2">
                        <span>{meta.label}</span>
                        <span className="text-xs font-normal text-slate-400 font-sans">
                          ({meta.title})
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {stat.total} total cases answered
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Visual bar */}
                    <div className="w-24 sm:w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className={`h-full ${
                          stat.accuracy >= 70
                            ? 'bg-emerald-400'
                            : stat.accuracy >= 40
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${stat.total > 0 ? stat.accuracy : 0}%` }}
                      />
                    </div>

                    <div className="text-right font-mono min-w-[70px]">
                      <div className="text-xs font-bold text-slate-200">
                        {stat.accuracy}% True
                      </div>
                      <div className="text-[10px] text-slate-400">
                        ✅ {stat.correct} • ❌ {stat.incorrect}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Predictions Log with Confidence vs Result */}
        <div className="lg:col-span-5 bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>📋</span> Recent Prediction Log
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {investigations.length} items
              </span>
            </div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {investigations.slice(0, 6).map((inv) => (
                <div
                  key={inv.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">
                      {inv.confidence === 100
                        ? '🔥'
                        : inv.confidence === 75
                        ? '😎'
                        : inv.confidence === 50
                        ? '🙂'
                        : '😐'}
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">{inv.mysteryTitle}</div>
                      <div className="text-[11px] text-slate-400">
                        Predicted <span className="text-amber-300">{inv.predictedValue}</span> (
                        {inv.confidence}%)
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {inv.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>VERIFIED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>MISCONCEPTION</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {investigations.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs font-mono">
                  No prediction log entries yet. Run a case to populate!
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs font-mono text-amber-300">
            Deductions sharpen when you note why you felt confident!
          </div>
        </div>
      </div>
    </div>
  );
};
