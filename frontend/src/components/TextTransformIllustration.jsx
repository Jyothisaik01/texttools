import React from 'react';

export default function TextTransformIllustration({ className = 'w-full h-full' }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background soft ambient glow */}
      <div className="absolute w-48 h-48 rounded-full bg-blue-400/20 blur-2xl -z-10 animate-pulse pointer-events-none" />

      <svg
        viewBox="0 0 340 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[145px] object-contain drop-shadow-xl"
      >
        <defs>
          <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
          </linearGradient>
          <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>
          <linearGradient id="arrowBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <filter id="cardShadowSoft" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Back Document Sheet */}
        <g transform="translate(60, 20) rotate(-6)" filter="url(#cardShadowSoft)">
          <rect
            width="95"
            height="130"
            rx="12"
            fill="url(#cardGrad1)"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />
          {/* Document Lines */}
          <rect x="15" y="22" width="38" height="6" rx="3" fill="#3B82F6" opacity="0.8" />
          <rect x="15" y="38" width="65" height="4.5" rx="2" fill="#E2E8F0" />
          <rect x="15" y="50" width="55" height="4.5" rx="2" fill="#E2E8F0" />
          <rect x="15" y="62" width="65" height="4.5" rx="2" fill="#E2E8F0" />
          <rect x="15" y="74" width="45" height="4.5" rx="2" fill="#E2E8F0" />
          <rect x="15" y="86" width="60" height="4.5" rx="2" fill="#E2E8F0" />
        </g>

        {/* Floating Badge 1: Aa -> AA (Top Left/Center) */}
        <g transform="translate(145, 16)" filter="url(#cardShadowSoft)">
          <rect width="68" height="24" rx="12" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
          <text x="34" y="16" fill="#2563EB" fontSize="10" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            Aa → AA
          </text>
        </g>

        {/* Floating Badge 2: text -> Text (Top Right) */}
        <g transform="translate(225, 20)" filter="url(#cardShadowSoft)">
          <rect width="78" height="24" rx="12" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
          <text x="39" y="16" fill="#059669" fontSize="10" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            text → Text
          </text>
        </g>

        {/* Front Document Sheet with large Aa */}
        <g transform="translate(170, 32) rotate(6)" filter="url(#cardShadowSoft)">
          <rect
            width="95"
            height="130"
            rx="12"
            fill="url(#cardGrad2)"
            stroke="#93C5FD"
            strokeWidth="1.5"
          />
          {/* Large Aa Typography */}
          <text x="47" y="75" fill="#2563EB" fontSize="32" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            Aa
          </text>
          {/* Underline accent */}
          <rect x="25" y="88" width="45" height="5" rx="2.5" fill="#60A5FA" opacity="0.8" />
          <rect x="18" y="102" width="60" height="4" rx="2" fill="#E2E8F0" />
        </g>

        {/* Center Curved Dynamic Transformation Arrow */}
        <g transform="translate(145, 62)">
          <path
            d="M 5 20 C 15 5, 28 8, 38 22"
            stroke="url(#arrowBlueGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 33 15 L 40 23 L 30 27"
            stroke="url(#arrowBlueGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Decorative Sparkles */}
        <path d="M 290 45 L 292 51 L 298 53 L 292 55 L 290 61 L 288 55 L 282 53 L 288 51 Z" fill="#93C5FD" opacity="0.8" />
        <path d="M 45 105 L 47 110 L 52 112 L 47 114 L 45 119 L 43 114 L 38 112 L 43 110 Z" fill="#60A5FA" opacity="0.7" />
        <circle cx="215" cy="22" r="2.5" fill="#60A5FA" opacity="0.7" />
      </svg>
    </div>
  );
}

