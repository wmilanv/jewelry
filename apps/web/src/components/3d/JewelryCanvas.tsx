'use client';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Lightformer, ContactShadows, Sparkles, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import type { BandStyleKey, CutShapeKey, JewelryTypeKey, SettingStyleKey } from '@/types';
import { RELIEF_PRESETS } from '@/data/reliefPresets';

export type LightingMood = 'studio' | 'candle' | 'daylight';

export interface JewelrySceneProps {
  jewelryType?: JewelryTypeKey;
  metalColor: string;
  gemColor: string;
  sideGemColor?: string;
  carats: number;
  settingStyle?: SettingStyleKey;
  cutShape?: CutShapeKey;
  bandStyle?: BandStyleKey;
  finish?: 'polished' | 'satin' | 'hammered';
  lighting?: LightingMood;
  autoRotate?: boolean;
  interactive?: boolean;
  /** Imagen 2D (dataURL o URL) para esculpir en bajorrelieve / silueta 3D en tiempo real */
  reliefImageUrl?: string;
  /** Profundidad del relieve 2D→3D (0.2 a 3.0) */
  reliefDepth?: number;
  /** Tipo de montura para la imagen 2D→3D ('medallion' | 'signet-ring' | 'cutout-charm') */
  reliefMount?: 'medallion' | 'signet-ring' | 'cutout-charm';
  /** Invertir mapa de alturas claro/oscuro */
  reliefInvert?: boolean;
  /** Estilo de escultura ('relief' positivo / camafeo, 'intaglio' grabado fondo / lacre, 'engraving' fino) */
  reliefStyle?: 'relief' | 'intaglio' | 'engraving';
  /** Contraste / Nitidez del relieve (0.5 a 2.5) */
  reliefContrast?: number;
  /** Suavizado / Anti-ruido de trazo (0 a 3) */
  reliefSmooth?: number;
  /** Borde decorativo para el medallón ('milgrain' perlé | 'guilloche' solar | 'smooth' pulido) */
  reliefBorder?: 'milgrain' | 'guilloche' | 'smooth';
  /** URL de modelo .GLB (generado con Meshy AI / Tripo3D o subido por el usuario) */
  customGlbUrl?: string;
  /** Si es true, aplica el material de oro/platino elegido al modelo GLB */
  overrideGlbMaterial?: boolean;
}

/** Escala (x, z) según la talla de la gema para adaptar piedra, biseles y garras */
function getCutDimensions(cut: CutShapeKey): { sx: number; sz: number; segments: number; rotY: number } {
  switch (cut) {
    case 'emerald':
      return { sx: 0.82, sz: 1.18, segments: 8, rotY: Math.PI / 8 };
    case 'baguette':
      return { sx: 0.56, sz: 1.42, segments: 4, rotY: Math.PI / 4 };
    case 'asscher':
      return { sx: 0.96, sz: 0.96, segments: 8, rotY: Math.PI / 8 };
    case 'cushion':
      return { sx: 0.94, sz: 1.04, segments: 12, rotY: Math.PI / 12 };
    case 'oval':
      return { sx: 0.78, sz: 1.24, segments: 20, rotY: 0 };
    case 'princess':
      return { sx: 0.94, sz: 0.94, segments: 4, rotY: Math.PI / 4 };
    case 'pear':
      return { sx: 0.8, sz: 1.26, segments: 18, rotY: 0 };
    case 'marquise':
      return { sx: 0.64, sz: 1.4, segments: 16, rotY: 0 };
    case 'heart':
      return { sx: 1.05, sz: 1.05, segments: 16, rotY: 0 };
    case 'round':
    default:
      return { sx: 1, sz: 1, segments: 16, rotY: 0 };
  }
}

function GemMesh({
  cut,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  material,
}: {
  cut: CutShapeKey;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  material: React.ReactNode;
}) {
  const { sx, sz, segments, rotY } = getCutDimensions(cut);

  if (cut === 'heart') {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        {/* Dos lóbulos superiores + punta inferior para formar el corazón */}
        <mesh position={[-0.17, 0.06, -0.08]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.28, 0.22, 12]} />
          {material}
        </mesh>
        <mesh position={[0.17, 0.06, -0.08]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.28, 0.22, 12]} />
          {material}
        </mesh>
        <mesh position={[0, 0.04, 0.16]} rotation={[-Math.PI / 2.2, 0, 0]}>
          <coneGeometry args={[0.36, 0.48, 12]} />
          {material}
        </mesh>
        <mesh position={[0, -0.18, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.45, 0.38, 14]} />
          {material}
        </mesh>
      </group>
    );
  }

  if (cut === 'pear') {
    return (
      <group position={position} rotation={rotation} scale={[scale * sx, scale, scale * sz]}>
        <mesh position={[0, 0.12, -0.04]} rotation={[0.08, rotY, 0]}>
          <cylinderGeometry args={[0.28, 0.48, 0.17, segments, 1]} />
          {material}
        </mesh>
        <mesh position={[0, 0.08, 0.28]} rotation={[-Math.PI / 2.3, 0, 0]}>
          <coneGeometry args={[0.26, 0.42, 12]} />
          {material}
        </mesh>
        <mesh position={[0, -0.2, -0.02]} rotation={[Math.PI, rotY, 0]}>
          <coneGeometry args={[0.48, 0.44, segments, 1]} />
          {material}
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} rotation={rotation} scale={[scale * sx, scale, scale * sz]}>
      <mesh position={[0, 0.12, 0]} rotation={[0, rotY, 0]}>
        <cylinderGeometry args={[cut === 'emerald' || cut === 'baguette' || cut === 'asscher' ? 0.38 : 0.31, 0.5, 0.17, segments, 1]} />
        {material}
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[0, rotY, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.028, segments, 1]} />
        {material}
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI, rotY, 0]}>
        <coneGeometry args={[0.5, 0.43, segments, 1]} />
        {material}
      </mesh>
    </group>
  );
}

