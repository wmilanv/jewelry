/* eslint-disable @next/next/no-img-element */
import React from 'react';
import type { ArtKind } from '@/types';
import { ProductArt } from './ProductArt';

/** Muestra la foto si existe; si no, la ilustración de la categoría. */
export function Media({
  src,
  art,
  alt,
  className = '',
}: {
  src?: string;
  art: { kind: ArtKind; color: string };
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <ProductArt kind={art.kind} color={art.color} />
      )}
    </div>
  );
}

