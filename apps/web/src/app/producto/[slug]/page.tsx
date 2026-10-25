'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
  Check,
  Sparkles,
  ShieldCheck,
  Gem,
  Package,
  Ruler,
  X,
  ChevronDown,
} from 'lucide-react';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { useCartStore } from '@/store/useCartStore';
import { Media } from '@/components/ui/Media';
import { ProductCard } from '@/components/ui/ProductCard';
import { Reveal, SplitTitle } from '@/components/fx/Reveal';

function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const sizes = [
    { us: '4', eu: '47', mm: '14.9', circ: '46.8' },
    { us: '5', eu: '49', mm: '15.7', circ: '49.3' },
    { us: '6', eu: '52', mm: '16.5', circ: '51.9' },
    { us: '6.5', eu: '53', mm: '16.9', circ: '53.1' },
    { us: '7', eu: '54', mm: '17.3', circ: '54.4' },
    { us: '7.5', eu: '55', mm: '17.7', circ: '55.7' },
    { us: '8', eu: '57', mm: '18.1', circ: '57.0' },
    { us: '9', eu: '59', mm: '18.9', circ: '59.5' },
    { us: '10', eu: '62', mm: '19.8', circ: '62.1' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-[2rem] bg-surface border border-line p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <span className="eyebrow block">Guide des Tailles</span>
            <h3 className="font-display uppercase text-2xl mt-1">Guía de Medidas de Anillo</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:bg-ink hover:text-bg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          Cada anillo de Atelier Vendôme se forja con precisión milimétrica. Si no conoces la talla exacta, nuestro servicio de cortesía incluye un <b>primer ajuste de medida gratuito durante los primeros 60 días</b> tras la entrega.
        </p>

        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.04] text-[10px] uppercase tracking-wider text-muted border-b border-line">
              <tr>
                <th className="py-2.5 px-3">Talla US</th>
                <th className="py-2.5 px-3">Talla Europa</th>
                <th className="py-2.5 px-3">Diámetro Interior</th>
                <th className="py-2.5 px-3">Circunferencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {sizes.map((s) => (
                <tr key={s.us} className="hover:bg-white/[0.02]">
                  <td className="py-2 px-3 font-semibold text-accent">{s.us}</td>
                  <td className="py-2 px-3">{s.eu}</td>
                  <td className="py-2 px-3">{s.mm} mm</td>
                  <td className="py-2 px-3 text-muted">{s.circ} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl bg-white/[0.03] p-4 text-xs space-y-2 border border-line/60">
          <h4 className="font-semibold text-ink flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> ¿Cómo medir en casa?
          </h4>
          <p className="text-muted leading-relaxed">
            Rodea el nudillo del dedo deseado con una tira de papel fino, marca el punto de encuentro con un bolígrafo y mide los milímetros con una regla plana.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, categories, settings, hydrated } = useStoreData();
  const addItem = useCartStore((s) => s.addItem);
  const product = products.find((p) => p.slug === slug && p.active);

  const [selected, setSelected] = useState<Record<string, number>>({});
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeModal, setSizeModal] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'cert' | 'craft' | 'shipping' | null>('cert');

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
      <SizeGuideModal isOpen={sizeModal} onClose={() => setSizeModal(false)} />

      <Link href="/tienda" className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted hover:text-accent mb-8">
        <ChevronLeft className="w-4 h-4" /> Volver a colecciones
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Galería */}
        <Reveal y={30} className="space-y-4 sticky top-28">
          <Media src={product.images[img]} art={product.art} alt={product.name} className="aspect-[4/5] rounded-[2rem] border border-line shadow-2xl" />
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImg(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border transition ${i === img ? 'border-accent shadow-md scale-105' : 'border-line opacity-70 hover:opacity-100'}`}
                >
                  <Media src={src} art={product.art} alt="" className="w-full h-full" />
                </button>
              ))}
            </div>
          )}

          {/* Insignias de confianza bajo la foto */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] uppercase tracking-wider text-muted">
            <div className="rounded-xl border border-line/60 p-2.5">
              <Gem className="w-3.5 h-3.5 mx-auto text-accent mb-1" />
              Oro 18K / GIA
            </div>
            <div className="rounded-xl border border-line/60 p-2.5">
              <ShieldCheck className="w-3.5 h-3.5 mx-auto text-accent mb-1" />
              Póliza Asegurada
            </div>
            <div className="rounded-xl border border-line/60 p-2.5">
              <Package className="w-3.5 h-3.5 mx-auto text-accent mb-1" />
              Estuche de Gala
            </div>
          </div>
        </Reveal>

        {/* Info */}
        <Reveal y={40} delay={0.1} className="space-y-7">
          <div className="space-y-3 border-b border-line pb-6">
            <div className="flex items-center justify-between">
              {category && <span className="eyebrow">{category.name}</span>}
              <button
                onClick={() => setSizeModal(true)}
                className="text-[10px] uppercase tracking-[0.2em] text-accent hover:underline flex items-center gap-1 font-medium"
              >
                <Ruler className="w-3.5 h-3.5" /> Guía de Tallas
              </button>
            </div>
            <SplitTitle text={product.name} trigger="now" className="font-display uppercase text-4xl md:text-6xl leading-[0.95]" />
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl md:text-3xl font-medium text-accent">{formatMoney(unit, settings)}</span>
              {discount > 0 && (
                <>
                  <span className="text-muted line-through">{formatMoney(product.compareAtPrice, settings)}</span>
                  <span className="text-xs rounded-full border border-accent/50 text-accent px-3 py-0.5">-{discount}%</span>
                </>
              )}
            </div>
          </div>

          <p className="text-muted leading-relaxed text-sm md:text-base">{product.description}</p>

          {/* Opciones de producto */}
          {product.options.map((o, i) => (
            <div key={o.name} className="space-y-2">
              <span className="label">
                {o.name}: <b className="text-ink normal-case tracking-normal">{o.values[choice(i)]?.label}</b>
              </span>
              <div className="flex flex-wrap gap-2">
                {o.values.map((v, vi) => (
                  <button
                    key={v.label}
                    onClick={() => setSelected({ ...selected, [o.name]: vi })}
                    className={`px-5 py-2.5 rounded-full text-xs border transition ${choice(i) === vi ? 'border-accent bg-accent text-on-accent font-semibold shadow-md' : 'border-line text-muted hover:border-ink/60 hover:text-ink'}`}
                  >
                    {v.label}
                    {v.priceDelta !== 0 && <span className="opacity-75"> ({v.priceDelta > 0 ? '+' : ''}{formatMoney(v.priceDelta, settings)})</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Acciones de compra */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <div className="flex items-center rounded-full border border-ink/25 px-2">
                <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Menos"><Minus className="w-3.5 h-3.5" /></button>
                <span className="w-8 text-center text-sm font-medium">{qty}</span>
                <button className="p-3" onClick={() => setQty(Math.min(maxQty, qty + 1))} aria-label="Más"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              <button onClick={add} disabled={soldOut} className="btn-primary flex-1 shadow-lg">
                {soldOut ? 'Agotado' : added ? (<><Check className="w-4 h-4" /> Agregado al joyero</>) : (<><ShoppingBag className="w-4 h-4" /> Agregar al carrito</>)}
              </button>
            </div>

            {/* Acceso directo a personalizar en 3D */}
            <Link
              href="/personalizador"
              className="w-full rounded-full border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent transition py-3.5 px-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] font-medium"
            >
              <Sparkles className="w-4 h-4" /> Personalizar esta silueta en Atelier 3D
            </Link>

            {wa && (
              <a href={`https://wa.me/${wa}?text=${waText}`} target="_blank" rel="noreferrer" className="btn-outline w-full">
                <MessageCircle className="w-4 h-4" /> Consultar con un maestro gemólogo por WhatsApp
              </a>
            )}
          </div>

          <div className="text-xs text-muted space-y-1 border-t border-line pt-5">
            {product.stock > 0 && product.stock <= 5 && <p className="text-accent font-medium">¡Pieza única: solo quedan {product.stock} unidades disponibles en bóveda!</p>}
            {product.sku && <p>Referencia de Archivo: {product.sku}</p>}
            <p>{settings.shipping.note}</p>
          </div>

          {/* Acordeón de Excelencia Maison */}
          <div className="border-t border-line pt-5 space-y-3">
            {/* 1. Especificaciones */}
            <div className="rounded-2xl border border-line/80 overflow-hidden bg-surface/40">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'cert' ? null : 'cert')}
                className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-accent transition"
              >
                <span className="flex items-center gap-2">
                  <Gem className="w-4 h-4 text-accent" /> Ficha Técnica & Gemológica
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === 'cert' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'cert' && (
                <div className="p-4 pt-0 border-t border-line/40 text-xs text-muted space-y-3">
                  {product.specs.length > 0 ? (
                    <dl className="divide-y divide-line/40">
                      {product.specs.map((s) => (
                        <div key={s.label} className="flex justify-between py-2">
                          <dt className="text-muted">{s.label}</dt>
                          <dd className="text-ink font-medium">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p>Montura en Oro Macizo 18K (750/1000). Gemas naturales seleccionadas bajo lupa 10x y certificadas con número de serie.</p>
                  )}
                </div>
              )}
            </div>

            {/* 2. Savoir-Faire */}
            <div className="rounded-2xl border border-line/80 overflow-hidden bg-surface/40">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'craft' ? null : 'craft')}
                className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-accent transition"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" /> Savoir-Faire de la Maison
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === 'craft' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'craft' && (
                <div className="p-4 pt-0 border-t border-line/40 text-xs text-muted space-y-2 leading-relaxed">
                  <p>
                    Cada creación de Atelier Vendôme es concebida y forjada individualmente por maestros orfebres. Empleamos oro de abastecimiento ético y gemas libres de conflicto bajo el Proceso Kimberley.
                  </p>
                  <p>
                    El acabado final incluye un pulido de tres fases a espejo y rodinado suizo de alta durabilidad.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Empaque & Entrega */}
            <div className="rounded-2xl border border-line/80 overflow-hidden bg-surface/40">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                className="w-full p-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] font-medium text-ink hover:text-accent transition"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-accent" /> Empaque de Gala & Entrega Blindada
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'shipping' && (
                <div className="p-4 pt-0 border-t border-line/40 text-xs text-muted space-y-2 leading-relaxed">
                  <p>
                    Su pieza viaja en un estuche rígido de terciopelo verde esmeralda con sello en lacre de oro, acompañado del certificado gemológico oficial en sobre grabado.
                  </p>
                  <p>
                    Todos los envíos nacionales e internacionales están asegurados al 100% de su valor comercial y requieren firma personal a la entrega.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="pt-28">
          <SplitTitle text="Piezas complementarias" className="font-display uppercase text-4xl md:text-5xl mb-12" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