/* ======================================================================= */
/*  MOTOR 2D → 3D INSTANTÁNEO HAUTE JOAILLERIE (ESCULTOR EN VIVO SIN API)  */
/* ======================================================================= */
function ImageReliefSculpture({
  imageUrl,
  depth = 1.25,
  mount = 'medallion',
  invert = false,
  reliefStyle = 'relief',
  reliefContrast = 1.2,
  reliefSmooth = 0.8,
  reliefBorder = 'milgrain',
  metalColor,
  metalMat,
  gemMat,
  cutShape = 'round',
  finish = 'polished',
  autoRotate = true,
}: {
  imageUrl?: string;
  depth?: number;
  mount?: 'medallion' | 'signet-ring' | 'cutout-charm';
  invert?: boolean;
  reliefStyle?: 'relief' | 'intaglio' | 'engraving';
  reliefContrast?: number;
  reliefSmooth?: number;
  reliefBorder?: 'milgrain' | 'guilloche' | 'smooth';
  metalColor: string;
  metalMat: React.ReactNode;
  gemMat: React.ReactNode;
  cutShape?: CutShapeKey;
  finish?: 'polished' | 'satin' | 'hammered';
  autoRotate?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const [reliefGeo, setReliefGeo] = useState<THREE.BufferGeometry | null>(null);
  const [bumpTex, setBumpTex] = useState<THREE.CanvasTexture | null>(null);

  useFrame((state, delta) => {
    if (group.current) {
      if (autoRotate !== false) {
        group.current.rotation.y += delta * 0.28;
      }
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.55) * 0.05 + 0.12;
    }
  });

  useEffect(() => {
    let active = true;
    const grid = 160;
    const plane = new THREE.PlaneGeometry(1.55, 1.55, grid, grid);

    const sourceUrl = imageUrl || RELIEF_PRESETS[0].svgDataUri;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (!active) return;
      const canvas = document.createElement('canvas');
      const size = 320;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);

      if (reliefSmooth > 0) {
        ctx.filter = `blur(${Math.min(reliefSmooth, 3)}px)`;
      }

      const aspect = (img.naturalWidth || img.width) / (img.naturalHeight || img.height || 1);
      let dw = size * 0.92;
      let dh = size * 0.92;
      if (aspect > 1) {
        dh = dw / aspect;
      } else {
        dw = dh * aspect;
      }
      const dx = (size - dw) / 2;
      const dy = (size - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.filter = 'none';

      const imgData = ctx.getImageData(0, 0, size, size);
      const data = imgData.data;

      // Muestreo perimetral para auto-detección de fondo claro
      const cornerSamples = [
        0, 1, 2, 3,
        size - 4, size - 3, size - 2, size - 1,
        (size - 1) * size, (size - 1) * size + 1,
        size * size - 2, size * size - 1,
      ];
      let bgLumSum = 0;
      for (const idx of cornerSamples) {
        const p = idx * 4;
        bgLumSum += (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255;
      }
      const avgBgLum = bgLumSum / cornerSamples.length;
      const isLightBg = avgBgLum > 0.65;

      const contrastK = Math.max(0.5, Math.min(2.8, reliefContrast));
      const pos = plane.attributes.position;
      const w = grid + 1;
      const h = grid + 1;

      for (let i = 0; i < pos.count; i++) {
        const ix = i % w;
        const iy = Math.floor(i / w);
        const u = ix / (w - 1);
        const v = 1 - iy / (h - 1);

        const px = Math.min(size - 1, Math.max(0, Math.floor(u * (size - 1))));
        const py = Math.min(size - 1, Math.max(0, Math.floor((1 - v) * (size - 1))));
        const pIdx = (py * size + px) * 4;

        const r = data[pIdx] / 255;
        const g = data[pIdx + 1] / 255;
        const b = data[pIdx + 2] / 255;
        const alpha = data[pIdx + 3] / 255;

        let rawLum = (0.299 * r + 0.587 * g + 0.114 * b) * alpha;

        if (isLightBg) {
          rawLum = Math.max(0, 1 - rawLum);
        }

        if (invert) {
          rawLum = 1 - rawLum;
        }

        // Curva sigmoide para contraste profesional
        let lum = 1 / (1 + Math.exp(-contrastK * 6 * (rawLum - 0.5)));
        lum = Math.max(0, Math.min(1, (lum - 0.05) / 0.9));

        // Máscara perimetral suave
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const dist = Math.hypot(vx, vy);
        const mask =
          mount === 'cutout-charm'
            ? (alpha > 0.3 ? 1 : 0)
            : dist <= 0.70
            ? 1
            : dist >= 0.76
            ? 0
            : 0.5 + 0.5 * Math.cos((Math.PI * (dist - 0.70)) / (0.76 - 0.70));

        let heightMultiplier = 0.22 * depth * mask;
        if (reliefStyle === 'intaglio') {
          heightMultiplier = -0.18 * depth * mask;
        } else if (reliefStyle === 'engraving') {
          heightMultiplier = 0.09 * depth * mask;
        }

        pos.setZ(i, lum * heightMultiplier);
      }

      plane.computeVertexNormals();
      setReliefGeo(plane);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      setBumpTex((prev) => {
        if (prev) prev.dispose();
        return tex;
      });
    };

    img.src = sourceUrl;

    return () => {
      active = false;
      plane.dispose();
    };
  }, [imageUrl, depth, mount, invert, reliefStyle, reliefContrast, reliefSmooth]);

  useEffect(() => {
    return () => {
      if (bumpTex) bumpTex.dispose();
    };
  }, [bumpTex]);

  // Cuentas de oro para borde Milgrain (56 micro-esferas)
  const milgrainPositions = useMemo(() => {
    const count = 56;
    const pts: [number, number, number][] = [];
    const r = 0.88;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push([Math.cos(a) * r, Math.sin(a) * r, 0.068]);
    }
    return pts;
  }, []);

  const reliefMaterial = (
    <meshPhysicalMaterial
      color={metalColor}
      metalness={1}
      roughness={finish === 'satin' ? 0.32 : finish === 'hammered' ? 0.22 : 0.08}
      clearcoat={finish === 'satin' ? 0.2 : 0.8}
      clearcoatRoughness={0.08}
      reflectivity={1}
      envMapIntensity={2.8}
      bumpMap={bumpTex || undefined}
      bumpScale={reliefStyle === 'intaglio' ? -0.016 * depth : 0.018 * depth}
    />
  );

  if (mount === 'signet-ring') {
    const R = 1.15;
    return (
      <group ref={group} position={[0, -0.2, 0]} rotation={[0.34, -0.42, 0]}>
        {/* Aro macizo de Chevalière */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[R, 0.15, 48, 140]} />
          {metalMat}
        </mesh>
        {/* Hombros de transición hacia la meseta */}
        <mesh position={[0, R - 0.06, 0]}>
          <cylinderGeometry args={[0.66, 0.38, 0.34, 48]} />
          {metalMat}
        </mesh>
        {/* Meseta octogonal / bisel de protección */}
        <mesh position={[0, R + 0.1, 0]}>
          <cylinderGeometry args={[0.68, 0.65, 0.08, 48]} />
          {metalMat}
        </mesh>
        <mesh position={[0, R + 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.64, 0.035, 20, 64]} />
          {metalMat}
        </mesh>
        {/* Relieve esculpido en la meseta del sello */}
        {reliefGeo && (
          <mesh
            geometry={reliefGeo}
            position={[0, R + 0.138, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[0.74, 0.74, 0.74]}
          >
            {reliefMaterial}
          </mesh>
        )}
      </group>
    );
  }

  if (mount === 'cutout-charm') {
    return (
      <group ref={group} position={[0, 0, 0]}>
        {/* Argolla superior de suspensión */}
        <mesh position={[0, 0.96, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.13, 0.035, 20, 48]} />
          {metalMat}
        </mesh>
        {/* Silueta esculpida */}
        {reliefGeo && (
          <mesh geometry={reliefGeo} position={[0, 0, 0]}>
            {reliefMaterial}
          </mesh>
        )}
        {/* Placa trasera de soporte */}
        <mesh position={[0, 0, -0.02]}>
          <cylinderGeometry args={[0.78, 0.78, 0.04, 64]} />
          {metalMat}
        </mesh>
      </group>
    );
  }

  // Montura Medallón Talismán (Pendant Imperial)
  return (
    <group ref={group} position={[0, -0.05, 0]}>
      {/* Cadena superior de oro */}
      <mesh position={[0, 1.45, 0]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.95, 0.024, 20, 100, Math.PI]} />
        {metalMat}
      </mesh>
      {/* Argolla Pendentif (Bail) fluted */}
      <mesh position={[0, 1.14, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.15, 0.042, 24, 48]} />
        {metalMat}
      </mesh>
      <mesh position={[0, 0.98, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.08, 0.022, 16, 32]} />
        {metalMat}
      </mesh>

      {/* Caja maciza del medallón */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.94, 0.94, 0.13, 64]} />
        {metalMat}
      </mesh>
      {/* Moldura trasera biselada */}
      <mesh position={[0, 0, -0.065]}>
        <torusGeometry args={[0.93, 0.045, 20, 80]} />
        {metalMat}
      </mesh>

      {/* Borde Decorativo según preferencia */}
      {reliefBorder === 'milgrain' && (
        <>
          <mesh position={[0, 0, 0.065]}>
            <torusGeometry args={[0.92, 0.038, 20, 80]} />
            {metalMat}
          </mesh>
          {milgrainPositions.map((pos, idx) => (
            <mesh key={idx} position={pos}>
              <sphereGeometry args={[0.028, 12, 12]} />
              {metalMat}
            </mesh>
          ))}
        </>
      )}

      {reliefBorder === 'guilloche' && (
        <>
          <mesh position={[0, 0, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.93, 0.93, 0.03, 48]} />
            {metalMat}
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <torusGeometry args={[0.91, 0.045, 20, 72]} />
            {metalMat}
          </mesh>
        </>
      )}

      {reliefBorder === 'smooth' && (
        <mesh position={[0, 0, 0.068]}>
          <torusGeometry args={[0.92, 0.05, 24, 80]} />
          {metalMat}
        </mesh>
      )}

      {/* Gema de acento engastada en la corona superior del medallón */}
      <group position={[0, 0.81, 0.072]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.11, 0.05, 24]} />
          {metalMat}
        </mesh>
        <GemMesh cut={cutShape} scale={0.24} position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={gemMat} />
      </group>

      {/* Escultura en relieve con micro-facetado */}
      {reliefGeo && (
        <mesh geometry={reliefGeo} position={[0, 0, 0.065]}>
          {reliefMaterial}
        </mesh>
      )}
    </group>
  );
}

