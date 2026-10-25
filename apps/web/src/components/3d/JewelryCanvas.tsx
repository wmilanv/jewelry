'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshRefractionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface JewelrySceneProps {
  metalColor: string;
  gemColor: string;
  carats: number;
}

function RingModel({ metalColor, gemColor, carats }: JewelrySceneProps) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.15;
    }
  });

  const gemScale = 0.5 + carats * 0.25;

  return (
    <group ref={ringRef} position={[0, -0.2, 0]}>
      {/* Sortija / Aro Metálico */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.5, 0.14, 32, 100]} />
        <meshStandardMaterial
          color={metalColor}
          metalness={0.95}
          roughness={0.12}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Corona y Garras */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.15, 0.35, 8]} />
        <meshStandardMaterial
          color={metalColor}
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* Gema Preciosa Facetada (Talla Octagonal / Brillante) */}
      <mesh position={[0, 1.75, 0]} scale={[gemScale, gemScale, gemScale]}>
        <octahedronGeometry args={[0.5, 2]} />
        <meshPhysicalMaterial
          color={gemColor}
          transmission={0.9}
          opacity={1}
          transparent
          roughness={0.05}
          ior={2.417}
          metalness={0.05}
          reflectivity={0.9}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
}

export const JewelryCanvas: React.FC<JewelrySceneProps> = (props) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#ffffff" />
        <spotLight position={[0, 5, 2]} intensity={2} angle={0.4} penumbra={1} />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <RingModel {...props} />
        </Float>

        <OrbitControls
          enablePan={false}
          minDistance={2.5}
          maxDistance={7}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>
    </div>
  );
};