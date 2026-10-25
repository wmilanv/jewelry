'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Sun,
  Flame,
  Disc,
  RotateCw,
  Pause,
  Check,
  Upload,
  Wand2,
  Loader2,
  Box,
  FileText,
  MessageCircle,
  Share2,
  Copy,
  X,
  Printer,
} from 'lucide-react';
import { formatMoney, useStoreData } from '@/store/useStoreData';
import { useCartStore } from '@/store/useCartStore';
import type {
  BandStyleKey,
  CutShapeKey,
  CustomizerBandStyle,
  CustomizerCutShape,
  CustomizerSettingStyle,
  JewelryTypeKey,
  SettingStyleKey,
} from '@/types';
import type { LightingMood } from '@/components/3d/JewelryCanvas';

const JewelryCanvas = dynamic(() => import('@/components/3d/JewelryCanvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse bg-surface/40" />,
});

const JEWELRY_TYPES: { id: JewelryTypeKey; label: string; sub: string; priceDelta: number }[] = [
  { id: 'ring', label: 'Anillo', sub: '12 siluetas · 10 cortes · 8 aros', priceDelta: 0 },
  { id: 'necklace', label: 'Collar / Dije', sub: 'Pendentif sobre cadena en oro', priceDelta: 350000 },
  { id: 'earrings', label: 'Aretes (Par)', sub: 'Dormilonas y pendientes de gala', priceDelta: 680000 },
  { id: 'bracelet', label: 'Brazalete', sub: 'Manchette rígida o Rivière', priceDelta: 1250000 },
  { id: 'ai-relief', label: 'Imagen 2D → 3D', sub: 'Sube cualquier foto, logo o boceto', priceDelta: 450000 },
  { id: 'glb-custom', label: 'Malla 3D (.GLB)', sub: 'Modelo de Meshy AI o archivo propio', priceDelta: 600000 },
];

const DEFAULT_SETTINGS: CustomizerSettingStyle[] = [
  { id: 'solitaire', name: 'Solitario Imperial', subtitle: '6 garras clásicas de alta precisión', priceDelta: 0 },
  { id: 'halo', name: 'Halo Céleste', subtitle: 'Corona pavé de 16 diamantes alrededor', priceDelta: 1450000 },
  { id: 'three-stone', name: 'Trilogía Pasado·Presente·Futuro', subtitle: 'Gema central escoltada por 2 gemas laterales', priceDelta: 1850000 },
  { id: 'toi-et-moi', name: 'Toi et Moi (Tú y Yo)', subtitle: 'Dúo asimétrico de dos gemas encontradas', priceDelta: 2150000 },
  { id: 'cathedral', name: 'Catedral Vendôme', subtitle: 'Arcos elevados con galería arquitectónica', priceDelta: 680000 },
  { id: 'bezel', name: 'Bisel Modernista', subtitle: 'Engaste continuo de oro que abraza la gema', priceDelta: 490000 },
  { id: 'vintage', name: 'Roseta Art Déco', subtitle: 'Marco octogonal con milgrain 1925', priceDelta: 1950000 },
  { id: 'cluster', name: 'Cluster Floral Marquise', subtitle: 'Roseta botánica de 8 pétalos de diamante', priceDelta: 1780000 },
  { id: 'tension', name: 'Suspensión Aérea (Tension)', subtitle: 'Aro abierto con gema suspendida en el aire', priceDelta: 890000 },
  { id: 'signet', name: 'Sello Real (Signet Chevalière)', subtitle: 'Meseta maciza señorial con gema empotrada', priceDelta: 1120000 },
  { id: 'bypass', name: 'Bypass Serpenti', subtitle: 'Brazos fluidos envolventes en espiral', priceDelta: 940000 },
  { id: 'tiara', name: 'Tiara Couronne Impériale', subtitle: 'Diadema de 7 gemas en arco real', priceDelta: 1650000 },
];

const DEFAULT_CUTS: CustomizerCutShape[] = [
  { id: 'round', name: 'Brillante Redondo', subtitle: '57 facetas de máximo fuego óptico', priceDelta: 0 },
  { id: 'emerald', name: 'Talla Esmeralda', subtitle: 'Mesa rectangular escalonada de espejo', priceDelta: 350000 },
  { id: 'oval', name: 'Óvalo Lumière', subtitle: 'Silueta elongada que estiliza la mano', priceDelta: 280000 },
  { id: 'princess', name: 'Princesa Cuadrada', subtitle: 'Geometría piramidal contemporánea', priceDelta: 220000 },
  { id: 'pear', name: 'Gota Imperial (Pera)', subtitle: 'Lágrima asimétrica de alta costura', priceDelta: 420000 },
  { id: 'marquise', name: 'Marquesa Real', subtitle: 'Navette afilada de inspiración cortesana', priceDelta: 480000 },
  { id: 'cushion', name: 'Cojín Antiguo (Cushion)', subtitle: 'Cuadrado de esquinas suaves románticas', priceDelta: 310000 },
  { id: 'heart', name: 'Corazón Haute Couture', subtitle: 'Talla simbólica de simetría compleja', priceDelta: 560000 },
  { id: 'asscher', name: 'Asscher Octogonal', subtitle: 'Pabellón profundo de espejos concéntricos', priceDelta: 390000 },
  { id: 'baguette', name: 'Baguette Arquitectónico', subtitle: 'Prisma alargado de líneas puras Art Déco', priceDelta: 260000 },
];

