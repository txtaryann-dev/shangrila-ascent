import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import auroraPhoto from "@/assets/obsidian-phone.jpg";

function Phone({ rotationY }: { rotationY: number }) {
  const group = useRef<THREE.Group>(null);
  const photoTex = useLoader(THREE.TextureLoader, auroraPhoto);

  useMemo(() => {
    photoTex.colorSpace = THREE.SRGBColorSpace;
    photoTex.anisotropy = 8;
  }, [photoTex]);

  useFrame((_, dt) => {
    if (!group.current) return;
    const target = THREE.MathUtils.degToRad(rotationY);
    group.current.rotation.y += (target - group.current.rotation.y) * Math.min(1, dt * 4);
  });

  const W = 1.5;
  const H = 3.05;
  const D = 0.18;
  const R = 0.18;

  return (
    <group ref={group}>
      {/* Body - titanium frame with blue edge glow vibe */}
      <RoundedBox args={[W, H, D]} radius={R} smoothness={8} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#0d0d10"
          metalness={1}
          roughness={0.3}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* Back cover — exact Aurora Pro photo */}
      <mesh position={[0, 0, -D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W - 0.04, H - 0.04]} />
        <meshBasicMaterial map={photoTex} toneMapped={false} />
      </mesh>

      {/* Front screen — deep black to match the obsidian aesthetic */}
      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W - 0.12, H - 0.12]} />
        <meshBasicMaterial color="#020308" toneMapped={false} />
      </mesh>

      {/* Subtle blue rim glow on screen edges */}
      <mesh position={[0, 0, D / 2 + 0.0015]}>
        <planeGeometry args={[W - 0.12, H - 0.12]} />
        <meshBasicMaterial
          transparent
          opacity={0.35}
          color="#1a6cff"
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Glass overlay for reflections */}
      <mesh position={[0, 0, D / 2 + 0.003]}>
        <planeGeometry args={[W - 0.12, H - 0.12]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.2}
          roughness={0.04}
          metalness={0}
          transmission={0.5}
          ior={1.5}
          color="#ffffff"
        />
      </mesh>

      {/* Dynamic island */}
      <mesh position={[0, H / 2 - 0.28, D / 2 + 0.005]}>
        <planeGeometry args={[0.42, 0.11]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Side buttons */}
      <mesh position={[W / 2 + 0.005, 0.4, 0]}>
        <boxGeometry args={[0.02, 0.4, 0.08]} />
        <meshPhysicalMaterial color="#2a2a2d" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[-W / 2 - 0.005, 0.55, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.08]} />
        <meshPhysicalMaterial color="#2a2a2d" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[-W / 2 - 0.005, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.08]} />
        <meshPhysicalMaterial color="#2a2a2d" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

interface AuroraPhone3DProps {
  rotationY: number;
}

export const AuroraPhone3D = ({ rotationY }: AuroraPhone3DProps) => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.2], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={1.3} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#7aa8ff" />
        <pointLight position={[0, -2, 3]} intensity={0.5} color="#1a6cff" />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <Phone rotationY={rotationY} />
        </Float>

        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.7}
          scale={6}
          blur={2.6}
          far={3}
          color="#000000"
        />

        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
};
