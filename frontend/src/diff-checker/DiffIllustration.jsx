import React from 'react';

export default function DiffIllustration({ className = 'w-full h-full' }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute w-44 h-44 rounded-full bg-blue-400/20 blur-2xl -z-10 animate-pulse pointer-events-none" />

      <svg
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[150px] object-contain drop-shadow-xl"
      >
        <defs>
          <linearGradient id="sheetGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>
          <linearGradient id="sheetGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Left Document (Original) */}
        <g transform="translate(45, 20) rotate(-6)" filter="url(#cardShadow)">
          <rect
            width="100"
            height="140"
            rx="12"
            fill="url(#sheetGrad1)"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />
          {/* Document Lines */}
          <rect x="14" y="20" width="40" height="7" rx="3.5" fill="#3B82F6" opacity="0.8" />
          <rect x="14" y="36" width="72" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="14" y="49" width="60" height="5" rx="2.5" fill="#E2E8F0" />
          {/* Removed highlight line (Pink/Red) */}
          <rect x="14" y="62" width="72" height="7" rx="3.5" fill="#FECDD3" />
          <rect x="14" y="77" width="55" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="14" y="90" width="70" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="14" y="103" width="48" height="5" rx="2.5" fill="#E2E8F0" />
        </g>

        {/* Right Document (Modified) */}
        <g transform="translate(165, 20) rotate(6)" filter="url(#cardShadow)">
          <rect
            width="100"
            height="140"
            rx="12"
            fill="url(#sheetGrad2)"
            stroke="#93C5FD"
            strokeWidth="1.5"
          />
          {/* Document Lines */}
          <rect x="14" y="20" width="44" height="7" rx="3.5" fill="#2563EB" opacity="0.9" />
          <rect x="14" y="36" width="72" height="5" rx="2.5" fill="#E2E8F0" />
          {/* Added highlight lines (Green/Teal) */}
          <rect x="14" y="49" width="72" height="7" rx="3.5" fill="#A7F3D0" />
          <rect x="14" y="64" width="60" height="7" rx="3.5" fill="#A7F3D0" />
          <rect x="14" y="79" width="70" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="14" y="92" width="55" height="5" rx="2.5" fill="#E2E8F0" />
          <rect x="14" y="105" width="65" height="5" rx="2.5" fill="#E2E8F0" />
        </g>

        {/* Center Glowing Exchange Arrows */}
        <g transform="translate(138, 72)">
          {/* Top arrow pointing right */}
          <path
            d="M 5 6 L 30 6 M 24 1 L 31 6 L 24 11"
            stroke="url(#arrowGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom arrow pointing left */}
          <path
            d="M 33 22 L 8 22 M 14 17 L 7 22 L 14 27"
            stroke="url(#arrowGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Sparkles */}
        <path d="M 270 25 L 273 33 L 281 36 L 273 39 L 270 47 L 267 39 L 259 36 L 267 33 Z" fill="#60A5FA" opacity="0.75" />
        <path d="M 40 140 L 42 145 L 47 147 L 42 149 L 40 154 L 38 149 L 33 147 L 38 145 Z" fill="#818CF8" opacity="0.65" />
        <circle cx="285" cy="85" r="3" fill="#A78BFA" opacity="0.6" />
      </svg>
    </div>
  );
}