/* ======================================================================= */
/*  CARGADOR DE MALLA .GLB (GENERADA CON MESHY AI / TRIPO3D O SUBIDA)      */
/* ======================================================================= */
function CustomGlbModel({
  url,
  metalColor,
  finish = 'polished',
  overrideMaterial = true,
  autoRotate = true,
}: {
  url: string;
  metalColor: string;
  finish?: 'polished' | 'satin' | 'hammered';
  overrideMaterial?: boolean;
  autoRotate?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    if (overrideMaterial) {
      const rough = finish === 'satin' ? 0.28 : finish === 'hammered' ? 0.19 : 0.08;
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(metalColor),
        metalness: 1,
        roughness: rough,
        clearcoat: 0.5,
        envMapIntensity: 2.2,
      });
      c.traverse((obj: any) => {
        if (obj.isMesh) {
          obj.material = mat;
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
    }
    return c;
  }, [scene, metalColor, finish, overrideMaterial]);

  useFrame((_, delta) => {
    if (group.current && autoRotate !== false) {
      group.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={cloned} scale={2.1} />
      </Center>
    </group>
  );
}

/* ======================================================================= */
/*  MODELOS 3D DE COLLAR, ARETES Y BRAZALETE                               */
/* ======================================================================= */
function NecklaceModel({
  metalMat,
  gemMat,
  sideGemMat,
  cutShape = 'round',
  settingStyle = 'solitaire',
  carats,
  autoRotate = true,
}: {
  metalMat: React.ReactNode;
  gemMat: React.ReactNode;
  sideGemMat: React.ReactNode;
  cutShape?: CutShapeKey;
  settingStyle?: SettingStyleKey;
  carats: number;
  autoRotate?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current && autoRotate !== false) group.current.rotation.y += delta * 0.26;
  });
  const s = 0.6 + Math.cbrt(carats) * 0.34;
  return (
    <group ref={group} position={[0, 0.1, 0]}>
      {/* Cadena catenaria en oro */}
      <mesh position={[0, 0.85, 0]} rotation={[0.2, 0, Math.PI]}>
        <torusGeometry args={[1.35, 0.026, 24, 120, Math.PI]} />
        {metalMat}
      </mesh>
      {/* Reasa / Bail */}
      <mesh position={[0, -0.35, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.13, 0.035, 20, 48]} />
        {metalMat}
      </mesh>
      {/* Pendentif central */}
      <group position={[0, -0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.42 * s, 0.25 * s, 0.2 * s, 32]} />
          {metalMat}
        </mesh>
        {(settingStyle === 'halo' || settingStyle === 'vintage') &&
          Array.from({ length: 14 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 14;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.56 * s, 0.1 * s, Math.sin(a) * 0.56 * s]}>
                <octahedronGeometry args={[0.06 * s, 1]} />
                {sideGemMat}
              </mesh>
            );
          })}
        <GemMesh cut={cutShape} scale={s} position={[0, 0.12 * s, 0]} material={gemMat} />
      </group>
    </group>
  );
}

