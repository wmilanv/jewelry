'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { Media } from './Media';

export function ProductCard({ product }: { product: Product }) {
  const settings = useStoreData((s) => s.settings);
  const categories = useStoreData((s) => s.categories);
  const [hovered, setHovered] = useState(false);
  const sold = product.stock === 0;
  const discount =
    product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const category = categories.find((c) => c.id === product.categoryId);
  const hasSecondary = product.images.length > 1;

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block"
      data-cursor
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] rounded-[1.6rem] overflow-hidden border border-line bg-surface/30">
        {/* Imagen principal */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            hovered && hasSecondary ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Media
            src={product.images[0]}
            art={product.art}
            alt={product.name}
            className="w-full h-full [&_svg]:h-full [&_svg]:w-full [&_svg]:scale-105 [&_svg]:transition-transform [&_svg]:duration-[900ms] [&_img]:transition-transform [&_img]:duration-[900ms] group-hover:[&_img]:scale-110 group-hover:[&_svg]:scale-115"
          />
        </div>

        {/* Imagen secundaria en hover (si existe) */}
        {hasSecondary && (
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Media
              src={product.images[1]}
              art={product.art}
              alt={`${product.name} detalle`}
              className="w-full h-full [&_img]:transition-transform [&_img]:duration-[900ms] [&_img]:scale-105 group-hover:[&_img]:scale-110"
            />
          </div>
        )}

        <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {sold && (
            <span className="bg-ink text-bg text-[8px] sm:text-[10px] uppercase tracking-widest px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium shadow-md">
              Agotado
            </span>
          )}
          {!sold && product.badge && (
            <span className="bg-bg/85 backdrop-blur text-ink text-[8px] sm:text-[10px] uppercase tracking-widest px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-line shadow-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && !sold && (
            <span className="bg-accent text-on-accent text-[8px] sm:text-[10px] font-semibold tracking-widest px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        <span className="absolute bottom-3.5 left-3.5 right-3.5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500 bg-bg/90 backdrop-blur-md rounded-full text-center text-[10px] uppercase tracking-[0.22em] py-3 border border-white/10 z-10 font-medium hidden sm:block">
          Descubrir pieza
        </span>
      </div>

      <div className="pt-3 sm:pt-4 space-y-1 sm:space-y-1.5">
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-muted font-medium">
          <span className="truncate max-w-[65%]">{category?.name || 'Alta Joyería'}</span>
          <span className="shrink-0">{product.sku}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-3">
          <h3 className="font-display text-base sm:text-xl uppercase leading-tight tracking-wide text-ink group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="sm:text-right text-xs sm:text-sm shrink-0 flex items-baseline gap-1.5 sm:block">
            <span className="font-medium text-accent">{formatMoney(product.price, settings)}</span>
            {discount > 0 && (
              <span className="text-muted line-through text-[10px] sm:text-xs">
                {formatMoney(product.compareAtPrice, settings)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
