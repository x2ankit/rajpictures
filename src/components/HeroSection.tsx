import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

const HERO_VIDEO_URL =
  "https://ftadonqbzirhllyufnjs.supabase.co/storage/v1/object/public/portfolio/hero/.%20(48).mp4";

const Lens = () => {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.55;
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 0.9, 80, 1, true]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.75} roughness={0.35} />
      </mesh>

      <mesh position={[0, 0, 0.46]}>
        <circleGeometry args={[1.05, 80]} />
        <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0, 0.468]}>
        <ringGeometry args={[0.5, 1.03, 80]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={0.12}
          metalness={0.85}
          roughness={0.28}
        />
      </mesh>

      <mesh position={[0, 0, 0.49]}>
        <circleGeometry args={[0.46, 80]} />
        <meshStandardMaterial color="#0b0b0b" metalness={0.9} roughness={0.08} />
      </mesh>
    </group>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-5xl flex flex-col items-center text-center gap-6">
          <motion.h1
            className="font-serifDisplay text-amber-500 tracking-tight text-5xl sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0.2, 1] }}
          >
            RAJ PHOTOGRAPHY
          </motion.h1>

          <motion.p
            className="font-body text-white/90 text-sm sm:text-base md:text-lg tracking-[0.25em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.2, 0, 0.2, 1] }}
          >
            Cinematic Visuals &amp; Storytelling
          </motion.p>

          <div className="w-full max-w-3xl h-[220px] sm:h-[260px] md:h-[340px]">
            <Canvas
              camera={{ position: [0, 0, 4.2], fov: 42 }}
              dpr={[1, 1.75]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[3, 3, 3]} intensity={1.1} />
              <directionalLight position={[-3, -2, 2]} intensity={0.4} />

              <Lens />

              <OrbitControls
                enablePan={false}
                enableZoom={false}
                rotateSpeed={0.8}
                minPolarAngle={Math.PI / 2.4}
                maxPolarAngle={Math.PI / 1.55}
              />
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};
