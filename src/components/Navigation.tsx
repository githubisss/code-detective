/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDetective } from '../context/DetectiveContext';
import { ActiveTab } from '../types';
import {
  Home,
  FolderKanban,
  BrainCircuit,
  Target,
  Trophy,
  User,
  Volume2,
  VolumeX,
  Flame,
  Sparkles,
  RotateCcw,
  Compass,
} from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { userProfile, soundEnabled, toggleSound, loadSampleHackathonData, resetProgress } =
    useDetective();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'cases', label: 'Case Files', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'radar', label: 'Misconception Radar', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'confidence', label: 'Thinking Pattern', icon: <Target className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice Lab', icon: <Compass className="w-4 h-4" /> },
    {
      id: 'achievements',
      label: 'Badges',
      icon: <Trophy className="w-4 h-4" />,
      badge: `${userProfile.badges.length}`,
    },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  const xpPercent = Math.min(100, Math.round((userProfile.xp / userProfile.nextLevelXp) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#0c1024]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      {/* Top utility ticker / gamer status bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/40 text-xs text-slate-300 font-mono">
        {/* Logo / Brand */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-400 border-2 border-amber-300 shadow-[0_2px_0_#b45309] flex items-center justify-center text-slate-950 font-black text-base group-hover:scale-105 transition-transform">
            🕵️
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wide text-white font-sans flex items-center gap-1.5">
              CODE DETECTIVE
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-amber-400/30">
                PROTOTYPE
              </span>
            </span>
          </div>
        </div>

        {/* Player Stats Mini HUD */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Streak */}
          <div
            title="Daily Investigation Streak"
            className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse" />
            <span>{userProfile.streakDays} Day Streak</span>
          </div>

          {/* Level & XP bar */}
          <div
            onClick={() => setActiveTab('profile')}
            className="cursor-pointer flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/60 hover:border-slate-500 transition-colors"
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                LVL {userProfile.level} • {userProfile.rankTitle}
              </span>
              <span className="text-[11px] font-bold text-cyan-300">
                {userProfile.xp.toLocaleString()} / {userProfile.nextLevelXp.toLocaleString()} XP
              </span>
            </div>
            <div className="w-16 sm:w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Sound & Demo quick actions */}
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute 8-bit sounds' : 'Enable 8-bit sounds'}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>

            <button
              onClick={loadSampleHackathonData}
              title="Pre-populate rich investigation history for demo presentation"
              className="flex items-center gap-1 text-[11px] bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-500/40 px-2 py-1 rounded-md transition-all active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="hidden sm:inline">Demo Data</span>
            </button>

            <button
              onClick={resetProgress}
              title="Reset progress to rookie detective"
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-[0_3px_0_#b45309] translate-y-[-1px]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
