'use client';
import React from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { Media } from '@/components/ui/Media';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const settings = useStoreData((s) => s.settings);
  const subtotal = getSubtotal();
  const remaining = Math.max(0, settings.shipping.freeFrom - subtotal);

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-bg border-l border-line flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="font-display text-2xl">Tu carrito</h2>
          <button onClick={closeCart} aria-label="Cerrar carrito"><X className="w-5 h-5" /></button>
        </div>

        {items.length > 0 && settings.shipping.freeFrom > 0 && (
          <div className="px-6 py-3 border-b border-line text-xs text-muted">
            {remaining > 0 ? (
              <>Te faltan <b className="text-accent">{formatMoney(remaining, settings)}</b> para envío gratis</>
            ) : (
              <span className="text-accent">¡Tienes envío gratis!</span>
            )}
            <div className="h-1 bg-line mt-2">
              <div className="h-full bg-accent transition-all" style={{ width: `${Math.min(100, (subtotal / settings.shipping.freeFrom) * 100)}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-muted">
              <ShoppingBag className="w-10 h-10 opacity-40" />
              <p className="text-sm">Tu carrito está vacío</p>
              <Link href="/tienda" onClick={closeCart} className="btn-outline">Explorar productos</Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-5 border-b border-line">
                <Media src={item.image} art={item.art} alt={item.title} className="w-20 h-20 shrink-0 border border-line" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <h4 className="font-display text-lg leading-tight">{item.title}</h4>
                    <button onClick={() => removeItem(item.id)} className="text-muted hover:text-red-400" aria-label="Quitar"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  {item.variantLabel && <p className="text-[11px] text-muted mt-0.5">{item.variantLabel}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-line">
                      <button className="p-1.5" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Menos"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button className="p-1.5" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Más"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="text-sm font-medium">{formatMoney(item.price * item.quantity, settings)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider text-muted">Subtotal</span>
              <span className="font-display text-2xl text-accent">{formatMoney(subtotal, settings)}</span>
            </div>
            <p className="text-[11px] text-muted">El envío se calcula en el checkout.</p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
              Finalizar compra <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

