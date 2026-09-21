/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDetective } from '../context/DetectiveContext';
import { DetectiveMascot } from './DetectiveMascot';
import { User, Flame, Award, Zap, Shield, RotateCcw, Sparkles } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { userProfile, investigations, loadSampleHackathonData, resetProgress } = useDetective();

  const xpPercent = Math.min(100, Math.round((userProfile.xp / userProfile.nextLevelXp) * 100));
  const repairedCount = investigations.filter((i) => i.repaired && !i.isCorrect).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
          <User className="w-4 h-4" />
          <span>DETECTIVE DOSSIER</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>👤</span> DETECTIVE PROFILE
        </h1>
      </div>

      {/* Main Profile Card */}
      <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="bg-slate-950 p-4 rounded-2xl border-2 border-amber-400/40 shadow-[0_4px_0_#b45309]">
            <DetectiveMascot size="lg" mood="celebrate" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <h2 className="text-2xl font-black text-white font-sans">{userProfile.name}</h2>
              <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/40">
                @{userProfile.callsign}
              </span>
            </div>

            <div className="inline-block text-xs font-mono font-black text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-md border border-cyan-500/30 uppercase tracking-wider mb-4">
              LEVEL {userProfile.level} — {userProfile.rankTitle}
            </div>

            {/* XP Progress Bar */}
            <div className="max-w-md mb-4">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Experience Points</span>
                <span className="text-amber-300 font-bold">
                  {userProfile.xp.toLocaleString()} / {userProfile.nextLevelXp.toLocaleString()} XP
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Stat Pill Highlights */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-amber-400 font-bold">
                <Flame className="w-4 h-4 fill-current" />
                <span>{userProfile.streakDays} Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-cyan-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>{userProfile.investigationPoints} IP Points</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-purple-300 font-bold">
                <Award className="w-4 h-4" />
                <span>{userProfile.badges.length} Badges Claimed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Investigation Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-white font-mono">{investigations.length}</div>
          <div className="text-xs text-slate-400 font-mono mt-1">Total Predictions</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {investigations.filter((i) => i.isCorrect).length}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">Sound Mental Models</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-rose-400 font-mono">
            {investigations.filter((i) => !i.isCorrect).length}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">Misconceptions Found</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-amber-400 font-mono">{repairedCount}</div>
          <div className="text-xs text-slate-400 font-mono mt-1">Repairs Completed</div>
        </div>
      </div>

      {/* Demo Utilities */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-sm">Demo & Presentation Tools</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Reset to a fresh learner state or load realistic multi-case diagnostic data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSampleHackathonData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo History</span>
          </button>
          <button
            onClick={resetProgress}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
