/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useDetective } from '../context/DetectiveContext';
import { sounds } from '../utils/soundEffects';
import { Compass, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickDrill {
  id: string;
  category: string;
  prompt: string;
  code: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

const QUICK_DRILLS: QuickDrill[] = [
  {
    id: 'drill-1',
    category: 'VARIABLES',
    prompt: 'Mental Model: Are variables wired together, or independent snapshots?',
    code: `p = 100
q = p
p = 50
print(q)`,
    options: [
      { text: '100', isCorrect: true, explanation: 'Correct! When q = p happened, p was 100. Changing p later leaves q at 100.' },
      { text: '50', isCorrect: false, explanation: 'Common misconception: Variables are not live electrical wires.' },
      { text: '150', isCorrect: false, explanation: 'Assignment does not sum variables.' },
    ],
  },
  {
    id: 'drill-2',
    category: 'LOOPS',
    prompt: 'Mental Model: Does range(5) run 4 times or 5 times?',
    code: `count = 0
for step in range(5):
    count += 1
print(count)`,
    options: [
      { text: '4', isCorrect: false, explanation: 'range(5) produces [0, 1, 2, 3, 4] — exactly 5 elements!' },
      { text: '5', isCorrect: true, explanation: 'Spot on! range(N) always iterates N times when starting from 0.' },
      { text: '0', isCorrect: false, explanation: 'The loop body updates count on every iteration.' },
    ],
  },
  {
    id: 'drill-3',
    category: 'FUNCTIONS',
    prompt: 'Mental Model: Does a function output to a variable if return is omitted?',
    code: `def calc(x):
    ans = x + 5

val = calc(10)
print(val)`,
    options: [
      { text: '15', isCorrect: false, explanation: 'Without the explicit return keyword, Python silently hands back None.' },
      { text: 'None', isCorrect: true, explanation: 'Flawless! Omitting return results in None.' },
      { text: '10', isCorrect: false, explanation: 'The argument is not echoed.' },
    ],
  },
  {
    id: 'drill-4',
    category: 'ARRAYS',
    prompt: 'Mental Model: What index points to the first item?',
    code: `roster = ["Sherlock", "Watson", "Moriarty"]
print(roster[0])`,
    options: [
      { text: '"Sherlock"', isCorrect: true, explanation: 'Index 0 represents the 0-offset starting element!' },
      { text: '"Watson"', isCorrect: false, explanation: 'Index 1 is the second element.' },
      { text: '"Moriarty"', isCorrect: false, explanation: 'Index 0 is the beginning, not the end.' },
    ],
  },
];

export const PracticeLab: React.FC = () => {
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const drill = QUICK_DRILLS[activeDrillIndex];

  const handleSelect = (idx: number) => {
    if (answered) return;
    sounds.playClick();
    setSelectedOption(idx);
    setAnswered(true);

    if (drill.options[idx].isCorrect) {
      sounds.playSuccess();
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
    } else {
      sounds.playMisconceptionAlert();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setSelectedOption(null);
    setAnswered(false);
    setActiveDrillIndex((prev) => (prev + 1) % QUICK_DRILLS.length);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="pb-6 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
          <Compass className="w-4 h-4" />
          <span>MICRO-DRILL PRACTICE LAB</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>🎯</span> PRACTICE LAB
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Bite-sized mental model checks to instantly stress-test and reinforce programming intuition.
        </p>
      </div>

      <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30">
            {drill.category} • DRILL {activeDrillIndex + 1} OF {QUICK_DRILLS.length}
          </span>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> +25 XP
          </span>
        </div>

        <h2 className="text-lg font-bold text-white mb-3">{drill.prompt}</h2>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-amber-300 mb-6 whitespace-pre">
          {drill.code}
        </div>

        <div className="space-y-3 mb-6">
          {drill.options.map((opt, idx) => {
            const isChosen = selectedOption === idx;
            let btnStyle = 'bg-slate-800 text-white border-slate-700 hover:border-amber-400';
            if (answered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_3px_0_#065f46]';
              } else if (isChosen) {
                btnStyle = 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-[0_3px_0_#991b1b]';
              } else {
                btnStyle = 'bg-slate-900 text-slate-500 border-slate-800 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-xl font-mono text-sm font-bold border-2 transition-all cursor-pointer flex flex-col gap-1.5 ${btnStyle}`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.text}</span>
                  {answered && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {answered && isChosen && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                </div>

                {answered && (isChosen || opt.isCorrect) && (
                  <p className="text-xs font-sans text-slate-300 mt-1">{opt.explanation}</p>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_3px_0_#b45309] active:translate-y-1 transition-all cursor-pointer text-sm"
            >
              <span>NEXT DRILL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
