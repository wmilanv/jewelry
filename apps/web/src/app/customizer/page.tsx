'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { JewelryCanvas } from '@/components/3d/JewelryCanvas';
import { useCartStore } from '@/store/useCartStore';
import { ArrowLeft, Sparkles, Check, ShoppingBag } from 'lucide-react';

const METALS = [
  { id: 'gold_18k', name: 'Or Jaune 18k', hex: '#ffd700', price: 0 },
  { id: 'rose_gold', name: 'Or Rose Impérial', hex: '#e8a598', price: 150000 },
  { id: 'platinum_950', name: 'Platine Pur 950', hex: '#e5e8ec', price: 650000 },
  { id: 'noir_bronze', name: 'Bronze Noirci Brut', hex: '#3d342b', price: -100000 },
];

const GEMS = [
  { id: 'diamond_flawless', name: 'Diamant D-Flawless', hex: '#ffffff', pricePerCt: 8500000 },
  { id: 'emerald_muzo', name: 'Émeraude de Muzo', hex: '#00c853', pricePerCt: 6200000 },
  { id: 'sapphire_ceylon', name: 'Saphir Royal de Ceylan', hex: '#1565c0', pricePerCt: 5100000 },
  { id: 'ruby_pigeon', name: 'Rubis Sang de Pigeon', hex: '#d50000', pricePerCt: 7800000 },
  { id: 'onyx_stellar', name: 'Onyx Noir Stellaire', hex: '#111111', pricePerCt: 1800000 },
];

export default function CustomizerPage() {
  const [metal, setMetal] = useState(METALS[0]);
  const [gem, setGem] = useState(GEMS[0]);
  const [carats, setCarats] = useState(1.8);
  const [ringSize, setRingSize] = useState(6.5);
  const [engraving, setEngraving] = useState('');
  
  // Hover preview instantáneo
  const [hoverMetal, setHoverMetal] = useState<typeof METALS[0] | null>(null);
  const [hoverGem, setHoverGem] = useState<typeof GEMS[0] | null>(null);

  const { addItem, openCart } = useCartStore();

  const activeMetal = hoverMetal || metal;
  const activeGem = hoverGem || gem;

  // Cálculo en Pesos Colombianos (COP)
  const basePrice = 3200000;
  const totalPriceCOP = basePrice + activeMetal.price + Math.round(activeGem.pricePerCt * carats);

  const handleAddToCart = () => {
    addItem({
      id: `BESPOKE-${metal.id}-${gem.id}-${carats}ct-${Date.now()}`,
      title: `Solitaire Vendôme Sur-Mesure (${gem.name})`,
      priceCOP: totalPriceCOP,
      quantity: 1,
      isBespoke: true,
      bespokeConfig: {
        ringId: 'solitaire-vendome',
        metal: metal.id as any,
        gemstone: gem.id as any,
        carats,
        ringSize,
        engravingText: engraving || undefined,
      },
    });
    openCart();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0d] flex flex-col md:flex-row text-neutral-100">
      {/* Columna Izquierda: Visor 3D */}
      <div className="relative flex-1 h-1/2 md:h-full bg-gradient-to-b from-[#111116] to-[#070709]">
        <JewelryCanvas
          metalColor={activeMetal.hex}
          gemColor={activeGem.hex}
          carats={carats}
        />

        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la Maison
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c5a880]">
            Vue Interactive 3D (R3F)
          </span>
          <p className="text-xs text-neutral-400 font-light">Arrastra para orbitar • Pasa el mouse sobre materiales para previsualizar</p>
        </div>
      </div>

      {/* Columna Derecha: Panel de Configuración Bespoke */}
      <div className="w-full md:w-[460px] h-1/2 md:h-full bg-[#0d0d10] border-l border-[#24242d] flex flex-col justify-between p-8 overflow-y-auto">
        <div className="space-y-6">
          <div className="border-b border-[#212128] pb-4">
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[#c5a880]">
              Atelier Haute Joaillerie
            </span>
            <h1 className="font-serif text-2xl text-white tracking-wide mt-1">Solitaire Vendôme No. 1</h1>
          </div>

          {/* Selector de Metales con Hover instantáneo */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-2.5">
              1. Métal Précieux: <span className="text-white font-medium">{activeMetal.name}</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {METALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMetal(m)}
                  onMouseEnter={() => setHoverMetal(m)}
                  onMouseLeave={() => setHoverMetal(null)}
                  className={`flex items-center gap-3 p-2.5 border text-xs text-left transition-all ${
                    metal.id === m.id
                      ? 'border-[#c5a880] bg-[#1a1712]'
                      : 'border-[#262630] bg-[#121216] hover:border-neutral-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-black/40 shadow-inner" style={{ backgroundColor: m.hex }} />
                  <span className="truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Gemas */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-2.5">
              2. Gemme Centrale: <span className="text-white font-medium">{activeGem.name}</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {GEMS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGem(g)}
                  onMouseEnter={() => setHoverGem(g)}
                  onMouseLeave={() => setHoverGem(null)}
                  className={`flex items-center gap-3 p-2.5 border text-xs text-left transition-all ${
                    gem.id === g.id
                      ? 'border-[#c5a880] bg-[#1a1712]'
                      : 'border-[#262630] bg-[#121216] hover:border-neutral-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-black/40 shadow-inner" style={{ backgroundColor: g.hex }} />
                  <span className="truncate">{g.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slider de Quilataje */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-neutral-400 uppercase tracking-wider text-[11px]">3. Poids en Carats:</span>
              <span className="font-mono text-[#c5a880] font-bold">{carats.toFixed(2)} ct</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="4.0"
              step="0.1"
              value={carats}
              onChange={(e) => setCarats(parseFloat(e.target.value))}
              className="w-full accent-[#c5a880] cursor-pointer bg-[#22222b]"
            />
          </div>

          {/* Gravado Láser */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1.5">
              4. Gravure Laser Intérieure (Optionnel)
            </label>
            <input
              type="text"
              maxLength={24}
              placeholder="Ex: Éternité 24.10.26"
              value={engraving}
              onChange={(e) => setEngraving(e.target.value)}
              className="w-full bg-[#141419] border border-[#2b2b36] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
            />
          </div>
        </div>

        {/* Resumen de Precio y Botón de Carrito */}
        <div className="border-t border-[#212128] pt-6 mt-6 space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">Total Estimé (COP)</span>
            <span className="font-serif text-2xl text-[#e5c28e] font-semibold">
              ${totalPriceCOP.toLocaleString('es-CO')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-[#c5a880] hover:bg-[#d6ba94] text-black text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#c5a880]/15"
          >
            <ShoppingBag className="w-4 h-4" />
            Ajouter à l'Écrin
          </button>
        </div>
      </div>
    </div>
  );
}