function EarringsModel({
  metalMat,
  gemMat,
  sideGemMat,
  cutShape = 'round',
  settingStyle = 'solitaire',
  carats,
  autoRotate = true,
}: {
  metalMat: React.ReactNode;
  gemMat: React.ReactNode;
  sideGemMat: React.ReactNode;
  cutShape?: CutShapeKey;
  settingStyle?: SettingStyleKey;
  carats: number;
  autoRotate?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current && autoRotate !== false) group.current.rotation.y += delta * 0.26;
  });
  const s = 0.46 + Math.cbrt(carats) * 0.26;
  return (
    <group ref={group} position={[0, -0.05, 0]}>
      {[-0.88, 0.88].map((xOffset, idx) => (
        <group key={idx} position={[xOffset, 0, 0]} rotation={[0, idx === 0 ? 0.18 : -0.18, 0]}>
          {/* Argolla Huggie superior */}
          <mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.28, 0.048, 24, 64]} />
            {metalMat}
          </mesh>
          {/* Eslabón de suspensión con diamante */}
          <mesh position={[0, 0.25, 0.05]}>
            <octahedronGeometry args={[0.075, 1]} />
            {sideGemMat}
          </mesh>
          {/* Gema principal colgante */}
          <group position={[0, -0.25, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.4 * s, 0.22 * s, 0.18 * s, 28]} />
              {metalMat}
            </mesh>
            {settingStyle === 'halo' &&
              Array.from({ length: 12 }).map((_, i) => {
                const a = (i * Math.PI * 2) / 12;
                return (
                  <mesh key={i} position={[Math.cos(a) * 0.54 * s, 0.08 * s, Math.sin(a) * 0.54 * s]}>
                    <octahedronGeometry args={[0.055 * s, 1]} />
                    {sideGemMat}
                  </mesh>
                );
              })}
            <GemMesh cut={cutShape} scale={s} position={[0, 0.1 * s, 0]} material={gemMat} />
          </group>
        </group>
      ))}
    </group>
  );
}

function BraceletModel({
  metalMat,
  gemMat,
  sideGemMat,
  cutShape = 'round',
  bandStyle = 'plain',
  carats,
  autoRotate = true,
}: {
  metalMat: React.ReactNode;
  gemMat: React.ReactNode;
  sideGemMat: React.ReactNode;
  cutShape?: CutShapeKey;
  bandStyle?: BandStyleKey;
  carats: number;
  autoRotate?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current && autoRotate !== false) group.current.rotation.y += delta * 0.26;
  });
  const R = 1.42;
  const s = 0.45 + Math.cbrt(carats) * 0.25;
  return (
    <group ref={group} position={[0, -0.1, 0]} rotation={[0.38, -0.3, 0]}>
      {/* Brazalete Manchette / Rivière */}
      <mesh castShadow>
        <torusGeometry args={[R, 0.11, 48, 160, Math.PI * 1.75]} />
        {metalMat}
      </mesh>
      {bandStyle === 'pave' &&
        Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 23) * Math.PI * 1.65 + 0.1;
          return (
            <mesh key={i} position={[Math.cos(a) * (R + 0.1), Math.sin(a) * (R + 0.1), 0]}>
              <octahedronGeometry args={[0.055, 1]} />
              {sideGemMat}
            </mesh>
          );
        })}
      {/* Gema estación central */}
      <group position={[0, R + 0.12, 0]}>
        <GemMesh cut={cutShape} scale={s} position={[0, 0.12 * s, 0]} material={gemMat} />
      </group>
    </group>
  );
}

