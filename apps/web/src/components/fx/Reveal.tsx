'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Aparece al hacer scroll (fade + desplazamiento). */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: any;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { y, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);
  return <Tag ref={ref} className={className}>{children}</Tag>;
}

/** Título que se revela palabra por palabra (máscara desde abajo). */
export function SplitTitle({
  text,
  className = '',
  delay = 0,
  trigger = 'scroll',
}: {
  text: string;
  className?: string;
  delay?: number;
  trigger?: 'scroll' | 'now';
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>('[data-w]');
    const tween = gsap.fromTo(
      words,
      { yPercent: 115, rotate: 4 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.2,
        delay,
        stagger: 0.08,
        ease: 'power4.out',
        scrollTrigger: trigger === 'scroll' ? { trigger: el, start: 'top 88%', once: true } : undefined,
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text, delay, trigger]);

  return (
    <h2 ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.25em]" aria-hidden>
          <span data-w className="inline-block will-change-transform">{w}</span>
        </span>
      ))}
    </h2>
  );
}

/** Párrafo cuyas palabras se iluminan según el scroll. */
export function ScrubText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll('[data-w]');
    const tween = gsap.fromTo(
      words,
      { opacity: 0.14 },
      { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text]);
  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} data-w className="inline-block mr-[0.28em]">{w}</span>
      ))}
    </p>
  );
}

/** Banda de texto infinita que acelera según la velocidad de scroll. */
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const tween = gsap.to(el, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = Math.min(6, 1 + Math.abs(self.getVelocity()) / 400);
        gsap.to(tween, { timeScale: v * (self.direction === 1 ? 1 : -1), duration: 0.2, overwrite: true });
        gsap.to(tween, { timeScale: self.direction === 1 ? 1 : -1, duration: 1.2, delay: 0.2, overwrite: 'auto' });
      },
    });
    return () => {
      st.kill();
      tween.kill();
    };
  }, []);
  const row = items.filter(Boolean);
  const content = [...row, ...row, ...row, ...row];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={track} className="inline-flex will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="inline-flex shrink-0">
            {content.map((t, i) => (
              <span key={i} className="inline-flex items-center">
                <span>{t}</span>
                <span className="mx-8 text-accent">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

