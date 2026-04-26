import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Float,
  MeshTransmissionMaterial,
} from '@react-three/drei';
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Pointer parallax target — shared between the gyroscope/pointer listener
 * and the rAF interpolator inside <Bottle/>.
 */
type ParallaxTarget = { x: number; y: number };

function Bottle({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const target = useRef<ParallaxTarget>({ x: 0, y: 0 });
  const current = useRef<ParallaxTarget>({ x: 0, y: 0 });
  const { size } = useThree();
  const isMobile = size.width < 768;

  // Pointer / gyroscope parallax. Disabled when reduced motion is requested.
  useEffect(() => {
    if (reducedMotion) return;

    const onPointer = (e: PointerEvent) => {
      // Normalize to [-1, 1] across the viewport.
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current.x = nx;
      target.current.y = ny;
    };

    const onOrient = (e: DeviceOrientationEvent) => {
      // gamma: left/right tilt (-90..90), beta: front/back (-180..180).
      const gx = (e.gamma ?? 0) / 45; // ~[-2, 2]
      const gy = (e.beta ?? 0) / 90;  // ~[-2, 2]
      target.current.x = THREE.MathUtils.clamp(gx, -1, 1);
      target.current.y = THREE.MathUtils.clamp(gy, -1, 1);
    };

    if (isMobile && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', onOrient, { passive: true });
      return () => window.removeEventListener('deviceorientation', onOrient);
    }
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [reducedMotion, isMobile]);

  // Smoothly interpolate toward the parallax target each frame (critically
  // damped style lerp — frame-rate independent enough for 60–144Hz displays).
  useFrame((_, delta) => {
    const k = reducedMotion ? 0 : 1 - Math.exp(-delta * 4);
    current.current.x += (target.current.x - current.current.x) * k;
    current.current.y += (target.current.y - current.current.y) * k;

    if (group.current) {
      // Max ±18° pivot — gentle, "quiet luxury" feel.
      group.current.rotation.y = current.current.x * 0.32;
      group.current.rotation.x = -current.current.y * 0.18;
    }
  });

  // Procedural normal map for subtle micro-imperfections on the matte cap.
  const capNormal = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const img = ctx.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = 128 + (Math.random() - 0.5) * 14;
      img.data[i] = n;
      img.data[i + 1] = n;
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }, []);

  return (
    <Float
      speed={reducedMotion ? 0 : 1.1}
      rotationIntensity={reducedMotion ? 0 : 0.18}
      floatIntensity={reducedMotion ? 0 : 0.55}
      floatingRange={[-0.08, 0.08]}
    >
      <group ref={group} position={[0, -0.15, 0]}>
        {/* Glass body — low-poly cylinder, hi-fi via transmission shader */}
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 1.5, 48, 1]} />
          <MeshTransmissionMaterial
            samples={6}
            resolution={256}
            thickness={0.6}
            roughness={0.05}
            transmission={1}
            ior={1.45}
            chromaticAberration={0.03}
            anisotropy={0.2}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.05}
            color={'#f5efe6'}
            attenuationColor={'#e8d9c0'}
            attenuationDistance={1.6}
          />
        </mesh>

        {/* Subtle amber serum inside */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.5, 0.55, 1.0, 40, 1]} />
          <meshPhysicalMaterial
            color={'#c98a3c'}
            transmission={0.85}
            roughness={0.15}
            thickness={0.8}
            ior={1.38}
            attenuationColor={'#9a5a1c'}
            attenuationDistance={0.8}
          />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 0.22, 32, 1]} />
          <meshPhysicalMaterial
            color={'#0a0f1f'}
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>

        {/* Matte brushed cap */}
        <mesh position={[0, 1.12, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.32, 48, 1]} />
          <meshPhysicalMaterial
            color={'#1a2238'}
            metalness={0.85}
            roughness={0.42}
            normalMap={capNormal}
            normalScale={new THREE.Vector2(0.4, 0.4)}
            clearcoat={0.6}
            clearcoatRoughness={0.3}
          />
        </mesh>

        {/* Thin gold accent ring (the "flex") */}
        <mesh position={[0, 0.96, 0]} castShadow>
          <torusGeometry args={[0.235, 0.012, 16, 64]} />
          <meshPhysicalMaterial
            color={'#d9a14a'}
            metalness={1}
            roughness={0.18}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function SerumBottleScene({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  // Cap DPR so high-density displays don't murder the GPU.
  const dpr: [number, number] = [1, 1.6];

  return (
    <Canvas
      shadows
      dpr={dpr}
      gl={{
        antialias: false, // SMAA pass handles AA cheaper than MSAA on glass
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      camera={{ position: [0, 0.2, 3.6], fov: 32 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[3, 4, 2]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color={'#fbb072'} />

      <Bottle reducedMotion={reducedMotion} />

      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.45}
        scale={6}
        blur={2.6}
        far={2.5}
        resolution={512}
        color={'#000000'}
      />

      {/* HDRi for premium reflections; "studio" preset is small + cached */}
      <Environment preset="studio" background={false} />

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.2}
          mipmapBlur
        />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