/* ======================================================================= */
/*  ARQUITECTURA DE ANILLOS (12 SILUETAS × 10 CORTES × 8 PERFILES DE ARO)  */
/* ======================================================================= */
function RingModel({
  metalColor,
  gemColor,
  sideGemColor,
  carats,
  settingStyle = 'solitaire',
  cutShape = 'round',
  bandStyle = 'plain',
  finish = 'polished',
  autoRotate = true,
  jewelryType = 'ring',
  reliefImageUrl,
  reliefDepth,
  reliefMount,
  reliefInvert,
  reliefStyle,
  reliefContrast,
  reliefSmooth,
  reliefBorder,
  customGlbUrl,
  overrideGlbMaterial,
}: JewelrySceneProps) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      if (autoRotate !== false) {
        group.current.rotation.y += delta * 0.28;
      }
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.55) * 0.06 + 0.22;
    }
  });

  const s = 0.5 + Math.cbrt(carats) * 0.32;
  const R = 1.15;
  const { sx, sz } = getCutDimensions(cutShape);
  const isDark = new THREE.Color(gemColor).getHSL({ h: 0, s: 0, l: 0 }).l < 0.15;
  const rough = finish === 'satin' ? 0.28 : finish === 'hammered' ? 0.19 : 0.08;

  const metalMat = (
    <meshPhysicalMaterial
      color={metalColor}
      metalness={1}
      roughness={rough}
      clearcoat={finish === 'satin' ? 0.15 : 0.5}
      clearcoatRoughness={rough * 0.8}
      reflectivity={1}
      envMapIntensity={2.3}
    />
  );

  const gemMat = (
    <meshPhysicalMaterial
      color={gemColor}
      flatShading
      metalness={isDark ? 0.55 : 0.04}
      roughness={0.01}
      transmission={isDark ? 0.15 : 0.93}
      thickness={1.9}
      ior={2.417}
      clearcoat={1}
      clearcoatRoughness={0}
      reflectivity={1}
      envMapIntensity={isDark ? 1.9 : 4.4}
      attenuationColor={gemColor}
      attenuationDistance={0.95}
    />
  );

  const accentGemTone = sideGemColor || '#f5fbff';
  const sideGemMat = (
    <meshPhysicalMaterial
      color={accentGemTone}
      flatShading
      metalness={0.05}
      roughness={0.02}
      transmission={0.9}
      thickness={1.1}
      ior={2.417}
      clearcoat={1}
      reflectivity={1}
      envMapIntensity={3.8}
    />
  );

  /* Curvas 3D para la banda Torsade (twisted) — declaradas antes de cualquier return condicional */
  const twistedGeometries = useMemo(() => {
    const createStrand = (phase: number) => {
      const pts: THREE.Vector3[] = [];
      const steps = 160;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const distFromTop = Math.min(1, Math.abs(Math.sin(t - Math.PI / 2)) * 1.4);
        const amp = 0.055 * distFromTop;
        const twist = t * 7 + phase;
        const r = R + Math.cos(twist) * amp * 0.45;
        const z = Math.sin(twist) * amp;
        pts.push(new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r, z));
      }
      const curve = new THREE.CatmullRomCurve3(pts, true);
      return new THREE.TubeGeometry(curve, 180, 0.078, 20, true);
    };
    return [createStrand(0), createStrand(Math.PI)];
  }, [R]);

  /* Curva 3D para aro Chevron V-Crown */
  const chevronGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const steps = 160;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const topPeak = Math.exp(-Math.pow((t - Math.PI / 2) * 3.5, 2));
      const z = topPeak * 0.24;
      pts.push(new THREE.Vector3(Math.cos(t) * R, Math.sin(t) * R, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    return new THREE.TubeGeometry(curve, 160, 0.115, 24, true);
  }, [R]);

  /* Posiciones para Pavé en el aro */
  const paveAngles = useMemo(() => {
    const arr: number[] = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const frac = i / (count - 1);
      const a = -Math.PI * 0.15 + frac * Math.PI * 1.3;
      if (Math.abs(a - Math.PI / 2) > 0.22) arr.push(a);
    }
    return arr;
  }, []);

  /* Si el cliente eligió otra categoría de joya o el estudio 2D→3D */
  if (jewelryType === 'ai-relief') {
    return (
      <ImageReliefSculpture
        imageUrl={reliefImageUrl}
        depth={reliefDepth}
        mount={reliefMount}
        invert={reliefInvert}
        reliefStyle={reliefStyle}
        reliefContrast={reliefContrast}
        reliefSmooth={reliefSmooth}
        reliefBorder={reliefBorder}
        metalColor={metalColor}
        metalMat={metalMat}
        gemMat={gemMat}
        cutShape={cutShape}
        finish={finish}
        autoRotate={autoRotate}
      />
    );
  }
  if (jewelryType === 'glb-custom' && customGlbUrl) {
    return (
      <Suspense fallback={null}>
        <CustomGlbModel
          url={customGlbUrl}
          metalColor={metalColor}
          finish={finish}
          overrideMaterial={overrideGlbMaterial}
          autoRotate={autoRotate}
        />
      </Suspense>
    );
  }
  if (jewelryType === 'necklace') {
    return (
      <NecklaceModel
        metalMat={metalMat}
        gemMat={gemMat}
        sideGemMat={sideGemMat}
        cutShape={cutShape}
        settingStyle={settingStyle}
        carats={carats}
        autoRotate={autoRotate}
      />
    );
  }
  if (jewelryType === 'earrings') {
    return (
      <EarringsModel
        metalMat={metalMat}
        gemMat={gemMat}
        sideGemMat={sideGemMat}
        cutShape={cutShape}
        settingStyle={settingStyle}
        carats={carats}
        autoRotate={autoRotate}
      />
    );
  }
  if (jewelryType === 'bracelet') {
    return (
      <BraceletModel
        metalMat={metalMat}
        gemMat={gemMat}
        sideGemMat={sideGemMat}
        cutShape={cutShape}
        bandStyle={bandStyle}
        carats={carats}
        autoRotate={autoRotate}
      />
    );
  }

  return (
    <group ref={group} position={[0, -0.25, 0]} rotation={[0.24, -0.42, -0.1]}>
      {/* ==================== 1. BANDA / ARO ==================== */}
      {settingStyle === 'tension' ? (
        /* En montura de Suspensión Aérea (Tension), el aro se abre en la cima */
        <mesh rotation={[0, 0, Math.PI / 2 + 0.28]} castShadow>
          <torusGeometry args={[R, 0.145, 48, 160, Math.PI * 2 - 0.56]} />
          {metalMat}
        </mesh>
      ) : (
        <>
          {bandStyle === 'plain' && (
            <>
              <mesh castShadow receiveShadow>
                <torusGeometry args={[R, 0.125, 64, 180]} />
                {metalMat}
              </mesh>
              <mesh>
                <torusGeometry args={[R - 0.028, 0.095, 32, 128]} />
                {metalMat}
              </mesh>
            </>
          )}

          {bandStyle === 'knife' && (
            <mesh castShadow receiveShadow>
              <torusGeometry args={[R, 0.138, 6, 180]} />
              {metalMat}
            </mesh>
          )}

          {bandStyle === 'split' && (
            <>
              <mesh rotation={[0.1, 0, 0]} position={[0, 0, 0.04]} castShadow>
                <torusGeometry args={[R, 0.088, 48, 160]} />
                {metalMat}
              </mesh>
              <mesh rotation={[-0.1, 0, 0]} position={[0, 0, -0.04]} castShadow>
                <torusGeometry args={[R, 0.088, 48, 160]} />
                {metalMat}
              </mesh>
            </>
          )}

          {bandStyle === 'twisted' && (
            <>
              <mesh geometry={twistedGeometries[0]} castShadow>
                {metalMat}
              </mesh>
              <mesh geometry={twistedGeometries[1]} castShadow>
                {metalMat}
              </mesh>
            </>
          )}

          {bandStyle === 'chevron' && (
            <mesh geometry={chevronGeometry} castShadow>
              {metalMat}
            </mesh>
          )}

          {bandStyle === 'beaded' && (
            <>
              <mesh>
                <torusGeometry args={[R, 0.07, 24, 120]} />
                {metalMat}
              </mesh>
              {Array.from({ length: 34 }).map((_, i) => {
                const a = (i * Math.PI * 2) / 34;
                if (Math.abs(a - Math.PI / 2) < 0.2) return null;
                return (
                  <mesh key={i} position={[Math.cos(a) * R, Math.sin(a) * R, 0]} castShadow>
                    <sphereGeometry args={[0.135, 24, 24]} />
                    {metalMat}
                  </mesh>
                );
              })}
            </>
          )}

          {bandStyle === 'channel' && (
            <>
              {/* Rieles exteriores de oro */}
              <mesh position={[0, 0, 0.075]} castShadow>
                <torusGeometry args={[R, 0.055, 32, 160]} />
                {metalMat}
              </mesh>
              <mesh position={[0, 0, -0.075]} castShadow>
                <torusGeometry args={[R, 0.055, 32, 160]} />
                {metalMat}
              </mesh>
              <mesh>
                <torusGeometry args={[R - 0.03, 0.09, 32, 140]} />
                {metalMat}
              </mesh>
              {paveAngles.map((a, idx) => (
                <mesh
                  key={idx}
                  position={[Math.cos(a) * (R + 0.08), Math.sin(a) * (R + 0.08), 0]}
                  rotation={[0, 0, a - Math.PI / 2]}
                >
                  <boxGeometry args={[0.09, 0.045, 0.09]} />
                  {sideGemMat}
                </mesh>
              ))}
            </>
          )}

          {bandStyle === 'pave' && (
            <>
              <mesh castShadow receiveShadow>
                <torusGeometry args={[R, 0.122, 64, 180]} />
                {metalMat}
              </mesh>
              {paveAngles.map((a, idx) => {
                const rOuter = R + 0.115;
                return (
                  <group
                    key={idx}
                    position={[Math.cos(a) * rOuter, Math.sin(a) * rOuter, 0]}
                    rotation={[0, 0, a - Math.PI / 2]}
                  >
                    <mesh>
                      <octahedronGeometry args={[0.052, 1]} />
                      {sideGemMat}
                    </mesh>
                    <mesh position={[0, 0, 0.048]}>
                      <sphereGeometry args={[0.018, 10, 10]} />
                      {metalMat}
                    </mesh>
                    <mesh position={[0, 0, -0.048]}>
                      <sphereGeometry args={[0.018, 10, 10]} />
                      {metalMat}
                    </mesh>
                  </group>
                );
              })}
            </>
          )}
        </>
      )}

      {/* ==================== 2. MONTURA & GEMA CENTRAL ==================== */}
      <group position={[0, R + 0.08, 0]}>
        {/* -------- VARIANTE: TOI ET MOI (TÚ Y YO — DOS GEMAS ENCONTRADAS) -------- */}
        {settingStyle === 'toi-et-moi' ? (
          <group position={[0, 0.12 * s, 0]}>
            <GemMesh
              cut={cutShape}
              scale={s * 0.85}
              position={[-0.28 * s, 0.08 * s, 0.08]}
              rotation={[0.08, 0.2, 0.18]}
              material={gemMat}
            />
            <GemMesh
              cut={cutShape === 'pear' ? 'emerald' : 'pear'}
              scale={s * 0.82}
              position={[0.28 * s, 0.08 * s, -0.08]}
              rotation={[-0.08, -0.25, -0.18]}
              material={sideGemMat}
            />
            {/* Basamento doble */}
            <mesh position={[-0.26 * s, -0.08, 0.06]}>
              <cylinderGeometry args={[0.24 * s, 0.14 * s, 0.2 * s, 20]} />
              {metalMat}
            </mesh>
            <mesh position={[0.26 * s, -0.08, -0.06]}>
              <cylinderGeometry args={[0.24 * s, 0.14 * s, 0.2 * s, 20]} />
              {metalMat}
            </mesh>
          </group>
        ) : settingStyle === 'signet' ? (
          /* -------- VARIANTE: SELLO REAL (SIGNET CHEVALIÈRE) -------- */
          <group position={[0, -0.02, 0]}>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.58 * s, 0.32 * s, 0.28 * s, 8]} />
              {metalMat}
            </mesh>
            <GemMesh cut={cutShape} scale={s * 0.72} position={[0, 0.18 * s, 0]} material={gemMat} />
          </group>
        ) : (
          <>
            {/* Galería portapiedra */}
            {settingStyle !== 'bezel' && settingStyle !== 'tension' && (
              <>
                <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[sx, sz, 1]}>
                  <torusGeometry args={[0.34 * s, 0.026, 24, 64]} />
                  {metalMat}
                </mesh>
                <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[sx, sz, 1]}>
                  <torusGeometry args={[0.2 * s, 0.032, 24, 64]} />
                  {metalMat}
                </mesh>
              </>
            )}

            {/* Garras adaptadas */}
            {settingStyle !== 'bezel' &&
              settingStyle !== 'tension' &&
              [0, 1, 2, 3, 4, 5].map((i) => {
                const count = cutShape === 'princess' || cutShape === 'emerald' || cutShape === 'baguette' ? 4 : 6;
                if (i >= count) return null;
                const offset = count === 4 ? Math.PI / 4 : 0;
                const a = (i * Math.PI * 2) / count + offset;
                const rTopX = 0.42 * s * sx;
                const rTopZ = 0.42 * s * sz;
                const rBotX = 0.19 * s * sx;
                const rBotZ = 0.19 * s * sz;
                const topX = Math.cos(a) * rTopX;
                const topZ = Math.sin(a) * rTopZ;
                const botX = Math.cos(a) * rBotX;
                const botZ = Math.sin(a) * rBotZ;
                const midX = (topX + botX) * 0.5;
                const midZ = (topZ + botZ) * 0.5;
                const radialAngle = Math.atan2(topZ, topX);
                const distTop = Math.hypot(topX, topZ);
                const distBot = Math.hypot(botX, botZ);
                const tilt = Math.atan2(distTop - distBot, 0.38 * s);
                return (
                  <group key={i}>
                    <mesh position={[midX, 0.17 * s, midZ]} rotation={[0, -radialAngle, -tilt]}>
                      <cylinderGeometry args={[0.025, 0.035, 0.44 * s, 16]} />
                      {metalMat}
                    </mesh>
                    <mesh position={[topX * 0.96, 0.36 * s, topZ * 0.96]}>
                      <sphereGeometry args={[0.031, 16, 16]} />
                      {metalMat}
                    </mesh>
                  </group>
                );
              })}

            {/* BISEL MODERNISTA */}
            {settingStyle === 'bezel' && (
              <group position={[0, 0.18 * s, 0]} scale={[sx, 1, sz]}>
                <mesh>
                  <cylinderGeometry args={[0.53 * s, 0.34 * s, 0.28 * s, 48, 1, true]} />
                  {metalMat}
                </mesh>
                <mesh position={[0, 0.14 * s, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.51 * s, 0.042 * s, 24, 64]} />
                  {metalMat}
                </mesh>
              </group>
            )}

            {/* CATEDRAL VENDÔME */}
            {settingStyle === 'cathedral' && (
              <>
                {[-1, 1].map((dir) => (
                  <mesh key={dir} position={[dir * 0.38, -0.08, 0]} rotation={[0, 0, dir * -0.52]}>
                    <cylinderGeometry args={[0.045, 0.075, 0.58, 20]} />
                    {metalMat}
                  </mesh>
                ))}
                <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.27 * s, 0.022, 16, 48]} />
                  {metalMat}
                </mesh>
              </>
            )}

            {/* BYPASS SERPENTI */}
            {settingStyle === 'bypass' && (
              <>
                {[-1, 1].map((dir) => (
                  <mesh
                    key={dir}
                    position={[dir * 0.26 * s, 0.12 * s, dir * 0.18 * s]}
                    rotation={[0.4 * dir, 0, dir * -0.65]}
                  >
                    <torusGeometry args={[0.38 * s, 0.052, 20, 48, Math.PI]} />
                    {metalMat}
                  </mesh>
                ))}
              </>
            )}

            {/* TIARA COURONNE IMPÉRIALE */}
            {settingStyle === 'tiara' && (
              <group position={[0, 0.08 * s, 0.24 * s]}>
                {[-3, -2, -1, 0, 1, 2, 3].map((k) => {
                  const a = k * 0.28;
                  const h = (1 - Math.abs(k) * 0.18) * 0.18 * s;
                  return (
                    <mesh
                      key={k}
                      position={[Math.sin(a) * 0.55 * s, h, Math.cos(a) * 0.22 * s]}
                      rotation={[0.3, 0, -a * 0.6]}
                    >
                      <coneGeometry args={[0.055 * s, 0.24 * s, 8]} />
                      {sideGemMat}
                    </mesh>
                  );
                })}
              </group>
            )}

            {/* CLUSTER FLORAL MARQUISE */}
            {settingStyle === 'cluster' && (
              <group position={[0, 0.22 * s, 0]}>
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i * Math.PI * 2) / 8;
                  const rx = 0.58 * s * sx;
                  const rz = 0.58 * s * sz;
                  return (
                    <mesh
                      key={i}
                      position={[Math.cos(a) * rx, -0.02 * s, Math.sin(a) * rz]}
                      rotation={[0.25 * Math.sin(a), -a, 0.25 * Math.cos(a)]}
                      scale={[0.6, 1, 1.25]}
                    >
                      <octahedronGeometry args={[0.13 * s, 1]} />
                      {sideGemMat}
                    </mesh>
                  );
                })}
              </group>
            )}

            {/* HALO CÉLESTE */}
            {settingStyle === 'halo' && (
              <group position={[0, 0.24 * s, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} scale={[sx, sz, 1]}>
                  <torusGeometry args={[0.58 * s, 0.052 * s, 24, 64]} />
                  {metalMat}
                </mesh>
                {Array.from({ length: 16 }).map((_, i) => {
                  const a = (i * Math.PI * 2) / 16;
                  const rx = 0.58 * s * sx;
                  const rz = 0.58 * s * sz;
                  return (
                    <mesh key={i} position={[Math.cos(a) * rx, 0.03 * s, Math.sin(a) * rz]}>
                      <octahedronGeometry args={[0.058 * s, 1]} />
                      {sideGemMat}
                    </mesh>
                  );
                })}
              </group>
            )}

            {/* ROSETA ART DÉCO (VINTAGE) */}
            {settingStyle === 'vintage' && (
              <group position={[0, 0.23 * s, 0]}>
                <mesh rotation={[Math.PI / 2, 0, Math.PI / 8]} scale={[sx, sz, 1]}>
                  <torusGeometry args={[0.62 * s, 0.06 * s, 8, 8]} />
                  {metalMat}
                </mesh>
                {Array.from({ length: 16 }).map((_, i) => {
                  const a = (i * Math.PI * 2) / 16;
                  const rx = 0.6 * s * sx;
                  const rz = 0.6 * s * sz;
                  return (
                    <group key={i} position={[Math.cos(a) * rx, 0.035 * s, Math.sin(a) * rz]}>
                      <mesh>
                        <octahedronGeometry args={[0.052 * s, 1]} />
                        {sideGemMat}
                      </mesh>
                      <mesh position={[Math.cos(a) * 0.055 * s, 0, Math.sin(a) * 0.055 * s]}>
                        <sphereGeometry args={[0.018 * s, 10, 10]} />
                        {metalMat}
                      </mesh>
                    </group>
                  );
                })}
              </group>
            )}

            {/* TRILOGÍA (THREE-STONE) */}
            {settingStyle === 'three-stone' && (
              <>
                {[-1, 1].map((dir) => (
                  <group
                    key={dir}
                    position={[dir * (0.46 * s * sx + 0.22), 0.05 * s, 0]}
                    rotation={[0, 0, dir * -0.38]}
                  >
                    <mesh position={[0, -0.05, 0]}>
                      <cylinderGeometry args={[0.17 * s, 0.1 * s, 0.16 * s, 16]} />
                      {metalMat}
                    </mesh>
                    <GemMesh
                      cut={cutShape === 'emerald' ? 'emerald' : 'round'}
                      scale={s * 0.56}
                      position={[0, 0.08 * s, 0]}
                      material={sideGemMat}
                    />
                  </group>
                ))}
              </>
            )}

            {/* Gema Preciosa Central */}
            <GemMesh
              cut={cutShape}
              scale={s}
              position={[0, settingStyle === 'tension' ? 0.02 * s : 0.22 * s, 0]}
              material={gemMat}
            />
          </>
        )}
      </group>
    </group>
  );
}

