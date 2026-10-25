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
    <Link href={`/producto/${product.slug}`} className="group block">
      <div className="relative aspect-square border border-line group-hover:border-accent transition-colors">
        <Media
          src={product.images[0]}
          art={product.art}
          alt={product.name}
          className="w-full h-full [&_svg]:transition-transform [&_svg]:duration-700 group-hover:[&_svg]:scale-105 [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {sold && <span className="bg-ink text-bg text-[10px] uppercase tracking-widest px-2 py-1">Agotado</span>}
          {!sold && product.badge && (
            <span className="bg-accent text-on-accent text-[10px] uppercase tracking-widest px-2 py-1">{product.badge}</span>
          )}
          {discount > 0 && !sold && (
            <span className="bg-bg/90 text-accent border border-accent/40 text-[10px] tracking-widest px-2 py-1">-{discount}%</span>
          )}
        </div>
      </div>
      <div className="pt-3.5 space-y-1">
        <h3 className="font-display text-lg leading-tight group-hover:text-accent transition-colors">{product.name}</h3>
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-medium">{formatMoney(product.price, settings)}</span>
          {discount > 0 && <span className="text-muted line-through text-xs">{formatMoney(product.compareAtPrice, settings)}</span>}
        </div>
      </div>
    </Link>
  );
}

