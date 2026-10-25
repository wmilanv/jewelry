'use client';
import { useEffect } from 'react';
import { useStoreData } from '@/store/useStoreData';
import { useCartStore } from '@/store/useCartStore';

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0');
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const PALETTES = {
  dark: { bg: '10 10 13', surface: '20 20 26', line: '42 42 52', ink: '244 239 230', muted: '150 150 160' },
  light: { bg: '250 249 247', surface: '255 255 255', line: '226 222 215', ink: '28 28 32', muted: '110 110 120' },
};

/** Hidrata los stores desde localStorage y aplica el tema configurado. */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const theme = useStoreData((s) => s.settings.theme);

  useEffect(() => {
    Promise.resolve(useStoreData.persist.rehydrate()).then(() => useStoreData.getState().setHydrated());
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const root = document.documentElement.style;
    const p = PALETTES[theme.mode] ?? PALETTES.dark;
    const [r, g, b] = hexToRgb(theme.accent || '#c5a880');
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    root.setProperty('--bg', p.bg);
    root.setProperty('--surface', p.surface);
    root.setProperty('--line', p.line);
    root.setProperty('--ink', p.ink);
    root.setProperty('--muted', p.muted);
    root.setProperty('--accent', `${r} ${g} ${b}`);
    root.setProperty('--on-accent', lum > 0.6 ? '10 10 13' : '255 255 255');
    root.setProperty(
      '--font-display',
      theme.fontStyle === 'serif' ? "'Cormorant Garamond', Georgia, serif" : "'Inter', system-ui, sans-serif",
    );
  }, [theme]);

  return <>{children}</>;
}

