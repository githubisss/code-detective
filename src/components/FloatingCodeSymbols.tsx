/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface FloatingCodeSymbolsProps {
  count?: number;
  className?: string;
}

const SYMBOLS = [
  { text: '{ }', color: 'text-amber-400/30' },
  { text: '< >', color: 'text-cyan-400/30' },
  { text: 'if', color: 'text-rose-400/30' },
  { text: 'for', color: 'text-emerald-400/30' },
  { text: 'print()', color: 'text-indigo-400/30' },
  { text: '=', color: 'text-yellow-400/30' },
  { text: '==', color: 'text-purple-400/30' },
  { text: 'range(3)', color: 'text-sky-400/25' },
  { text: 'def', color: 'text-pink-400/25' },
  { text: '[ 0 ]', color: 'text-teal-400/25' },
  { text: 'return', color: 'text-amber-300/25' },
];

export const FloatingCodeSymbols: React.FC<FloatingCodeSymbolsProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}>
      {SYMBOLS.map((item, idx) => {
        // Distribute positions across the canvas
        const leftPercent = 5 + ((idx * 27) % 90);
        const topPercent = 8 + ((idx * 33) % 80);
        const floatDuration = 4 + (idx % 4) * 1.5;
        const delay = (idx % 5) * 0.4;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: [0.3, 0.75, 0.3],
              y: [0, -16, 0],
              rotate: [idx % 2 === 0 ? -6 : 6, idx % 2 === 0 ? 6 : -6, idx % 2 === 0 ? -6 : 6],
            }}
            transition={{
              repeat: Infinity,
              duration: floatDuration,
              delay,
              ease: 'easeInOut',
            }}
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
            }}
            className={`absolute font-mono text-sm md:text-base font-bold tracking-wider ${item.color} filter blur-[0.3px]`}
          >
            {item.text}
          </motion.div>
        );
      })}
    </div>
  );
};
