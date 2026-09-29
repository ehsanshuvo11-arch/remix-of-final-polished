import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LuxuryBottle3DProps {
  className?: string;
  interactive?: boolean;
  showBadge?: boolean;
  lightMode?: 'luxury' | 'studio' | 'amber';
}

export default function LuxuryBottle3D({
  className = '',
  interactive = true,
  showBadge = true,
  lightMode = 'luxury',
}: LuxuryBottle3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Group for the entire luxury assembly
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- MATERIALS ---
    // Frosted Glass Bottle Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x182c66), // Deep Polished Navy
      metalness: 0.1,
      roughness: 0.22,
      transmission: 0.88,
      thickness: 1.4,
      ior: 1.52,
      transparent: true,
      opacity: 0.95,
      specularIntensity: 1.2,
      specularColor: new THREE.Color(0xffffff),
    });

    // Gold / Amber Metallic Collar & Dropper Ring
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xfb923c), // Polished Orange / Warm Gold
      metalness: 0.88,
      roughness: 0.24,
      envMapIntensity: 1.5,
    });

    // Dark Chrome Dropper Top
    const capMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x0e172e),
      metalness: 0.7,
      roughness: 0.35,
    });

    // Inner Serum Core with luminous amber glow
    const serumMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf59e0b),
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.65,
    });

    // --- GEOMETRY: LUXURY SERUM BOTTLE ---
    const bottleGroup = new THREE.Group();
    rootGroup.add(bottleGroup);

    // 1. Main Bottle Body (Cylinder with beveled edges)
    const bodyGeometry = new THREE.CylinderGeometry(0.95, 0.95, 2.6, 64, 1, false);
    const bottleBody = new THREE.Mesh(bodyGeometry, glassMaterial);
    bottleBody.position.y = 0;
    bottleBody.castShadow = true;
    bottleBody.receiveShadow = true;
    bottleGroup.add(bottleBody);

    // 2. Inner Serum Liquid
    const serumGeometry = new THREE.CylinderGeometry(0.82, 0.82, 2.2, 48);
    const serumMesh = new THREE.Mesh(serumGeometry, serumMaterial);
    serumMesh.position.y = -0.15;
    bottleGroup.add(serumMesh);

    // 3. Rounded Bottom Base Ring
    const baseGeometry = new THREE.TorusGeometry(0.85, 0.1, 24, 64);
    baseGeometry.rotateX(Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeometry, glassMaterial);
    baseMesh.position.y = -1.3;
    bottleGroup.add(baseMesh);

    // 4. Bottle Shoulder Taper
    const shoulderGeometry = new THREE.CylinderGeometry(0.55, 0.95, 0.45, 64);
    const shoulder = new THREE.Mesh(shoulderGeometry, glassMaterial);
    shoulder.position.y = 1.5;
    bottleGroup.add(shoulder);

    // 5. Gold Collar Ring
    const collarGeometry = new THREE.CylinderGeometry(0.56, 0.58, 0.42, 64);
    const collar = new THREE.Mesh(collarGeometry, goldMaterial);
    collar.position.y = 1.85;
    collar.castShadow = true;
    bottleGroup.add(collar);

    // 6. Accent Gold Trim Line
    const trimGeometry = new THREE.TorusGeometry(0.59, 0.03, 16, 64);
    trimGeometry.rotateX(Math.PI / 2);
    const trim = new THREE.Mesh(trimGeometry, goldMaterial);
    trim.position.y = 1.95;
    bottleGroup.add(trim);

    // 7. Dropper Cap
    const capGeometry = new THREE.CylinderGeometry(0.44, 0.48, 0.95, 64);
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.position.y = 2.45;
    cap.castShadow = true;
    bottleGroup.add(cap);

    // 8. Dropper Rubber Bulb
    const bulbGeometry = new THREE.SphereGeometry(0.42, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const bulb = new THREE.Mesh(bulbGeometry, capMaterial);
    bulb.position.y = 2.85;
    bulb.scale.set(0.9, 1.2, 0.9);
    bottleGroup.add(bulb);

    // 9. Luxury Label Plate (Wrap around)
    // Create a dynamic canvas texture for the label
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 512;
    const ctx = labelCanvas.getContext('2d');
    if (ctx) {
      // Off-white silk label background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 1024, 512);

      // Gold border trim
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, 964, 452);

      // Secondary fine border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(45, 45, 934, 422);

      // Title: POLISHED
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 78px "Cormorant Garamond", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('P O L I S H E D', 512, 180);

      // Accent gold divider line
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(380, 220);
      ctx.lineTo(644, 220);
      ctx.stroke();

      // Subtitle
      ctx.fillStyle = '#64748b';
      ctx.font = '28px "DM Sans", Arial, sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText('CONVERSION ELIXIR', 512, 270);

      ctx.fillStyle = '#fb923c';
      ctx.font = 'bold 24px "DM Sans", Arial, sans-serif';
      ctx.fillText('3.2x ROAS FORMULA', 512, 330);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px "DM Sans", Arial, sans-serif';
      ctx.fillText('PREMIUM BENGALI AESTHETIC', 512, 390);
    }

    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.anisotropy = 8;

    const labelGeometry = new THREE.CylinderGeometry(0.965, 0.965, 1.45, 64, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
    const labelMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.4,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    labelMesh.position.y = 0.05;
    bottleGroup.add(labelMesh);

    // --- FLOATING 3D LUXURY ELEMENTS (Orbs & Crystals) ---
    const particlesGroup = new THREE.Group();
    rootGroup.add(particlesGroup);

    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xfb923c),
      transmission: 0.9,
      roughness: 0.15,
      ior: 1.8,
      thickness: 1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });

    const floatingItems: { mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number; rotSpeed: THREE.Vector3 }[] = [];

    // Floating gem 1 (Icosahedron)
    const gemGeo1 = new THREE.IcosahedronGeometry(0.28, 0);
    const gem1 = new THREE.Mesh(gemGeo1, crystalMaterial);
    const gem1Pos = new THREE.Vector3(1.8, 1.2, 0.5);
    gem1.position.copy(gem1Pos);
    particlesGroup.add(gem1);
    floatingItems.push({ mesh: gem1, basePos: gem1Pos, speed: 1.2, rotSpeed: new THREE.Vector3(0.015, 0.02, 0.01) });

    // Floating gem 2 (Octahedron)
    const gemGeo2 = new THREE.OctahedronGeometry(0.22, 0);
    const gem2 = new THREE.Mesh(gemGeo2, crystalMaterial);
    const gem2Pos = new THREE.Vector3(-1.9, -0.6, 0.8);
    gem2.position.copy(gem2Pos);
    particlesGroup.add(gem2);
    floatingItems.push({ mesh: gem2, basePos: gem2Pos, speed: 0.9, rotSpeed: new THREE.Vector3(-0.01, 0.025, 0.015) });

    // Floating gold ring (Torus)
    const ringGeo = new THREE.TorusGeometry(0.35, 0.04, 16, 48);
    const ringMesh = new THREE.Mesh(ringGeo, goldMaterial);
    const ringPos = new THREE.Vector3(-1.6, 1.6, -0.3);
    ringMesh.position.copy(ringPos);
    particlesGroup.add(ringMesh);
    floatingItems.push({ mesh: ringMesh, basePos: ringPos, speed: 1.1, rotSpeed: new THREE.Vector3(0.02, 0.01, -0.02) });

    // Small golden droplet
    const dropGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const dropMesh = new THREE.Mesh(dropGeo, goldMaterial);
    const dropPos = new THREE.Vector3(1.6, -1.2, 0.3);
    dropMesh.position.copy(dropPos);
    particlesGroup.add(dropMesh);
    floatingItems.push({ mesh: dropMesh, basePos: dropPos, speed: 1.4, rotSpeed: new THREE.Vector3(0.01, 0.01, 0.01) });

    // Soft reflective pedestal ground disc
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.12, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x13224f),
      metalness: 0.8,
      roughness: 0.3,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.8;
    pedestal.receiveShadow = true;
    rootGroup.add(pedestal);

    // --- LIGHTING SETUP (Studio Quiet Luxury) ---
    // Ambient light (Deep navy mood)
    const ambientLight = new THREE.AmbientLight(0x384a80, 1.2);
    scene.add(ambientLight);

    // Key Light (Warm Amber / Gold from top-left)
    const keyLight = new THREE.DirectionalLight(0xfb923c, 3.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill Light (Soft cool luxury blue from right)
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 2.0);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    // Rim / Back Light (Crisp edge separation)
    const rimLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // Bottom glow accent point light
    const pointLight = new THREE.PointLight(0xfb923c, 1.5, 8);
    pointLight.position.set(0, -1.2, 1.5);
    scene.add(pointLight);

    // --- INTERACTION & ANIMATION STATE ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    // Mouse / Touch handlers
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        targetRotationY += deltaX * 0.012;
        targetRotationX += deltaY * 0.008;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      } else {
        mouseX = normX;
        mouseY = normY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);
    }

    // Handle container resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 400;
      const newHeight = container.clientHeight || 450;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth idle floating on Y
      const floatY = Math.sin(elapsed * 1.5) * 0.12;
      bottleGroup.position.y = floatY;

      // Idle subtle breathing rotation if not manually dragged
      if (!isDragging) {
        targetRotationY += 0.005; // Gentle continuous auto-spin
        const targetX = mouseY * 0.35;
        bottleGroup.rotation.x += (targetX + targetRotationX * 0.2 - bottleGroup.rotation.x) * 0.06;
        bottleGroup.rotation.y += (targetRotationY - bottleGroup.rotation.y) * 0.08;
      } else {
        bottleGroup.rotation.x += (targetRotationX - bottleGroup.rotation.x) * 0.15;
        bottleGroup.rotation.y += (targetRotationY - bottleGroup.rotation.y) * 0.15;
      }

      // Constrain tilt
      bottleGroup.rotation.x = Math.max(-0.4, Math.min(0.4, bottleGroup.rotation.x));

      // Animate floating luxury gems
      floatingItems.forEach((item, index) => {
        const offset = index * 1.3;
        item.mesh.position.y = item.basePos.y + Math.sin(elapsed * item.speed + offset) * 0.15;
        item.mesh.position.x = item.basePos.x + Math.cos(elapsed * 0.8 + offset) * 0.08;
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;
      });

      // Render
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onPointerUp);
      }
      renderer.dispose();
      bodyGeometry.dispose();
      serumGeometry.dispose();
      baseGeometry.dispose();
      shoulderGeometry.dispose();
      collarGeometry.dispose();
      trimGeometry.dispose();
      capGeometry.dispose();
      bulbGeometry.dispose();
      labelGeometry.dispose();
      gemGeo1.dispose();
      gemGeo2.dispose();
      ringGeo.dispose();
      dropGeo.dispose();
      pedestalGeo.dispose();
      glassMaterial.dispose();
      goldMaterial.dispose();
      capMaterial.dispose();
      serumMaterial.dispose();
      labelMaterial.dispose();
      crystalMaterial.dispose();
      pedestalMat.dispose();
      labelTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive, lightMode]);

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[380px] md:min-h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center relative z-10"
        title="Click and drag to rotate 3D luxury bottle"
      />

      {/* Floating 3D Depth Card - Conversion Badge */}
      {showBadge && (
        <div
          className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-[280px] z-20 bg-[#1e3a8a]/95 backdrop-blur-md border border-[#fb923c]/30 rounded-sm p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-[#fb923c] group/badge"
          style={{ transform: 'perspective(800px) rotateY(-4deg)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[2px] text-[#fb923c]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fb923c] animate-pulse"></span>
              Interactive 3D Asset
            </span>
            <span className="text-[9px] text-white/50 tracking-wider">Drag to rotate</span>
          </div>
          <p className="text-white text-xs font-serif font-medium leading-snug">
            Tactile Luxury Visual Architecture
          </p>
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70">
            <span>Perceived Value Lift</span>
            <span className="font-bold text-[#fb923c]">+440%</span>
          </div>
        </div>
      )}

      {/* Ambient soft glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-30 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(30,58,138,0.15) 50%, transparent 75%)',
        }}
      />
    </div>
  );
}
