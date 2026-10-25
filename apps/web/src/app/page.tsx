'use client';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Sparkles, Compass, ShieldCheck, Gem } from 'lucide-react';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { Media } from '@/components/ui/Media';
import { ProductCard } from '@/components/ui/ProductCard';
import { Marquee, Reveal, ScrubText, SplitTitle } from '@/components/fx/Reveal';
import { Preloader } from '@/components/fx/Preloader';
import type { BandStyleKey, CutShapeKey, SettingStyleKey } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const JewelryCanvas = dynamic(() => import('@/components/3d/JewelryCanvas'), {
  ssr: false,
  loading: () => null,
});

function PillCta({ href, label, dark = false }: { href: string; label: string; dark?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2" data-cursor>
      <span
        className={`rounded-full h-14 px-8 inline-flex items-center text-[11px] uppercase tracking-[0.2em] transition ${
          dark ? 'bg-ink text-bg' : 'bg-white text-black'
        } group-hover:bg-accent group-hover:text-on-accent`}
      >
        {label}
      </span>
      <span
        className={`rounded-full w-14 h-14 inline-flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-45deg] ${
          dark ? 'bg-ink text-bg' : 'bg-white text-black'
        } group-hover:bg-accent group-hover:text-on-accent`}
      >
        <ArrowRight className="w-5 h-5" />
      </span>
    </Link>
  );
}

const BESPOKE_SILHOUETTES: {
  id: SettingStyleKey;
  code: string;
  name: string;
  french: string;
  desc: string;
  cut: CutShapeKey;
  band: BandStyleKey;
  metalColor: string;
  gemColor: string;
  carats: number;
}[] = [
  {
    id: 'solitaire',
    code: 'SILUETA N° 01',
    name: 'Solitario Imperial',
    french: 'Six Griffes Haute Précision',
    desc: 'Seis garras esbeltas elevan la gema para permitir que la luz entre desde los 360 grados con fuego inigualable.',
    cut: 'round',
    band: 'plain',
    metalColor: '#ffd24a',
    gemColor: '#f4fbff',
    carats: 1.8,
  },
  {
    id: 'halo',
    code: 'SILUETA N° 02',
    name: 'Halo Céleste',
    french: 'Couronne Pavé Diamants',
    desc: 'Un anillo orbital de 16 diamantes abraza la piedra central sobre un aro pavé que multiplica su presencia visual.',
    cut: 'oval',
    band: 'pave',
    metalColor: '#e5e8ec',
    gemColor: '#f4fbff',
    carats: 1.6,
  },
  {
    id: 'three-stone',
    code: 'SILUETA N° 03',
    name: 'Trilogía Muzo',
    french: 'Passé · Présent · Futur',
    desc: 'Gema central en talla esmeralda custodiada por dos gemas laterales inclinadas en proporción áurea.',
    cut: 'emerald',
    band: 'plain',
    metalColor: '#ffd24a',
    gemColor: '#0eb854',
    carats: 2.1,
  },
  {
    id: 'cathedral',
    code: 'SILUETA N° 04',
    name: 'Catedral Vendôme',
    french: 'Arche Architecturale',
    desc: 'Arcos tensados emergen desde los hombros del aro para sostener la galería como una bóveda gótica.',
    cut: 'princess',
    band: 'split',
    metalColor: '#e8a598',
    gemColor: '#f4a9bc',
    carats: 1.7,
  },
  {
    id: 'bezel',
    code: 'SILUETA N° 05',
    name: 'Bisel Modernista',
    french: 'Serti Clos Contemporain',
    desc: 'Un collarín continuo de oro macizo esculpido a mano protege el perímetro de la gema con pureza minimalista.',
    cut: 'pear',
    band: 'twisted',
    metalColor: '#ffd24a',
    gemColor: '#1e5fd9',
    carats: 1.65,
  },
  {
    id: 'vintage',
    code: 'SILUETA N° 06',
    name: 'Roseta Art Déco',
    french: 'Octogone Milgrain 1925',
    desc: 'Geometría octogonal inspirada en la Place Vendôme de los años veinte con perlado milgrain y filo de cuchillo.',
    cut: 'emerald',
    band: 'knife',
    metalColor: '#dec49a',
    gemColor: '#d9112b',
    carats: 2.0,
  },
  {
    id: 'toi-et-moi',
    code: 'SILUETA N° 07',
    name: 'Toi et Moi Imperial',
    french: 'Deux Âmes Entrelacées',
    desc: 'Dos gemas encontradas en diálogo asimétrico: la silueta histórica de Napoleón y Josefina reinterpretada en clave contemporánea.',
    cut: 'pear',
    band: 'plain',
    metalColor: '#ffd24a',
    gemColor: '#0eb854',
    carats: 2.2,
  },
  {
    id: 'cluster',
    code: 'SILUETA N° 08',
    name: 'Cluster Floral Marquise',
    french: 'Bouquet de Lumière',
    desc: 'Corona botánica de 8 pétalos tallados que rodean el corazón de la gema como una flor de alta costura.',
    cut: 'round',
    band: 'beaded',
    metalColor: '#e8a598',
    gemColor: '#f4a9bc',
    carats: 1.9,
  },
  {
    id: 'signet',
    code: 'SILUETA N° 09',
    name: 'Sello Real Chevalière',
    french: 'Chevalière Massive 18k',
    desc: 'Meseta arquitectónica de oro macizo con gema empotrada a ras, ideal para escudos o heráldica personal.',
    cut: 'asscher',
    band: 'plain',
    metalColor: '#ffd24a',
    gemColor: '#0a0a0d',
    carats: 1.5,
  },
  {
    id: 'tiara',
    code: 'SILUETA N° 10',
    name: 'Tiara Imperial',
    french: 'Diadème Souverain',
    desc: 'Arco coronado por cinco agujas de diamante sobre aro en V que enmarca la piedra con dramatismo real.',
    cut: 'marquise',
    band: 'chevron',
    metalColor: '#e5e8ec',
    gemColor: '#f4fbff',
    carats: 1.85,
  },
];

