/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  InvestigationRecord,
  CaseQuestion,
  ConfidenceLevel,
  MisconceptionDetail,
  ConceptCategory,
  Badge,
} from '../types';
import { CASES_DATA, INITIAL_BADGES } from '../data/casesData';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface ConceptStat {
  concept: ConceptCategory;
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  status: 'Strong Understanding' | 'Needs Investigation' | 'Misconception Detected';
  recurringMisconception?: string;
}

interface ConfidenceStat {
  confidence: ConfidenceLevel;
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

interface ThinkingAnalysis {
  summary: string;
  blindspots: string[];
  strengths: string[];
  recommendation: string;
  overconfidenceRating: 'Low' | 'Moderate' | 'High Alert';
}

interface DetectiveContextType {
  userProfile: UserProfile;
  investigations: InvestigationRecord[];
  activeCaseId: string | null;
  setActiveCaseId: (id: string | null) => void;
  activeQuestionId: string | null;
  setActiveQuestionId: (id: string | null) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  recordInvestigation: (
    question: CaseQuestion,
    optionId: 'A' | 'B' | 'C' | 'D',
    confidence: ConfidenceLevel
  ) => { isCorrect: boolean; misconception?: MisconceptionDetail; xpAwarded: number };
  repairChallengeCompleted: (question: CaseQuestion, chosenOptionId: string) => boolean;
  conceptStats: Record<ConceptCategory, ConceptStat>;
  confidenceStats: ConfidenceStat[];
  thinkingAnalysis: ThinkingAnalysis;
  resetProgress: () => void;
  loadSampleHackathonData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  callsign: 'ByteSleuth',
  avatarSeed: 'robot-detective',
  level: 4,
  xp: 1240,
  nextLevelXp: 1500,
  rankTitle: 'Logic Detective',
  streakDays: 3,
  investigationPoints: 85,
  unlockedCases: ['case-01', 'case-02', 'case-03', 'case-04'],
  completedCases: ['case-01', 'case-02'],
  badges: INITIAL_BADGES.slice(0, 4),
};

const DetectiveContext = createContext<DetectiveContextType | null>(null);

export const DetectiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('code_detective_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  const [investigations, setInvestigations] = useState<InvestigationRecord[]>(() => {
    const saved = localStorage.getItem('code_detective_investigations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Seed initial realistic investigations showing the classic loop & variables clues
    return [
      {
        id: 'seed-1',
        caseId: 'case-01',
        questionId: 'q-01-1',
        mysteryTitle: 'THE SHIFTING BOXES',
        concept: 'VARIABLES',
        predictedOptionId: 'C',
        predictedValue: '30',
        actualOutput: '20',
        confidence: 75,
        isCorrect: false,
        misconceptionName: 'Live Wire / Pointer Illusion',
        misconceptionDetail: 'Thought a=b created a permanent wire so changing b later altered a.',
        repaired: true,
        xpEarned: 250,
        timestamp: Date.now() - 86400000 * 2,
      },
      {
        id: 'seed-2',
        caseId: 'case-02',
        questionId: 'q-02-1',
        mysteryTitle: 'THE CASCADING IF MYSTERY',
        concept: 'CONDITIONS',
        predictedOptionId: 'C',
        predictedValue: '"gold"',
        actualOutput: 'gold',
        confidence: 100,
        isCorrect: true,
        repaired: true,
        xpEarned: 250,
        timestamp: Date.now() - 86400000,
      },
      {
        id: 'seed-3',
        caseId: 'case-03',
        questionId: 'q-03-1',
        mysteryTitle: 'THE LOOP MYSTERY',
        concept: 'LOOPS',
        predictedOptionId: 'C',
        predictedValue: '2',
        actualOutput: '3',
        confidence: 100,
        isCorrect: false,
        misconceptionName: 'Loop Iteration Misunderstanding',
        misconceptionDetail: 'Underestimated loop iterations thinking range(3) stops after 2 steps.',
        repaired: false,
        xpEarned: 50,
        timestamp: Date.now() - 3600000,
      },
    ];
  });

