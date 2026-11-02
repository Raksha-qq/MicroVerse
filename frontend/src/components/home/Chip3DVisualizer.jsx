import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Zap, Activity, Eye, RotateCw } from 'lucide-react';

export function Chip3DVisualizer() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeView, setActiveView] = useState('iso'); // 'iso' | 'top' | 'pins'
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null);
  const [rotationActive, setRotationActive] = useState(true);

  // Technical Annotation Callouts
  const annotations = [
    {
      id: 'core',
      title: 'SILICON CORE',
      value: 'ARM Cortex-M4 @ 84MHz with FPU',
      desc: '32-bit RISC core with DSP instruction extensions & single-precision FPU',
      pos: 'top-left',
    },
    {
      id: 'bus',
      title: 'BUS MATRIX',
      value: 'Multi-Layer AHB / APB Bridge',
      desc: 'Parallel concurrent arbitration between CPU, DMA streams & peripherals',
      pos: 'top-right',
    },
    {
      id: 'pins',
      title: 'I/O TOPOLOGY',
      value: '64-Pin LQFP (50x GPIO)',
      desc: 'Push-pull / open-drain programmable with 5V-tolerant clamping diodes',
      pos: 'bottom-left',
    },
    {
      id: 'mem',
      title: 'MEMORY HIERARCHY',
      value: '512KB Flash • 96KB SRAM',
      desc: 'Zero-wait state execution via ART Accelerator & 16-channel DMA offloading',
      pos: 'bottom-right',
    },
  ];

  useEffect(() => {
    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGL()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1220, 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 5.5);

    // 3. Renderer setup
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (err) {
      console.warn('WebGL init failed, using fallback:', err);
      setHasWebGL(false);
      return;
    }

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0x192b40, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x55c7ff, 3.5);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa5e3ff, 1.8);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0x55c7ff, 2.0, 15);
    pointLight.position.set(0, 1.5, 0);
    scene.add(pointLight);

    // 5. Build Microcontroller Model Group
    const chipGroup = new THREE.Group();
    scene.add(chipGroup);

    // 5a. Dark Silicon Package Body (QFP-64)
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.32, 2.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0e1828,
      roughness: 0.3,
      metalness: 0.4,
    });
    const chipBody = new THREE.Mesh(bodyGeo, bodyMat);
    chipGroup.add(chipBody);

    // 5b. Inner Recessed Silicon Die Center
    const dieGeo = new THREE.BoxGeometry(1.6, 0.02, 1.6);
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0x142338,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x55c7ff,
      emissiveIntensity: 0.08,
    });
    const dieMesh = new THREE.Mesh(dieGeo, dieMat);
    dieMesh.position.y = 0.17;
    chipGroup.add(dieMesh);

    // 5c. Pin 1 Polarity Indicator Dimple
    const dimpleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16);
    const dimpleMat = new THREE.MeshStandardMaterial({
      color: 0x55c7ff,
      emissive: 0x55c7ff,
      emissiveIntensity: 0.5,
    });
    const dimple = new THREE.Mesh(dimpleGeo, dimpleMat);
    dimple.position.set(-0.95, 0.17, -0.95);
    chipGroup.add(dimple);

    // 5d. Golden Metallic Pins (16 pins per side = 64 pins)
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xa5e3ff,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x55c7ff,
      emissiveIntensity: 0.15,
    });

    const pinsPerSide = 12;
    const pinLength = 0.35;
    const pinWidth = 0.045;
    const pinHeight = 0.025;
    const spacing = 1.8 / (pinsPerSide - 1);

    for (let i = 0; i < pinsPerSide; i++) {
      const offset = -0.9 + i * spacing;

      // North side (Z = -1.2)
      const pN = new THREE.Mesh(new THREE.BoxGeometry(pinWidth, pinHeight, pinLength), pinMat);
      pN.position.set(offset, 0, -1.2 - pinLength / 2);
      chipGroup.add(pN);

      // South side (Z = 1.2)
      const pS = new THREE.Mesh(new THREE.BoxGeometry(pinWidth, pinHeight, pinLength), pinMat);
      pS.position.set(offset, 0, 1.2 + pinLength / 2);
      chipGroup.add(pS);

      // East side (X = 1.2)
      const pE = new THREE.Mesh(new THREE.BoxGeometry(pinLength, pinHeight, pinWidth), pinMat);
      pE.position.set(1.2 + pinLength / 2, 0, offset);
      chipGroup.add(pE);

      // West side (X = -1.2)
      const pW = new THREE.Mesh(new THREE.BoxGeometry(pinLength, pinHeight, pinWidth), pinMat);
      pW.position.set(-1.2 - pinLength / 2, 0, offset);
      chipGroup.add(pW);
    }

    // 5e. Substrate Circuit Board with Trace Grid
    const boardGeo = new THREE.BoxGeometry(4.2, 0.05, 4.2);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x09101b,
      roughness: 0.8,
      metalness: 0.1,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.y = -0.3;
    chipGroup.add(board);

    // 5f. Glowing Circuit Traces on Substrate
    const traceLines = new THREE.Group();
    const traceMat = new THREE.LineBasicMaterial({
      color: 0x55c7ff,
      transparent: true,
      opacity: 0.45,
    });

    for (let r = 0; r < 8; r++) {
      const angle = (r / 8) * Math.PI * 2;
      const x1 = Math.cos(angle) * 1.5;
      const z1 = Math.sin(angle) * 1.5;
      const x2 = Math.cos(angle) * 2.8;
      const z2 = Math.sin(angle) * 2.8;

      const points = [
        new THREE.Vector3(x1, -0.27, z1),
        new THREE.Vector3(x1 * 1.4, -0.27, z1),
        new THREE.Vector3(x2, -0.27, z2),
      ];
      const traceGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(traceGeo, traceMat);
      traceLines.add(line);
    }
    chipGroup.add(traceLines);

    // 5g. Signal Particles
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let p = 0; p < particleCount; p++) {
      const radius = 1.4 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      particlePositions[p * 3] = Math.cos(theta) * radius;
      particlePositions[p * 3 + 1] = -0.24 + Math.random() * 0.15;
      particlePositions[p * 3 + 2] = Math.sin(theta) * radius;
      particleSpeeds[p] = 0.005 + Math.random() * 0.01;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x55c7ff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    chipGroup.add(particles);

    // Set initial rotation
    chipGroup.rotation.x = 0.35;
    chipGroup.rotation.y = -0.45;

    // 6. Interactive Mouse Drag / Parallax
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.35;
    let targetRotationY = -0.45;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.006;
        targetRotationX += deltaY * 0.006;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        // Subtle hover parallax
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetRotationY = -0.45 + normX * 0.35;
        targetRotationX = 0.35 + normY * 0.2;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    // 7. Resize handling
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damped rotation towards target
      if (rotationActive && !isDragging) {
        targetRotationY += 0.002; // continuous gentle spin
      }
      chipGroup.rotation.y += (targetRotationY - chipGroup.rotation.y) * 0.06;
      chipGroup.rotation.x += (targetRotationX - chipGroup.rotation.x) * 0.06;

      // Subtle breathing float on Y axis
      chipGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // Animate signal particles
      const positions = particleGeo.attributes.position.array;
      for (let p = 0; p < particleCount; p++) {
        let x = positions[p * 3];
        let z = positions[p * 3 + 2];
        let r = Math.sqrt(x * x + z * z);
        r -= particleSpeeds[p];
        if (r < 1.3) r = 2.6; // loop back to outer edge
        const theta = Math.atan2(z, x) + 0.003;
        positions[p * 3] = Math.cos(theta) * r;
        positions[p * 3 + 2] = Math.sin(theta) * r;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse point light
      pointLight.intensity = 1.8 + Math.sin(elapsedTime * 3) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      if (renderer) renderer.dispose();
    };
  }, [rotationActive]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] flex items-center justify-center select-none"
    >
      {/* Ambient background glow ring */}
      <div className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-tr from-[#55C7FF]/10 via-[#111E30]/40 to-transparent blur-3xl pointer-events-none" />

      {/* Primary 3D WebGL Canvas */}
      {hasWebGL ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
        />
      ) : (
        /* Graceful SVG Silicon Chip Fallback */
        <div className="relative z-10 w-72 h-72 sm:w-84 sm:h-84 rounded-2xl bg-[#0E1828] border-2 border-[#55C7FF]/40 shadow-[0_0_40px_rgba(85,199,255,0.25)] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-xl bg-[#111E30] border border-[#55C7FF] flex items-center justify-center text-[#55C7FF] mb-3 shadow-[0_0_20px_rgba(85,199,255,0.4)]">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
          <div className="font-heading font-bold text-lg text-[#EAF5FF]">
            MICROVERSE STM32F401
          </div>
          <div className="text-xs font-mono text-[#55C7FF] mt-0.5">
            ARM CORTEX-M4 • 84MHz
          </div>
          <div className="text-[11px] font-mono text-[#8FA6BC] mt-2 max-w-[200px]">
            64-Pin LQFP Architecture • 512KB Flash • Hardware FPU
          </div>
        </div>
      )}

      {/* Floating HUD Annotations with Technical Indicators */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-start gap-4">
          {/* Top-Left Annotation: Core */}
          <div
            className={`pointer-events-auto transition-all duration-300 max-w-[200px] sm:max-w-[240px] p-2.5 sm:p-3 rounded-lg bg-[#0B1220]/90 backdrop-blur-md border ${
              hoveredAnnotation === 'core'
                ? 'border-[#55C7FF] shadow-[0_0_20px_rgba(85,199,255,0.25)]'
                : 'border-[#192B40]'
            }`}
            onMouseEnter={() => setHoveredAnnotation('core')}
            onMouseLeave={() => setHoveredAnnotation(null)}
          >
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-[#55C7FF] font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55C7FF] animate-ping" />
              {annotations[0].title}
            </div>
            <div className="text-xs font-heading font-bold text-[#EAF5FF] mt-0.5">
              {annotations[0].value}
            </div>
            <div className="text-[10px] text-[#8FA6BC] mt-1 leading-snug hidden sm:block">
              {annotations[0].desc}
            </div>
          </div>

          {/* Top-Right Annotation: Bus */}
          <div
            className={`pointer-events-auto transition-all duration-300 max-w-[200px] sm:max-w-[240px] p-2.5 sm:p-3 rounded-lg bg-[#0B1220]/90 backdrop-blur-md border text-right ${
              hoveredAnnotation === 'bus'
                ? 'border-[#55C7FF] shadow-[0_0_20px_rgba(85,199,255,0.25)]'
                : 'border-[#192B40]'
            }`}
            onMouseEnter={() => setHoveredAnnotation('bus')}
            onMouseLeave={() => setHoveredAnnotation(null)}
          >
            <div className="flex items-center justify-end gap-1.5 text-[9px] font-mono uppercase text-[#A5E3FF] font-semibold tracking-wider">
              {annotations[1].title}
              <span className="w-1.5 h-1.5 rounded-full bg-[#A5E3FF]" />
            </div>
            <div className="text-xs font-heading font-bold text-[#EAF5FF] mt-0.5">
              {annotations[1].value}
            </div>
            <div className="text-[10px] text-[#8FA6BC] mt-1 leading-snug hidden sm:block">
              {annotations[1].desc}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end gap-4">
          {/* Bottom-Left Annotation: Pins */}
          <div
            className={`pointer-events-auto transition-all duration-300 max-w-[200px] sm:max-w-[240px] p-2.5 sm:p-3 rounded-lg bg-[#0B1220]/90 backdrop-blur-md border ${
              hoveredAnnotation === 'pins'
                ? 'border-[#55C7FF] shadow-[0_0_20px_rgba(85,199,255,0.25)]'
                : 'border-[#192B40]'
            }`}
            onMouseEnter={() => setHoveredAnnotation('pins')}
            onMouseLeave={() => setHoveredAnnotation(null)}
          >
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-[#FBBF24] font-semibold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
              {annotations[2].title}
            </div>
            <div className="text-xs font-heading font-bold text-[#EAF5FF] mt-0.5">
              {annotations[2].value}
            </div>
            <div className="text-[10px] text-[#8FA6BC] mt-1 leading-snug hidden sm:block">
              {annotations[2].desc}
            </div>
          </div>

          {/* Bottom-Right Annotation: Memory */}
          <div
            className={`pointer-events-auto transition-all duration-300 max-w-[200px] sm:max-w-[240px] p-2.5 sm:p-3 rounded-lg bg-[#0B1220]/90 backdrop-blur-md border text-right ${
              hoveredAnnotation === 'mem'
                ? 'border-[#55C7FF] shadow-[0_0_20px_rgba(85,199,255,0.25)]'
                : 'border-[#192B40]'
            }`}
            onMouseEnter={() => setHoveredAnnotation('mem')}
            onMouseLeave={() => setHoveredAnnotation(null)}
          >
            <div className="flex items-center justify-end gap-1.5 text-[9px] font-mono uppercase text-[#10B981] font-semibold tracking-wider">
              {annotations[3].title}
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </div>
            <div className="text-xs font-heading font-bold text-[#EAF5FF] mt-0.5">
              {annotations[3].value}
            </div>
            <div className="text-[10px] text-[#8FA6BC] mt-1 leading-snug hidden sm:block">
              {annotations[3].desc}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Interactive 3D Control Bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1220]/90 backdrop-blur-md border border-[#192B40] text-[10px] font-mono text-[#8FA6BC]">
        <span className="flex items-center gap-1.5 text-[#55C7FF]">
          <Activity className="w-3 h-3 animate-spin" />
          <span>DRAG TO ROTATE 3D DIE</span>
        </span>
        <span className="text-[#192B40]">|</span>
        <button
          onClick={() => setRotationActive(!rotationActive)}
          className={`flex items-center gap-1 transition-colors cursor-pointer ${
            rotationActive ? 'text-[#55C7FF]' : 'text-[#8FA6BC]'
          }`}
          title="Toggle Auto Spin"
        >
          <RotateCw className="w-3 h-3" />
          <span>{rotationActive ? 'AUTOROTATE' : 'PAUSED'}</span>
        </button>
      </div>
    </div>
  );
}

