import React from 'react';
import type { ArtKind } from '@/types';

/** Ilustración vectorial por categoría de producto, usada cuando no hay foto. */
export function ProductArt({ kind, color, className = '' }: { kind: ArtKind; color: string; className?: string }) {
  const id = `g${kind}${color.replace('#', '')}`;
  return (
    <svg viewBox="0 0 200 200" className={`w-full h-full ${className}`} aria-hidden>
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0.04" />
        </radialGradient>
        <linearGradient id={`${id}-m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.35" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${id}-bg)`} />
      <g fill="none" stroke={`url(#${id}-m)`} strokeLinecap="round" strokeLinejoin="round">
        {kind === 'ring' && (
          <>
            <ellipse cx="100" cy="124" rx="44" ry="42" strokeWidth="9" />
            <path d="M84 84 L100 62 L116 84 L100 96 Z" fill="#ffffff" fillOpacity="0.85" strokeWidth="3" stroke={color} />
            <path d="M84 84 H116 M100 62 V96" strokeWidth="1.4" stroke={color} opacity="0.7" />
          </>
        )}
        {kind === 'necklace' && (
          <>
            <path d="M44 48 C50 130 150 130 156 48" strokeWidth="3" strokeDasharray="1 5.5" />
            <path d="M44 48 C50 130 150 130 156 48" strokeWidth="1.2" opacity="0.6" />
            <path d="M100 118 L89 134 L100 158 L111 134 Z" fill="#ffffff" fillOpacity="0.85" stroke={color} strokeWidth="3" />
          </>
        )}
        {kind === 'earrings' && (
          <>
            {[68, 132].map((x) => (
              <g key={x}>
                <circle cx={x} cy="52" r="4" fill={color} stroke="none" />
                <path d={`M${x} 56 V84`} strokeWidth="2.5" />
                <path d={`M${x} 84 L${x - 12} 108 L${x} 138 L${x + 12} 108 Z`} fill="#ffffff" fillOpacity="0.8" stroke={color} strokeWidth="3" />
              </g>
            ))}
          </>
        )}
        {kind === 'bracelet' && (
          <>
            <ellipse cx="100" cy="104" rx="62" ry="40" strokeWidth="10" />
            <ellipse cx="100" cy="104" rx="62" ry="40" strokeWidth="2" stroke="#fff" opacity="0.5" strokeDasharray="2 9" />
          </>
        )}
        {kind === 'watch' && (
          <>
            <rect x="82" y="22" width="36" height="42" rx="6" strokeWidth="3" />
            <rect x="82" y="136" width="36" height="42" rx="6" strokeWidth="3" />
            <circle cx="100" cy="100" r="40" strokeWidth="7" />
            <path d="M100 100 V76 M100 100 L116 108" strokeWidth="3" />
          </>
        )}
        {kind === 'box' && (
          <>
            <path d="M52 84 L100 60 L148 84 V138 L100 162 L52 138 Z" strokeWidth="4" />
            <path d="M52 84 L100 108 L148 84 M100 108 V162" strokeWidth="3" />
          </>
        )}
      </g>
    </svg>
  );
}

