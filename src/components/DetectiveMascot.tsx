/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface DetectiveMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  mood?: 'idle' | 'thinking' | 'alert' | 'celebrate' | 'magnifying';
  speechBubble?: string;
  className?: string;
}

export const DetectiveMascot: React.FC<DetectiveMascotProps> = ({
  size = 'md',
  mood = 'idle',
  speechBubble,
  className = '',
}) => {
  const dimension = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    hero: 'w-48 h-48 md:w-56 md:h-56',
  }[size];

  // Mascot eye variations based on mood
  const eyeColor = mood === 'alert' ? '#f87171' : mood === 'celebrate' ? '#34d399' : '#38bdf8';

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble dialogue */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-12 sm:-top-14 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-slate-900 border-2 border-amber-400 text-amber-300 text-xs font-mono font-bold px-3 py-1.5 rounded-xl shadow-[0_4px_0_#0f172a] flex items-center gap-1.5"
        >
          <span>💬</span>
          <span>{speechBubble}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-400" />
        </motion.div>
      )}

      {/* Mascot Animated Body */}
      <motion.div
        animate={
          mood === 'thinking'
            ? { rotate: [-2, 2, -2], y: [0, -3, 0] }
            : mood === 'celebrate'
            ? { y: [0, -10, 0], scale: [1, 1.05, 1] }
            : mood === 'alert'
            ? { x: [-3, 3, -3, 3, 0] }
            : { y: [0, -4, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: mood === 'celebrate' ? 0.6 : 3,
          ease: 'easeInOut',
        }}
        className={`relative ${dimension}`}
      >
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Cyber Glow Aura */}
          <circle cx="80" cy="85" r="55" fill="#38bdf8" fillOpacity="0.08" />

          {/* Robot Detective Hat (Tweed Deerstalker Hat) */}
          <path
            d="M42 46 C42 22, 118 22, 118 46 L130 50 C130 54, 30 54, 30 50 Z"
            fill="#78350f"
          />
          <path
            d="M48 44 C48 26, 112 26, 112 44 Z"
            fill="#92400e"
          />
          {/* Plaid / Detective Hat Bow Tie */}
          <rect x="74" y="24" width="12" height="6" rx="2" fill="#d97706" />
          <path d="M40 50 L120 50" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />

          {/* Robot Head Body (Retro Rounded Monitor Box) */}
          <rect
            x="36"
            y="48"
            width="88"
            height="70"
            rx="18"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="4"
          />
          {/* Highlight shine on head */}
          <path
            d="M44 56 C44 56, 75 52, 116 56"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />

          {/* Screen Visor (CRT Screen) */}
          <rect
            x="46"
            y="58"
            width="68"
            height="46"
            rx="10"
            fill="#020617"
            stroke="#0ea5e9"
            strokeWidth="2.5"
          />

          {/* CRT Scanline effect lines */}
          <line x1="48" y1="68" x2="112" y2="68" stroke="#38bdf8" strokeOpacity="0.12" strokeWidth="1" />
          <line x1="48" y1="78" x2="112" y2="78" stroke="#38bdf8" strokeOpacity="0.12" strokeWidth="1" />
          <line x1="48" y1="88" x2="112" y2="88" stroke="#38bdf8" strokeOpacity="0.12" strokeWidth="1" />

          {/* Glowing Eyes */}
          {mood === 'celebrate' ? (
            // Joyful arch eyes ^^
            <g stroke={eyeColor} strokeWidth="3.5" strokeLinecap="round">
              <path d="M57 78 Q63 70 69 78" />
              <path d="M91 78 Q97 70 103 78" />
            </g>
          ) : mood === 'alert' ? (
            // Alert diamond/surprised eyes !!
            <g fill={eyeColor}>
              <circle cx="63" cy="76" r="6" />
              <circle cx="97" cy="76" r="6" />
              <rect x="76" y="86" width="8" height="8" rx="2" fill="#f87171" />
            </g>
          ) : mood === 'thinking' ? (
            // Curious squint
            <g fill={eyeColor}>
              <circle cx="63" cy="74" r="5" />
              <rect x="91" y="74" width="12" height="4" rx="2" />
            </g>
          ) : (
            // Friendly glowing eyes
            <g fill={eyeColor}>
              <circle cx="63" cy="76" r="5.5" />
              <circle cx="97" cy="76" r="5.5" />
              {/* Pupil glint */}
              <circle cx="61" cy="74" r="2" fill="#ffffff" />
              <circle cx="95" cy="74" r="2" fill="#ffffff" />
            </g>
          )}

          {/* Cute robot cheeks */}
          <ellipse cx="55" cy="88" rx="4" ry="2" fill="#ec4899" fillOpacity="0.5" />
          <ellipse cx="105" cy="88" rx="4" ry="2" fill="#ec4899" fillOpacity="0.5" />

          {/* Robot smile / speaker grille */}
          <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7">
            <path d="M74 88 Q80 93 86 88" />
          </g>

          {/* Detective Trenchcoat Collar & Body */}
          <path
            d="M50 118 L44 146 C44 150, 116 150, 116 146 L110 118 Z"
            fill="#334155"
            stroke="#1e293b"
            strokeWidth="3"
          />
          {/* Trenchcoat Lapels */}
          <path d="M60 118 L76 138 L80 118" fill="#d97706" />
          <path d="M100 118 L84 138 L80 118" fill="#b45309" />
          {/* Badge Pin on Coat */}
          <polygon points="80,126 84,134 76,134" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

          {/* Robot Feet/Treads */}
          <rect x="52" y="146" width="22" height="8" rx="4" fill="#1e293b" />
          <rect x="86" y="146" width="22" height="8" rx="4" fill="#1e293b" />

          {/* Magnifying Glass (Holding in hand) */}
          <g className="transition-transform duration-300">
            {/* Hand holding glass */}
            <circle cx="122" cy="116" r="7" fill="#64748b" stroke="#334155" strokeWidth="2" />
            {/* Glass Handle */}
            <line x1="126" y1="120" x2="142" y2="136" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
            <line x1="126" y1="120" x2="142" y2="136" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            {/* Glass Rim */}
            <circle
              cx="116"
              cy="104"
              r="18"
              fill="#38bdf8"
              fillOpacity="0.2"
              stroke="#fbbf24"
              strokeWidth="4"
            />
            {/* Glass Lens Reflection */}
            <path
              d="M106 96 A12 12 0 0 1 126 96"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            {/* Clue code glyph under magnifier */}
            <text
              x="110"
              y="108"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              fill="#fef08a"
            >
              x?
            </text>
          </g>

          {/* Cute antenna on side */}
          <line x1="36" y1="62" x2="24" y2="52" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="22" cy="50" r="4" fill="#38bdf8" />
        </svg>
      </motion.div>
    </div>
  );
};
