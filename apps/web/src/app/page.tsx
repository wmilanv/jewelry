'use client';
import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Sparkles, Shield, Gem, Compass } from 'lucide-react';

export default function HomePage() {
  const { openCart, items } = useCartStore();
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#08080a] text-[#f4efe6]">
      {/* Barra de Navegación Editorial */}
      <header className="sticky top-0 z-40 bg-[#08080a]/80 backdrop-blur-md border-b border-[#212128] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="group flex flex-col">
            <span className="font-serif text-xl tracking-[0.25em] font-medium text-white group-hover:text-[#c5a880] transition-colors">
              ATELIER VENDÔME
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-mono">
              Place Vendôme • Paris & Bogotá
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-[0.2em] text-neutral-300">
          <Link href="/customizer" className="hover:text-[#c5a880] transition-colors flex items-center gap-1.5 text-[#c5a880]">
            <Sparkles className="w-3.5 h-3.5" />
            Atelier 3D Sur-Mesure
          </Link>
          <Link href="#collections" className="hover:text-white transition-colors">
            Collections
          </Link>
          <Link href="#haute-couture" className="hover:text-white transition-colors">
            Savoir-Faire
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={openCart}
            className="relative p-2.5 bg-[#141418] border border-[#2b2b35] hover:border-[#c5a880] text-neutral-200 transition-all rounded-none"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#c5a880] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section Cinematográfica */}
      <main className="relative px-8 md:px-16 py-20 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-[#302a20] bg-[#16130e] px-4 py-1.5 mb-8">
          <Gem className="w-3.5 h-3.5 text-[#c5a880]" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
            Haute Joaillerie Contemporaine
          </span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight leading-[1.1] mb-8">
          L'Élégance Pure, <br />
          <span className="italic font-serif text-[#e5c28e]">Façonnée en 3D Temps Réel.</span>
        </h1>

        <p className="text-neutral-400 max-w-2xl text-sm md:text-base leading-relaxed font-light mb-12">
          Experimenta la unión entre el clasicismo centenario de la Place Vendôme y el vanguardismo
          digital. Modela tu solitario imperial, previsualiza gemas y oro en tiempo real y finaliza
          tu pedido con pasarela segura para Colombia.
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <Link
            href="/customizer"
            className="px-10 py-4 bg-[#c5a880] hover:bg-[#d6ba94] text-black font-semibold text-xs tracking-[0.25em] uppercase transition-all shadow-xl shadow-[#c5a880]/10"
          >
            Entrar al Configurador 3D
          </Link>
          <Link
            href="#collections"
            className="px-8 py-4 border border-[#33333f] hover:border-[#c5a880] text-neutral-300 hover:text-white text-xs tracking-[0.25em] uppercase transition-colors"
          >
            Ver Colección Prêt-à-Porter
          </Link>
        </div>

        {/* Pilares de Marca y Seguridad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-28 w-full text-left border-t border-[#1e1e26] pt-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#c5a880]">
              <Compass className="w-4 h-4" />
              <h3 className="font-serif text-sm uppercase tracking-wider text-white">Visualización Háptica 3D</h3>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Pasa el cursor sobre diamantes, esmeraldas de Muzo y platino para ver la dispersión de luz en vivo sin tiempos de carga.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#c5a880]">
              <Shield className="w-4 h-4" />
              <h3 className="font-serif text-sm uppercase tracking-wider text-white">Seguridad & Wompi Colombia</h3>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Pagos con PSE, Nequi y tarjetas verificados mediante SHA-256 integrity checks y protección contra Prototype Pollution.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#c5a880]">
              <Gem className="w-4 h-4" />
              <h3 className="font-serif text-sm uppercase tracking-wider text-white">Gemas Certificadas GIA</h3>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Cada creación incluye certificado gemológico internacional y estuche de cuero grabado a mano.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}