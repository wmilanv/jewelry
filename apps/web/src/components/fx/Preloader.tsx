'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useStoreData } from '@/store/useStoreData';

/** Intro de marca: el nombre sube letra por letra y la cortina se abre. Una vez por sesión. */
export function Preloader({ onDone }: { onDone?: () => void }) {
  const [show, setShow] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const name = useStoreData((s) => s.settings.brand.name);
  const tagline = useStoreData((s) => s.settings.brand.tagline);

  useEffect(() => {
    if (sessionStorage.getItem('intro_seen')) {
      setShow(false);
      onDone?.();
      return;
    }
    const el = root.current;
    if (!el) return;
    document.body.style.overflow = 'hidden';
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('intro_seen', '1');
        document.body.style.overflow = '';
        setShow(false);
        onDone?.();
      },
    });
    tl.fromTo('[data-l]', { yPercent: 120 }, { yPercent: 0, duration: 1.1, stagger: 0.05, ease: 'power4.out' })
      .fromTo('[data-t]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .fromTo('[data-bar]', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '-=0.9')
      .to('[data-in]', { yPercent: -120, duration: 0.7, ease: 'power3.in' }, '+=0.2')
      .to(el, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '-=0.2')
      .add(() => onDone?.(), '-=0.7');
    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[90] bg-[#0a0a0d] text-[#f4efe6] flex flex-col items-center justify-center">
      <div data-in className="text-center">
        <div className="font-display text-5xl md:text-8xl uppercase tracking-[0.12em] flex overflow-hidden pb-2">
          {name.split('').map((c, i) => (
            <span key={i} data-l className="inline-block">{c === ' ' ? '\u00A0' : c}</span>
          ))}
        </div>
        <p data-t className="text-[10px] uppercase tracking-[0.5em] text-white/50 mt-4 opacity-0">{tagline}</p>
      </div>
      <div className="absolute bottom-12 w-48 h-px bg-white/15 overflow-hidden">
        <div data-bar className="h-full bg-white origin-left" />
      </div>
    </div>
  );
}

