'use client';
import React, { Suspense, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, ShieldCheck, Truck, Award, Sparkles } from 'lucide-react';
import { useStoreData } from '@/store/useStoreData';
import { Media } from '@/components/ui/Media';
import { ProductCard } from '@/components/ui/ProductCard';

const JewelryCanvas = dynamic(() => import('@/components/3d/JewelryCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse bg-surface/60" />,
});

const ICONS = [Award, Truck, ShieldCheck, Sparkles];

export default function HomePage() {
  const { settings, categories, products } = useStoreData();
  const { hero, sections, customizer } = settings;
  const active = useMemo(() => products.filter((p) => p.active), [products]);
  const featured = useMemo(() => {
    const f = active.filter((p) => p.featured);
    return (f.length ? f : active).slice(0, 8);
  }, [active]);
  const newest = useMemo(() => [...active].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4), [active]);
  const show3D = hero.show3D && customizer.enabled && !hero.imageUrl;

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgb(var(--accent)/0.14),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center min-h-[560px]">
          <div className="space-y-6 fade-up">
            {hero.eyebrow && <span className="eyebrow">{hero.eyebrow}</span>}
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] font-medium">{hero.title}</h1>
            <p className="text-muted text-base md:text-lg max-w-lg leading-relaxed">{hero.subtitle}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              {hero.ctaLabel && (
                <Link href={hero.ctaHref || '/tienda'} className="btn-primary">
                  {hero.ctaLabel} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {hero.secondaryLabel && (
                <Link href={hero.secondaryHref || '/tienda'} className="btn-outline">
                  {hero.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
          <div className="relative h-[380px] md:h-[500px]">
            {hero.imageUrl ? (
              <Media src={hero.imageUrl} art={{ kind: 'box', color: '#888' }} alt={hero.title} className="w-full h-full" />
            ) : show3D ? (
              <Suspense fallback={null}>
                <JewelryCanvas
                  metalColor={customizer.metals[0]?.color ?? '#ffd24a'}
                  gemColor={customizer.gems[0]?.color ?? '#ffffff'}
                  carats={1.5}
                />
              </Suspense>
            ) : (
              <Media src="" art={featured[0]?.art ?? { kind: 'box', color: '#c5a880' }} alt="" className="w-full h-full border border-line" />
            )}
            {show3D && (
              <span className="absolute bottom-0 right-0 text-[10px] uppercase tracking-[0.3em] text-muted">Arrastra para girar</span>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 pt-20">
          <h2 className="font-display text-4xl text-center mb-10">{sections.categoriesTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((c) => (
              <Link key={c.id} href={`/tienda?cat=${c.slug}`} className="group relative aspect-[4/5] border border-line hover:border-accent transition overflow-hidden">
                <Media src={c.image} art={c.art} alt={c.name} className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-5">
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-accent inline-flex items-center gap-1.5 mt-1">
                    Ver todo <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* DESTACADOS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-24">
        <div className="text-center mb-12 space-y-2">
          <h2 className="font-display text-4xl">{sections.featuredTitle}</h2>
          <p className="text-muted text-sm">{sections.featuredSubtitle}</p>
        </div>
        {featured.length === 0 ? (
          <p className="text-center text-muted">Aún no hay productos. Agrégalos desde <Link href="/admin" className="text-accent underline">/admin</Link>.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        <div className="text-center mt-12">
          <Link href="/tienda" className="btn-outline">Ver todos los productos</Link>
        </div>
      </section>

      {/* PERSONALIZADOR */}
      {customizer.enabled && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 pt-24">
          <div className="border border-line bg-surface/50 grid md:grid-cols-2 items-center overflow-hidden">
            <div className="p-10 md:p-16 space-y-5">
              <span className="eyebrow">{customizer.subtitle}</span>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">{customizer.title}</h2>
              <p className="text-muted leading-relaxed">
                Elige el metal, la piedra y los quilates. Mira tu pieza en 3D en tiempo real y conoce el precio al instante.
              </p>
              <Link href="/personalizador" className="btn-primary">Empezar a diseñar <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="h-72 md:h-[420px] bg-gradient-to-br from-black/30 to-transparent">
              <Suspense fallback={null}>
                <JewelryCanvas metalColor={customizer.metals[1]?.color ?? '#e8a598'} gemColor={customizer.gems[1]?.color ?? '#12c45a'} carats={1.2} interactive={false} />
              </Suspense>
            </div>
          </div>
        </section>
      )}

      {/* NOVEDADES */}
      {newest.length > 0 && active.length > 4 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 pt-24">
          <h2 className="font-display text-4xl text-center mb-12">Novedades</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
            {newest.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* BENEFICIOS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-line py-12">
          {sections.benefits.map((b, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={i} className="text-center space-y-3">
                <Icon className="w-6 h-6 mx-auto text-accent" />
                <h4 className="font-display text-xl">{b.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{b.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter title={sections.newsletterTitle} text={sections.newsletterText} />
    </div>
  );
}

function Newsletter({ title, text }: { title: string; text: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <section className="max-w-2xl mx-auto px-5 pt-24 text-center space-y-4">
      <h2 className="font-display text-4xl">{title}</h2>
      <p className="text-muted text-sm">{text}</p>
      {done ? (
        <p className="text-accent text-sm pt-2">¡Gracias por suscribirte!</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="flex gap-2 pt-2">
          <input type="email" required placeholder="tu@correo.com" className="input" />
          <button className="btn-primary shrink-0">Suscribirme</button>
        </form>
      )}
    </section>
  );
}
