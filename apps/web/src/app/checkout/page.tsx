'use client';
import React, { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, MessageCircle } from 'lucide-react';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { useCartStore } from '@/store/useCartStore';
import { Media } from '@/components/ui/Media';
import type { OrderRecord } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function CheckoutPage() {
  const router = useRouter();
  const settings = useStoreData((s) => s.settings);
  const addOrder = useStoreData((s) => s.addOrder);
  const { items, getSubtotal, clearCart } = useCartStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', notes: '' });
  const [loading, setLoading] = useState<'' | 'wompi' | 'whatsapp'>('');
  const [error, setError] = useState('');

  const subtotal = getSubtotal();
  const shipping = subtotal === 0 || (settings.shipping.freeFrom > 0 && subtotal >= settings.shipping.freeFrom) ? 0 : settings.shipping.flatRate;
  const total = subtotal + shipping;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const wompiAvailable = settings.payments.wompi && !!API_URL && settings.locale.currency === 'COP';
  const waNumber = settings.contact.whatsapp.replace(/\D/g, '');
  const waAvailable = settings.payments.whatsappOrders && !!waNumber;

  const buildOrder = (method: OrderRecord['method']): OrderRecord => ({
    id: crypto.randomUUID(),
    reference: `${settings.payments.orderPrefix || 'PED'}-${Date.now()}`,
    createdAt: Date.now(),
    customer: form,
    items,
    subtotal,
    shipping,
    total,
    method,
    status: 'pendiente',
  });

  const payWompi = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading('wompi');
    try {
      const order = buildOrder('wompi');
      const res = await fetch(`${API_URL}/v1/payments/wompi/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.reference, amountInCents: Math.round(total * 100), currency: 'COP', customerEmail: form.email }),
      });
      if (!res.ok) throw new Error('No se pudo conectar con el servidor de pagos');
      const cfg = await res.json();
      addOrder(order);
      // @ts-ignore widget global de Wompi
      const checkout = new WidgetCheckout({
        currency: cfg.currency,
        amountInCents: cfg.amountInCents,
        reference: cfg.reference,
        publicKey: cfg.publicKey,
        signature: { integrity: cfg.signatureHex },
        redirectUrl: cfg.redirectUrl,
      });
      checkout.open(() => {});
    } catch (err: any) {
      setError(err.message || 'Error al iniciar el pago');
    } finally {
      setLoading('');
    }
  };

  const orderWhatsapp = () => {
    const f = document.getElementById('checkout-form') as HTMLFormElement;
    if (!f.reportValidity()) return;
    setLoading('whatsapp');
    const order = buildOrder('whatsapp');
    addOrder(order);
    const lines = [
      `*Nuevo pedido ${order.reference}*`,
      ...items.map((i) => `• ${i.quantity} x ${i.title}${i.variantLabel ? ` (${i.variantLabel})` : ''} — ${formatMoney(i.price * i.quantity, settings)}`),
      `Subtotal: ${formatMoney(subtotal, settings)}`,
      `Envío: ${shipping ? formatMoney(shipping, settings) : 'Gratis'}`,
      `*Total: ${formatMoney(total, settings)}*`,
      '',
      `Cliente: ${form.name}`,
      `Email: ${form.email}`,
      `Teléfono: ${form.phone}`,
      `Dirección: ${form.address}, ${form.city}`,
      form.notes && `Notas: ${form.notes}`,
    ].filter(Boolean);
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
    clearCart();
    router.push(`/checkout/confirmation?ref=${order.reference}&via=whatsapp`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-32 text-center space-y-4">
        <h1 className="font-display text-4xl">Tu carrito está vacío</h1>
        <Link href="/tienda" className="btn-primary">Ir a la tienda</Link>
      </div>
    );
  }

  return (
    <>
      {wompiAvailable && <Script src="https://checkout.wompi.co/widget.js" strategy="lazyOnload" />}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        <Link href="/tienda" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted hover:text-accent mb-8">
          <ArrowLeft className="w-4 h-4" /> Seguir comprando
        </Link>

        <div className="grid md:grid-cols-5 gap-12">
          <form id="checkout-form" onSubmit={payWompi} className="md:col-span-3 space-y-5">
            <div className="border-b border-line pb-4">
              <span className="eyebrow">Pago seguro</span>
              <h1 className="font-display text-4xl mt-1">Finalizar compra</h1>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">Nombre completo</label><input required className="input" value={form.name} onChange={set('name')} /></div>
              <div><label className="label">Correo electrónico</label><input required type="email" className="input" value={form.email} onChange={set('email')} /></div>
              <div><label className="label">Teléfono / WhatsApp</label><input required className="input" value={form.phone} onChange={set('phone')} /></div>
              <div><label className="label">Ciudad</label><input required className="input" value={form.city} onChange={set('city')} /></div>
            </div>
            <div><label className="label">Dirección de entrega</label><input required className="input" value={form.address} onChange={set('address')} /></div>
            <div><label className="label">Notas del pedido (opcional)</label><textarea rows={3} className="input" value={form.notes} onChange={set('notes')} /></div>

            {error && <p className="text-sm text-red-400 border border-red-400/30 p-3">{error}</p>}

            <div className="space-y-3 pt-2">
              {wompiAvailable && (
                <button type="submit" disabled={!!loading} className="btn-primary w-full">
                  <Lock className="w-4 h-4" /> {loading === 'wompi' ? 'Conectando…' : `Pagar ${formatMoney(total, settings)} con Wompi`}
                </button>
              )}
              {waAvailable && (
                <button type="button" onClick={orderWhatsapp} disabled={!!loading} className={wompiAvailable ? 'btn-outline w-full' : 'btn-primary w-full'}>
                  <MessageCircle className="w-4 h-4" /> Hacer pedido por WhatsApp
                </button>
              )}
              {!wompiAvailable && !waAvailable && (
                <p className="text-sm text-muted">Configura un método de pago en Admin → Tienda → Pagos.</p>
              )}
              {wompiAvailable && <p className="text-[11px] text-muted text-center">Aceptamos tarjetas, PSE, Nequi y Bancolombia.</p>}
            </div>
          </form>

          <aside className="md:col-span-2 border border-line bg-surface/50 p-6 h-fit space-y-5">
            <h2 className="font-display text-2xl">Resumen</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3">
                  <Media src={i.image} art={i.art} alt={i.title} className="w-16 h-16 shrink-0 border border-line" />
                  <div className="flex-1 text-sm">
                    <p className="font-display text-base leading-tight">{i.title}</p>
                    {i.variantLabel && <p className="text-[11px] text-muted">{i.variantLabel}</p>}
                    <p className="text-xs text-muted mt-1">{i.quantity} × {formatMoney(i.price, settings)}</p>
                  </div>
                </div>
              ))}
            </div>
            <dl className="border-t border-line pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatMoney(subtotal, settings)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Envío</dt><dd>{shipping ? formatMoney(shipping, settings) : 'Gratis (Asegurado)'}</dd></div>
              <div className="flex justify-between text-lg pt-2 border-t border-line"><dt>Total</dt><dd className="font-display text-2xl text-accent">{formatMoney(total, settings)}</dd></div>
            </dl>

            <div className="rounded-xl border border-line bg-surface/80 p-4 space-y-2.5 text-xs">
              <span className="text-[10px] uppercase tracking-[0.25em] text-accent block font-medium">Garantías de la Maison</span>
              <div className="flex items-start gap-2 text-muted">
                <span className="text-accent font-serif">⚜️</span>
                <span><b>Certificado Oficial:</b> Cada pieza se entrega con ficha gemológica y número de serie registrado.</span>
              </div>
              <div className="flex items-start gap-2 text-muted">
                <span className="text-accent font-serif">🔒</span>
                <span><b>Transporte con Seguro Total:</b> Cobertura del 100% hasta la entrega en mano propia.</span>
              </div>
              <div className="flex items-start gap-2 text-muted">
                <span className="text-accent font-serif">✨</span>
                <span><b>Ajuste de Talla Gratuito:</b> Primer redimensionamiento sin costo durante los primeros 60 días.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
