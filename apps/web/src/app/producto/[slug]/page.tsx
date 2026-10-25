'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Minus, Plus, ShoppingBag, MessageCircle, Check } from 'lucide-react';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { useCartStore } from '@/store/useCartStore';
import { Media } from '@/components/ui/Media';
import { ProductCard } from '@/components/ui/ProductCard';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, categories, settings, hydrated } = useStoreData();
  const addItem = useCartStore((s) => s.addItem);
  const product = products.find((p) => p.slug === slug && p.active);

  const [selected, setSelected] = useState<Record<string, number>>({});
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) document.title = `${product.name} · ${settings.brand.name}`;
    setSelected({});
    setImg(0);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const related = useMemo(
    () => (product ? products.filter((p) => p.active && p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4) : []),
    [products, product],
  );

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-32 text-center space-y-4">
        <h1 className="font-display text-4xl">{hydrated ? 'Producto no encontrado' : 'Cargando…'}</h1>
        <Link href="/tienda" className="btn-outline">Volver a la tienda</Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const choice = (i: number) => selected[product.options[i].name] ?? 0;
  const delta = product.options.reduce((acc, o, i) => acc + (o.values[choice(i)]?.priceDelta ?? 0), 0);
  const unit = product.price + delta;
  const variantLabel = product.options.map((o, i) => `${o.name}: ${o.values[choice(i)]?.label}`).join(' · ');
  const soldOut = product.stock === 0;
  const maxQty = product.stock > 0 ? product.stock : 99;
  const discount = product.compareAtPrice > unit ? Math.round((1 - unit / product.compareAtPrice) * 100) : 0;

  const add = () => {
    addItem({
      id: `${product.id}|${variantLabel}`,
      productId: product.id,
      title: product.name,
      variantLabel,
      price: unit,
      quantity: qty,
      image: product.images[0] ?? '',
      art: product.art,
      isBespoke: false,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const wa = settings.contact.whatsapp.replace(/\D/g, '');
  const waText = encodeURIComponent(`Hola, quiero información sobre: ${product.name} (${variantLabel || 'sin opciones'})`);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <Link href="/tienda" className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted hover:text-accent mb-8">
        <ChevronLeft className="w-4 h-4" /> Volver a la tienda
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Galería */}
        <div className="space-y-3">
          <Media src={product.images[img]} art={product.art} alt={product.name} className="aspect-square border border-line" />
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((src, i) => (
                <button key={i} onClick={() => setImg(i)} className={`w-20 h-20 border ${i === img ? 'border-accent' : 'border-line'}`}>
                  <Media src={src} art={product.art} alt="" className="w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            {category && <span className="eyebrow">{category.name}</span>}
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-medium text-accent">{formatMoney(unit, settings)}</span>
              {discount > 0 && (
                <>
                  <span className="text-muted line-through">{formatMoney(product.compareAtPrice, settings)}</span>
                  <span className="text-xs border border-accent/50 text-accent px-2 py-0.5">-{discount}%</span>
                </>
              )}
            </div>
          </div>

          <p className="text-muted leading-relaxed">{product.description}</p>

          {product.options.map((o, i) => (
            <div key={o.name}>
              <span className="label">{o.name}: <b className="text-ink normal-case tracking-normal">{o.values[choice(i)]?.label}</b></span>
              <div className="flex flex-wrap gap-2">
                {o.values.map((v, vi) => (
                  <button
                    key={v.label}
                    onClick={() => setSelected({ ...selected, [o.name]: vi })}
                    className={`px-4 py-2.5 text-xs border transition ${choice(i) === vi ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-accent/60'}`}
                  >
                    {v.label}
                    {v.priceDelta !== 0 && <span className="opacity-60"> ({v.priceDelta > 0 ? '+' : ''}{formatMoney(v.priceDelta, settings)})</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <div className="flex items-center border border-line">
              <button className="px-3.5 py-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Menos"><Minus className="w-3.5 h-3.5" /></button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button className="px-3.5 py-3" onClick={() => setQty(Math.min(maxQty, qty + 1))} aria-label="Más"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <button onClick={add} disabled={soldOut} className="btn-primary flex-1">
              {soldOut ? 'Agotado' : added ? (<><Check className="w-4 h-4" /> Agregado</>) : (<><ShoppingBag className="w-4 h-4" /> Agregar al carrito</>)}
            </button>
          </div>

          {wa && (
            <a href={`https://wa.me/${wa}?text=${waText}`} target="_blank" rel="noreferrer" className="btn-outline w-full">
              <MessageCircle className="w-4 h-4" /> Preguntar por WhatsApp
            </a>
          )}

          <div className="text-xs text-muted space-y-1 border-t border-line pt-5">
            {product.stock > 0 && product.stock <= 5 && <p className="text-accent">¡Solo quedan {product.stock} unidades!</p>}
            {product.sku && <p>SKU: {product.sku}</p>}
            <p>{settings.shipping.note}</p>
          </div>

          {product.specs.length > 0 && (
            <div className="border-t border-line pt-5">
              <h3 className="eyebrow mb-3">Especificaciones</h3>
              <dl className="divide-y divide-line text-sm">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between py-2.5">
                    <dt className="text-muted">{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-24">
          <h2 className="font-display text-3xl text-center mb-10">También te puede gustar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

