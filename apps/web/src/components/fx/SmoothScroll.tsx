'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/** Scroll suave (Lenis) sincronizado con ScrollTrigger + cursor personalizado. */
export function SmoothScroll() {
  const pathname = usePathname();
  const inAdmin = pathname.startsWith('/admin') || pathname.startsWith('/personalizador');

  useEffect(() => {
    if (inAdmin || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [inAdmin]);

  // Recalcula posiciones al cambiar de página
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 400);
    window.scrollTo(0, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  return null;
}

/** Círculo que sigue al mouse y crece sobre enlaces y botones (solo escritorio). */
export function Cursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = document.getElementById('cursor');
    if (!el) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
    const move = (e: MouseEvent) => {
      x(e.clientX);
      y(e.clientY);
      gsap.to(el, { opacity: 1, duration: 0.3, overwrite: 'auto' });
    };
    const over = (e: MouseEvent) => {
      const hot = (e.target as HTMLElement).closest('a,button,[data-cursor]');
      gsap.to(el, { scale: hot ? 2.6 : 1, duration: 0.3 });
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <div
      id="cursor"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-3 w-3 -ml-1.5 -mt-1.5 rounded-full bg-white opacity-0 mix-blend-difference md:block"
    />
  );
}