const DEFAULT_BANDS: CustomizerBandStyle[] = [
  { id: 'plain', name: 'Media Caña Confort', subtitle: 'Banda maciza pulida a espejo', priceDelta: 0 },
  { id: 'pave', name: 'Pavé Éternité', subtitle: '24 diamantes micro-engastados en el aro', priceDelta: 1350000 },
  { id: 'twisted', name: 'Torsade Infinito', subtitle: 'Doble hebra de oro entrelazada', priceDelta: 720000 },
  { id: 'split', name: 'Doble Brazo (Split Shank)', subtitle: 'Banda bifurcada hacia la corona', priceDelta: 840000 },
  { id: 'knife', name: 'Filo de Cuchillo (Knife-Edge)', subtitle: 'Arista central arquitectónica', priceDelta: 320000 },
  { id: 'beaded', name: 'Perlé Alhambra', subtitle: 'Esferas de oro macizo esculpidas una a una', priceDelta: 960000 },
  { id: 'channel', name: 'Carré Channel Set', subtitle: 'Rieles paralelos con baguettes empotrados', priceDelta: 1420000 },
  { id: 'chevron', name: 'Chevron V-Crown', subtitle: 'Silueta en V pensada para anidar alianzas', priceDelta: 540000 },
];

const FINISHES: { id: 'polished' | 'satin' | 'hammered'; label: string; sub: string; delta: number }[] = [
  { id: 'polished', label: 'Espejo Haute Joaillerie', sub: 'Pulido de alto brillo reflectivo', delta: 0 },
  { id: 'satin', label: 'Satinado Brossé', sub: 'Textura sedosa mate de taller', delta: 120000 },
  { id: 'hammered', label: 'Martelé Orgánico', sub: 'Brillo suave facetado a mano', delta: 180000 },
];

/** Icono vectorial minimalista de cada talla de gema */
function CutIcon({ cut }: { cut: CutShapeKey }) {
  return (
    <svg viewBox="0 0 36 36" className="w-7 h-7 stroke-current fill-none shrink-0" strokeWidth="1.4">
      {cut === 'round' && (
        <>
          <circle cx="18" cy="18" r="13" />
          <polygon points="18,9 25,13 25,23 18,27 11,23 11,13" opacity="0.55" />
        </>
      )}
      {cut === 'emerald' && (
        <>
          <polygon points="10,5 26,5 30,9 30,27 26,31 10,31 6,27 6,9" />
          <rect x="11" y="10" width="14" height="16" opacity="0.55" />
        </>
      )}
      {cut === 'baguette' && (
        <>
          <rect x="10" y="4" width="16" height="28" />
          <rect x="13" y="8" width="10" height="20" opacity="0.55" />
        </>
      )}
      {cut === 'asscher' && (
        <>
          <polygon points="11,5 25,5 31,11 31,25 25,31 11,31 5,25 5,11" />
          <rect x="11" y="11" width="14" height="14" opacity="0.55" />
        </>
      )}
      {cut === 'cushion' && (
        <>
          <rect x="6" y="6" width="24" height="24" rx="7" />
          <rect x="11" y="11" width="14" height="14" rx="4" opacity="0.55" />
        </>
      )}
      {cut === 'heart' && (
        <path d="M18 30 C18 30 6 21 6 12.5 A6.5 6.5 0 0 1 18 9 A6.5 6.5 0 0 1 30 12.5 C30 21 18 30 18 30 Z" />
      )}
      {cut === 'oval' && (
        <>
          <ellipse cx="18" cy="18" rx="9.5" ry="13.5" />
          <ellipse cx="18" cy="18" rx="5.5" ry="9" opacity="0.55" />
        </>
      )}
      {cut === 'princess' && (
        <>
          <rect x="6" y="6" width="24" height="24" />
          <line x1="6" y1="6" x2="30" y2="30" opacity="0.45" />
          <line x1="30" y1="6" x2="6" y2="30" opacity="0.45" />
        </>
      )}
      {cut === 'pear' && (
        <>
          <path d="M18 4 C25 13 28 19 28 23 A10 10 0 1 1 8 23 C8 19 11 13 18 4 Z" />
          <path d="M18 10 C22 16 24 20 24 23 A6 6 0 1 1 12 23 C12 20 14 16 18 10 Z" opacity="0.55" />
        </>
      )}
      {cut === 'marquise' && (
        <>
          <path d="M18 3 C27 11 27 25 18 33 C9 25 9 11 18 3 Z" />
          <path d="M18 8 C23 13 23 23 18 28 C13 23 13 13 18 8 Z" opacity="0.55" />
        </>
      )}
    </svg>
  );
}

/** Icono vectorial minimalista de cada silueta de montura */
function SettingIcon({ style }: { style: SettingStyleKey }) {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none shrink-0" strokeWidth="1.4">
      {style === 'solitaire' && (
        <>
          <circle cx="20" cy="24" r="10" />
          <polygon points="20,6 26,11 20,16 14,11" />
        </>
      )}
      {style === 'halo' && (
        <>
          <circle cx="20" cy="20" r="7" />
          <circle cx="20" cy="20" r="12" strokeDasharray="2 3" />
        </>
      )}
      {style === 'three-stone' && (
        <>
          <polygon points="20,8 26,15 20,22 14,15" />
          <polygon points="9,14 13,18 9,22 5,18" opacity="0.7" />
          <polygon points="31,14 35,18 31,22 27,18" opacity="0.7" />
          <path d="M7 26 Q20 34 33 26" />
        </>
      )}
      {style === 'toi-et-moi' && (
        <>
          <polygon points="14,10 20,17 14,24 8,17" />
          <ellipse cx="26" cy="17" rx="5" ry="7" transform="rotate(-15 26 17)" />
          <path d="M8 28 Q20 34 32 28" />
        </>
      )}
      {style === 'cathedral' && (
        <>
          <polygon points="20,6 25,11 20,16 15,11" />
          <path d="M8 28 C10 16 15 13 16 13" />
          <path d="M32 28 C30 16 25 13 24 13" />
          <path d="M8 28 Q20 34 32 28" />
        </>
      )}
      {style === 'bezel' && (
        <>
          <circle cx="20" cy="20" r="11" strokeWidth="2.6" />
          <circle cx="20" cy="20" r="7" opacity="0.6" />
        </>
      )}
      {style === 'vintage' && (
        <>
          <polygon points="14,6 26,6 34,14 34,26 26,34 14,34 6,26 6,14" />
          <circle cx="20" cy="20" r="6" />
        </>
      )}
      {style === 'cluster' && (
        <>
          <circle cx="20" cy="20" r="5" />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return <circle key={deg} cx={20 + Math.cos(rad) * 9} cy={20 + Math.sin(rad) * 9} r="3.2" />;
          })}
        </>
      )}
      {style === 'tension' && (
        <>
          <path d="M13 11 A12 12 0 1 0 27 11" strokeWidth="2" />
          <polygon points="20,6 25,12 20,18 15,12" />
        </>
      )}
      {style === 'signet' && (
        <>
          <polygon points="10,10 30,10 34,28 6,28" />
          <rect x="16" y="15" width="8" height="8" opacity="0.65" />
        </>
      )}
      {style === 'bypass' && (
        <>
          <path d="M7 26 C12 12 24 12 31 18" />
          <path d="M33 14 C28 28 16 28 9 22" />
          <circle cx="20" cy="20" r="4.5" />
        </>
      )}
      {style === 'tiara' && (
        <>
          <path d="M6 26 Q20 14 34 26" />
          <polygon points="20,7 23,15 17,15" />
          <polygon points="13,11 15,17 11,17" opacity="0.7" />
          <polygon points="27,11 29,17 25,17" opacity="0.7" />
        </>
      )}
    </svg>
  );
}

