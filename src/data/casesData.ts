/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaseFile, Badge } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-clue',
    title: 'First Clue Found',
    category: 'GENERAL',
    description: 'Began your very first Code Detective investigation.',
    icon: '🔍',
    rarity: 'Common',
    unlockedAt: new Date().toLocaleDateString(),
  },
  {
    id: 'badge-variable-detective',
    title: 'Variable Sleuth',
    category: 'VARIABLES',
    description: 'Mastered the illusion of variable assignment and memory box values.',
    icon: '📦',
    rarity: 'Common',
  },
  {
    id: 'badge-condition-crusher',
    title: 'Logic Inspector',
    category: 'CONDITIONS',
    description: 'Untangled branching paths and conditional truth values.',
    icon: '⚖️',
    rarity: 'Rare',
  },
  {
    id: 'badge-loop-hunter',
    title: 'Loop Hunter',
    category: 'LOOPS',
    description: 'Repaired the loop iteration misunderstanding.',
    icon: '🔁',
    rarity: 'Rare',
  },
  {
    id: 'badge-function-finder',
    title: 'Function Finder',
    category: 'FUNCTIONS',
    description: 'Uncovered the difference between returning values and printing.',
    icon: '⚙️',
    rarity: 'Rare',
  },
  {
    id: 'badge-array-sleuth',
    title: 'Index Decipherer',
    category: 'ARRAYS',
    description: 'Conquered zero-based indexing and list boundary traps.',
    icon: '📑',
    rarity: 'Epic',
  },
  {
    id: 'badge-recursion-decoder',
    title: 'Stack Master',
    category: 'RECURSION',
    description: 'Solved the recursive mirror chamber and call stack unwinding.',
    icon: '🪞',
    rarity: 'Legendary',
  },
  {
    id: 'badge-confidence-master',
    title: 'Mental Model Master',
    category: 'GENERAL',
    description: 'Maintained 100% confidence with flawless deductions.',
    icon: '🧠',
    rarity: 'Epic',
  },
  {
    id: 'badge-bug-buster',
    title: 'Bug Buster',
    category: 'GENERAL',
    description: 'Successfully completed 3 mental model repair challenges.',
    icon: '🏅',
    rarity: 'Common',
  }
];