export default function HomePage() {
  const { settings, categories, products } = useStoreData();
  const { hero, sections, customizer, brand } = settings;
  const active = useMemo(() => products.filter((p) => p.active), [products]);
  const featured = useMemo(() => {
    const f = active.filter((p) => p.featured);
    return (f.length ? f : active).slice(0, 8);
  }, [active]);

  const [introDone, setIntroDone] = useState(false);
  const [heroSilIdx, setHeroSilIdx] = useState(0);
  const [activeSilIdx, setActiveSilIdx] = useState(1);

  const show3D = hero.show3D && customizer.enabled && !hero.imageUrl;
  const heroSil = BESPOKE_SILHOUETTES[heroSilIdx] ?? BESPOKE_SILHOUETTES[0];
  const showcaseSil = BESPOKE_SILHOUETTES[activeSilIdx] ?? BESPOKE_SILHOUETTES[0];

  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!introDone) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-fade]', { opacity: 0, y: 24, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.4 });
      gsap.from(bottomRef.current, { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.6 });
      gsap.to(bgRef.current, {
        yPercent: 10,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, heroRef);
    return () => ctx.revert();
  }, [introDone]);

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => clearTimeout(id);
  }, [products.length, categories.length]);

  /* Vista previa flotante al pasar sobre las categorías */
  const [hoverCat, setHoverCat] = useState(-1);
  const preview = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = preview.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' });
    const move = (e: MouseEvent) => {
      x(e.clientX);
      y(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  useEffect(() => {
    if (preview.current) {
      gsap.to(preview.current, {
        opacity: hoverCat >= 0 ? 1 : 0,
        scale: hoverCat >= 0 ? 1 : 0.82,
        duration: 0.45,
        ease: 'power3.out',
      });
    }
  }, [hoverCat]);

  const marqueeItems = [
    brand.name,
    'OR 18K CERTIFIÉ',
    'ATELIER BESPOKE 360°',
    'ESMERALDAS DE MUZO',
    'DIAMANTES GIA',
    brand.tagline,
  ];

  return (
    <div>
      <Preloader onDone={() => setIntroDone(true)} />

      {/* ======================= 1. HERO ENMARCADO DE LUJO ======================= */}
      <section className="px-3 md:px-5">
        <div
          ref={heroRef}
          className="relative rounded-[2.2rem] overflow-hidden bg-[#08080b] text-[#f4efe6] min-h-[calc(100vh-6.5rem)] flex flex-col border border-white/10 shadow-2xl"
        >
          {/* Marco editorial interior estilo revista francesa */}
          <div className="pointer-events-none absolute inset-4 md:inset-6 rounded-[1.6rem] border border-white/[0.07] z-10" />

          {/* Fondo atmosférico + Escena 3D interactiva */}
          <div ref={bgRef} className="absolute inset-0">
            {hero.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgb(var(--accent)/0.24),transparent_58%),radial-gradient(ellipse_at_20%_90%,rgba(255,255,255,0.06),transparent_50%)]" />
            )}
            {show3D && introDone && (
              <div className="absolute inset-y-0 right-0 w-full lg:w-[66%]">
                <Suspense fallback={null}>
                  <JewelryCanvas
                    metalColor={heroSil.metalColor}
                    gemColor={heroSil.gemColor}
                    carats={heroSil.carats}
                    settingStyle={heroSil.id}
                    cutShape={heroSil.cut}
                    bandStyle={heroSil.band}
                  />
                </Suspense>
              </div>
            )}
          </div>

          {/* Cabecera técnica dentro del Hero (Coordenadas + Selector rápido de silueta 3D) */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-8 md:px-14 pt-8 md:pt-11 text-[10px] uppercase tracking-[0.3em] text-white/55">
            <span data-hero-fade>{hero.eyebrow || 'HAUTE JOAILLERIE · ARCHIVE 2026'}</span>
            {show3D && (
              <div data-hero-fade className="flex flex-wrap items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 p-1">
                {BESPOKE_SILHOUETTES.slice(0, 4).map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setHeroSilIdx(idx)}
                    className={`px-3 py-1 rounded-full text-[9px] tracking-[0.2em] transition ${
                      heroSilIdx === idx ? 'bg-accent text-on-accent font-semibold' : 'text-white/65 hover:text-white'
                    }`}
                  >
                    {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Titular monumental */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-14 py-10 pointer-events-none">
            <div data-hero-title>
              {introDone ? (
                <SplitTitle
                  text={hero.title}
                  trigger="now"
                  delay={0.15}
                  className="font-display uppercase leading-[0.9] tracking-[0.02em] text-[clamp(2.8rem,8.5vw,8.6rem)] max-w-[13ch]"
                />
              ) : (
                <h1 className="font-display uppercase leading-[0.9] text-[clamp(2.8rem,8.5vw,8.6rem)] max-w-[13ch] opacity-0">
                  {hero.title}
                </h1>
              )}
            </div>

            {show3D && (
              <div data-hero-fade className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-accent">
                <span className="inline-block w-8 h-px bg-accent" />
                <span>
                  {heroSil.code}: {heroSil.name} · Talla {heroSil.cut.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Barra flotante inferior cristalina */}
          <div
            ref={bottomRef}
            className="relative z-20 m-4 md:m-7 rounded-[1.6rem] bg-black/60 backdrop-blur-2xl border border-white/15 px-6 md:px-10 py-6 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10"
          >
            <div className="shrink-0">
              <span className="font-display uppercase text-3xl md:text-5xl tracking-[0.14em] leading-none block">
                {brand.name}
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-accent block mt-1">
                4°39&apos;N 74°03&apos;W · BOGOTÁ
              </span>
            </div>
            <p className="text-xs md:text-[13px] text-white/70 leading-relaxed max-w-xl flex-1">{hero.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4 pointer-events-auto">
              {hero.secondaryLabel && (
                <Link
                  href={hero.secondaryHref || '/personalizador'}
                  className="text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-accent underline underline-offset-8 decoration-white/30 transition"
                >
                  {hero.secondaryLabel}
                </Link>
              )}
              {hero.ctaLabel && <PillCta href={hero.ctaHref || '/tienda'} label={hero.ctaLabel} />}
            </div>
          </div>
        </div>
      </section>

      {/* ======================= 2. BANDA CINÉTICA ======================= */}
      <Marquee
        items={marqueeItems}
        className="py-12 md:py-16 font-display uppercase text-[clamp(2.4rem,6.5vw,5.5rem)] leading-none outline-text"
      />

      {/* ======================= 3. MANIFIESTO DE LA MAISON ======================= */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-3 space-y-2">
            <span className="eyebrow block">01 / Savoir-Faire</span>
            <span className="text-xs text-muted block">Manifiesto de la Maison</span>
          </div>
          <div className="md:col-span-9">
            <ScrubText
              text={brand.description}
              className="font-display text-[clamp(1.75rem,4vw,3.6rem)] leading-[1.14]"
            />
          </div>
        </div>
      </section>

      {/* ======================= 4. ATELIER BESPOKE: 6 SILUETAS 3D ======================= */}
      {customizer.enabled && (
        <section className="px-3 md:px-5 pt-10">
          <div className="rounded-[2.4rem] bg-[#0b0b0f] text-[#f4efe6] border border-white/10 overflow-hidden p-6 md:p-14 lg:p-16">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8 mb-10">
              <div>
                <span className="eyebrow block mb-3">02 / {customizer.subtitle}</span>
                <SplitTitle
                  text="12 Siluetas. Joyas 360° + IA 2D a 3D."
                  className="font-display uppercase text-4xl md:text-6xl leading-[0.95]"
                />
              </div>
              <p className="text-xs md:text-sm text-white/60 max-w-md leading-relaxed">
                Diseña anillos, collares, aretes o brazaletes con 12 monturas, 10 tallas de gema y 8 aros, o sube una imagen plana (logo, dibujo, escudo) para convertirla en una joya 3D real.
              </p>
            </div>

            {/* Banner destacado Estudio IA 2D -> 3D */}
            <div className="mb-10 rounded-2xl border border-accent/35 bg-gradient-to-r from-accent/15 via-white/[0.03] to-transparent p-5 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-accent">
                  <Sparkles className="w-3.5 h-3.5" /> Nuevo · Escultor 2D → 3D Instantáneo + Meshy AI / Tripo3D
                </div>
                <h3 className="font-display uppercase text-2xl md:text-3xl">
                  ¿Tu cliente tiene un boceto, logo, firma o foto? Súbelo y conviértelo en Oro 18k o Platino 3D
                </h3>
                <p className="text-xs text-white/65 leading-relaxed">
                  Nuestro motor esculpe al instante cualquier imagen plana en un medallón, anillo de sello o dije calado en 3D sin costo, y además integra generación de mallas completas vía Meshy AI / Tripo3D o carga directa de archivos .GLB.
                </p>
              </div>
              <div className="shrink-0">
                <PillCta href="/personalizador?type=ai-relief" label="Probar Estudio 2D → 3D" />
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Lista de siluetas */}
              <div className="lg:col-span-5 space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                {BESPOKE_SILHOUETTES.map((sil, i) => {
                  const isCurrent = activeSilIdx === i;
                  return (
                    <div
                      key={sil.id}
                      onMouseEnter={() => setActiveSilIdx(i)}
                      onClick={() => setActiveSilIdx(i)}
                      className={`cursor-pointer rounded-2xl border p-4 md:p-5 transition-all ${
                        isCurrent
                          ? 'border-accent bg-white/[0.05] shadow-lg'
                          : 'border-white/10 hover:border-white/25 bg-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] tracking-[0.25em] text-accent font-mono">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="font-display uppercase text-xl md:text-2xl leading-none">
                              {sil.name}
                            </h3>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                              {sil.french}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/personalizador?style=${sil.id}&cut=${sil.cut}&band=${sil.band}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 hover:border-accent hover:bg-accent hover:text-on-accent px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] transition"
                        >
                          Personalizar <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      {isCurrent && (
                        <p className="text-xs text-white/65 leading-relaxed mt-3 pl-7">
                          {sil.desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Escenario 3D en vivo de la silueta activa */}
              <div className="lg:col-span-7 relative rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_center,rgb(var(--accent)/0.2),#070709_70%)] h-[420px] md:h-[560px] overflow-hidden">
                <Suspense fallback={null}>
                  <JewelryCanvas
                    metalColor={showcaseSil.metalColor}
                    gemColor={showcaseSil.gemColor}
                    carats={showcaseSil.carats}
                    settingStyle={showcaseSil.id}
                    cutShape={showcaseSil.cut}
                    bandStyle={showcaseSil.band}
                  />
                </Suspense>

                <div className="absolute top-5 left-6 right-6 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/60 pointer-events-none">
                  <span>{showcaseSil.code}</span>
                  <span>CORTE {showcaseSil.cut.toUpperCase()} · ARO {showcaseSil.band.toUpperCase()}</span>
                </div>

                <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="pointer-events-none">
                    <div className="font-display uppercase text-2xl md:text-3xl">{showcaseSil.name}</div>
                    <div className="text-xs text-white/55">Arrastra el anillo para girarlo en 360°</div>
                  </div>
                  <PillCta
                    href={`/personalizador?style=${showcaseSil.id}&cut=${showcaseSil.cut}&band=${showcaseSil.band}`}
                    label="Abrir en Atelier 3D"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================= 5. GALERÍA ASIMÉTRICA DE PIEZAS ======================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-3">03 / {sections.featuredSubtitle}</p>
            <SplitTitle
              text={sections.featuredTitle}
              className="font-display text-5xl md:text-7xl uppercase leading-none"
            />
          </div>
          <PillCta href="/tienda" label="Explorar archivo completo" dark />
        </div>

        {featured.length === 0 ? (
          <p className="text-center text-muted">
            Aún no hay productos. Agrégalos desde{' '}
            <Link href="/admin" className="text-accent underline">
              /admin
            </Link>
            .
          </p>
        ) : (
          /* Editorial Staggered Grid (Lookbook Vogue / Cartier) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8 items-start">
            {featured.map((p, i) => {
              // Patrón asimétrico editorial cada 4 piezas
              const mod = i % 4;
              const colClass =
                mod === 0
                  ? 'md:col-span-7'
                  : mod === 1
                    ? 'md:col-span-5 md:mt-20'
                    : mod === 2
                      ? 'md:col-span-5'
                      : 'md:col-span-7 md:-mt-16';
              return (
                <Reveal key={p.id} delay={(i % 2) * 0.1} y={50} className={colClass}>
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted">
                    <span>ARCHIVE N° 0{i + 1}</span>
                    <span>{p.sku}</span>
                  </div>
                  <ProductCard product={p} />
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================= 6. ÍNDICE INTERACTIVO DE COLECCIONES ======================= */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-8 pt-28">
          <div className="flex items-end justify-between border-b border-line pb-6 mb-2">
            <div>
              <span className="eyebrow block mb-2">04 / Maison Directory</span>
              <SplitTitle text={sections.categoriesTitle} className="font-display text-5xl md:text-7xl uppercase" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted hidden md:block">
              ({String(categories.length).padStart(2, '0')} COLECCIONES)
            </span>
          </div>
          <div>
            {categories.map((c, i) => (
              <Reveal key={c.id} y={30} delay={i * 0.05}>
                <Link
                  href={`/tienda?cat=${c.slug}`}
                  onMouseEnter={() => setHoverCat(i)}
                  onMouseLeave={() => setHoverCat(-1)}
                  data-cursor
                  className="group flex items-center justify-between gap-6 border-b border-line py-7 md:py-10 transition-all hover:px-4 md:hover:px-8"
                >
                  <span className="text-[11px] tracking-[0.3em] text-muted w-10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-display uppercase text-[clamp(2.2rem,6.5vw,6rem)] leading-none transition-colors group-hover:text-accent">
                    {c.name}
                  </span>
                  <span className="hidden md:block text-xs text-muted max-w-[16rem] text-right">
                    {c.description}
                  </span>
                  <span className="w-12 h-12 rounded-full border border-ink/25 flex items-center justify-center group-hover:bg-accent group-hover:text-on-accent group-hover:border-accent transition shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
      <div
        ref={preview}
        className="pointer-events-none fixed left-0 top-0 z-[60] -ml-32 -mt-40 w-64 h-80 rounded-2xl overflow-hidden border border-line opacity-0 hidden md:block shadow-2xl"
      >
        {hoverCat >= 0 && categories[hoverCat] && (
          <Media src={categories[hoverCat].image} art={categories[hoverCat].art} alt="" className="w-full h-full" />
        )}
      </div>

      {/* ======================= 7. DÍPTICO EDITORIAL DE ALTA COSTURA ======================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-28">
        <div className="grid lg:grid-cols-12 gap-8 items-center rounded-[2.2rem] border border-line bg-surface/50 p-6 md:p-12">
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85"
                alt="Alta Joyería"
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-line mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&w=900&q=85"
                alt="Esmeralda de Muzo"
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            <span className="eyebrow">05 / Cita Privada & Concierge</span>
            <h3 className="font-display uppercase text-4xl md:text-5xl leading-[0.98]">
              Atención privada con un maestro gemólogo.
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Seleccionamos lotes privados de diamantes GIA y esmeraldas de Muzo según tus especificaciones. Agenda una sesión virtual o presencial en nuestro salón de Bogotá.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-line text-center">
              <div className="p-3">
                <Gem className="w-4 h-4 mx-auto text-accent mb-1.5" />
                <span className="text-[10px] uppercase tracking-widest block">Lotes Únicos</span>
              </div>
              <div className="p-3">
                <Compass className="w-4 h-4 mx-auto text-accent mb-1.5" />
                <span className="text-[10px] uppercase tracking-widest block">Diseño CAD 3D</span>
              </div>
              <div className="p-3">
                <ShieldCheck className="w-4 h-4 mx-auto text-accent mb-1.5" />
                <span className="text-[10px] uppercase tracking-widest block">Póliza Total</span>
              </div>
            </div>
            <div className="pt-2">
              <PillCta
                href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, deseo agendar una consulta privada con el Atelier.')}`}
                label="Agendar cita privada"
                dark
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================= 8. PILARES DE LA MAISON ======================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-28">
        <div className="grid md:grid-cols-4 border-t border-line">
          {sections.benefits.map((b, i) => (
            <Reveal
              key={i}
              delay={i * 0.1}
              className="border-b md:border-b-0 md:border-r last:border-r-0 border-line py-10 md:px-8 first:md:pl-0 space-y-4"
            >
              <span className="text-[11px] tracking-[0.3em] text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h4 className="font-display text-3xl uppercase leading-none">{b.title}</h4>
              <p className="text-sm text-muted leading-relaxed">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ======================= 9. NEWSLETTER ======================= */}
      <Newsletter title={sections.newsletterTitle} text={sections.newsletterText} />
    </div>
  );
}

function Newsletter({ title, text }: { title: string; text: string }) {
  const [done, setDone] = useState(false);
  return (
    <section className="max-w-3xl mx-auto px-6 pt-32 text-center space-y-6">
      <span className="eyebrow">Membresía de la Maison</span>
      <SplitTitle text={title} className="font-display text-5xl md:text-7xl uppercase leading-none" />
      <p className="text-muted text-sm">{text}</p>
      {done ? (
        <p className="text-accent text-sm pt-2">Bienvenido al Círculo Privado.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="flex gap-2 pt-2 max-w-lg mx-auto p-1.5 rounded-full border border-ink/25"
        >
          <input
            type="email"
            required
            placeholder="tu@correo.com"
            className="flex-1 bg-transparent px-5 text-sm focus:outline-none placeholder:text-muted/60"
          />
          <button className="btn-primary !py-3">Suscribirme</button>
        </form>
      )}
    </section>
  );
}
