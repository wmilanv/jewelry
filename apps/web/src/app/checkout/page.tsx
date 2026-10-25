'use client';
import React, { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotalCOP } = useCartStore();
  const [customerEmail, setCustomerEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const totalCOP = getTotalCOP();

  const handleWompiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderRef = `VENDOME-${Date.now()}`;
      const amountInCents = totalCOP * 100;

      // 1. Obtener la firma de integridad calculada por el backend NestJS
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/v1/payments/wompi/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderRef,
          amountInCents,
          currency: 'COP',
          customerEmail,
        }),
      });

      if (!res.ok) throw new Error('Error al conectar con el servidor de pagos');
      const checkoutConfig = await res.json();

      // 2. Invocar el Widget oficial de Wompi Colombia
      // @ts-ignore
      const checkout = new WidgetCheckout({
        currency: checkoutConfig.currency,
        amountInCents: checkoutConfig.amountInCents,
        reference: checkoutConfig.reference,
        publicKey: checkoutConfig.publicKey,
        signature: { integrity: checkoutConfig.signatureHex },
        redirectUrl: checkoutConfig.redirectUrl,
      });

      checkout.open((result: any) => {
        console.log('Resultado Wompi:', result);
      });
    } catch (err: any) {
      alert('Error al iniciar Wompi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.wompi.co/widget.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-[#08080a] text-neutral-100 px-6 py-12 max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> Revenir à l'Atelier
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Formulario */}
          <div>
            <div className="border-b border-[#212128] pb-4 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c5a880]">Paiement Sécurisé</span>
              <h1 className="font-serif text-3xl text-white mt-1">Finaliser Votre Commande</h1>
              <p className="text-xs text-neutral-400 mt-2">Medios aceptados en Colombia: PSE, Nequi, Bancolombia y Tarjetas.</p>
            </div>

            <form onSubmit={handleWompiPayment} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-300 mb-1">
                  Nom Complet
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean-Luc Picard"
                  className="w-full bg-[#121217] border border-[#2b2b36] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-300 mb-1">
                  Adresse Courriel (Email)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="client@vendome.com"
                  className="w-full bg-[#121217] border border-[#2b2b36] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full py-4 bg-[#c5a880] hover:bg-[#d6ba94] text-black font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Connexion en cours...' : `Payer $${totalCOP.toLocaleString('es-CO')} COP via Wompi`}
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-neutral-500 justify-center pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Chiffrement SSL 256-bit • Signature d'Intégrité SHA-256</span>
              </div>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="bg-[#0f0f14] border border-[#212128] p-6 h-fit">
            <h3 className="font-serif text-lg text-white mb-4">Récapitulatif de Commande</h3>
            <div className="space-y-3 border-b border-[#212128] pb-4 mb-4">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-xs">
                  <span className="text-neutral-300">{i.title} × {i.quantity}</span>
                  <span className="font-mono text-neutral-400">${(i.priceCOP * i.quantity).toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-baseline text-sm font-mono pt-2">
              <span className="text-neutral-400 uppercase">Total à Payer:</span>
              <span className="font-serif text-2xl text-[#e5c28e] font-bold">
                ${totalCOP.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}