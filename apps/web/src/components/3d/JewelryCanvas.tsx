'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Lightformer, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export interface JewelrySceneProps {
  metalColor: string;
  gemColor: string;
  carats: number;
  /** Rotación automática (se desactiva al interactuar) */
  autoRotate?: boolean;
  interactive?: boolean;
}

function RingModel({ metalColor, gemColor, carats }: JewelrySceneProps) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.25;
  });

  const s = 0.55 + Math.cbrt(carats) * 0.35; // la piedra crece con los quilates
  const R = 1.15; // radio de la banda
  const metal = (
    <meshStandardMaterial color={metalColor} metalness={1} roughness={0.14} envMapIntensity={1.6} />
  );
  const isDark = new THREE.Color(gemColor).getHSL({ h: 0, s: 0, l: 0 }).l < 0.12;

  return (
    <group ref={group} position={[0, -0.35, 0]}>
      {/* Banda */}
      <mesh castShadow>
        <torusGeometry args={[R, 0.13, 48, 128]} />
        {metal}
      </mesh>
      {/* Base de la montura */}
      <mesh position={[0, R + 0.1, 0]}>
        <cylinderGeometry args={[0.34 * s + 0.1, 0.2, 0.28, 24]} />
        {metal}
      </mesh>
      {/* Garras */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i * Math.PI) / 2 + Math.PI / 4;
        const r = 0.36 * s + 0.08;
        return (
          <mesh key={i} position={[Math.cos(a) * r, R + 0.42 + 0.1 * s, Math.sin(a) * r]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            {metal}
          </mesh>
        );
      })}
      {/* Gema: corona + pabellón */}
      <group position={[0, R + 0.3 + 0.05, 0]} scale={s}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 0.22, 8, 1]} />
          <meshPhysicalMaterial color={gemColor} flatShading metalness={isDark ? 0.6 : 0.1} roughness={0.02} clearcoat={1} envMapIntensity={isDark ? 1.2 : 3} ior={2.4} reflectivity={1} />
        </mesh>
        <mesh position={[0, -0.18, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.5, 0.5, 8, 1]} />
          <meshPhysicalMaterial color={gemColor} flatShading metalness={isDark ? 0.6 : 0.1} roughness={0.02} clearcoat={1} envMapIntensity={isDark ? 1.2 : 3} ior={2.4} reflectivity={1} />
        </mesh>
      </group>
    </group>
  );
}

export const JewelryCanvas: React.FC<JewelrySceneProps> = (props) => {
  return (
    <Canvas camera={{ position: [0, 1.2, 5.2], fov: 38 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.35} />
      <spotLight position={[4, 6, 4]} intensity={80} angle={0.5} penumbra={1} color="#fff6e6" />
      <spotLight position={[-5, 3, -3]} intensity={40} angle={0.6} penumbra={1} color="#cfe0ff" />

      {/* Entorno de estudio generado en código (sin descargas externas) */}
      <Environment resolution={256}>
        <color attach="background" args={['#0b0b0e']} />
        <Lightformer form="rect" intensity={4} position={[0, 5, -6]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={3} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={3} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={5} position={[0, 2, 5]} scale={4} />
      </Environment>

      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
        <RingModel {...props} />
      </Float>
      <ContactShadows position={[0, -1.7, 0]} opacity={0.5} scale={8} blur={2.6} far={3} />

      {props.interactive !== false ? (
        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} maxPolarAngle={Math.PI / 2 + 0.2} />
      ) : null}
    </Canvas>
  );
};

export default JewelryCanvas;

