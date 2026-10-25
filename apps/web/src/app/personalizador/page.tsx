'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { useCartStore } from '@/store/useCartStore';

const JewelryCanvas = dynamic(() => import('@/components/3d/JewelryCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse" />,
});

export default function CustomizerPage() {
  const { settings, hydrated } = useStoreData();
  const c = settings.customizer;
  const addItem = useCartStore((s) => s.addItem);

  const [metalId, setMetalId] = useState<string>('');
  const [gemId, setGemId] = useState<string>('');
  const [hoverMetal, setHoverMetal] = useState<string>('');
  const [hoverGem, setHoverGem] = useState<string>('');
  const [carats, setCarats] = useState(1.2);
  const [ringSize, setRingSize] = useState(7);
  const [engraving, setEngraving] = useState('');

  if (hydrated && !c.enabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted">El personalizador no está activo.</p>
        <Link href="/" className="btn-outline">Volver al inicio</Link>
      </div>
    );
  }

  const metal = c.metals.find((m) => m.id === metalId) ?? c.metals[0];
  const gem = c.gems.find((g) => g.id === gemId) ?? c.gems[0];
  if (!metal || !gem) return null;
  const shownMetal = c.metals.find((m) => m.id === hoverMetal) ?? metal;
  const shownGem = c.gems.find((g) => g.id === hoverGem) ?? gem;

  const total = Math.max(0, c.basePrice + metal.priceDelta + Math.round(gem.pricePerCt * carats));

  const add = () => {
    addItem({
      id: `bespoke|${metal.id}|${gem.id}|${carats}|${ringSize}|${engraving}`,
      productId: 'bespoke',
      title: `${c.title} (${gem.name})`,
      variantLabel: `${metal.name} · ${gem.name} · ${carats.toFixed(2)} ct · Talla ${ringSize}${engraving ? ` · Grabado: "${engraving}"` : ''}`,
      price: total,
      quantity: 1,
      image: '',
      art: { kind: 'ring', color: metal.color },
      isBespoke: true,
      bespokeConfig: { metal: metal.name, gemstone: gem.name, carats, ringSize, engravingText: engraving || undefined },
    });
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-bg">
      <div className="relative flex-1 min-h-0 bg-[radial-gradient(ellipse_at_center,rgb(var(--accent)/0.12),rgb(var(--bg))_70%)]">
        <JewelryCanvas metalColor={shownMetal.color} gemColor={shownGem.color} carats={carats} />
        <Link href="/" className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted hover:text-accent transition">
          <ArrowLeft className="w-4 h-4" /> Volver a la tienda
        </Link>
        <div className="absolute bottom-5 left-6 z-10 pointer-events-none">
          <span className="text-[10px] uppercase tracking-[0.3em] text-accent">Vista 3D interactiva</span>
          <p className="text-xs text-muted">Arrastra para girar · Pasa el mouse sobre las opciones para previsualizar</p>
        </div>
      </div>

      <aside className="w-full md:w-[460px] md:h-full h-[55%] bg-surface border-l border-line flex flex-col">
        <div className="flex-1 overflow-y-auto p-7 space-y-7">
          <div className="border-b border-line pb-4">
            <span className="eyebrow">{c.subtitle}</span>
            <h1 className="font-display text-3xl mt-1">{c.title}</h1>
          </div>

          <div>
            <span className="label">1. Metal: <b className="text-ink normal-case tracking-normal">{shownMetal.name}</b></span>
            <div className="grid grid-cols-2 gap-2.5">
              {c.metals.map((m) => (
                <button key={m.id} onClick={() => setMetalId(m.id)} onMouseEnter={() => setHoverMetal(m.id)} onMouseLeave={() => setHoverMetal('')}
                  className={`flex items-center gap-3 p-3 border text-xs text-left transition ${metal.id === m.id ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/50'}`}>
                  <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ background: m.color }} />
                  <span className="flex-1">{m.name}{m.priceDelta !== 0 && <em className="block not-italic text-[10px] text-muted">{m.priceDelta > 0 ? '+' : ''}{formatMoney(m.priceDelta, settings)}</em>}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label">2. Piedra central: <b className="text-ink normal-case tracking-normal">{shownGem.name}</b></span>
            <div className="grid grid-cols-2 gap-2.5">
              {c.gems.map((g) => (
                <button key={g.id} onClick={() => setGemId(g.id)} onMouseEnter={() => setHoverGem(g.id)} onMouseLeave={() => setHoverGem('')}
                  className={`flex items-center gap-3 p-3 border text-xs text-left transition ${gem.id === g.id ? 'border-accent bg-accent/10' : 'border-line hover:border-accent/50'}`}>
                  <span className="w-4 h-4 rotate-45 border border-white/20 shrink-0" style={{ background: g.color }} />
                  <span className="flex-1">{g.name}<em className="block not-italic text-[10px] text-muted">{formatMoney(g.pricePerCt, settings)} / ct</em></span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline">
              <span className="label">3. Quilates</span>
              <b className="text-accent text-sm">{carats.toFixed(2)} ct</b>
            </div>
            <input type="range" min={c.minCarats} max={c.maxCarats} step={0.05} value={carats} onChange={(e) => setCarats(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
          </div>

          <div>
            <div className="flex justify-between items-baseline">
              <span className="label">4. Talla del anillo</span>
              <b className="text-accent text-sm">{ringSize}</b>
            </div>
            <input type="range" min={4} max={12} step={0.5} value={ringSize} onChange={(e) => setRingSize(Number(e.target.value))} className="w-full accent-[rgb(var(--accent))]" />
          </div>

          {c.engraving && (
            <div>
              <span className="label">5. Grabado interior (opcional)</span>
              <input value={engraving} maxLength={24} onChange={(e) => setEngraving(e.target.value)} placeholder="Ej: Siempre juntos 12.06.2026" className="input" />
              <p className="text-[10px] text-muted mt-1 text-right">{engraving.length}/24</p>
            </div>
          )}
        </div>

        <div className="border-t border-line p-7 space-y-4 bg-bg/40">
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-wider text-muted">Total estimado</span>
            <span className="font-display text-3xl text-accent">{formatMoney(total, settings)}</span>
          </div>
          <button onClick={add} className="btn-primary w-full"><ShoppingBag className="w-4 h-4" /> Agregar al carrito</button>
        </div>
      </aside>
    </div>
  );
}

