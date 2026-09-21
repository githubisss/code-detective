/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ConceptCategory =
  | 'VARIABLES'
  | 'CONDITIONS'
  | 'LOOPS'
  | 'FUNCTIONS'
  | 'ARRAYS'
  | 'RECURSION'
  | 'SCOPE'
  | 'REFERENCES';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ConfidenceLevel = 25 | 50 | 75 | 100;

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  value: string;
  isCorrect: boolean;
}

export interface ExecutionStep {
  stepNumber: number;
  lineIndex: number; // 1-indexed line in the code snippet
  codeSnippet: string;
  explanation: string;
  variables: Record<string, string | number | boolean | (string | number)[]>;
  callStack?: string[];
  outputSoFar?: string;
}

export interface MisconceptionDetail {
  name: string;
  tagline: string;
  explanation: string;
  friendlyClue: string;
  mentalModelRemedy: string;
}

export interface RepairChallenge {
  id: string;
  title: string;
  instruction: string;
  code: string;
  questionText: string;
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  bonusXp: number;
  badgeToUnlock?: Badge;
}

export interface CaseQuestion {
  id: string;
  caseId: string;
  mysteryTitle: string;
  narrativeClue: string;
  concept: ConceptCategory;
  language: string;
  code: string;
  questionText: string;
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  actualOutput: string;
  executionSteps: ExecutionStep[];
  misconceptions: Record<string, MisconceptionDetail>; // key is option id (A, B, C, D)
  repairChallenge: RepairChallenge;
}

export interface CaseFile {
  id: string;
  number: number;
  caseCode: string; // e.g. "CASE 01"
  title: string;
  concept: ConceptCategory;
  difficulty: Difficulty;
  xpReward: number;
  shortDescription: string;
  longDescription: string;
  questions: CaseQuestion[];
  isLockedDefault: boolean;
  requiredPrevCaseId?: string;
}

export interface Badge {
  id: string;
  title: string;
  category: ConceptCategory | 'GENERAL';
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: string;
}

export interface InvestigationRecord {
  id: string;
  caseId: string;
  questionId: string;
  mysteryTitle: string;
  concept: ConceptCategory;
  predictedOptionId: string;
  predictedValue: string;
  actualOutput: string;
  confidence: ConfidenceLevel;
  isCorrect: boolean;
  misconceptionName?: string;
  misconceptionDetail?: string;
  repaired: boolean;
  xpEarned: number;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  callsign: string;
  avatarSeed: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  rankTitle: string;
  streakDays: number;
  investigationPoints: number;
  unlockedCases: string[];
  completedCases: string[];
  badges: Badge[];
}

export type ActiveTab =
  | 'home'
  | 'cases'
  | 'radar'
  | 'confidence'
  | 'practice'
  | 'achievements'
  | 'profile';
