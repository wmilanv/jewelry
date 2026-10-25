'use client';
import React from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { Media } from './Media';

export function ProductCard({ product }: { product: Product }) {
  const settings = useStoreData((s) => s.settings);
  const sold = product.stock === 0;
  const discount =
    product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <Link href={`/producto/${product.slug}`} className="group block" data-cursor>
      <div className="relative aspect-[4/5] rounded-[1.4rem] overflow-hidden border border-line">
        <Media
          src={product.images[0]}
          art={product.art}
          alt={product.name}
          className="w-full h-full [&_svg]:h-full [&_svg]:w-full [&_svg]:scale-110 [&_svg]:transition-transform [&_svg]:duration-[900ms] [&_img]:transition-transform [&_img]:duration-[900ms] group-hover:[&_img]:scale-110 group-hover:[&_svg]:scale-125"
        />
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
          {sold && <span className="bg-ink text-bg text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">Agotado</span>}
          {!sold && product.badge && (
            <span className="bg-bg/80 backdrop-blur text-ink text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-line">{product.badge}</span>
          )}
          {discount > 0 && !sold && (
            <span className="bg-accent text-on-accent text-[10px] tracking-widest px-3 py-1 rounded-full">-{discount}%</span>
          )}
        </div>
        <span className="absolute bottom-3.5 left-3.5 right-3.5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500 bg-bg/85 backdrop-blur rounded-full text-center text-[10px] uppercase tracking-[0.2em] py-3">
          Ver pieza
        </span>
      </div>
      <div className="pt-4 flex items-start justify-between gap-3">
        <h3 className="font-display text-xl uppercase leading-tight tracking-wide">{product.name}</h3>
        <div className="text-right text-sm shrink-0">
          <div>{formatMoney(product.price, settings)}</div>
          {discount > 0 && <div className="text-muted line-through text-xs">{formatMoney(product.compareAtPrice, settings)}</div>}
        </div>
      </div>
    </Link>
  );
}