export const CASES_DATA: CaseFile[] = [
  {
    id: 'case-01',
    number: 1,
    caseCode: 'CASE 01',
    title: 'The Vanishing Assignment',
    concept: 'VARIABLES',
    difficulty: 'Beginner',
    xpReward: 200,
    shortDescription: 'Variables hold values, not wires or live links. Inspect how values transfer.',
    longDescription:
      'A suspect claims that when variable B changes later in the program, variable A automatically updates with it like a live broadcast. Can you uncover what actually gets stored in memory?',
    isLockedDefault: false,
    questions: [
      {
        id: 'q-01-1',
        caseId: 'case-01',
        mysteryTitle: 'THE SHIFTING BOXES',
        narrativeClue: 'Inspector Byte discovered two storage lockers labeled `a` and `b`. Look at how the contents are copied:',
        concept: 'VARIABLES',
        language: 'python',
        code: `a = 10
b = 20
a = b
b = 30

print(a)`,
        questionText: 'What do YOU think will be printed?',
        options: [
          { id: 'A', label: '10', value: '10', isCorrect: false },
          { id: 'B', label: '20', value: '20', isCorrect: true },
          { id: 'C', label: '30', value: '30', isCorrect: false },
          { id: 'D', label: '50', value: '50', isCorrect: false },
        ],
        correctOptionId: 'B',
        actualOutput: '20',
        executionSteps: [
          {
            stepNumber: 1,
            lineIndex: 1,
            codeSnippet: 'a = 10',
            explanation: 'Memory creates variable `a` and puts the integer value 10 inside the box.',
            variables: { a: 10 },
            outputSoFar: '',
          },
          {
            stepNumber: 2,
            lineIndex: 2,
            codeSnippet: 'b = 20',
            explanation: 'Memory creates variable `b` and stores the integer value 20.',
            variables: { a: 10, b: 20 },
            outputSoFar: '',
          },
          {
            stepNumber: 3,
            lineIndex: 3,
            codeSnippet: 'a = b',
            explanation: 'The current value of `b` (20) is copied into `a`. It does NOT form a permanent wire!',
            variables: { a: 20, b: 20 },
            outputSoFar: '',
          },
          {
            stepNumber: 4,
            lineIndex: 4,
            codeSnippet: 'b = 30',
            explanation: 'Variable `b` is assigned a new number (30). Variable `a` remains 20 untouched.',
            variables: { a: 20, b: 30 },
            outputSoFar: '',
          },
          {
            stepNumber: 5,
            lineIndex: 6,
            codeSnippet: 'print(a)',
            explanation: 'Outputs the current value stored in `a`, which is 20.',
            variables: { a: 20, b: 30 },
            outputSoFar: '20',
          },
        ],
        misconceptions: {
          A: {
            name: 'Original Value Persistence Bias',
            tagline: 'Thinking variables resist reassignment',
            explanation:
              'You predicted 10! You might be feeling like once a variable is assigned (a = 10), it holds its original identity forever.',
            friendlyClue: 'Variables in Python are like whiteboards: any new assignment completely erases whatever was written before!',
            mentalModelRemedy: 'Remember: In `a = b`, the right side evaluates to 20, replacing `a`’s old 10 immediately.',
          },
          C: {
            name: 'Live Wire / Pointer Illusion',
            tagline: 'Thinking `a = b` connects them like an electrical wire',
            explanation:
              'You predicted 30! This is one of the most common beginner traps: thinking `a = b` creates a permanent tether where updating `b` later automatically changes `a`.',
            friendlyClue: 'Almost! You found a crucial clue. Variables hold values, not live links.',
            mentalModelRemedy: 'Assignment copies the current snapshot of the value. Once copied, `a` and `b` live independent lives.',
          },
          D: {
            name: 'Arithmetic Blend Confusion',
            tagline: 'Interpreting assignment as addition',
            explanation: 'You predicted 50, which is 20 + 30. The equals sign `=` only copies values, never sums them unless there is a `+`.',
            friendlyClue: 'Good detective work on the math, but `=` is purely an assignment arrow in Python!',
            mentalModelRemedy: 'Read `=` as "gets the value of", not "add with".',
          },
        },
        repairChallenge: {
          id: 'rep-01-1',
          title: 'FIX THE BUG IN YOUR THINKING',
          instruction: 'Test your new mental model: variables are independent boxes!',
          code: `x = 5
y = x
x = 12

print(y)`,
          questionText: 'What will happen now?',
          options: [
            { id: 'A', label: '5', value: '5', isCorrect: true },
            { id: 'B', label: '12', value: '12', isCorrect: false },
            { id: 'C', label: '17', value: '17', isCorrect: false },
            { id: 'D', label: 'None', value: 'None', isCorrect: false },
          ],
          correctOptionId: 'A',
          explanation: 'Brilliant deduction! When `y = x` executed, x was 5. Changing `x` to 12 later does not touch `y`!',
          bonusXp: 50,
          badgeToUnlock: {
            id: 'badge-variable-detective',
            title: 'Variable Sleuth',
            category: 'VARIABLES',
            description: 'Mastered the illusion of variable assignment and memory box values.',
            icon: '📦',
            rarity: 'Common',
          },
        },
      },
    ],
  },
  {
    id: 'case-02',
    number: 2,
    caseCode: 'CASE 02',
    title: 'The Double-Agent Condition',
    concept: 'CONDITIONS',
    difficulty: 'Beginner',
    xpReward: 250,
    shortDescription: 'Multiple standalone `if` statements vs `elif` branches. Which branch actually claims victory?',
    longDescription:
      'In a high-stakes arcade scoring system, players are awarded badges based on their score. But multiple `if` statements are running in sequence. Who gets the final word?',
    isLockedDefault: false,
    requiredPrevCaseId: 'case-01',
    questions: [
      {
        id: 'q-02-1',
        caseId: 'case-02',
        mysteryTitle: 'THE CASCADING IF MYSTERY',
        narrativeClue: 'Check this scoring kiosk logic. Notice there are NO `elif`s here — only standalone `if` gates:',
        concept: 'CONDITIONS',
        language: 'python',
        code: `score = 85
badge = "bronze"

if score > 50:
    badge = "silver"
if score > 80:
    badge = "gold"
if score > 90:
    badge = "diamond"

print(badge)`,
        questionText: 'What do YOU think will be printed?',
        options: [
          { id: 'A', label: '"bronze"', value: '"bronze"', isCorrect: false },
          { id: 'B', label: '"silver"', value: '"silver"', isCorrect: false },
          { id: 'C', label: '"gold"', value: '"gold"', isCorrect: true },
          { id: 'D', label: '"diamond"', value: '"diamond"', isCorrect: false },
        ],
        correctOptionId: 'C',
        actualOutput: 'gold',
        executionSteps: [
          {
            stepNumber: 1,
            lineIndex: 1,
            codeSnippet: 'score = 85',
            explanation: 'Player score is initialized to 85.',
            variables: { score: 85 },
            outputSoFar: '',
          },
          {
            stepNumber: 2,
            lineIndex: 2,
            codeSnippet: 'badge = "bronze"',
            explanation: 'Default badge is set to "bronze".',
            variables: { score: 85, badge: 'bronze' },
            outputSoFar: '',
          },
          {
            stepNumber: 3,
            lineIndex: 4,
            codeSnippet: 'if score > 50:',
            explanation: 'Is 85 > 50? True! The code enters this block and sets badge = "silver".',
            variables: { score: 85, badge: 'silver' },
            outputSoFar: '',
          },
          {
            stepNumber: 4,
            lineIndex: 6,
            codeSnippet: 'if score > 80:',
            explanation: 'Is 85 > 80? Also True! Standalone `if` statements always check. Badge is overwritten to "gold"!',
            variables: { score: 85, badge: 'gold' },
            outputSoFar: '',
          },
          {
            stepNumber: 5,
            lineIndex: 8,
            codeSnippet: 'if score > 90:',
            explanation: 'Is 85 > 90? False! This block is skipped. Badge remains "gold".',
            variables: { score: 85, badge: 'gold' },
            outputSoFar: '',
          },
          {
            stepNumber: 6,
            lineIndex: 11,
            codeSnippet: 'print(badge)',
            explanation: 'Outputs the final value in badge: "gold".',
            variables: { score: 85, badge: 'gold' },
            outputSoFar: 'gold',
          },
        ],
        misconceptions: {
          B: {
            name: 'First-Match Lockout Misconception',
            tagline: 'Thinking the first true `if` statement halts checking',
            explanation:
              'You predicted "silver"! You thought that once `score > 50` was satisfied, the program stopped checking other conditions like an `if-elif-else` chain does.',
            friendlyClue: 'Notice that every line says `if`, not `elif`! Each `if` is an independent guard.',
            mentalModelRemedy: 'Unless wrapped in `elif`, every `if` executes sequentially and can overwrite previous values.',
          },
          A: {
            name: 'Initial State Persistence',
            tagline: 'Ignoring condition evaluations altogether',
            explanation: 'You predicted "bronze". But since 85 is greater than 50 and 80, the variable was updated multiple times.',
            friendlyClue: 'Look closely at the comparisons: 85 is greater than 50!',
            mentalModelRemedy: 'Follow the execution down through every guard: conditions execute line by line.',
          },
          D: {
            name: 'Greedy Expectation Error',
            tagline: 'Assuming 85 passes the highest threshold of 90',
            explanation: 'You predicted "diamond", but 85 is not strictly greater than 90.',
            friendlyClue: 'Close! But 85 > 90 evaluates to False.',
            mentalModelRemedy: 'Double check the numbers: 85 is less than 90, so line 9 never runs.',
          },
        },
        repairChallenge: {
          id: 'rep-02-1',
          title: 'FIX THE BUG IN YOUR THINKING',
          instruction: 'Identify how independent `if` statements cascade:',
          code: `level = 2
title = "Rookie"

if level >= 1:
    title = "Explorer"
if level >= 3:
    title = "Master"

print(title)`,
          questionText: 'What will be printed?',
          options: [
            { id: 'A', label: '"Rookie"', value: '"Rookie"', isCorrect: false },
            { id: 'B', label: '"Explorer"', value: '"Explorer"', isCorrect: true },
            { id: 'C', label: '"Master"', value: '"Master"', isCorrect: false },
            { id: 'D', label: 'Error', value: 'Error', isCorrect: false },
          ],
          correctOptionId: 'B',
          explanation: 'Spot on! Level 2 is >= 1 (becoming Explorer), but NOT >= 3, so Explorer stays!',
          bonusXp: 50,
          badgeToUnlock: {
            id: 'badge-condition-crusher',
            title: 'Logic Inspector',
            category: 'CONDITIONS',
            description: 'Untangled branching paths and conditional truth values.',
            icon: '⚖️',
            rarity: 'Rare',
          },
        },
      },
    ],
  },
  {
    id: 'case-03',
    number: 3,
    caseCode: 'CASE 03',
    title: 'The Loop Mystery',
    concept: 'LOOPS',
    difficulty: 'Intermediate',
    xpReward: 300,
    shortDescription: 'How many times does `range(3)` really run? Uncover loop iterations and counter updates.',
    longDescription:
      'The classic riddle that trips up millions of new coders: How many times does a loop run when given `range(3)`? Does it stop at 2, or run 3 times?',
    isLockedDefault: false,
    requiredPrevCaseId: 'case-02',
    questions: [
      {
        id: 'q-03-1',
        caseId: 'case-03',
        mysteryTitle: 'THE LOOP MYSTERY',
        narrativeClue: 'A counter is tracking footsteps in the crime scene. Watch the accumulator closely:',
        concept: 'LOOPS',
        language: 'python',
        code: `x = 0

for i in range(3):
    x = x + 1

print(x)`,
        questionText: 'What do YOU think will be printed?',
        options: [
          { id: 'A', label: '0', value: '0', isCorrect: false },
          { id: 'B', label: '1', value: '1', isCorrect: false },
          { id: 'C', label: '2', value: '2', isCorrect: false },
          { id: 'D', label: '3', value: '3', isCorrect: true },
        ],
        correctOptionId: 'D',
        actualOutput: '3',
        executionSteps: [
          {
            stepNumber: 1,
            lineIndex: 1,
            codeSnippet: 'x = 0',
            explanation: 'Initialize variable `x` to 0.',
            variables: { x: 0 },
            outputSoFar: '',
          },
          {
            stepNumber: 2,
            lineIndex: 3,
            codeSnippet: 'for i in range(3): (i = 0)',
            explanation: 'Loop begins iteration 1. `i` takes the first value: 0.',
            variables: { x: 0, i: 0 },
            outputSoFar: '',
          },
          {
            stepNumber: 3,
            lineIndex: 4,
            codeSnippet: 'x = x + 1',
            explanation: 'x increases from 0 to 1.',
            variables: { x: 1, i: 0 },
            outputSoFar: '',
          },
          {
            stepNumber: 4,
            lineIndex: 3,
            codeSnippet: 'for i in range(3): (i = 1)',
            explanation: 'Loop begins iteration 2. `i` takes the second value: 1.',
            variables: { x: 1, i: 1 },
            outputSoFar: '',
          },
          {
            stepNumber: 5,
            lineIndex: 4,
            codeSnippet: 'x = x + 1',
            explanation: 'x increases from 1 to 2.',
            variables: { x: 2, i: 1 },
            outputSoFar: '',
          },
          {
            stepNumber: 6,
            lineIndex: 3,
            codeSnippet: 'for i in range(3): (i = 2)',
            explanation: 'Loop begins iteration 3. `i` takes the third value: 2.',
            variables: { x: 2, i: 2 },
            outputSoFar: '',
          },
          {
            stepNumber: 7,
            lineIndex: 4,
            codeSnippet: 'x = x + 1',
            explanation: 'x increases from 2 to 3.',
            variables: { x: 3, i: 2 },
            outputSoFar: '',
          },
          {
            stepNumber: 8,
            lineIndex: 6,
            codeSnippet: 'print(x)',
            explanation: 'Loop has finished! Total value printed is 3.',
            variables: { x: 3, i: 2 },
            outputSoFar: '3',
          },
        ],
        misconceptions: {
          C: {
            name: 'Loop Iteration Misunderstanding',
            tagline: 'Underestimating how many times a loop executes',
            explanation:
              'You predicted 2! Your answer suggests you noticed `i` stops at 2 (since range(3) produces 0, 1, 2) and concluded that the loop only executed 2 times.',
            friendlyClue: 'Almost! You found a clue. Counting from 0: [0, 1, 2] is three distinct iterations!',
            mentalModelRemedy: 'Range(N) always iterates exactly N times: 0 (first), 1 (second), 2 (third)!',
          },
          B: {
            name: 'Single-Pass Blindspot',
            tagline: 'Believing the loop body only runs once',
            explanation: 'You predicted 1! You may have treated the loop as a single conditional statement rather than repeating.',
            friendlyClue: 'A `for` loop repeats its indented block for every single element in the sequence!',
            mentalModelRemedy: 'Picture the computer circling back to the top of the loop for each number in range(3).',
          },
          A: {
            name: 'Scope / Mutation Skepticism',
            tagline: 'Thinking variables outside loops cannot be modified inside',
            explanation: 'You predicted 0! You may have assumed `x` was protected or shielded from the loop’s changes.',
            friendlyClue: 'Variables declared outside a loop are directly modified whenever the loop body runs.',
            mentalModelRemedy: 'The variable `x` is the exact same storage box inside and outside the loop.',
          },
        },
        repairChallenge: {
          id: 'rep-03-1',
          title: 'FIX THE BUG IN YOUR THINKING',
          instruction: 'Verify your refreshed iteration mental model:',
          code: `x = 0

for i in range(4):
    x += 1

print(x)`,
          questionText: 'What will happen now?',
          options: [
            { id: 'A', label: '3', value: '3', isCorrect: false },
            { id: 'B', label: '4', value: '4', isCorrect: true },
            { id: 'C', label: '5', value: '5', isCorrect: false },
            { id: 'D', label: '0', value: '0', isCorrect: false },
          ],
          correctOptionId: 'B',
          explanation: 'Fantastic work Detective! `range(4)` generates 0, 1, 2, 3 — exactly 4 iterations, so `x` ends at 4.',
          bonusXp: 50,
          badgeToUnlock: {
            id: 'badge-loop-hunter',
            title: 'Loop Hunter',
            category: 'LOOPS',
            description: 'Repaired the loop iteration misunderstanding.',
            icon: '🔁',
            rarity: 'Rare',
          },
        },
      },
    ],
  },
  {
    id: 'case-04',
    number: 4,
    caseCode: 'CASE 04',
    title: 'The Ghost Return',
    concept: 'FUNCTIONS',
    difficulty: 'Intermediate',
    xpReward: 350,
    shortDescription: 'The difference between calculating a value and returning it back to the caller.',
    longDescription:
      'A mysterious calculator function processed the secret code, but when the detective checked the mailbox, nothing arrived. What happened to the result?',
    isLockedDefault: false,
    requiredPrevCaseId: 'case-03',
    questions: [
      {
        id: 'q-04-1',
        caseId: 'case-04',
        mysteryTitle: 'THE MISSING RETURN MYSTERY',
        narrativeClue: 'Look inside this function. It multiplies `num * 2`, but something is missing:',
        concept: 'FUNCTIONS',
        language: 'python',
        code: `def double_val(num):
    result = num * 2

total = double_val(5)
print(total)`,
        questionText: 'What do YOU think will be printed?',
        options: [
          { id: 'A', label: '10', value: '10', isCorrect: false },
          { id: 'B', label: 'None', value: 'None', isCorrect: true },
          { id: 'C', label: '"num * 2"', value: '"num * 2"', isCorrect: false },
          { id: 'D', label: 'Error', value: 'Error', isCorrect: false },
        ],
        correctOptionId: 'B',
        actualOutput: 'None',
        executionSteps: [
          {
            stepNumber: 1,
            lineIndex: 1,
            codeSnippet: 'def double_val(num):',
            explanation: 'Python registers the function `double_val` into memory.',
            variables: {},
            outputSoFar: '',
          },
          {
            stepNumber: 2,
            lineIndex: 4,
            codeSnippet: 'total = double_val(5)',
            explanation: 'Calls `double_val` with argument 5. Execution jumps inside.',
            variables: { num: 5 },
            callStack: ['main', 'double_val(num=5)'],
            outputSoFar: '',
          },
          {
            stepNumber: 3,
            lineIndex: 2,
            codeSnippet: 'result = num * 2',
            explanation: 'Inside the function, local variable `result` becomes 10. But there is NO `return` statement!',
            variables: { num: 5, result: 10 },
            callStack: ['main', 'double_val(num=5)'],
            outputSoFar: '',
          },
          {
            stepNumber: 4,
            lineIndex: 4,
            codeSnippet: 'total = double_val(5) (Returned)',
            explanation: 'Function finishes without a `return` keyword. In Python, it implicitly returns `None`!',
            variables: { total: 'None' },
            callStack: ['main'],
            outputSoFar: '',
          },
          {
            stepNumber: 5,
            lineIndex: 5,
            codeSnippet: 'print(total)',
            explanation: 'Outputs the value stored in `total`: None.',
            variables: { total: 'None' },
            outputSoFar: 'None',
          },
        ],
        misconceptions: {
          A: {
            name: 'Automatic Function Return Illusion',
            tagline: 'Assuming functions automatically hand back whatever they compute',
            explanation:
              'You predicted 10! In some languages or in human intuition, calculating `result = num * 2` feels like it should be the output of the function.',
            friendlyClue: 'In Python, if you do not explicitly use the `return` keyword, the function gives back `None`!',
            mentalModelRemedy: 'A function is like a room with a door: unless you write `return result`, the result stays locked inside the room.',
          },
          D: {
            name: 'Syntax Crash Assumption',
            tagline: 'Thinking omitting return causes a fatal error',
            explanation: 'You predicted an Error! Python does not crash when return is omitted; it silently returns None.',
            friendlyClue: 'Python is permissive here: non-returning functions are totally legal!',
            mentalModelRemedy: 'No error occurs — Python quietly wraps the exit with `None`.',
          },
          C: {
            name: 'Literal Expression Leak',
            tagline: 'Expecting the raw math expression to stringify',
            explanation: 'Python computes arithmetic into numeric values, not verbatim strings.',
            friendlyClue: 'Expressions evaluate immediately to values.',
            mentalModelRemedy: 'Computers calculate values before doing anything else.',
          },
        },
        repairChallenge: {
          id: 'rep-04-1',
          title: 'FIX THE BUG IN YOUR THINKING',
          instruction: 'Now observe what happens when `return` is explicitly provided:',
          code: `def add_ten(n):
    return n + 10

score = add_ten(5)
print(score)`,
          questionText: 'What will happen now?',
          options: [
            { id: 'A', label: 'None', value: 'None', isCorrect: false },
            { id: 'B', label: '15', value: '15', isCorrect: true },
            { id: 'C', label: '5', value: '5', isCorrect: false },
            { id: 'D', label: '10', value: '10', isCorrect: false },
          ],
          correctOptionId: 'B',
          explanation: 'Detective victory! Because `return n + 10` was written, 15 is passed right into `score`!',
          bonusXp: 50,
          badgeToUnlock: {
            id: 'badge-function-finder',
            title: 'Function Finder',
            category: 'FUNCTIONS',
            description: 'Uncovered the difference between returning values and printing.',
            icon: '⚙️',
            rarity: 'Rare',
          },
        },
      },
    ],
  },
  {
    id: 'case-05',
    number: 5,
    caseCode: 'CASE 05',
    title: 'The Off-by-One Trap',
    concept: 'ARRAYS',
    difficulty: 'Intermediate',
    xpReward: 350,
    shortDescription: 'Zero-based indexing vs human counting. Which element does index 1 retrieve?',
    longDescription:
      'A roster of suspects is stored in a Python list. When the patrol asks for suspect at index `1`, who walks out of the lineup?',
    isLockedDefault: false,
    requiredPrevCaseId: 'case-04',
    questions: [
      {
        id: 'q-05-1',
        caseId: 'case-05',
        mysteryTitle: 'THE INDEX 1 RIDDLE',
        narrativeClue: 'Look at this list of clue items. Beware of human numbering vs computer indexing:',
        concept: 'ARRAYS',
        language: 'python',
        code: `items = ["magnifier", "badge", "footprint"]

print(items[1])`,
        questionText: 'What do YOU think will be printed?',
        options: [
          { id: 'A', label: '"magnifier"', value: '"magnifier"', isCorrect: false },
          { id: 'B', label: '"badge"', value: '"badge"', isCorrect: true },
          { id: 'C', label: '"footprint"', value: '"footprint"', isCorrect: false },
          { id: 'D', label: 'IndexError', value: 'IndexError', isCorrect: false },
        ],
        correctOptionId: 'B',
        actualOutput: 'badge',
        executionSteps: [
          {
            stepNumber: 1,
            lineIndex: 1,
            codeSnippet: 'items = ["magnifier", "badge", "footprint"]',
            explanation: 'Array allocated in memory. Slot 0: "magnifier", Slot 1: "badge", Slot 2: "footprint".',
            variables: { 'items[0]': '"magnifier"', 'items[1]': '"badge"', 'items[2]': '"footprint"' },
            outputSoFar: '',
          },
          {
            stepNumber: 2,
            lineIndex: 3,
            codeSnippet: 'print(items[1])',
            explanation: 'Accessing index 1 fetches the second item in the zero-indexed list: "badge".',
            variables: { 'items[1]': '"badge"' },
            outputSoFar: 'badge',
          },
        ],
        misconceptions: {
          A: {
            name: '1-Based Natural Counting Bias',
            tagline: 'Assuming the 1st position has index 1',
            explanation:
              'You predicted "magnifier"! In normal human speech, "item 1" means the very first item. But in programming, lists count offsets starting from zero.',
            friendlyClue: 'Almost! You found a classic clue. Index 0 is the starting offset.',
            mentalModelRemedy: 'Think of indices as distance from the beginning: the 1st item is 0 steps away, so index 0 = "magnifier"!',
          },
          C: {
            name: 'Last-Item Confusion',
            tagline: 'Thinking index 1 is the tail',
            explanation: 'You predicted "footprint". In Python, the last item is retrieved using -1 or index (len - 1), which is index 2 here.',
            friendlyClue: 'Index 2 would be the last item in a 3-element list.',
            mentalModelRemedy: 'Remember: 0 is first, 1 is middle, 2 is last!',
          },
          D: {
            name: 'Bounds Paranoia',
            tagline: 'Thinking 1 is out of range',
            explanation: 'There are 3 items, so indices 0, 1, and 2 are all safe and valid.',
            friendlyClue: 'Indices 0, 1, and 2 are fully valid in this 3-item list.',
            mentalModelRemedy: 'Lists with length 3 accommodate indices 0 up to 2.',
          },
        },
        repairChallenge: {
          id: 'rep-05-1',
          title: 'FIX THE BUG IN YOUR THINKING',
          instruction: 'Retrieve the first item using zero-based indexing:',
          code: `clues = ["secret_map", "keycard", "decoder"]

print(clues[0])`,
          questionText: 'What will be printed?',
          options: [
            { id: 'A', label: '"secret_map"', value: '"secret_map"', isCorrect: true },
            { id: 'B', label: '"keycard"', value: '"keycard"', isCorrect: false },
            { id: 'C', label: '"decoder"', value: '"decoder"', isCorrect: false },
            { id: 'D', label: 'None', value: 'None', isCorrect: false },
          ],
          correctOptionId: 'A',
          explanation: 'Index Decipherer! Zero points directly to the 1st item: "secret_map"!',
          bonusXp: 50,
          badgeToUnlock: {
            id: 'badge-array-sleuth',
            title: 'Index Decipherer',
            category: 'ARRAYS',
            description: 'Conquered zero-based indexing and list boundary traps.',
            icon: '📑',
            rarity: 'Epic',
          },
        },
      },
    ],
  },
  {
    id: 'case-06',
    number: 6,
    caseCode: 'CASE 06',
    title: 'The Mirror Chamber',
    concept: 'RECURSION',
    difficulty: 'Advanced',
    xpReward: 500,
    shortDescription: 'Base cases and the call stack. Watch how values return in reverse order as the stack unwinds.',
    longDescription:
      'A recursive function dives deeper and deeper until it hits a base case. Does the base case erase the accumulated work, or does it pass the torch back up the stairs?',
    isLockedDefault: false,
    requiredPrevCaseId: 'case-05',
    questions: [
      {
        id: 'q-06-1',
        caseId: 'case-06',
        mysteryTitle: 'THE RECURSIVE ECHO',
        narrativeClue: 'Trace the stack frames as countdown(3) executes. Notice the return addition:',
        concept: 'RECURSION',
        language: 'python',
        code: `def countdown(n):
    if n == 0:
        return 0
    return n + countdown(n - 1)

print(countdown(3))`,
        questionText: 'What do YOU think will be printed?',
        options: [
          { id: 'A', label: '3', value: '3', isCorrect: false },
          { id: 'B', label: '6', value: '6', isCorrect: true },
          { id: 'C', label: '0', value: '0', isCorrect: false },
          { id: 'D', label: 'Infinite Loop', value: 'Infinite Loop', isCorrect: false },
        ],
        correctOptionId: 'B',
        actualOutput: '6',
        executionSteps: [
          {
            stepNumber: 1,
            lineIndex: 6,
            codeSnippet: 'countdown(3)',
            explanation: 'Frame 1: countdown(3) enters. n=3 is not 0, so it computes 3 + countdown(2).',
            variables: { n: 3 },
            callStack: ['countdown(3) [waiting for countdown(2)]'],
            outputSoFar: '',
          },
          {
            stepNumber: 2,
            lineIndex: 4,
            codeSnippet: 'countdown(2)',
            explanation: 'Frame 2: countdown(2) enters. n=2 is not 0, computes 2 + countdown(1).',
            variables: { n: 2 },
            callStack: ['countdown(3)', 'countdown(2) [waiting for countdown(1)]'],
            outputSoFar: '',
          },
          {
            stepNumber: 3,
            lineIndex: 4,
            codeSnippet: 'countdown(1)',
            explanation: 'Frame 3: countdown(1) enters. n=1 is not 0, computes 1 + countdown(0).',
            variables: { n: 1 },
            callStack: ['countdown(3)', 'countdown(2)', 'countdown(1) [waiting for countdown(0)]'],
            outputSoFar: '',
          },
          {
            stepNumber: 4,
            lineIndex: 2,
            codeSnippet: 'if n == 0: return 0 (Base Case Hit!)',
            explanation: 'Frame 4: countdown(0) enters. Base case met! It immediately returns 0.',
            variables: { n: 0, returning: 0 },
            callStack: ['countdown(3)', 'countdown(2)', 'countdown(1)', 'countdown(0) -> returns 0'],
            outputSoFar: '',
          },
          {
            stepNumber: 5,
            lineIndex: 4,
            codeSnippet: 'Unwinding Frame 3: 1 + 0 = 1',
            explanation: 'countdown(1) receives 0, computes 1 + 0 = 1, returns 1 up the stack.',
            variables: { returnedToFrame2: 1 },
            callStack: ['countdown(3)', 'countdown(2) -> gets 1'],
            outputSoFar: '',
          },
          {
            stepNumber: 6,
            lineIndex: 4,
            codeSnippet: 'Unwinding Frame 2: 2 + 1 = 3',
            explanation: 'countdown(2) receives 1, computes 2 + 1 = 3, returns 3 up to Frame 1.',
            variables: { returnedToFrame1: 3 },
            callStack: ['countdown(3) -> gets 3'],
            outputSoFar: '',
          },
          {
            stepNumber: 7,
            lineIndex: 4,
            codeSnippet: 'Unwinding Frame 1: 3 + 3 = 6',
            explanation: 'countdown(3) receives 3, computes 3 + 3 = 6, and delivers the final answer!',
            variables: { finalResult: 6 },
            callStack: ['main'],
            outputSoFar: '6',
          },
        ],
        misconceptions: {
          C: {
            name: 'Base Case Obliteration Fallacy',
            tagline: 'Thinking the base case return overwrites all previous stack frames',
            explanation:
              'You predicted 0! A very common intuition is that when `return 0` executes at the bottom, it "resets" or overrides the entire function output to 0.',
            friendlyClue: 'The base case only answers the bottom call! Each waiting call on the stack resumes and adds its own number.',
            mentalModelRemedy: 'Think of recursion like peeling an onion: you dive in to the center (0), then work back out layer by layer: 0 + 1 + 2 + 3 = 6!',
          },
          A: {
            name: 'Shallow Evaluation Blindspot',
            tagline: 'Thinking only the topmost number 3 is returned',
            explanation: 'You predicted 3, perhaps thinking the recursion stops immediately after the first step without combining the rest.',
            friendlyClue: 'Each step adds `n` to the answer of `countdown(n-1)`.',
            mentalModelRemedy: '3 is added to the sum of 2, 1, and 0!',
          },
          D: {
            name: 'Termination Uncertainty',
            tagline: 'Doubting whether the base case is ever reached',
            explanation: 'Because `n` decreases by 1 on every step, `countdown(3)` reliably reaches `countdown(0)` in 4 calls.',
            friendlyClue: 'The code decrements `n - 1`, guaranteeing it meets `n == 0`.',
            mentalModelRemedy: 'As long as `n` moves toward the base condition, the recursion safely halts.',
          },
        },
        repairChallenge: {
          id: 'rep-06-1',
          title: 'FIX THE BUG IN YOUR THINKING',
          instruction: 'Trace this smaller 2-step recursion stack:',
          code: `def step_sum(n):
    if n <= 1:
        return 1
    return n + step_sum(n - 1)

print(step_sum(2))`,
          questionText: 'What will be printed?',
          options: [
            { id: 'A', label: '1', value: '1', isCorrect: false },
            { id: 'B', label: '2', value: '2', isCorrect: false },
            { id: 'C', label: '3', value: '3', isCorrect: true },
            { id: 'D', label: '0', value: '0', isCorrect: false },
          ],
          correctOptionId: 'C',
          explanation: 'Master Sleuth! step_sum(2) = 2 + step_sum(1) = 2 + 1 = 3! The stack unwound perfectly.',
          bonusXp: 50,
          badgeToUnlock: {
            id: 'badge-recursion-decoder',
            title: 'Stack Master',
            category: 'RECURSION',
            description: 'Solved the recursive mirror chamber and call stack unwinding.',
            icon: '🪞',
            rarity: 'Legendary',
          },
        },
      },
    ],
  },
];
