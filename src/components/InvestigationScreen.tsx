/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { CASES_DATA } from '../data/casesData';
import { CaseQuestion, ConfidenceLevel } from '../types';
import { useDetective } from '../context/DetectiveContext';
import { DetectiveMascot } from './DetectiveMascot';
import { sounds } from '../utils/soundEffects';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Wrench,
  Trophy,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvestigationScreenProps {
  caseId: string;
  onBack: () => void;
  onNextCase: () => void;
}

type Stage = 'predict' | 'confidence' | 'ready_to_run' | 'executing' | 'result' | 'repair' | 'repaired';

export const InvestigationScreen: React.FC<InvestigationScreenProps> = ({
  caseId,
  onBack,
  onNextCase,
}) => {
  const { recordInvestigation, repairChallengeCompleted } = useDetective();

  const currentCase = CASES_DATA.find((c) => c.id === caseId) || CASES_DATA[0];
  const question: CaseQuestion = currentCase.questions[0];

  // Stage state machine
  const [stage, setStage] = useState<Stage>('predict');
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<ConfidenceLevel | null>(null);

  // Execution engine state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Misconception outcome
  const [investigationResult, setInvestigationResult] = useState<{
    isCorrect: boolean;
    misconception?: {
      name: string;
      tagline: string;
      explanation: string;
      friendlyClue: string;
      mentalModelRemedy: string;
    };
    xpAwarded: number;
  } | null>(null);

  // Repair stage state
  const [repairSelectedOption, setRepairSelectedOption] = useState<string | null>(null);
  const [repairSuccess, setRepairSuccess] = useState<boolean | null>(null);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, []);

  // Handle auto-playing steps
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < question.executionSteps.length - 1) {
            sounds.playStep();
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (playTimerRef.current) clearInterval(playTimerRef.current);
            finishExecution();
            return prev;
          }
        });
      }, 1200);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, question.executionSteps.length]);

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    sounds.playClick();
    setSelectedOptionId(optId);
    setStage('confidence');
  };

  const handleSelectConfidence = (conf: ConfidenceLevel) => {
    sounds.playClick();
    setSelectedConfidence(conf);
    setStage('ready_to_run');
  };

  const handleStartRun = () => {
    sounds.playClick();
    setStage('executing');
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleStepNext = () => {
    if (currentStepIndex < question.executionSteps.length - 1) {
      sounds.playStep();
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      finishExecution();
    }
  };

  const handleResetExecution = () => {
    sounds.playClick();
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const finishExecution = () => {
    if (!selectedOptionId || !selectedConfidence) return;
    const result = recordInvestigation(question, selectedOptionId, selectedConfidence);
    setInvestigationResult(result);
    setStage('result');
  };

  const handleStartRepair = () => {
    sounds.playClick();
    setStage('repair');
  };

  const handleAnswerRepair = (optId: string) => {
    sounds.playClick();
    setRepairSelectedOption(optId);
    const success = repairChallengeCompleted(question, optId);
    setRepairSuccess(success);
    if (success) {
      setStage('repaired');
    }
  };

  const activeStep = question.executionSteps[currentStepIndex] || question.executionSteps[0];
  const activeLineNumber = activeStep?.lineIndex || 1;

  // Split code lines for syntax highlighting & line pointer
  const codeLines = question.code.split('\n');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Navigation & Header Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO CASE FILES</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-md">
            {currentCase.caseCode} • {question.concept}
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            +{currentCase.xpReward} XP BOUNTY
          </span>
        </div>
      </div>

      {/* Case Header Title & Clue */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
          <span className="text-amber-400 font-bold">🔍 INVESTIGATION IN PROGRESS</span>
          <span>•</span>
          <span>{currentCase.title}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {question.mysteryTitle}
        </h1>
        <p className="mt-2 text-sm text-amber-200/90 font-mono bg-amber-950/30 border-l-4 border-amber-400 px-3 py-2 rounded-r-lg">
          💬 {question.narrativeClue}
        </p>
      </div>

      {/* Central Split View: Code & Memory on Left, Detective Interaction on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Block + Step Execution + Memory Box */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Code Window */}
          <div className="bg-slate-950 border-2 border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Window Header */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-300 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  mystery_{currentCase.number}.py
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Python 3.12</span>
            </div>

            {/* Code Lines with Execution Pointer */}
            <div className="p-4 sm:p-5 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto bg-[#090d1f]">
              {codeLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isCurrentLine = (stage === 'executing' || stage === 'result') && activeLineNumber === lineNum;

                return (
                  <div
                    key={idx}
                    className={`flex items-center py-0.5 px-2 rounded transition-all duration-200 ${
                      isCurrentLine
                        ? 'bg-amber-400/20 text-amber-300 font-bold border-l-4 border-amber-400 pl-1'
                        : 'text-slate-200'
                    }`}
                  >
                    {/* Line number */}
                    <span className="w-8 select-none text-slate-600 text-xs font-mono text-right mr-4">
                      {lineNum}
                    </span>

                    {/* Step arrow indicator */}
                    <span className="w-4 select-none mr-2">
                      {isCurrentLine ? (
                        <span className="text-amber-400 font-bold animate-pulse">▶</span>
                      ) : (
                        ''
                      )}
                    </span>

                    {/* Code text */}
                    <span className="flex-1 whitespace-pre">
                      {line || ' '}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Execution Controls (Shown when in executing or result stage) */}
            {(stage === 'executing' || stage === 'result') && (
              <div className="bg-slate-900/90 border-t border-slate-800 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs shadow-[0_2px_0_#b45309] hover:bg-amber-300 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                  </button>

                  <button
                    onClick={handleStepNext}
                    disabled={currentStepIndex >= question.executionSteps.length - 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                  >
                    <span>STEP</span>
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleResetExecution}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
                    title="Restart execution"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Step <span className="text-amber-400 font-bold">{currentStepIndex + 1}</span> of{' '}
                  {question.executionSteps.length}
                </div>
              </div>
            )}
          </div>

          {/* Step Detail Explanation & Visual Memory Box (The Runtime Inspector) */}
          {(stage === 'executing' || stage === 'result') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400">
                  <Cpu className="w-4 h-4" />
                  <span>RUNTIME MEMORY & STEP TRACER</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Code: <code className="text-amber-300">{activeStep.codeSnippet}</code>
                </span>
              </div>

              {/* Step Explanation */}
              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                {activeStep.explanation}
              </p>

              {/* Visual Variable Boxes (As requested in Section 5) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="text-[11px] font-mono text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>ACTIVE MEMORY BOXES</span>
                </div>

                {Object.keys(activeStep.variables).length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {Object.entries(activeStep.variables).map(([varName, val]) => (
                      <motion.div
                        key={varName}
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ duration: 0.3 }}
                        className="font-mono text-xs bg-slate-900 border-2 border-amber-400/60 rounded-lg px-3 py-1.5 shadow-[0_2px_0_#b45309] flex items-center gap-2"
                      >
                        <span className="text-amber-400 font-bold">{varName}</span>
                        <span className="text-slate-500">=</span>
                        <span className="text-white font-black bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                          {String(val)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 font-mono italic">
                    No variables allocated yet.
                  </span>
                )}

                {/* Call Stack if present (Functions & Recursion) */}
                {activeStep.callStack && activeStep.callStack.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="text-[10px] font-mono text-indigo-300 font-bold mb-1.5">
                      CALL STACK (DEPTH: {activeStep.callStack.length}):
                    </div>
                    <div className="flex flex-col-reverse gap-1 font-mono text-xs">
                      {activeStep.callStack.map((frame, fIdx) => (
                        <div
                          key={fIdx}
                          className="bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 px-2.5 py-1 rounded text-[11px]"
                        >
                          frame[{fIdx}]: {frame}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Console Output Stream */}
              <div className="mt-3 bg-black/70 border border-slate-800 rounded-lg px-3 py-2 font-mono text-xs flex items-center justify-between">
                <span className="text-slate-400">OUTPUT STREAM:</span>
                <span className="text-emerald-400 font-bold">
                  {activeStep.outputSoFar ? `→ ${activeStep.outputSoFar}` : '(waiting for print...)'}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Detective Interaction & Misconception Diagnosis */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {/* STAGE 1: PREDICTION (WHAT DO YOU THINK?) */}
            {stage === 'predict' && (
              <motion.div
                key="predict"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-1">
                  <span>STEP 1 OF 3: FORMULATE HYPOTHESIS</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                  “What do YOU think will be printed?”
                </h2>
                <p className="text-xs text-slate-300 mb-5">
                  Pick the option that matches your mental picture of what Python will output.
                  Don’t second guess—there are no penalties!
                </p>

                {/* Option Cards (🅰, 🅱, 🅲, 🅳) */}
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className="w-full text-left p-3.5 sm:p-4 rounded-xl font-mono text-sm sm:text-base font-bold bg-slate-800/90 hover:bg-amber-400 hover:text-slate-950 text-slate-100 border-2 border-slate-700 hover:border-amber-300 shadow-[0_4px_0_#1e293b] hover:shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-slate-900 group-hover:bg-slate-950 text-amber-300 group-hover:text-amber-400 border border-slate-700 flex items-center justify-center text-sm font-black">
                        {option.id}
                      </span>
                      <span className="flex-1 font-mono text-base">{option.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                  <DetectiveMascot size="sm" mood="thinking" />
                  <p>
                    <strong>Detective Tip:</strong> Trust your genuine prediction. Even a divergence
                    reveals the exact key to code mastery!
                  </p>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: CONFIDENCE RATING (SECTION 4) */}
            {stage === 'confidence' && (
              <motion.div
                key="confidence"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900/90 border-2 border-amber-400/80 rounded-2xl p-5 sm:p-6 shadow-xl"
              >
                <div className="text-xs font-mono font-bold text-amber-400 mb-1">
                  STEP 2 OF 3: CALIBRATION
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                  “How confident are you?”
                </h2>
                <p className="text-xs text-slate-300 mb-5">
                  You predicted choice{' '}
                  <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/40">
                    {selectedOptionId} ({question.options.find((o) => o.id === selectedOptionId)?.label})
                  </span>
                  . How certain are you about this deduction?
                </p>

                {/* Confidence Buttons: 25%, 50%, 75%, 100% */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { level: 25 as ConfidenceLevel, emoji: '😐', label: '25%', subtitle: 'Just guessing' },
                    { level: 50 as ConfidenceLevel, emoji: '🙂', label: '50%', subtitle: 'Somewhat sure' },
                    { level: 75 as ConfidenceLevel, emoji: '😎', label: '75%', subtitle: 'Pretty confident' },
                    { level: 100 as ConfidenceLevel, emoji: '🔥', label: '100%', subtitle: 'Bet my laptop!' },
                  ].map((item) => (
                    <button
                      key={item.level}
                      onClick={() => handleSelectConfidence(item.level)}
                      className="p-3.5 rounded-xl font-bold bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-100 border-2 border-slate-700 hover:border-amber-300 shadow-[0_4px_0_#1e293b] hover:shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all flex flex-col items-center justify-center cursor-pointer group"
                    >
                      <span className="text-2xl mb-1">{item.emoji}</span>
                      <span className="font-mono text-base font-black">{item.label}</span>
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-900 font-sans font-medium">
                        {item.subtitle}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 text-center text-xs text-slate-400 font-mono">
                  This tracks whether your confidence matches reality!
                </div>
              </motion.div>
            )}

            {/* STAGE 3: READY TO RUN INVESTIGATION (SECTION 5) */}
            {stage === 'ready_to_run' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl text-center"
              >
                <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-amber-400 mx-auto mb-4 text-3xl">
                  🚀
                </div>
                <div className="text-xs font-mono font-bold text-amber-400 mb-1">
                  PREDICTION LOCKED IN
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Ready to Test Reality?</h2>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-6 text-left font-mono text-xs space-y-1 text-slate-300">
                  <div>
                    Predicted Output:{' '}
                    <span className="font-bold text-amber-300">
                      {question.options.find((o) => o.id === selectedOptionId)?.label}
                    </span>
                  </div>
                  <div>
                    Confidence:{' '}
                    <span className="font-bold text-cyan-300">{selectedConfidence}%</span>
                  </div>
                </div>

                {/* Big Run Investigation Button */}
                <button
                  onClick={handleStartRun}
                  className="w-full py-4 rounded-xl font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 border-2 border-amber-200 shadow-[0_5px_0_#b45309] hover:shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all text-base cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>▶ RUN INVESTIGATION</span>
                </button>
              </motion.div>
            )}

            {/* STAGE 4: EXECUTING CODE (STEP BY STEP) */}
            {stage === 'executing' && (
              <motion.div
                key="executing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900/90 border-2 border-cyan-500/60 rounded-2xl p-5 shadow-xl text-center"
              >
                <div className="flex justify-center mb-3">
                  <DetectiveMascot size="sm" mood="magnifying" />
                </div>
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1 animate-pulse">
                  EXECUTING CODE INSTRUCTION BY INSTRUCTION...
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Tracing Runtime Execution
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  Watch the code lines and active memory boxes on the left to see exactly how Python
                  processes each line.
                </p>

                <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden border border-slate-700">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{
                      width: `${((currentStepIndex + 1) / question.executionSteps.length) * 100}%`,
                    }}
                  />
                </div>

                <button
                  onClick={finishExecution}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  Skip directly to results
                </button>
              </motion.div>
            )}

            {/* STAGE 5: RESULT & MISCONCEPTION DETECTION (SECTIONS 6 & 7) */}
            {stage === 'result' && investigationResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {investigationResult.isCorrect ? (
                  // CORRECT ANSWER CARD
                  <div className="bg-slate-900/95 border-2 border-emerald-500/80 rounded-2xl p-5 sm:p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          PERFECT DEDUCTION
                        </div>
                        <h2 className="text-xl font-black text-white">
                          🎉 Clue Solved! Mental Model Sound
                        </h2>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-mono mb-4 space-y-1.5">
                      <div className="text-slate-300">
                        Your Prediction:{' '}
                        <span className="font-bold text-emerald-400">
                          {question.options.find((o) => o.id === selectedOptionId)?.label}
                        </span>
                      </div>
                      <div className="text-slate-300">
                        Actual Output:{' '}
                        <span className="font-bold text-emerald-400">{question.actualOutput}</span>
                      </div>
                      <div className="text-amber-400 font-bold">
                        Bounty Earned: +{investigationResult.xpAwarded} XP
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed mb-5">
                      Your intuition was completely verified by the runtime! You correctly anticipated
                      the variable memory and iteration sequence.
                    </p>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={onNextCase}
                        className="w-full py-3 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>NEXT INVESTIGATION CASE</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // MISCONCEPTION DETECTED CARD (SECTION 6)
                  <div className="bg-slate-900/95 border-2 border-rose-500/80 rounded-2xl p-5 sm:p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-rose-400 animate-pulse">
                          🚨 MISCONCEPTION DETECTED
                        </div>
                        <h2 className="text-xl font-black text-white">Almost! You Found a Clue.</h2>
                      </div>
                    </div>

                    {/* Prediction vs Actual comparison */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-mono mb-4 grid grid-cols-2 gap-2">
                      <div className="bg-rose-950/40 p-2 rounded border border-rose-500/30">
                        <div className="text-slate-400 text-[10px]">YOUR PREDICTION</div>
                        <div className="text-rose-300 font-bold text-sm">
                          {question.options.find((o) => o.id === selectedOptionId)?.label}
                        </div>
                      </div>
                      <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                        <div className="text-slate-400 text-[10px]">ACTUAL OUTPUT</div>
                        <div className="text-emerald-300 font-bold text-sm">
                          {question.actualOutput}
                        </div>
                      </div>
                    </div>

                    {/* Identified Misconception */}
                    {investigationResult.misconception && (
                      <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3.5 mb-4">
                        <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                          <span>🧠 POSSIBLE MISCONCEPTION:</span>
                        </div>
                        <div className="text-sm font-extrabold text-white mb-1.5">
                          {investigationResult.misconception.name}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                          {investigationResult.misconception.explanation}
                        </p>
                        <div className="bg-amber-400/10 text-amber-200 text-xs font-mono p-2 rounded border border-amber-400/20">
                          💡 <strong>Mental Anchor:</strong>{' '}
                          {investigationResult.misconception.mentalModelRemedy}
                        </div>
                      </div>
                    )}

                    {/* CTA: Mini Repair Challenge (Section 9) */}
                    <button
                      onClick={handleStartRepair}
                      className="w-full py-3.5 rounded-xl font-black text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>FIX THE BUG IN YOUR THINKING (+50 XP)</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* STAGE 6: REPAIR CHALLENGE (SECTION 9) */}
            {stage === 'repair' && (
              <motion.div
                key="repair"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/95 border-2 border-indigo-500/80 rounded-2xl p-5 sm:p-6 shadow-2xl"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 mb-1">
                  <Wrench className="w-4 h-4" />
                  <span>{question.repairChallenge.title}</span>
                </div>
                <h2 className="text-xl font-black text-white mb-2">
                  Test Your New Mental Model
                </h2>
                <p className="text-xs text-slate-300 mb-4">
                  {question.repairChallenge.instruction}
                </p>

                {/* Repair Code Snippet */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-amber-300 mb-4 whitespace-pre">
                  {question.repairChallenge.code}
                </div>

                <div className="text-xs font-mono font-bold text-slate-200 mb-3">
                  {question.repairChallenge.questionText}
                </div>

                {/* Repair Options */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {question.repairChallenge.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerRepair(opt.id)}
                      className="p-3 rounded-xl font-mono text-sm font-bold bg-slate-800 hover:bg-indigo-600 text-white border-2 border-slate-700 hover:border-indigo-400 shadow-[0_3px_0_#1e1b4b] active:translate-y-1 transition-all text-center cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {repairSuccess === false && (
                  <div className="text-xs text-rose-300 font-mono bg-rose-950/60 border border-rose-500/30 p-2.5 rounded-lg text-center">
                    Almost! Look closely at the updated code and try again.
                  </div>
                )}
              </motion.div>
            )}

            {/* STAGE 7: REPAIRED CELEBRATION */}
            {stage === 'repaired' && (
              <motion.div
                key="repaired"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/95 border-2 border-amber-400 rounded-2xl p-6 shadow-2xl text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-400 mx-auto mb-3 text-3xl">
                  🏅
                </div>
                <div className="text-xs font-mono font-bold text-amber-400 mb-1">
                  CASE SOLVED & RESOLVED
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  🎉 MISCONCEPTION REPAIRED!
                </h2>
                <p className="text-xs text-slate-300 mb-4 max-w-sm mx-auto">
                  {question.repairChallenge.explanation}
                </p>

                <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 font-mono text-xs font-bold px-3 py-1.5 rounded-full border border-amber-400/40 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>+50 XP & DETECTIVE BADGE UNLOCKED</span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={onNextCase}
                    className="w-full py-3.5 rounded-xl font-black text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-[0_4px_0_#b45309] active:translate-y-1 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>CONTINUE ADVENTURE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Return to Case Files
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
