/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DetectiveMascot } from './DetectiveMascot';
import { FloatingCodeSymbols } from './FloatingCodeSymbols';
import { ActiveTab } from '../types';
import { useDetective } from '../context/DetectiveContext';
import { sounds } from '../utils/soundEffects';
import {
  Play,
  BrainCircuit,
  Trophy,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Eye,
  Zap,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomePageProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const { setActiveCaseId } = useDetective();

  const handleStartInvestigation = () => {
    sounds.playClick();
    setActiveCaseId('case-01');
    setActiveTab('cases');
  };

  const handleOpenRadar = () => {
    sounds.playClick();
    setActiveTab('radar');
  };

  const handleOpenProgress = () => {
    sounds.playClick();
    setActiveTab('confidence');
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)] overflow-hidden flex flex-col justify-between">
      {/* Floating Code Symbols in Background */}
      <FloatingCodeSymbols />

      {/* Background Decorative Gradients & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,53,15,0.25),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 flex-1 flex flex-col items-center text-center">
        {/* Mascot Greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <DetectiveMascot
            size="hero"
            mood="idle"
            speechBubble="Inspector Byte reporting! Ready to find clues?"
          />
        </motion.div>

        {/* Pixel / Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-amber-400/40 text-amber-300 font-mono text-xs font-semibold shadow-[0_3px_0_#1e293b] mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>A NEW KIND OF CODING LEARNING GAME</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-sans max-w-4xl"
        >
          <span className="inline-block mr-2">🕵️</span>
          <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
            CODE DETECTIVE
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-amber-300 font-sans tracking-wide"
        >
          “Every wrong answer leaves a clue.”
        </motion.p>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed"
        >
          Discover how you think about code, uncover your programming misconceptions, and build a
          rock-solid mental model through playful prediction and visual deduction.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5 select-none"
        >
          {/* Start Investigation Button */}
          <button
            onClick={handleStartInvestigation}
            className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-black text-slate-950 bg-amber-400 hover:bg-amber-300 border-2 border-amber-300 shadow-[0_5px_0_#b45309] hover:shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-[0_1px_0_#b45309] transition-all text-sm sm:text-base cursor-pointer uppercase tracking-wider"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>START INVESTIGATION</span>
          </button>

          {/* Misconceptions Radar Button */}
          <button
            onClick={handleOpenRadar}
            className="flex items-center gap-2.5 px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl font-bold text-slate-100 bg-slate-800 hover:bg-slate-700/90 border-2 border-slate-600 shadow-[0_5px_0_#1e293b] active:translate-y-1 active:shadow-[0_1px_0_#1e293b] transition-all text-sm sm:text-base cursor-pointer"
          >
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <span>MY MISCONCEPTIONS</span>
          </button>

          {/* Progress Button */}
          <button
            onClick={handleOpenProgress}
            className="flex items-center gap-2.5 px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl font-bold text-slate-100 bg-indigo-950/70 hover:bg-indigo-900/80 border-2 border-indigo-700/60 shadow-[0_5px_0_#1e1b4b] active:translate-y-1 active:shadow-[0_1px_0_#1e1b4b] transition-all text-sm sm:text-base cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>MY PROGRESS</span>
          </button>
        </motion.div>

        {/* Innovation Pipeline Card: The Detective Loop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-14 w-full max-w-4xl bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-left"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔎</span>
              <h2 className="font-extrabold text-lg text-white tracking-wide">
                HOW CODE DETECTIVE WORKS
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
              NOT JUST ANOTHER QUIZ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between hover:border-amber-400/40 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">1. Prediction</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We don’t ask for the right answer. We ask: <em>“What do YOU think will happen?”</em>
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-700/40 text-[11px] font-mono text-amber-300 font-semibold">
                State your hypothesis
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-400/40 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-3">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">2. Visual Execution</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Watch code run step-by-step with visual memory boxes, active lines, and call stacks.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-700/40 text-[11px] font-mono text-cyan-300 font-semibold">
                Trace real runtime values
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between hover:border-rose-400/40 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-rose-400/10 border border-rose-400/30 flex items-center justify-center text-rose-400 mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">3. Clue & Misconception</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If your prediction diverged, we diagnose <em>why</em> your mental model thought so.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-700/40 text-[11px] font-mono text-rose-300 font-semibold">
                No shaming. Pure clues!
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-400/40 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">4. Mental Model Repair</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Complete a mini challenge targeting the exact trap to lock in true understanding.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-700/40 text-[11px] font-mono text-emerald-300 font-semibold">
                +50 XP & Detective Badge
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Launch banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-mono"
        >
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" /> 6 Interactive Mystery Cases Available
          </span>
          <span>•</span>
          <span>Python Execution Visualizer</span>
          <span>•</span>
          <span>Cognitive Bias Detector</span>
          <span>•</span>
          <button
            onClick={() => {
              setActiveCaseId('case-03');
              setActiveTab('cases');
            }}
            className="text-amber-300 hover:text-amber-200 underline flex items-center gap-1 font-bold cursor-pointer"
          >
            Try Case 03: The Loop Mystery <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
      </div>

      {/* Final Tagline Bar (Requested by Section 18) */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/80 py-4 px-4 text-center">
        <p className="text-xs sm:text-sm font-mono font-medium text-amber-300/90 tracking-wide">
          “Don't just learn the right answer. Discover the wrong idea hiding behind it.”
        </p>
      </footer>
    </div>
  );
};
