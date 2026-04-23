import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/** Procedural nebula texture (electric blue → purple) for the screen. */
function useNebulaTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Deep black base
    ctx.fillStyle = "#02030a";
    ctx.fillRect(0, 0, size, size);

    // Cyan top glow
    const g1 = ctx.createRadialGradient(size * 0.55, size * 0.25, 10, size * 0.55, size * 0.25, size * 0.7);
    g1.addColorStop(0, "rgba(80,200,255,0.95)");
    g1.addColorStop(0.4, "rgba(40,120,220,0.45)");
    g1.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, size, size);

    // Purple bottom plume
    const g2 = ctx.createRadialGradient(size * 0.5, size * 0.75, 10, size * 0.5, size * 0.8, size * 0.7);
    g2.addColorStop(0, "rgba(190,80,255,0.9)");
    g2.addColorStop(0.5, "rgba(120,40,200,0.4)");
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, size, size);

    // Stars
    for (let i = 0; i < 220; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 1.4;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.8 + 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function Phone({ rotationY }: { rotationY: number }) {
  const group = useRef<THREE.Group>(null);
  const screenTex = useNebulaTexture();

  useFrame((_, dt) => {
    if (!group.current) return;
    // Smoothly approach target rotation
    const target = THREE.MathUtils.degToRad(rotationY);
    group.current.rotation.y += (target - group.current.rotation.y) * Math.min(1, dt * 4);
  });

  // Dimensions (in arbitrary units)
  const W = 1.5;
  const H = 3.05;
  const D = 0.18;
  const R = 0.18;

  return (
    <group ref={group} rotation={[0, 0, 0]}>
      {/* Body - titanium frame */}
      <RoundedBox args={[W, H, D]} radius={R} smoothness={8} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#1a1a1d"
          metalness={1}
          roughness={0.32}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </RoundedBox>

      {/* Screen (front face, slightly inset) */}
      <mesh position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W - 0.12, H - 0.12]} />
        <meshBasicMaterial map={screenTex} toneMapped={false} />
      </mesh>

      {/* Screen glass overlay for reflections */}
      <mesh position={[0, 0, D / 2 + 0.003]}>
        <planeGeometry args={[W - 0.12, H - 0.12]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.18}
          roughness={0.05}
          metalness={0}
          transmission={0.4}
          ior={1.5}
          color="#ffffff"
        />
      </mesh>

      {/* Dynamic island */}
      <mesh position={[0, H / 2 - 0.28, D / 2 + 0.005]}>
        <planeGeometry args={[0.42, 0.11]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Camera module on the back */}
      <group position={[-W / 2 + 0.42, H / 2 - 0.5, -D / 2 - 0.001]}>
        <RoundedBox args={[0.78, 0.78, 0.06]} radius={0.14} smoothness={6}>
          <meshPhysicalMaterial color="#0a0a0c" metalness={0.9} roughness={0.5} />
        </RoundedBox>
        {/* Lenses */}
        {[
          [-0.18, 0.18],
          [0.18, 0.18],
          [-0.18, -0.18],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, -0.04]}>
            <mesh>
              <cylinderGeometry args={[0.14, 0.14, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]} />
              <meshPhysicalMaterial color="#050505" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, -0.045]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />
              <meshPhysicalMaterial color="#0b1a2a" metalness={1} roughness={0.05} clearcoat={1} />
            </mesh>
          </group>
        ))}
      </group>

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
        <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#7aa8ff" />
        <pointLight position={[0, -2, 3]} intensity={0.5} color="#b76dff" />

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