  const [activeCaseId, setActiveCaseId] = useState<string | null>('case-03');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>('q-03-1');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('code_detective_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('code_detective_investigations', JSON.stringify(investigations));
  }, [investigations]);

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sounds.playClick();
  };

  const addXp = (amount: number) => {
    setUserProfile((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newNext = prev.nextLevelXp;
      let newRank = prev.rankTitle;

      while (newXp >= newNext) {
        newLevel += 1;
        newNext = Math.round(newNext * 1.35);
        if (newLevel >= 5) newRank = 'Chief Code Detective';
        else if (newLevel >= 4) newRank = 'Logic Detective';
        else if (newLevel >= 3) newRank = 'Senior Investigator';
        else if (newLevel >= 2) newRank = 'Junior Sleuth';
        sounds.playLevelUp();
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        nextLevelXp: newNext,
        rankTitle: newRank,
        investigationPoints: prev.investigationPoints + Math.floor(amount / 5),
      };
    });
  };

  const recordInvestigation = (
    question: CaseQuestion,
    optionId: 'A' | 'B' | 'C' | 'D',
    confidence: ConfidenceLevel
  ) => {
    const isCorrect = optionId === question.correctOptionId;
    const selectedOption = question.options.find((o) => o.id === optionId);
    const misconception = !isCorrect ? question.misconceptions[optionId] : undefined;
    const xpAwarded = isCorrect ? 150 : 40;

    const record: InvestigationRecord = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      caseId: question.caseId,
      questionId: question.id,
      mysteryTitle: question.mysteryTitle,
      concept: question.concept,
      predictedOptionId: optionId,
      predictedValue: selectedOption?.value || '',
      actualOutput: question.actualOutput,
      confidence,
      isCorrect,
      misconceptionName: misconception?.name,
      misconceptionDetail: misconception?.explanation,
      repaired: isCorrect,
      xpEarned: xpAwarded,
      timestamp: Date.now(),
    };

    setInvestigations((prev) => [record, ...prev]);
    addXp(xpAwarded);

    if (isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playMisconceptionAlert();
    }

    return { isCorrect, misconception, xpAwarded };
  };

  const repairChallengeCompleted = (question: CaseQuestion, chosenOptionId: string): boolean => {
    const isSuccess = chosenOptionId === question.repairChallenge.correctOptionId;
    if (isSuccess) {
      sounds.playSuccess();
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#fbbf24', '#34d399', '#a855f7'],
        });
      } catch {}

      addXp(question.repairChallenge.bonusXp);

      // Mark matching investigation as repaired
      setInvestigations((prev) =>
        prev.map((inv) =>
          inv.questionId === question.id ? { ...inv, repaired: true } : inv
        )
      );

      // Unlock badge if defined
      if (question.repairChallenge.badgeToUnlock) {
        const badge = question.repairChallenge.badgeToUnlock;
        setUserProfile((prev) => {
          if (prev.badges.some((b) => b.id === badge.id)) return prev;
          return {
            ...prev,
            badges: [...prev.badges, { ...badge, unlockedAt: new Date().toLocaleDateString() }],
          };
        });
      }

      // Mark case completed & unlock next
      const currentCase = CASES_DATA.find((c) => c.id === question.caseId);
      if (currentCase) {
        setUserProfile((prev) => {
          const completed = Array.from(new Set([...prev.completedCases, currentCase.id]));
          const nextIndex = CASES_DATA.findIndex((c) => c.id === currentCase.id) + 1;
          const nextCase = CASES_DATA[nextIndex];
          const unlocked = nextCase
            ? Array.from(new Set([...prev.unlockedCases, nextCase.id]))
            : prev.unlockedCases;

          return {
            ...prev,
            completedCases: completed,
            unlockedCases: unlocked,
          };
        });
      }
    }
    return isSuccess;
  };

  const resetProgress = () => {
    setUserProfile({
      name: 'Alex Rivera',
      callsign: 'ByteSleuth',
      avatarSeed: 'robot-detective',
      level: 1,
      xp: 0,
      nextLevelXp: 300,
      rankTitle: 'Cadet Detective',
      streakDays: 1,
      investigationPoints: 10,
      unlockedCases: ['case-01'],
      completedCases: [],
      badges: [INITIAL_BADGES[0]],
    });
    setInvestigations([]);
    setActiveCaseId('case-01');
    setActiveQuestionId('q-01-1');
  };

  const loadSampleHackathonData = () => {
    setUserProfile({
      ...DEFAULT_PROFILE,
      level: 4,
      xp: 1240,
      nextLevelXp: 1500,
      rankTitle: 'Logic Detective',
      streakDays: 4,
      investigationPoints: 120,
      unlockedCases: ['case-01', 'case-02', 'case-03', 'case-04', 'case-05', 'case-06'],
      completedCases: ['case-01', 'case-02'],
      badges: INITIAL_BADGES.slice(0, 5),
    });
    setInvestigations([
      {
        id: 'seed-demo-1',
        caseId: 'case-01',
        questionId: 'q-01-1',
        mysteryTitle: 'THE SHIFTING BOXES',
        concept: 'VARIABLES',
        predictedOptionId: 'C',
        predictedValue: '30',
        actualOutput: '20',
        confidence: 75,
        isCorrect: false,
        misconceptionName: 'Live Wire / Pointer Illusion',
        misconceptionDetail: 'Thought a=b created a permanent wire so changing b later altered a.',
        repaired: true,
        xpEarned: 250,
        timestamp: Date.now() - 86400000 * 3,
      },
      {
        id: 'seed-demo-2',
        caseId: 'case-01',
        questionId: 'q-01-1',
        mysteryTitle: 'THE SHIFTING BOXES',
        concept: 'VARIABLES',
        predictedOptionId: 'B',
        predictedValue: '20',
        actualOutput: '20',
        confidence: 100,
        isCorrect: true,
        repaired: true,
        xpEarned: 150,
        timestamp: Date.now() - 86400000 * 2,
      },
      {
        id: 'seed-demo-3',
        caseId: 'case-02',
        questionId: 'q-02-1',
        mysteryTitle: 'THE CASCADING IF MYSTERY',
        concept: 'CONDITIONS',
        predictedOptionId: 'C',
        predictedValue: '"gold"',
        actualOutput: 'gold',
        confidence: 75,
        isCorrect: true,
        repaired: true,
        xpEarned: 150,
        timestamp: Date.now() - 86400000,
      },
      {
        id: 'seed-demo-4',
        caseId: 'case-03',
        questionId: 'q-03-1',
        mysteryTitle: 'THE LOOP MYSTERY',
        concept: 'LOOPS',
        predictedOptionId: 'C',
        predictedValue: '2',
        actualOutput: '3',
        confidence: 100,
        isCorrect: false,
        misconceptionName: 'Loop Iteration Misunderstanding',
        misconceptionDetail: 'Underestimated loop iterations thinking range(3) stops after 2 steps.',
        repaired: false,
        xpEarned: 40,
        timestamp: Date.now() - 1800000,
      },
      {
        id: 'seed-demo-5',
        caseId: 'case-04',
        questionId: 'q-04-1',
        mysteryTitle: 'THE MISSING RETURN MYSTERY',
        concept: 'FUNCTIONS',
        predictedOptionId: 'A',
        predictedValue: '10',
        actualOutput: 'None',
        confidence: 100,
        isCorrect: false,
        misconceptionName: 'Automatic Function Return Illusion',
        misconceptionDetail: 'Assumed Python automatically returns calculated values without return keyword.',
        repaired: false,
        xpEarned: 40,
        timestamp: Date.now() - 900000,
      },
      {
        id: 'seed-demo-6',
        caseId: 'case-05',
        questionId: 'q-05-1',
        mysteryTitle: 'THE INDEX 1 RIDDLE',
        concept: 'ARRAYS',
        predictedOptionId: 'B',
        predictedValue: '"badge"',
        actualOutput: 'badge',
        confidence: 50,
        isCorrect: true,
        repaired: true,
        xpEarned: 150,
        timestamp: Date.now() - 300000,
      },
    ]);
  };

  // Compute concept stats
  const allConcepts: ConceptCategory[] = [
    'VARIABLES',
    'CONDITIONS',
    'LOOPS',
    'FUNCTIONS',
    'ARRAYS',
    'RECURSION',
  ];

  const conceptStats = allConcepts.reduce((acc, concept) => {
    const records = investigations.filter((inv) => inv.concept === concept);
    const total = records.length;
    const correct = records.filter((r) => r.isCorrect).length;
    const incorrect = total - correct;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 75; // baseline

    let status: ConceptStat['status'] = 'Strong Understanding';
    if (total === 0) {
      status = 'Strong Understanding';
    } else if (percentage < 50) {
      status = 'Misconception Detected';
    } else if (percentage < 80) {
      status = 'Needs Investigation';
    }

    const lastIncorrect = records.find((r) => !r.isCorrect);

    acc[concept] = {
      concept,
      total,
      correct,
      incorrect,
      percentage,
      status,
      recurringMisconception: lastIncorrect?.misconceptionName,
    };
    return acc;
  }, {} as Record<ConceptCategory, ConceptStat>);

  // Compute confidence stats
  const confidenceLevels: ConfidenceLevel[] = [25, 50, 75, 100];
  const confidenceStats: ConfidenceStat[] = confidenceLevels.map((lvl) => {
    const matching = investigations.filter((inv) => inv.confidence === lvl);
    const total = matching.length;
    const correct = matching.filter((m) => m.isCorrect).length;
    const incorrect = total - correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      confidence: lvl,
      total,
      correct,
      incorrect,
      accuracy,
    };
  });

  // Cognitive Thinking Analyzer (Synthesizes user's mental models)
  const highConfidenceErrors = investigations.filter(
    (inv) => !inv.isCorrect && inv.confidence >= 75
  );

  let overconfidenceRating: 'Low' | 'Moderate' | 'High Alert' = 'Low';
  if (highConfidenceErrors.length >= 2) {
    overconfidenceRating = 'High Alert';
  } else if (highConfidenceErrors.length === 1) {
    overconfidenceRating = 'Moderate';
  }

  const blindspots: string[] = [];
  const strengths: string[] = [];

  if (conceptStats.LOOPS.status === 'Misconception Detected') {
    blindspots.push('You frequently underestimate how many times a loop executes in range(N).');
  }
  if (conceptStats.VARIABLES.status === 'Needs Investigation' || conceptStats.VARIABLES.incorrect > 0) {
    blindspots.push('You tend to picture variable assignment as a live tether rather than a one-time value copy.');
  }
  if (conceptStats.FUNCTIONS.status === 'Misconception Detected' || conceptStats.FUNCTIONS.incorrect > 0) {
    blindspots.push('You often assume functions implicitly return calculated values without explicit `return`.');
  }
  if (conceptStats.CONDITIONS.percentage >= 80) {
    strengths.push('Solid grasp of cascading condition execution and boolean truth tables.');
  }
  if (conceptStats.ARRAYS.correct > 0) {
    strengths.push('Good intuition navigating zero-based offset indexing in arrays.');
  }
  if (strengths.length === 0) {
    strengths.push('Keen willingness to make bold hypotheses and test code step-by-step.');
  }

  const thinkingAnalysis: ThinkingAnalysis = {
    summary:
      highConfidenceErrors.length > 0
        ? 'Interesting cognitive pattern detected: You tend to feel the most confident (75-100%) when encountering loop boundaries or implicit returns, suggesting deeply ingrained intuitive assumptions rather than carelessness.'
        : 'Your mental model calibration is healthy! Your high-confidence predictions align accurately with execution outputs.',
    blindspots: blindspots.length > 0 ? blindspots : ['Keep investigating cases to expose subtle edge-case traps!'],
    strengths,
    recommendation:
      highConfidenceErrors.length > 0
        ? 'Anchor your mental model before running code: trace loop iterations with finger tallies starting from 0, and always double-check if a function ends with an explicit `return` keyword.'
        : 'Continue to advanced cases (Recursion & References) to stress-test your stack execution mental models!',
    overconfidenceRating,
  };

  return (
    <DetectiveContext.Provider
      value={{
        userProfile,
        investigations,
        activeCaseId,
        setActiveCaseId,
        activeQuestionId,
        setActiveQuestionId,
        soundEnabled,
        toggleSound,
        recordInvestigation,
        repairChallengeCompleted,
        conceptStats,
        confidenceStats,
        thinkingAnalysis,
        resetProgress,
        loadSampleHackathonData,
      }}
    >
      {children}
    </DetectiveContext.Provider>
  );
};

export const useDetective = () => {
  const ctx = useContext(DetectiveContext);
  if (!ctx) {
    throw new Error('useDetective must be used within a DetectiveProvider');
  }
  return ctx;
};
