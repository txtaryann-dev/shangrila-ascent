import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import auroraPhoto from "@/assets/obsidian-phone.jpg";

/** Check system motion preference without framer-motion (R3F runs outside React DOM). */
const getPrefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Phone({ rotationY, explode, shouldReduce }: { rotationY: number; explode: number; shouldReduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const photoTex = useLoader(THREE.TextureLoader, auroraPhoto);

  useMemo(() => {
    photoTex.colorSpace = THREE.SRGBColorSpace;
    photoTex.anisotropy = 4;
    photoTex.generateMipmaps = true;
    photoTex.minFilter = THREE.LinearMipmapLinearFilter;
    photoTex.magFilter = THREE.LinearFilter;
    photoTex.needsUpdate = true;
  }, [photoTex]);

  // Instant snap for reduced motion; critically-damped spring otherwise.
  const current = useRef(THREE.MathUtils.degToRad(rotationY));
  const velocity = useRef(0);
  const explodeRef = useRef(explode);
  const backRef = useRef<THREE.Mesh>(null);
  const frontRef = useRef<THREE.Mesh>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const chipRef = useRef<THREE.Mesh>(null);
  const batteryRef = useRef<THREE.Mesh>(null);
  const cameraRef = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!group.current) return;
    const target = THREE.MathUtils.degToRad(rotationY);
    const t = Math.min(dt, 1 / 30);
    if (shouldReduce) {
      current.current = target;
      group.current.rotation.y = target;
      explodeRef.current = explode;
    } else {
      const stiffness = 90;
      const damping = 18;
      const accel = (target - current.current) * stiffness - velocity.current * damping;
      velocity.current += accel * t;
      current.current += velocity.current * t;
      group.current.rotation.y = current.current;
      explodeRef.current += (explode - explodeRef.current) * Math.min(1, t * 6);
    }
    const e = explodeRef.current;
    const D = 0.18;
    if (backRef.current) backRef.current.position.z = -D / 2 - 0.001 - e * 0.7;
    if (frontRef.current) frontRef.current.position.z = D / 2 + 0.001 + e * 0.7;
    if (glassRef.current) glassRef.current.position.z = D / 2 + 0.003 + e * 1.0;
    if (chipRef.current) { chipRef.current.position.z = -e * 0.25; (chipRef.current.material as THREE.Material).opacity = e; }
    if (batteryRef.current) { batteryRef.current.position.z = -e * 0.25; (batteryRef.current.material as THREE.Material).opacity = e; }
    if (cameraRef.current) { cameraRef.current.position.z = -D / 2 - 0.001 - e * 1.4; (cameraRef.current.material as THREE.Material).opacity = e; }
  });

  const W = 1.5;
  const H = 3.05;
  const D = 0.18;
  const R = 0.18;

  return (
    <group ref={group}>
      {/* Body — cheaper standard material (no clearcoat / transmission) */}
      <RoundedBox args={[W, H, D]} radius={R} smoothness={4}>
        <meshStandardMaterial color="#0d0d10" metalness={1} roughness={0.32} />
      </RoundedBox>

      {/* Back cover */}
      <mesh ref={backRef} position={[0, 0, -D / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W - 0.04, H - 0.04]} />
        <meshBasicMaterial map={photoTex} toneMapped={false} />
      </mesh>

      {/* Front screen */}
      <mesh ref={frontRef} position={[0, 0, D / 2 + 0.001]}>
        <planeGeometry args={[W - 0.12, H - 0.12]} />
        <meshBasicMaterial map={photoTex} toneMapped={false} />
      </mesh>

      {/* Glass overlay */}
      <mesh ref={glassRef} position={[0, 0, D / 2 + 0.003]}>
        <planeGeometry args={[W - 0.12, H - 0.12]} />
        <meshStandardMaterial transparent opacity={0.12} roughness={0.05} metalness={0} color="#ffffff" />
      </mesh>

      {/* Internal components — visible when exploded */}
      <mesh ref={chipRef} position={[0, -0.4, 0]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial transparent opacity={0} color="#1a6cff" emissive="#1a6cff" emissiveIntensity={0.4} />
      </mesh>
      <mesh ref={batteryRef} position={[0, 0.6, 0]}>
        <planeGeometry args={[1.2, 1.4]} />
        <meshStandardMaterial transparent opacity={0} color="#2dd4a8" emissive="#2dd4a8" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={cameraRef} position={[-0.4, 1.0, -D / 2 - 0.001]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial transparent opacity={0} color="#ff6b35" emissive="#ff6b35" emissiveIntensity={0.5} />
      </mesh>

      {/* Dynamic island */}
      <mesh position={[0, H / 2 - 0.28, D / 2 + 0.005]}>
        <planeGeometry args={[0.42, 0.11]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Side buttons */}
      <mesh position={[W / 2 + 0.005, 0.4, 0]}>
        <boxGeometry args={[0.02, 0.4, 0.08]} />
        <meshStandardMaterial color="#2a2a2d" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[-W / 2 - 0.005, 0.55, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.08]} />
        <meshStandardMaterial color="#2a2a2d" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[-W / 2 - 0.005, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.08]} />
        <meshStandardMaterial color="#2a2a2d" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  );
}

interface AuroraPhone3DProps {
  rotationY: number;
  explode?: number;
}

export const AuroraPhone3D = ({ rotationY, explode = 0 }: AuroraPhone3DProps) => {
  // Lazy-mount the canvas only when the viewer scrolls into view to cut initial cost.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const shouldReduce = getPrefersReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {visible && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5.2], fov: 32 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 4, 5]} intensity={1.3} />
            <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#7aa8ff" />
            <pointLight position={[0, -2, 3]} intensity={0.5} color="#1a6cff" />

            <Float speed={shouldReduce ? 0 : 1.2} rotationIntensity={shouldReduce ? 0 : 0.15} floatIntensity={shouldReduce ? 0 : 0.4}>
              <Phone rotationY={rotationY} explode={explode} shouldReduce={shouldReduce} />
            </Float>

            <ContactShadows
              position={[0, -1.7, 0]}
              opacity={0.55}
              scale={6}
              blur={2.6}
              far={3}
              resolution={256}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
