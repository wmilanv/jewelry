'use client';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, Sparkles, Compass, ShieldCheck, Gem, ChevronDown, Award, Star, Quote, CheckCircle2 } from 'lucide-react';
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
      if (bottomRef.current) gsap.from(bottomRef.current, { y: 24, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.6 });
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

      {/* ======================= 1. HERO DE ALTA JOYERÍA ======================= */}
      <section className="px-3 md:px-6">
        <div
          ref={heroRef}
          className="relative rounded-[2rem] sm:rounded-[2.4rem] overflow-hidden bg-[#08080b] text-[#f4efe6] min-h-[calc(100dvh-6.5rem)] flex flex-col justify-between border border-white/10 shadow-2xl p-5 sm:p-7 lg:p-8 xl:p-10"
        >
          {/* Marco editorial interior sutil */}
          <div className="pointer-events-none absolute inset-3 sm:inset-5 rounded-[1.6rem] border border-white/[0.06] z-10" />

          {/* Fondo atmosférico de luz */}
          <div ref={bgRef} className="absolute inset-0 pointer-events-none">
            {hero.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.imageUrl} alt="" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgb(var(--accent)/0.22),transparent_60%),radial-gradient(ellipse_at_20%_80%,rgba(255,255,255,0.04),transparent_50%)]" />
            )}
          </div>

          {/* Cabecera del Hero: Eyebrow + Garantías */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 text-[9px] sm:text-[10px] uppercase tracking-[0.26em] text-white/55 border-b border-white/10 pb-3 sm:pb-4">
            <span data-hero-fade>{hero.eyebrow || 'HAUTE JOAILLERIE · PLACE VENDÔME & BOGOTÁ'}</span>
            <div data-hero-fade className="hidden sm:flex items-center gap-2 text-accent">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Oro 18K Ético · Diamantes GIA · Esmeraldas de Muzo</span>
            </div>
          </div>

          {/* Cuerpo principal: Split Grid 2 Columnas (Texto Izquierda / Joya 3D Derecha) */}
          <div className="relative z-20 grid lg:grid-cols-12 gap-6 lg:gap-8 items-center py-3 sm:py-5 lg:py-6 my-auto">
            {/* Columna Izquierda: Titular monumental + Texto + Acciones */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5">
              <div data-hero-title>
                {introDone ? (
                  <SplitTitle
                    text={hero.title}
                    trigger="now"
                    delay={0.15}
                    className="font-display uppercase leading-[0.95] tracking-[0.02em] text-[clamp(2.1rem,4vw,4.2rem)]"
                  />
                ) : (
                  <h1 className="font-display uppercase leading-[0.95] text-[clamp(2.1rem,4vw,4.2rem)] opacity-0">
                    {hero.title}
                  </h1>
                )}
              </div>

              <p data-hero-fade className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-lg">
                {hero.subtitle}
              </p>

              <div data-hero-fade className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                {hero.secondaryLabel && (
                  <PillCta href={hero.secondaryHref || '/personalizador'} label={hero.secondaryLabel} />
                )}
                {hero.ctaLabel && (
                  <Link
                    href={hero.ctaHref || '/tienda'}
                    className="rounded-full border border-white/20 hover:border-white px-5 sm:px-6 h-12 sm:h-13 inline-flex items-center text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition"
                  >
                    {hero.ctaLabel}
                  </Link>
                )}
              </div>
            </div>

            {/* Columna Derecha: Escenario 3D interactivo completamente despejado */}
            {show3D && (
              <div className="lg:col-span-6 relative h-[280px] sm:h-[350px] lg:h-[400px] xl:h-[440px] rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
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

                {/* Selector superior discreto de siluetas */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.18em] text-white/60 pointer-events-none">
                  <span className="bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/10 pointer-events-auto shrink-0">
                    {heroSil.code}
                  </span>
                  <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 p-1 overflow-x-auto no-scrollbar shrink-0 max-w-[calc(100%-110px)]">
                    {BESPOKE_SILHOUETTES.slice(0, 4).map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => setHeroSilIdx(idx)}
                        className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] tracking-[0.12em] whitespace-nowrap transition ${
                          heroSilIdx === idx ? 'bg-accent text-on-accent font-semibold' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {s.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtítulo inferior elegante */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-white/70 pointer-events-none bg-black/60 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-white font-medium">{heroSil.name}</span>
                  <span className="text-accent text-[8.5px] sm:text-[9px]">Girar en 360°</span>
                </div>
              </div>
            )}
          </div>

          {/* Pie del Hero: Coordenadas y Hallmarks */}
          <div ref={bottomRef} className="relative z-20 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
            <span className="font-display uppercase text-lg sm:text-xl text-white tracking-[0.16em]">
              {brand.name || 'ATELIER VENDÔME'}
            </span>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] uppercase tracking-[0.2em]">
              <span>4°39&apos;N 74°03&apos;W · BOGOTÁ</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">HAUTE JOAILLERIE SUR-MESURE</span>
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

            {/* Banner destacado: Innovación Escultor 2D a 3D */}
            <div className="mb-10 rounded-2xl border border-accent/40 bg-gradient-to-r from-accent/15 via-white/[0.02] to-transparent p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-accent font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> Innovación Bespoke · Escultura 2D a 3D en Oro 18K
                </div>
                <h3 className="font-display uppercase text-2xl md:text-3xl leading-snug">
                  Transforma un boceto, emblema familiar o monograma en una joya tridimensional
                </h3>
                <p className="text-xs text-white/65 leading-relaxed">
                  Sube cualquier imagen plana (dibujo a mano, silueta o escudo) y nuestro motor la esculpe de inmediato en un medallón o anillo de sello 3D en oro macizo, listo para fundición en taller.
                </p>
              </div>
              <div className="shrink-0">
                <PillCta href="/personalizador?type=ai-relief" label="Probar Escultor 2D→3D" />
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Escenario 3D en vivo de la silueta activa (primero en móvil para ver respuesta visual instantánea) */}
              <div className="lg:col-span-7 order-1 lg:order-2 relative rounded-[1.8rem] sm:rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_center,rgb(var(--accent)/0.2),#070709_70%)] h-[320px] sm:h-[420px] md:h-[560px] overflow-hidden">
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

                <div className="absolute top-4 sm:top-5 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-white/60 pointer-events-none">
                  <span>{showcaseSil.code}</span>
                  <span>{showcaseSil.cut.toUpperCase()} · {showcaseSil.band.toUpperCase()}</span>
                </div>

                <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="pointer-events-none">
                    <div className="font-display uppercase text-xl sm:text-2xl md:text-3xl leading-none">{showcaseSil.name}</div>
                    <div className="text-[11px] text-white/55 mt-0.5">Gira en 360° para inspeccionar facetas</div>
                  </div>
                  <PillCta
                    href={`/personalizador?style=${showcaseSil.id}&cut=${showcaseSil.cut}&band=${showcaseSil.band}`}
                    label="Personalizar 3D"
                  />
                </div>
              </div>

              {/* Lista de siluetas */}
              <div className="lg:col-span-5 order-2 lg:order-1 space-y-2.5 max-h-[480px] lg:max-h-[560px] overflow-y-auto pr-1">
                {BESPOKE_SILHOUETTES.map((sil, i) => {
                  const isCurrent = activeSilIdx === i;
                  return (
                    <div
                      key={sil.id}
                      onMouseEnter={() => setActiveSilIdx(i)}
                      onClick={() => setActiveSilIdx(i)}
                      className={`cursor-pointer rounded-2xl border p-3.5 sm:p-5 transition-all ${
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
                            <h3 className="font-display uppercase text-lg sm:text-xl md:text-2xl leading-none">
                              {sil.name}
                            </h3>
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/45">
                              {sil.french}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/personalizador?style=${sil.id}&cut=${sil.cut}&band=${sil.band}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 hover:border-accent hover:bg-accent hover:text-on-accent px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] transition shrink-0"
                        >
                          Crear <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                      {isCurrent && (
                        <p className="text-xs text-white/65 leading-relaxed mt-2.5 pl-6 sm:pl-7">
                          {sil.desc}
                        </p>
                      )}
                    </div>
                  );
                })}
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
          /* Cuadrícula editorial de alta joyería sin colisiones ni márgenes negativos */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.08} y={30} className="w-full">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-muted font-medium">
                  <span>ARCHIVE N° 0{i + 1}</span>
                  <span>{p.sku}</span>
                </div>
                <ProductCard product={p} />
              </Reveal>
            ))}
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

      {/* ======================= 8. EL PROCESO DEL TALLER (SAVOIR-FAIRE EN 4 ACTOS) ======================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-b border-line pb-8">
          <div>
            <span className="eyebrow block mb-2">06 / Savoir-Faire en 4 Actos</span>
            <SplitTitle text="El Arte del Taller" className="font-display uppercase text-5xl md:text-7xl leading-none" />
          </div>
          <p className="text-muted text-xs md:text-sm max-w-md leading-relaxed">
            Desde el boceto a mano alzada hasta la entrega con escolta asegurada: cada pieza transita un rigor artesanal de más de 80 horas de taller.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              num: 'I',
              title: 'Gouache & Boceto',
              desc: 'Pintura en acuarela sobre papel negro donde el diseñador define la luz, las facetas y las proporciones anatómicas de la mano.',
              tag: 'Acuarela y Proporción Áurea',
            },
            {
              num: 'II',
              title: 'Escultura & Cera',
              desc: 'Transformación del boceto en geometría tridimensional y fundición en crisol al vacío con Oro 18K reciclado certificado.',
              tag: 'Micro-fusión Oro Ley 750',
            },
            {
              num: 'III',
              title: 'Engaste Micrométrico',
              desc: 'El maestro engastador asegura cada diamante y esmeralda bajo microscopio Leica de 40x para máxima estabilidad y fuego de luz.',
              tag: 'Técnica de Place Vendôme',
            },
            {
              num: 'IV',
              title: 'Lustre & Ficha GIA',
              desc: 'Pulido tri-fásico a espejo en banco de madera, grabado láser del punzón de la Maison y certificación gemológica oficial.',
              tag: 'Póliza y Certificado GIA/Muzo',
            },
          ].map((step, idx) => (
            <Reveal key={step.num} delay={idx * 0.1} y={40} className="rounded-[1.8rem] border border-line bg-surface/40 p-6 md:p-8 flex flex-col justify-between space-y-6 hover:border-accent/60 transition group">
              <div>
                <div className="flex items-center justify-between text-accent font-display text-2xl mb-4">
                  <span>ACTO {step.num}</span>
                  <span className="w-8 h-8 rounded-full border border-accent/30 flex items-center justify-center text-xs group-hover:bg-accent group-hover:text-on-accent transition">
                    0{idx + 1}
                  </span>
                </div>
                <h4 className="font-display uppercase text-2xl text-ink group-hover:text-accent transition leading-tight mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent/80 border-t border-line/40 pt-4 block font-medium">
                {step.tag}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ======================= 9. CARTAS DE NUESTROS CLIENTES ======================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 pt-28">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="eyebrow block">07 / Archivo de Confianza</span>
          <SplitTitle text="Cartas de la Maison" className="font-display uppercase text-5xl md:text-7xl leading-none" />
          <p className="text-xs md:text-sm text-muted">
            Testimonios de anillos de compromiso, aniversarios y piezas únicas encargadas en nuestro taller.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: '«Ver el anillo en el personalizador 3D y luego recibirlo en Cartagena superó todas las expectativas. El verde de la esmeralda de Muzo es hipnótico.»',
              client: 'Alejandro & Valeria',
              city: 'Cartagena / Bogotá',
              piece: 'Solitario Trilogía Muzo 2.1ct',
            },
            {
              quote: '«El nivel de detalle del estuche, el lacre en oro y la caligrafía fue digno de la Rue de la Paix en París. Mi prometida no para de admirarlo.»',
              client: 'Mauricio S.',
              city: 'Miami, FL',
              piece: 'Halo Céleste Pavé Diamantes GIA',
            },
            {
              quote: '«Subimos el escudo familiar de mis abuelos al Estudio 2D a 3D y nos forjaron un anillo de sello en Oro Amarillo 18k que ahora es reliquia familiar.»',
              client: 'Felipe & Diana C.',
              city: 'Madrid / Medellín',
              piece: 'Chevalière Sello Real 18K',
            },
          ].map((t, i) => (
            <Reveal key={i} delay={i * 0.1} y={40} className="rounded-[2rem] border border-line bg-surface/30 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-accent">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-accent" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-ink/90 font-serif italic leading-relaxed">{t.quote}</p>
              </div>
              <div className="border-t border-line/60 pt-4">
                <div className="font-display uppercase text-lg text-ink">{t.client}</div>
                <div className="text-xs text-muted flex items-center justify-between mt-0.5">
                  <span>{t.city}</span>
                  <span className="text-accent text-[11px]">{t.piece}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ======================= 10. PREGUNTAS FRECUENTES (FAQ) ======================= */}
      <HomeFaq />

      {/* ======================= 11. PILARES DE LA MAISON ======================= */}
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

function HomeFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    {
      q: '¿Cómo puedo conocer la talla exacta si el anillo es una propuesta sorpresa?',
      a: 'Nuestro equipo gemológico te orientará con métodos discretos (utilizando otro anillo de referencia o fotos de la mano). Además, todas las piezas de compromiso incluyen un primer ajuste de talla de cortesía 100% gratuito durante los primeros 60 días tras la entrega.',
    },
    {
      q: '¿Qué certificados respaldan los diamantes y esmeraldas?',
      a: 'Nuestros diamantes naturales a partir de 0.50 ct cuentan con certificado oficial del Gemological Institute of America (GIA) con número de serie micro-grabado a láser en el filetín. Nuestras esmeraldas provienen de las minas históricas de Muzo y Coscuez con certificación gemológica de pureza y tratamiento.',
    },
    {
      q: '¿Cómo funciona la seguridad en el envío y el empaque?',
      a: 'Cada joya viaja bajo póliza de seguro a todo riesgo con empresas de transporte de valores blindado (Brinks / FedEx Express) y requiere firma personal del titular. El empaque exterior es neutro y confidencial para garantizar máxima discreción.',
    },
    {
      q: '¿Puedo llevar o rediseñar gemas heredadas de mi familia?',
      a: 'Absolutamente. En nuestro salón de Bogotá y a través del Atelier Bespoke evaluamos gemas antiguas para desmontarlas, certificarlas e integrarlas en una montura contemporánea en Oro 18K manteniendo su valor sentimental y patrimonial.',
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 md:px-8 pt-28">
      <div className="text-center mb-12 space-y-3">
        <span className="eyebrow block">08 / Concierge & Dudas Frecuentes</span>
        <SplitTitle text="Preguntas Frecuentes" className="font-display uppercase text-5xl md:text-7xl leading-none" />
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen ? 'border-accent bg-surface/60 shadow-lg' : 'border-line bg-surface/30 hover:border-line/80'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 font-display uppercase text-lg md:text-xl text-ink"
              >
                <span>{f.q}</span>
                <span className={`w-8 h-8 rounded-full border border-line flex items-center justify-center text-xs shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-accent text-on-accent border-accent' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
              {isOpen && (
                <div className="px-5 md:px-6 pb-6 pt-0 border-t border-line/40 text-xs md:text-sm text-muted leading-relaxed">
                  <p className="mt-3">{f.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
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