/** Convierte imagen subida a dataURL redimensionada */
async function readImageDataUrl(file: File, max = 512): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

function CustomizerInner() {
  const params = useSearchParams();
  const { settings, hydrated } = useStoreData();
  const c = settings.customizer;
  const addItem = useCartStore((s) => s.addItem);

  const settingStyles = c.settings?.length ? c.settings : DEFAULT_SETTINGS;
  const cutShapes = c.cuts?.length ? c.cuts : DEFAULT_CUTS;
  const bandStyles = c.bands?.length ? c.bands : DEFAULT_BANDS;

  const initialType = (params.get('type') as JewelryTypeKey) || 'ring';
  const initialSetting = (params.get('style') as SettingStyleKey) || settingStyles[0].id;
  const initialCut = (params.get('cut') as CutShapeKey) || cutShapes[0].id;
  const initialBand = (params.get('band') as BandStyleKey) || bandStyles[0].id;

  const [step, setStep] = useState<'arquitectura' | 'gema' | 'metal' | 'ia2d3d' | 'firma'>(
    initialType === 'ai-relief' || initialType === 'glb-custom' ? 'ia2d3d' : 'arquitectura',
  );
  const [jewelryType, setJewelryType] = useState<JewelryTypeKey>(initialType);
  const [settingId, setSettingId] = useState<SettingStyleKey>(initialSetting);
  const [cutId, setCutId] = useState<CutShapeKey>(initialCut);
  const [bandId, setBandId] = useState<BandStyleKey>(initialBand);
  const [metalId, setMetalId] = useState<string>('');
  const [gemId, setGemId] = useState<string>('');
  const [sideGemId, setSideGemId] = useState<string>('');
  const [finishId, setFinishId] = useState<'polished' | 'satin' | 'hammered'>('polished');

  /* Estados para el Estudio 2D → 3D (Relieve Instantáneo + Meshy AI / Tripo3D + GLB) */
  const [reliefImageUrl, setReliefImageUrl] = useState<string>('');
  const [reliefDepth, setReliefDepth] = useState<number>(1.15);
  const [reliefMount, setReliefMount] = useState<'medallion' | 'signet-ring' | 'cutout-charm'>('medallion');
  const [reliefInvert, setReliefInvert] = useState<boolean>(false);
  const [customGlbUrl, setCustomGlbUrl] = useState<string>('');
  const [overrideGlbMaterial, setOverrideGlbMaterial] = useState<boolean>(true);
  const [aiProvider, setAiProvider] = useState<'meshy' | 'tripo'>('meshy');
  const [userAiKey, setUserAiKey] = useState<string>('');
  const [aiStatus, setAiStatus] = useState<string>('');
  const [aiProgress, setAiProgress] = useState<number>(0);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const imgInputRef = useRef<HTMLInputElement>(null);
  const glbInputRef = useRef<HTMLInputElement>(null);

  const [hoverSetting, setHoverSetting] = useState<SettingStyleKey | ''>('');
  const [hoverCut, setHoverCut] = useState<CutShapeKey | ''>('');
  const [hoverBand, setHoverBand] = useState<BandStyleKey | ''>('');
  const [hoverMetal, setHoverMetal] = useState<string>('');
  const [hoverGem, setHoverGem] = useState<string>('');

  const [carats, setCarats] = useState(1.5);
  const [ringSize, setRingSize] = useState(6.5);
  const [engraving, setEngraving] = useState('');
  const [lighting, setLighting] = useState<LightingMood>('studio');
  const [autoRotate, setAutoRotate] = useState(true);
  const [added, setAdded] = useState(false);
  const [showDossier, setShowDossier] = useState(false);
  const [copied, setCopied] = useState(false);

  if (hydrated && !c.enabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted">El personalizador no está activo.</p>
        <Link href="/" className="btn-outline">Volver al inicio</Link>
      </div>
    );
  }

  const jTypeObj = JEWELRY_TYPES.find((j) => j.id === jewelryType) ?? JEWELRY_TYPES[0];
  const setting = settingStyles.find((s) => s.id === settingId) ?? settingStyles[0];
  const cut = cutShapes.find((x) => x.id === cutId) ?? cutShapes[0];
  const band = bandStyles.find((b) => b.id === bandId) ?? bandStyles[0];
  const metal = c.metals.find((m) => m.id === metalId) ?? c.metals[0];
  const gem = c.gems.find((g) => g.id === gemId) ?? c.gems[0];
  const sideGem = c.gems.find((g) => g.id === sideGemId) ?? c.gems[0];
  const finish = FINISHES.find((f) => f.id === finishId) ?? FINISHES[0];

  if (!metal || !gem) return null;

  const shownSetting = settingStyles.find((s) => s.id === hoverSetting) ?? setting;
  const shownCut = cutShapes.find((x) => x.id === hoverCut) ?? cut;
  const shownBand = bandStyles.find((b) => b.id === hoverBand) ?? band;
  const shownMetal = c.metals.find((m) => m.id === hoverMetal) ?? metal;
  const shownGem = c.gems.find((g) => g.id === hoverGem) ?? gem;

  const hasSideGems =
    shownSetting.id === 'halo' ||
    shownSetting.id === 'three-stone' ||
    shownSetting.id === 'toi-et-moi' ||
    shownSetting.id === 'vintage' ||
    shownSetting.id === 'cluster' ||
    shownSetting.id === 'tiara' ||
    shownBand.id === 'pave' ||
    shownBand.id === 'channel';

  const total = Math.max(
    0,
    c.basePrice +
      jTypeObj.priceDelta +
      shownSetting.priceDelta +
      shownCut.priceDelta +
      shownBand.priceDelta +
      shownMetal.priceDelta +
      finish.delta +
      Math.round(shownGem.pricePerCt * carats),
  );

  const applyPreset = (preset: {
    type?: JewelryTypeKey;
    setting: SettingStyleKey;
    cut: CutShapeKey;
    band: BandStyleKey;
    metalIdx: number;
    gemIdx: number;
    carats: number;
  }) => {
    setJewelryType(preset.type ?? 'ring');
    setSettingId(preset.setting);
    setCutId(preset.cut);
    setBandId(preset.band);
    if (c.metals[preset.metalIdx]) setMetalId(c.metals[preset.metalIdx].id);
    if (c.gems[preset.gemIdx]) setGemId(c.gems[preset.gemIdx].id);
    setCarats(preset.carats);
  };

  /* Generación de Malla 3D con Meshy AI / Tripo3D desde la imagen 2D */
  const generateWithMeshyAi = async () => {
    if (!reliefImageUrl) {
      setAiStatus('Primero sube una imagen 2D arriba.');
      return;
    }
    setAiLoading(true);
    setAiProgress(5);
    setAiStatus(`Enviando imagen a ${aiProvider === 'meshy' ? 'Meshy AI' : 'Tripo3D'}...`);
    try {
      const activeKey = userAiKey.trim() || c.meshyApiKey || '';
      const res = await fetch('/api/image-to-3d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeKey ? { 'x-ai-key': activeKey } : {}),
        },
        body: JSON.stringify({ provider: aiProvider, imageUrl: reliefImageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo iniciar la generación 3D');

      const taskId = data.taskId;
      setAiStatus('Esculpiendo malla 3D con IA (puede tomar 45–90 seg)...');

      // Polling cada 4 segundos
      for (let attempt = 0; attempt < 40; attempt++) {
        await new Promise((r) => setTimeout(r, 4000));
        const poll = await fetch(`/api/image-to-3d?taskId=${encodeURIComponent(taskId)}&provider=${aiProvider}`, {
          headers: activeKey ? { 'x-ai-key': activeKey } : {},
        });
        const pData = await poll.json();
        if (typeof pData.progress === 'number') setAiProgress(pData.progress);
        if (pData.status === 'SUCCEEDED' && pData.glbUrl) {
          setCustomGlbUrl(pData.glbUrl);
          setJewelryType('glb-custom');
          setAiStatus('¡Malla 3D generada con éxito y cargada en el visor!');
          setAiLoading(false);
          return;
        }
        if (pData.status === 'FAILED') {
          throw new Error('La IA no pudo reconstruir la malla 3D de esta imagen.');
        }
      }
      throw new Error('Tiempo de espera agotado.');
    } catch (err: any) {
      setAiStatus(err?.message || 'Error generando con IA');
    } finally {
      setAiLoading(false);
    }
  };

  const add = () => {
    const labelParts = [
      jTypeObj.label,
      jewelryType === 'ring' ? `${setting.name} · Aro ${band.name}` : '',
      jewelryType === 'ai-relief' ? `Escultura 2D→3D (${reliefMount})` : '',
      `Talla ${cut.name}`,
      metal.name,
      `${gem.name} (${carats.toFixed(2)} ct)`,
      hasSideGems ? `Acentos: ${sideGem.name}` : '',
      finish.label,
      jewelryType === 'ring' ? `Medida ${ringSize}` : '',
      engraving ? `Grabado: "${engraving}"` : '',
    ].filter(Boolean);

    addItem({
      id: `bespoke|${jewelryType}|${setting.id}|${cut.id}|${band.id}|${metal.id}|${gem.id}|${sideGem.id}|${carats}|${ringSize}|${finish.id}|${engraving}`,
      productId: 'bespoke',
      title: `${jTypeObj.label} Bespoke · ${gem.name}`,
      variantLabel: labelParts.join(' · '),
      price: total,
      quantity: 1,
      image: reliefImageUrl || '',
      art: {
        kind:
          jewelryType === 'necklace'
            ? 'necklace'
            : jewelryType === 'earrings'
              ? 'earrings'
              : jewelryType === 'bracelet'
                ? 'bracelet'
                : 'ring',
        color: metal.color,
      },
      isBespoke: true,
      bespokeConfig: {
        jewelryType: jTypeObj.label,
        settingStyle: setting.name,
        cutShape: cut.name,
        bandStyle: band.name,
        metal: metal.name,
        gemstone: gem.name,
        sideGemstone: hasSideGems ? sideGem.name : undefined,
        carats,
        ringSize,
        finish: finish.label,
        engravingText: engraving || undefined,
        customReferenceImage: reliefImageUrl || undefined,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row bg-[#09090c] text-[#f4efe6]">
      {/* ==================== VISOR 3D ==================== */}
      <div className="relative flex-1 min-h-[42vh] lg:min-h-0">
        <JewelryCanvas
          jewelryType={jewelryType}
          metalColor={shownMetal.color}
          gemColor={shownGem.color}
          sideGemColor={sideGem.color}
          carats={carats}
          settingStyle={shownSetting.id}
          cutShape={shownCut.id}
          bandStyle={shownBand.id}
          finish={finish.id}
          lighting={lighting}
          autoRotate={autoRotate}
          reliefImageUrl={reliefImageUrl}
          reliefDepth={reliefDepth}
          reliefMount={reliefMount}
          reliefInvert={reliefInvert}
          customGlbUrl={customGlbUrl}
          overrideGlbMaterial={overrideGlbMaterial}
        />

        {/* Barra superior sobre el visor */}
        <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between gap-3 pointer-events-none">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-md border border-white/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white hover:border-accent transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {settings.brand.name}
          </Link>

          {/* Selector de atmósfera lumínica + rotación */}
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 p-1">
            {(
              [
                { id: 'studio', label: 'Estudio', icon: Disc },
                { id: 'candle', label: 'Velas', icon: Flame },
                { id: 'daylight', label: 'Luz día', icon: Sun },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setLighting(m.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] transition ${
                  lighting === m.id ? 'bg-white text-black font-medium' : 'text-white/65 hover:text-white'
                }`}
              >
                <m.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            ))}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pausar rotación' : 'Girar automáticamente'}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white"
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <RotateCw className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Presets de Inspiración rápida */}
        <div className="absolute bottom-5 left-5 right-5 z-10 flex flex-wrap items-end justify-between gap-4 pointer-events-none">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent block">
              {jTypeObj.label} · {shownSetting.name} · {shownCut.name}
            </span>
            <p className="text-xs text-white/55">
              Arrastra para inspeccionar en 360° · {carats.toFixed(2)} ct en {shownMetal.name}
            </p>
          </div>

          <div className="pointer-events-auto flex flex-wrap gap-1.5">
            {[
              { label: 'Toi et Moi Diamante & Esmeralda', type: 'ring' as const, setting: 'toi-et-moi' as const, cut: 'pear' as const, band: 'plain' as const, metalIdx: 0, gemIdx: 1, carats: 1.9 },
              { label: 'Cluster Floral Zafiro Rosa', type: 'ring' as const, setting: 'cluster' as const, cut: 'oval' as const, band: 'pave' as const, metalIdx: 1, gemIdx: 4, carats: 1.7 },
              { label: 'Tiara Imperial Marquesa', type: 'ring' as const, setting: 'tiara' as const, cut: 'marquise' as const, band: 'chevron' as const, metalIdx: 0, gemIdx: 0, carats: 1.8 },
              { label: 'Sello Real Asscher', type: 'ring' as const, setting: 'signet' as const, cut: 'asscher' as const, band: 'plain' as const, metalIdx: 0, gemIdx: 1, carats: 2.2 },
              { label: 'Collar Corazón Rubí', type: 'necklace' as const, setting: 'halo' as const, cut: 'heart' as const, band: 'plain' as const, metalIdx: 0, gemIdx: 3, carats: 2.0 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="rounded-full bg-black/60 backdrop-blur-md border border-white/15 hover:border-accent px-3.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/80 hover:text-accent transition"
              >
                <Sparkles className="w-2.5 h-2.5 inline mr-1 text-accent" />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== PANEL DE ARQUITECTURA BESPOKE + IA ==================== */}
      <aside className="w-full lg:w-[540px] lg:h-full h-[58vh] bg-[#111116] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col">
        {/* Encabezado y pestañas de pasos */}
        <div className="p-5 pb-3.5 border-b border-white/10 space-y-3.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="eyebrow">{c.subtitle}</span>
              <h1 className="font-display uppercase text-2xl md:text-3xl mt-0.5">{c.title}</h1>
            </div>
            <button
              onClick={() => {
                setJewelryType('ai-relief');
                setStep('ia2d3d');
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 border border-accent/50 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-accent hover:bg-accent hover:text-on-accent transition"
            >
              <Wand2 className="w-3 h-3" /> Subir Imagen 2D→3D
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1 bg-black/40 p-1 rounded-full border border-white/10">
            {(
              [
                { id: 'arquitectura', label: '1. Joya' },
                { id: 'gema', label: '2. Gema' },
                { id: 'metal', label: '3. Metal' },
                { id: 'ia2d3d', label: '4. IA 2D→3D' },
                { id: 'firma', label: '5. Firma' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setStep(t.id)}
                className={`py-2 rounded-full text-[10px] uppercase tracking-[0.15em] transition ${
                  step === t.id ? 'bg-accent text-on-accent font-semibold' : 'text-white/60 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido desplazable del paso activo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {step === 'arquitectura' && (
            <>
              {/* Selector de Tipo de Joya */}
              <div>
                <span className="label">
                  Categoría de Joya: <b className="text-white normal-case">{jTypeObj.label}</b>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {JEWELRY_TYPES.map((jt) => (
                    <button
                      key={jt.id}
                      onClick={() => {
                        setJewelryType(jt.id);
                        if (jt.id === 'ai-relief' || jt.id === 'glb-custom') setStep('ia2d3d');
                      }}
                      className={`p-3 rounded-2xl border text-left transition ${
                        jewelryType === jt.id
                          ? 'border-accent bg-accent/15 text-white'
                          : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="text-xs font-medium">{jt.label}</div>
                      <div className="text-[10px] text-white/45 leading-tight mt-0.5">{jt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 12 Siluetas de montura */}
              <div>
                <span className="label">
                  Silueta de Montura (12 Arquitecturas): <b className="text-white normal-case">{shownSetting.name}</b>
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {settingStyles.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSettingId(s.id)}
                      onMouseEnter={() => setHoverSetting(s.id)}
                      onMouseLeave={() => setHoverSetting('')}
                      className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition ${
                        setting.id === s.id
                          ? 'border-accent bg-accent/10 text-white'
                          : 'border-white/10 text-white/75 hover:border-white/30'
                      }`}
                    >
                      <SettingIcon style={s.id} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium leading-tight">{s.name}</div>
                        <div className="text-[10px] text-white/50 leading-snug mt-0.5">{s.subtitle}</div>
                        {s.priceDelta !== 0 && (
                          <div className="text-[10px] text-accent mt-1">+{formatMoney(s.priceDelta, settings)}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 8 Perfiles del aro */}
              <div>
                <span className="label">
                  Arquitectura del Aro (8 Perfiles): <b className="text-white normal-case">{shownBand.name}</b>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bandStyles.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBandId(b.id)}
                      onMouseEnter={() => setHoverBand(b.id)}
                      onMouseLeave={() => setHoverBand('')}
                      className={`flex flex-col justify-between p-3.5 rounded-2xl border text-left transition ${
                        band.id === b.id
                          ? 'border-accent bg-accent/10 text-white'
                          : 'border-white/10 text-white/75 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-medium">{b.name}</div>
                        <div className="text-[10px] text-white/50 mt-0.5">{b.subtitle}</div>
                      </div>
                      <span className="text-[10px] text-accent mt-2">
                        {b.priceDelta === 0 ? 'Incluido' : `+${formatMoney(b.priceDelta, settings)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'gema' && (
            <>
              {/* 10 Tallas / Cortes de la gema */}
              <div>
                <span className="label">
                  Talla de la Gema (10 Cortes): <b className="text-white normal-case">{shownCut.name}</b>
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {cutShapes.map((x) => (
                    <button
                      key={x.id}
                      onClick={() => setCutId(x.id)}
                      onMouseEnter={() => setHoverCut(x.id)}
                      onMouseLeave={() => setHoverCut('')}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                        cut.id === x.id
                          ? 'border-accent bg-accent/10 text-white'
                          : 'border-white/10 text-white/75 hover:border-white/30'
                      }`}
                    >
                      <CutIcon cut={x.id} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium truncate">{x.name}</div>
                        <div className="text-[10px] text-white/50 truncate">{x.subtitle}</div>
                        {x.priceDelta > 0 && (
                          <div className="text-[10px] text-accent">+{formatMoney(x.priceDelta, settings)}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 10 Piedras preciosas centrales */}
              <div>
                <span className="label">
                  Gema Central: <b className="text-white normal-case">{shownGem.name}</b>
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {c.gems.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGemId(g.id)}
                      onMouseEnter={() => setHoverGem(g.id)}
                      onMouseLeave={() => setHoverGem('')}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-xs text-left transition ${
                        gem.id === g.id ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rotate-45 rounded-sm border border-white/30 shrink-0 shadow-inner"
                        style={{ background: g.color }}
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block truncate font-medium">{g.name}</span>
                        <em className="block not-italic text-[10px] text-white/50">
                          {formatMoney(g.pricePerCt, settings)} / ct
                        </em>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quilataje */}
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="label">Peso de la Gema Principal</span>
                  <b className="text-accent text-sm">{carats.toFixed(2)} ct</b>
                </div>
                <input
                  type="range"
                  min={c.minCarats}
                  max={c.maxCarats}
                  step={0.05}
                  value={carats}
                  onChange={(e) => setCarats(Number(e.target.value))}
                  className="w-full accent-[rgb(var(--accent))]"
                />
              </div>

              {/* Gemas secundarias / acento */}
              {hasSideGems && (
                <div>
                  <span className="label">
                    Gemas Secundarias / Acento: <b className="text-white normal-case">{sideGem.name}</b>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {c.gems.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setSideGemId(g.id)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs transition ${
                          sideGem.id === g.id ? 'border-accent bg-accent/15 text-white' : 'border-white/10 text-white/70'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-white/30" style={{ background: g.color }} />
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'metal' && (
            <>
              <div>
                <span className="label">
                  Aleación Noble: <b className="text-white normal-case">{shownMetal.name}</b>
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {c.metals.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMetalId(m.id)}
                      onMouseEnter={() => setHoverMetal(m.id)}
                      onMouseLeave={() => setHoverMetal('')}
                      className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border text-xs text-left transition ${
                        metal.id === m.id ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-white/25 shrink-0" style={{ background: m.color }} />
                        <span className="font-medium text-sm">{m.name}</span>
                      </span>
                      <span className="text-[11px] text-accent">
                        {m.priceDelta === 0 ? 'Incluido' : `${m.priceDelta > 0 ? '+' : ''}${formatMoney(m.priceDelta, settings)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="label">Acabado Superficial del Metal</span>
                <div className="space-y-2">
                  {FINISHES.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFinishId(f.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition ${
                        finish.id === f.id ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-medium">{f.label}</div>
                        <div className="text-[10px] text-white/50">{f.sub}</div>
                      </div>
                      <span className="text-[11px] text-accent">
                        {f.delta === 0 ? 'Incluido' : `+${formatMoney(f.delta, settings)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ==================== PASO 4: ESTUDIO IA 2D → 3D + MESHY AI ==================== */}
          {step === 'ia2d3d' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider">
                  <Wand2 className="w-4 h-4" /> Estudio 2D → 3D (Gratis + Meshy AI / Tripo3D)
                </div>
                <p className="text-xs text-white/75 leading-relaxed">
                  Sube cualquier imagen plana (boceto, escudo, inicial, firma o foto de una joya). Tienes <b>2 modos</b>:
                  <br />• <b>Modo A (Instantáneo y 100% Gratis):</b> Convierte tu imagen al instante en una joya 3D esculpida en bajorrelieve sobre medallón, anillo de sello o dije calado.
                  <br />• <b>Modo B (Meshy AI / Tripo3D Cloud):</b> Genera una malla 3D completa `.GLB` mediante inteligencia artificial o carga tu propio archivo `.GLB`.
                </p>
              </div>

              {/* 1. Subir imagen plana */}
              <div className="space-y-3">
                <span className="label">1. Sube tu Imagen Plana (PNG, JPG, Boceto o Logo)</span>
                <div className="flex gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => imgInputRef.current?.click()}
                    className="btn-outline !py-3 flex-1 !border-white/25"
                  >
                    <Upload className="w-4 h-4" /> Seleccionar imagen 2D…
                  </button>
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await readImageDataUrl(file);
                      setReliefImageUrl(url);
                      setJewelryType('ai-relief');
                      e.target.value = '';
                    }}
                  />
                </div>

                {reliefImageUrl && (
                  <div className="flex items-center gap-4 p-3 rounded-2xl border border-white/10 bg-black/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={reliefImageUrl} alt="Referencia 2D" className="w-16 h-16 rounded-xl object-cover border border-white/20" />
                    <div className="flex-1 text-xs space-y-1">
                      <div className="text-accent font-medium">¡Imagen convertida a Relieve 3D!</div>
                      <div className="text-white/55">Puedes cambiar el metal en el paso 3 y ajustar la profundidad abajo.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Controles del Escultor 2D → 3D Instantáneo */}
              <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">Modo A · Escultor 3D en Vivo (Sin API Key)</span>
                  <button
                    type="button"
                    onClick={() => setJewelryType('ai-relief')}
                    className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      jewelryType === 'ai-relief' ? 'border-accent bg-accent text-on-accent' : 'border-white/20 text-white/60'
                    }`}
                  >
                    {jewelryType === 'ai-relief' ? 'Activo en visor' : 'Activar'}
                  </button>
                </div>

                <div>
                  <span className="label">Tipo de Joya donde esculpir tu imagen</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'medallion', label: 'Medallón Collar' },
                        { id: 'signet-ring', label: 'Anillo de Sello' },
                        { id: 'cutout-charm', label: 'Dije Silueta' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setReliefMount(m.id);
                          setJewelryType('ai-relief');
                        }}
                        className={`p-2.5 rounded-xl border text-xs transition ${
                          reliefMount === m.id && jewelryType === 'ai-relief'
                            ? 'border-accent bg-accent/15 text-white'
                            : 'border-white/10 text-white/65'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Profundidad del Relieve 3D</span>
                    <b className="text-accent">{reliefDepth.toFixed(2)} mm</b>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={2.5}
                    step={0.05}
                    value={reliefDepth}
                    onChange={(e) => {
                      setReliefDepth(Number(e.target.value));
                      setJewelryType('ai-relief');
                    }}
                    className="w-full accent-[rgb(var(--accent))]"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-white/75 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reliefInvert}
                    onChange={(e) => {
                      setReliefInvert(e.target.checked);
                      setJewelryType('ai-relief');
                    }}
                  />
                  Invertir relieve (zonas oscuras sobresalen en vez de las claras)
                </label>
              </div>

              {/* Modo B: Meshy AI / Tripo3D Cloud + Carga directa de .GLB */}
              <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                <span className="eyebrow block">Modo B · Generación Cloud Meshy AI / Tripo3D (.GLB)</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAiProvider('meshy')}
                    className={`py-2 rounded-xl border text-xs ${
                      aiProvider === 'meshy' ? 'border-accent bg-accent/15 text-white' : 'border-white/10 text-white/60'
                    }`}
                  >
                    Meshy AI (Image-to-3D)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiProvider('tripo')}
                    className={`py-2 rounded-xl border text-xs ${
                      aiProvider === 'tripo' ? 'border-accent bg-accent/15 text-white' : 'border-white/10 text-white/60'
                    }`}
                  >
                    Tripo3D AI
                  </button>
                </div>

                <div>
                  <label className="label">
                    API Key de {aiProvider === 'meshy' ? 'Meshy.ai' : 'Tripo3D.ai'} (opcional si ya está en .env o /admin)
                  </label>
                  <input
                    type="password"
                    value={userAiKey}
                    onChange={(e) => setUserAiKey(e.target.value)}
                    placeholder={aiProvider === 'meshy' ? 'msy_...' : 'tsk_...'}
                    className="input !bg-black/50 !border-white/15 !text-white text-xs"
                  />
                </div>

                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={generateWithMeshyAi}
                  className="btn-primary w-full !py-3 !bg-accent !text-on-accent"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Generando 3D ({aiProgress}%)…
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" /> Generar Malla 3D Completa con IA
                    </>
                  )}
                </button>

                {aiStatus && <p className="text-xs text-accent">{aiStatus}</p>}

                <div className="border-t border-white/10 pt-3 space-y-2">
                  <span className="label">¿Ya tienes un modelo .GLB de Meshy, Blender o Rhino?</span>
                  <button
                    type="button"
                    onClick={() => glbInputRef.current?.click()}
                    className="btn-outline w-full !py-2.5 !border-white/20"
                  >
                    <Box className="w-4 h-4" /> Cargar archivo 3D (.GLB / .GLTF)
                  </button>
                  <input
                    ref={glbInputRef}
                    type="file"
                    accept=".glb,.gltf"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setCustomGlbUrl(url);
                      setJewelryType('glb-custom');
                      e.target.value = '';
                    }}
                  />
                  {customGlbUrl && (
                    <label className="flex items-center gap-2 text-xs text-white/75 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overrideGlbMaterial}
                        onChange={(e) => setOverrideGlbMaterial(e.target.checked)}
                      />
                      Bañar el modelo 3D con el metal seleccionado ({shownMetal.name})
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'firma' && (
            <>
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="label">Talla Estándar (US / Colombia)</span>
                  <b className="text-accent text-sm">Talla {ringSize}</b>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setRingSize(sz)}
                      className={`py-2.5 rounded-xl border text-xs transition ${
                        ringSize === sz
                          ? 'border-accent bg-accent text-on-accent font-semibold'
                          : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {c.engraving && (
                <div>
                  <span className="label">Caligrafía Láser Interior (Cortesía de la Maison)</span>
                  <input
                    value={engraving}
                    maxLength={28}
                    onChange={(e) => setEngraving(e.target.value)}
                    placeholder="Ej: A & M · 24.10.2026 · Amor Eterno"
                    className="input !bg-black/40 !border-white/15 !text-white"
                  />
                  <p className="text-[10px] text-white/45 mt-1 text-right">{engraving.length}/28 caracteres</p>
                </div>
              )}

              {/* Resumen de la ficha Bespoke */}
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="eyebrow">Certificado de Configuración</span>
                  <button
                    onClick={() => setShowDossier(true)}
                    className="text-[10px] uppercase tracking-wider text-accent hover:underline flex items-center gap-1 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" /> Ver Ficha Oficial
                  </button>
                </div>
                <div className="flex justify-between"><span className="text-white/50">Tipo de Joya</span><span>{jTypeObj.label}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Montura</span><span>{setting.name}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Talla Gema</span><span>{cut.name} ({carats.toFixed(2)} ct)</span></div>
                <div className="flex justify-between"><span className="text-white/50">Piedra Principal</span><span>{gem.name}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Aro & Metal</span><span>{band.name} · {metal.name}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Acabado</span><span>{finish.label}</span></div>
              </div>
            </>
          )}
        </div>

        {/* Footer de precio y acción */}
        <div className="border-t border-white/10 p-6 space-y-3 bg-black/50">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 block">Valor de la Creación</span>
              <span className="text-[11px] text-white/45">Incluye certificado GIA y estuche de laca</span>
            </div>
            <span className="font-display text-3xl text-accent">{formatMoney(total, settings)}</span>
          </div>

          <button onClick={add} className="btn-primary w-full !bg-accent !text-on-accent hover:brightness-110 shadow-xl">
            {added ? (
              <>
                <Check className="w-4 h-4" /> Añadido a tu joyero
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Encargar esta creación
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setShowDossier(true)}
              className="py-2.5 px-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/50 text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-accent" /> Ficha Técnica
            </button>
            <button
              onClick={() => {
                const text = [
                  `*Atelier Vendôme · Solicitud de Cita & Ficha Bespoke 3D*`,
                  `• Pieza: ${jTypeObj.label} (${setting.name})`,
                  `• Talla de Gema: ${cut.name} (${carats.toFixed(2)} ct)`,
                  `• Piedra Central: ${gem.name}`,
                  `• Aro & Metal: ${band.name} en ${metal.name}`,
                  `• Acabado: ${finish.label}`,
                  jewelryType === 'ring' ? `• Talla Anillo: ${ringSize} (US / Colombia)` : '',
                  engraving ? `• Caligrafía Interior: "${engraving}"` : '',
                  `• Cotización Estimada: ${formatMoney(total, settings)}`,
                  '',
                  'Hola, he diseñado esta pieza en su Atelier 3D y deseo coordinar su manufactura con un gemólogo de la Maison.',
                ].filter(Boolean).join('\n');
                const wa = settings.contact.whatsapp.replace(/\D/g, '');
                window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="py-2.5 px-3 rounded-full border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-1.5 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Cotizar con VIP
            </button>
          </div>
        </div>
      </aside>

      {/* Modal Ficha Técnica Oficial / Dossier Bespoke */}
      {showDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl rounded-[2.2rem] bg-[#0c0c11] border border-accent/40 p-6 md:p-10 shadow-2xl space-y-6 text-[#f4efe6] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent block">Dossier de Haute Joaillerie</span>
                <h3 className="font-display uppercase text-2xl mt-0.5">Ficha Técnica Oficial Bespoke</h3>
              </div>
              <button
                onClick={() => setShowDossier(false)}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-display uppercase text-xl text-accent">{setting.name}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/50">{jTypeObj.label}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-white/45 block text-[10px] uppercase tracking-wider">Gema Principal</span>
                  <span className="font-medium text-white">{gem.name} ({carats.toFixed(2)} Carats)</span>
                </div>
                <div>
                  <span className="text-white/45 block text-[10px] uppercase tracking-wider">Corte / Talla</span>
                  <span className="font-medium text-white">{cut.name}</span>
                </div>
                <div>
                  <span className="text-white/45 block text-[10px] uppercase tracking-wider">Metal Noble</span>
                  <span className="font-medium text-white">{metal.name}</span>
                </div>
                <div>
                  <span className="text-white/45 block text-[10px] uppercase tracking-wider">Aro & Acabado</span>
                  <span className="font-medium text-white">{band.name} ({finish.label})</span>
                </div>
                {jewelryType === 'ring' && (
                  <div>
                    <span className="text-white/45 block text-[10px] uppercase tracking-wider">Medida / Talla</span>
                    <span className="font-medium text-accent">Talla {ringSize} (US / Colombia)</span>
                  </div>
                )}
                {engraving && (
                  <div>
                    <span className="text-white/45 block text-[10px] uppercase tracking-wider">Grabado Láser</span>
                    <span className="font-medium text-white">&ldquo;{engraving}&rdquo;</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-white/50">Valor Estimado</span>
                <span className="font-display text-2xl text-accent">{formatMoney(total, settings)}</span>
              </div>
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed text-center">
              Esta ficha técnica es válida por 30 días para cotización y reserva en nuestro salón de Bogotá o mediante cita privada virtual con un gemólogo.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  const text = `Atelier Vendôme - Ficha Bespoke: ${setting.name}, ${cut.name} ${carats.toFixed(2)}ct, ${gem.name}, ${metal.name}, ${band.name}. Estimación: ${formatMoney(total, settings)}`;
                  navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="btn-outline flex-1 text-center flex items-center justify-center gap-1.5 !text-xs !py-3 !border-white/20 !text-white"
              >
                {copied ? <><Check className="w-3.5 h-3.5 text-accent" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar Ficha</>}
              </button>
              <button
                onClick={() => window.print()}
                className="btn-outline flex-1 text-center flex items-center justify-center gap-1.5 !text-xs !py-3 !border-white/20 !text-white"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimir Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomizerPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#09090c]" />}>
      <CustomizerInner />
    </React.Suspense>
  );
}
