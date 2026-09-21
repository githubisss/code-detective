/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDetective } from '../context/DetectiveContext';
import { INITIAL_BADGES } from '../data/casesData';
import { Trophy, Award, Lock, Sparkles, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const AchievementsView: React.FC = () => {
  const { userProfile } = useDetective();

  const isUnlocked = (badgeId: string) => userProfile.badges.some((b) => b.id === badgeId);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'bg-slate-700/60 text-slate-300 border-slate-600';
      case 'Rare':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40';
      case 'Epic':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      case 'Legendary':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Trophy className="w-4 h-4" />
            <span>ACCOLADES & BADGES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>🏆</span> INVESTIGATION TROPHY ROOM
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Collect badges by repairing cognitive misconceptions, predicting code outputs
            accurately, and completing investigation dossiers.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl self-start sm:self-auto font-mono text-xs">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-white font-bold">{userProfile.badges.length} Unlocked</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">{INITIAL_BADGES.length} Total</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INITIAL_BADGES.map((badge, idx) => {
          const unlocked = isUnlocked(badge.id);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-2xl p-5 border-2 transition-all flex flex-col justify-between select-none ${
                unlocked
                  ? 'bg-slate-900/90 border-amber-400/50 shadow-[0_4px_0_#b45309] hover:border-amber-400'
                  : 'bg-slate-950/50 border-slate-800/80 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 ${
                      unlocked
                        ? 'bg-amber-400/20 border-amber-400/40 text-amber-300 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {unlocked ? badge.icon : '🔒'}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${getRarityBadge(
                      badge.rarity
                    )}`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white mb-1 flex items-center gap-1.5">
                  <span>{badge.title}</span>
                  {unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">{badge.category}</span>
                <span className={unlocked ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                  {unlocked ? 'CLAIMED' : 'LOCKED'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
