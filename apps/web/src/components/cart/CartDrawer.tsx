'use client';
import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { X, Trash2, ArrowRight } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, getTotalCOP } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md h-full bg-[#0d0d10] border-l border-[#24242d] text-neutral-100 flex flex-col p-8 justify-between shadow-2xl">
        {/* Cabecera */}
        <div>
          <div className="flex justify-between items-center border-b border-[#212128] pb-5">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a880] font-mono">Écrin de Joaillerie</span>
              <h2 className="text-xl font-serif tracking-wide text-white">Votre Sélection</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 hover:text-white text-neutral-400 transition-colors"
              aria-label="Cerrar selección"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Joyas */}
          <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {items.length === 0 ? (
              <p className="text-neutral-500 font-serif italic text-center py-12 text-sm">
                Votre écrin est actuellement vide.
              </p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b border-[#1b1b22] pb-4">
                  <div className="space-y-1">
                    <h4 className="font-serif text-sm text-white">{item.title}</h4>
                    {item.isBespoke && item.bespokeConfig && (
                      <p className="text-[10px] text-[#c5a880] tracking-wider uppercase font-mono">
                        {item.bespokeConfig.metal.replace('_', ' ')} • {item.bespokeConfig.gemstone.replace('_', ' ')} • {item.bespokeConfig.carats} ct
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 font-mono">
                      {item.quantity} × ${item.priceCOP.toLocaleString('es-CO')} COP
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Totales y Botón de Checkout */}
        <div className="border-t border-[#212128] pt-6 space-y-4">
          <div className="flex justify-between items-baseline font-mono">
            <span className="text-xs uppercase text-neutral-400">Total Estimé (COP)</span>
            <span className="text-2xl font-serif text-[#e5c28e] font-bold">
              ${getTotalCOP().toLocaleString('es-CO')}
            </span>
          </div>

          <Link
            href="/checkout"
            onClick={closeCart}
            className={`w-full py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] font-bold transition-all ${
              items.length === 0
                ? 'bg-[#1b1b22] text-neutral-600 pointer-events-none'
                : 'bg-[#c5a880] hover:bg-[#d6ba94] text-black shadow-lg shadow-[#c5a880]/15'
            }`}
          >
            <span>Passer à la Caisse (Wompi)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};