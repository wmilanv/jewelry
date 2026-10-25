'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag, Gift, ShieldCheck, Gem } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { Media } from '@/components/ui/Media';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const settings = useStoreData((s) => s.settings);
  const subtotal = getSubtotal();
  const remaining = Math.max(0, settings.shipping.freeFrom - subtotal);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-bg border-l border-line flex flex-col transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent block">Haute Joaillerie</span>
            <h2 className="font-display text-2xl">Tu Joyero Privado</h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="w-8 h-8 rounded-full border border-line flex items-center justify-center hover:bg-ink hover:text-bg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {items.length > 0 && settings.shipping.freeFrom > 0 && (
          <div className="px-6 py-3 border-b border-line text-xs text-muted bg-surface/30">
            {remaining > 0 ? (
              <>Te faltan <b className="text-accent">{formatMoney(remaining, settings)}</b> para envío asegurado de cortesía</>
            ) : (
              <span className="text-accent font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> ¡Tu envío asegurado es de cortesía!
              </span>
            )}
            <div className="h-1 bg-line mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / settings.shipping.freeFrom) * 100)}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-muted py-12">
              <ShoppingBag className="w-12 h-12 opacity-30 stroke-1" />
              <div>
                <p className="font-display text-2xl text-ink uppercase">Tu joyero está vacío</p>
                <p className="text-xs text-muted mt-1 max-w-xs">
                  Explora nuestras colecciones exclusivas en oro 18K y gemas de autor.
                </p>
              </div>
              <Link href="/tienda" onClick={closeCart} className="btn-outline text-xs mt-2">
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-5 border-b border-line/60">
                  <Media src={item.image} art={item.art} alt={item.title} className="w-20 h-20 shrink-0 rounded-2xl border border-line overflow-hidden" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-display text-lg uppercase leading-tight truncate">{item.title}</h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted hover:text-red-400 transition"
                        aria-label="Quitar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.variantLabel && (
                      <p className="text-[11px] text-muted mt-1 line-clamp-2 leading-relaxed">{item.variantLabel}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-line rounded-full overflow-hidden px-1">
                        <button className="p-1 text-muted hover:text-ink" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Menos">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                        <button className="p-1 text-muted hover:text-ink" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Más">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-accent">{formatMoney(item.price * item.quantity, settings)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empaque de regalo de cortesía */}
              <div className="rounded-2xl border border-line bg-surface/40 p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="rounded border-line text-accent focus:ring-accent"
                  />
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-accent" /> ¿Es un regalo? Empaque de Gala de cortesía
                  </span>
                </label>
                {giftWrap && (
                  <div className="space-y-2 pt-1 border-t border-line/40">
                    <p className="text-[11px] text-muted">
                      Incluye estuche de terciopelo esmeralda con sello en lacre de oro y tarjeta personalizada.
                    </p>
                    <textarea
                      rows={2}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Dedicatoria o mensaje para la tarjeta caligrafiada..."
                      className="w-full bg-surface border border-line rounded-xl p-2.5 text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-accent"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line p-6 space-y-4 bg-surface/20">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-wider text-muted">Subtotal</span>
              <span className="font-display text-2xl text-accent">{formatMoney(subtotal, settings)}</span>
            </div>
            <p className="text-[11px] text-muted">
              Impuestos incluidos. Envío blindado y certificado oficial a la entrega.
            </p>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full shadow-xl">
              Finalizar pedido de gala <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted/80 pt-2 border-t border-line/40">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-accent" /> Pago Seguro</span>
              <span className="flex items-center gap-1"><Gem className="w-3 h-3 text-accent" /> Oro 18K Certificado</span>
              <span>Ajuste de talla 60d</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}