export const JewelryCanvas: React.FC<JewelrySceneProps> = (props) => {
  const mood: LightingMood = props.lighting ?? 'studio';
  const bg = mood === 'candle' ? '#0e0907' : mood === 'daylight' ? '#111318' : '#09090c';
  const keyColor = mood === 'candle' ? '#ffcf96' : mood === 'daylight' ? '#ffffff' : '#fff6e6';
  const fillColor = mood === 'candle' ? '#ff9b54' : mood === 'daylight' ? '#bfe0ff' : '#d6e4ff';

  return (
    <Canvas camera={{ position: [0, 0.55, 4.85], fov: 34 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={mood === 'daylight' ? 0.55 : 0.38} />
      <spotLight position={[4, 6, 4]} intensity={mood === 'candle' ? 110 : 95} angle={0.45} penumbra={1} color={keyColor} />
      <spotLight position={[-5, 3, -3]} intensity={55} angle={0.55} penumbra={1} color={fillColor} />
      <pointLight position={[0, 3, 2]} intensity={28} color={keyColor} />

      <Environment resolution={256}>
        <color attach="background" args={[bg]} />
        <Lightformer form="rect" intensity={mood === 'daylight' ? 8 : 6} position={[0, 5, -5]} scale={[10, 3, 1]} color={keyColor} />
        <Lightformer form="rect" intensity={4} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} color={fillColor} />
        <Lightformer form="rect" intensity={4} position={[6, 2, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} color={keyColor} />
        <Lightformer form="ring" intensity={7.5} position={[0, 2.5, 4]} scale={3.5} color={keyColor} />
        <Lightformer form="rect" intensity={2.5} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[8, 8, 1]} />
      </Environment>

      <Float speed={1.4} rotationIntensity={0.16} floatIntensity={0.28}>
        <RingModel {...props} />
      </Float>
      <Sparkles count={32} scale={4.2} size={1.4} speed={0.25} opacity={0.38} color={keyColor} />
      <ContactShadows position={[0, -1.68, 0]} opacity={0.58} scale={7.5} blur={2.4} far={3} />

      {props.interactive !== false ? (
        <OrbitControls
          target={props.jewelryType === 'ai-relief' ? [0, 0.05, 0] : [0, 0.32, 0]}
          enablePan={false}
          minDistance={2.4}
          maxDistance={7.5}
          maxPolarAngle={Math.PI / 2 + 0.35}
        />
      ) : null}
    </Canvas>
  );
};

export default JewelryCanvas;
