"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import * as THREE from "three";
import {
  Sparkles,
  Zap,
  Shield,
  Activity,
  Award,
  Volume2,
  VolumeX,
  RotateCw,
  Sliders,
  Check,
  ChevronRight,
  ChevronLeft,
  Flame,
  Radio,
  Crosshair,
  Layers,
  Repeat,
  Eye,
  Cpu,
  UserCheck,
} from "lucide-react";
import { AVATAR_OPTIONS } from "@/lib/avatars";

export interface GamerPersonaProps {
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  rankTier?: string;
  level?: number;
  xp?: number;
  streak?: number;
  onAvatarChange?: (newUrl: string) => void;
  onHandleChange?: (newHandle: string) => void;
}

export const AURA_THEMES = [
  { id: "lemon", name: "Volt Lemon", hex: "#EFFF4F", rgb: [239, 255, 79], glow: "rgba(239, 255, 79, 0.4)" },
  { id: "cyan", name: "Cyber Cyan", hex: "#00F0FF", rgb: [0, 240, 255], glow: "rgba(0, 240, 255, 0.4)" },
  { id: "matrix", name: "Matrix Green", hex: "#00FF66", rgb: [0, 255, 102], glow: "rgba(0, 255, 102, 0.4)" },
  { id: "violet", name: "Hyper Violet", hex: "#B026FF", rgb: [176, 38, 255], glow: "rgba(176, 38, 255, 0.4)" },
  { id: "crimson", name: "Plasma Red", hex: "#FF3366", rgb: [255, 51, 102], glow: "rgba(255, 51, 102, 0.4)" },
];

export default function GamerPersona3D({
  name,
  handle,
  email,
  avatarUrl,
  bio,
  rankTier = "SDET-II ARCHITECT",
  level = 28,
  xp = 3450,
  streak = 14,
  onAvatarChange,
}: GamerPersonaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Flip state
  const [isFlipped, setIsFlipped] = useState(false);
  const [fullAvatarGender, setFullAvatarGender] = useState<"female" | "male">("female");

  // Theme & 3D state
  const [activeAura, setActiveAura] = useState(AURA_THEMES[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<"STATS" | "BADGES" | "GEAR">("STATS");

  // Mouse tilt for CSS 3D parallax
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });

  // Web Audio synthesizer for futuristic feedback
  const playSfx = (freq = 880, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context may be restricted by browser policy
    }
  };

  const handleFlip = () => {
    playSfx(520, "sine", 0.12);
    setTimeout(() => playSfx(980, "triangle", 0.08), 80);
    setIsFlipped(!isFlipped);
  };

  // Card mouse movement for real 3D perspective tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // -10 to +10 deg
    const rotateY = ((x - centerX) / centerX) * 10;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  // Three.js WebGL Hologram Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (err) {
      console.warn("Could not create WebGL renderer:", err);
      return;
    }

    // Three.js 3D Objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer Hologram Torus Ring
    const torusGeom = new THREE.TorusGeometry(2.1, 0.035, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activeAura.hex),
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const outerRing = new THREE.Mesh(torusGeom, torusMat);
    outerRing.rotation.x = Math.PI / 2.3;
    group.add(outerRing);

    // 2. Middle Counter-Rotating Gyro Ring
    const midGeom = new THREE.TorusGeometry(1.65, 0.025, 12, 80);
    const midMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activeAura.hex),
      transparent: true,
      opacity: 0.6,
    });
    const midRing = new THREE.Mesh(midGeom, midMat);
    midRing.rotation.y = Math.PI / 4;
    group.add(midRing);

    // 3. Floating 3D Data Core Crystal (Octahedron)
    const crystalGeom = new THREE.OctahedronGeometry(0.75, 0);
    const crystalMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(activeAura.hex),
      emissive: new THREE.Color(activeAura.hex),
      emissiveIntensity: 0.35,
      wireframe: wireframe,
      transparent: true,
      opacity: 0.8,
      shininess: 90,
    });
    const crystal = new THREE.Mesh(crystalGeom, crystalMat);
    crystal.position.y = 0.2;
    group.add(crystal);

    // 4. Inner Wireframe Cage
    const innerCageGeom = new THREE.IcosahedronGeometry(0.95, 1);
    const innerCageMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activeAura.hex),
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerCage = new THREE.Mesh(innerCageGeom, innerCageMat);
    innerCage.position.y = 0.2;
    group.add(innerCage);

    // 5. Hologram Scanning Disc (Grid plane on floor)
    const gridHelper = new THREE.GridHelper(4.5, 18, new THREE.Color(activeAura.hex), new THREE.Color(0x333336));
    gridHelper.position.y = -1.4;
    group.add(gridHelper);

    // 6. Particle Field (Swirling Nebula Stardust)
    const particleCount = 280;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.0 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.0;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
      scales[i] = Math.random();
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(activeAura.hex),
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    group.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(activeAura.hex), 2.5, 10);
    pointLight.position.set(0, 1.5, 2);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(-3, 3, -2);
    scene.add(rimLight);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating) {
        outerRing.rotation.z = elapsedTime * 0.45;
        midRing.rotation.x = elapsedTime * -0.6;
        midRing.rotation.y = elapsedTime * 0.35;
        crystal.rotation.y = elapsedTime * 0.8;
        crystal.rotation.x = Math.sin(elapsedTime * 0.5) * 0.3;
        innerCage.rotation.y = elapsedTime * -0.5;
        particles.rotation.y = elapsedTime * 0.15;
      }

      // Breathing bobbing motion
      crystal.position.y = 0.2 + Math.sin(elapsedTime * 1.5) * 0.12;
      innerCage.position.y = crystal.position.y;
      pointLight.intensity = 2.0 + Math.sin(elapsedTime * 3) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      torusGeom.dispose();
      torusMat.dispose();
      midGeom.dispose();
      midMat.dispose();
      crystalGeom.dispose();
      crystalMat.dispose();
      innerCageGeom.dispose();
      innerCageMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, [activeAura, wireframe, isRotating]);

  return (
    <div className="w-full space-y-4">
      {/* 3D Perspective Card Wrapper */}
      <div
        className="w-full relative select-none"
        style={{ perspective: 1400 }}
      >
        {/* Flip Card Inner Rotating Container */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: `0 20px 50px -10px ${activeAura.glow}, 0 0 0 1px #3E3E43`,
          }}
          className="relative w-full rounded-2xl bg-gradient-to-b from-[#252528] via-[#1E1E22] to-[#161619] border border-[#3E3E43] overflow-hidden cursor-pointer"
          onClick={handleFlip}
        >
          {/* Dynamic Glare Reflection Sheen */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-300 z-30"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            }}
          />

          {/* ============================================================== */}
          {/* FRONT FACE: Telemetry, 3D WebGL Hologram, Level, Stats & Badges */}
          {/* ============================================================== */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            className={`p-6 transition-opacity duration-300 ${isFlipped ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            {/* Top Telemetry & Flip Trigger Bar */}
            <div
              className="flex items-center justify-between border-b border-[#3E3E43] pb-3 mb-3"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: activeAura.hex }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2.5 w-2.5"
                    style={{ backgroundColor: activeAura.hex }}
                  />
                </span>
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#EFFF4F] uppercase">
                  STATUS // COMBAT_READY
                </span>
              </div>

              {/* Controls & Dedicated Flip Button */}
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    playSfx(soundEnabled ? 300 : 700, "square");
                  }}
                  title={soundEnabled ? "Disable SFX" : "Enable SFX"}
                  className="p-1.5 rounded bg-[#2A2A2E] border border-[#3E3E43] text-[#A0A5B5] hover:text-white transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#EFFF4F]" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWireframe(!wireframe);
                    playSfx(1100, "triangle");
                  }}
                  title="Toggle 3D Wireframe"
                  className={`p-1.5 rounded border text-[10px] font-mono font-bold transition-colors ${
                    wireframe
                      ? "bg-[#EFFF4F] text-[#1E1E22] border-[#EFFF4F]"
                      : "bg-[#2A2A2E] border-[#3E3E43] text-[#A0A5B5] hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRotating(!isRotating);
                    playSfx(550, "sine");
                  }}
                  title="Toggle 3D Rotation"
                  className={`p-1.5 rounded border text-[10px] font-mono transition-colors ${
                    isRotating
                      ? "bg-[#2A2A2E] border-[#3E3E43] text-[#EFFF4F]"
                      : "bg-[#2A2A2E] border-[#3E3E43] text-[#5A5F70]"
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} style={{ animationDuration: "8s" }} />
                </button>

                {/* Flip To Back Trigger Button */}
                <button
                  type="button"
                  onClick={handleFlip}
                  className="px-2.5 py-1.5 rounded bg-[#EFFF4F] text-[#1E1E22] font-mono font-bold text-[10px] uppercase shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                  title="Flip card to inspect whole 3D body avatar"
                >
                  <Repeat className="w-3 h-3" />
                  <span>FLIP CARD</span>
                </button>
              </div>
            </div>

            {/* Click to Flip Prompt Pill */}
            <div className="flex items-center justify-center my-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#A0A5B5] bg-[#141416]/80 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5 animate-pulse">
                <Repeat className="w-2.5 h-2.5 text-[#EFFF4F]" />
                CLICK CARD TO FLIP FOR FULL 3D PERSONA AVATAR
              </span>
            </div>

            {/* Center 3D Stage: Hologram Canvas + 3D Avatar Projection */}
            <div
              className="relative h-60 w-full flex items-center justify-center overflow-hidden rounded-xl bg-[#141416]/90 border border-white/5 my-2"
              style={{ transform: "translateZ(40px)" }}
            >
              {/* Background 3D WebGL Canvas */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                title="Interactive 3D WebGL Hologram Core"
              />

              {/* Corner Tactical Reticles */}
              <div className="absolute top-2 left-2 pointer-events-none text-[#5A5F70] font-mono text-[9px]">
                ┌ POS_Z [3.4]
              </div>
              <div className="absolute top-2 right-2 pointer-events-none text-[#5A5F70] font-mono text-[9px]">
                YAW_RAD [0.82] ┐
              </div>
              <div className="absolute bottom-2 left-2 pointer-events-none text-[#5A5F70] font-mono text-[9px]">
                └ SDET // GRID
              </div>
              <div className="absolute bottom-2 right-2 pointer-events-none text-[#5A5F70] font-mono text-[9px]">
                FPS // 60 ┘
              </div>

              {/* Foreground Holographic Character Avatar */}
              <div
                className="relative z-10 flex flex-col items-center justify-center group"
                style={{ transform: "translateZ(55px)" }}
              >
                <div className="relative">
                  {/* Pulsing Aura Halo */}
                  <div
                    className="absolute -inset-3 rounded-full blur-xl opacity-60 animate-pulse transition-all duration-500"
                    style={{ backgroundColor: activeAura.hex }}
                  />

                  {/* Rotating HUD Bracket */}
                  <div
                    className="absolute -inset-2 rounded-2xl border-2 border-dashed opacity-40 animate-spin transition-colors duration-500"
                    style={{
                      borderColor: activeAura.hex,
                      animationDuration: "20s",
                    }}
                  />

                  {/* Avatar Frame */}
                  <div
                    className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 bg-gradient-to-b from-[#2A2A2E] to-[#1A1A1D] shadow-2xl transition-all duration-300 group-hover:scale-105"
                    style={{ borderColor: activeAura.hex }}
                  >
                    <Image
                      src={avatarUrl || "/avatars/avatar-1.png"}
                      alt={name || "Gamer Persona"}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover select-none"
                      priority
                    />

                    {/* Scanline Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px]" />
                  </div>

                  {/* Quick Edit Overlay Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAvatarPicker(!showAvatarPicker);
                      playSfx(900, "square");
                    }}
                    className="absolute -bottom-2 -right-2 px-2 py-1 rounded bg-[#EFFF4F] text-[#1E1E22] font-mono font-bold text-[9px] uppercase shadow-lg flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Sliders className="w-2.5 h-2.5" />
                    <span>SWAP</span>
                  </button>
                </div>

                {/* Holographic Pedestal Base Light */}
                <div
                  className="w-32 h-2 rounded-full blur-sm mt-3 opacity-80"
                  style={{ backgroundColor: activeAura.hex }}
                />
              </div>
            </div>

            {/* Persona Identity & Monospace Meta */}
            <div className="space-y-3 pt-2" style={{ transform: "translateZ(35px)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight font-display">
                      {name || "SDET OPERATOR"}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border"
                      style={{
                        color: activeAura.hex,
                        borderColor: `${activeAura.hex}40`,
                        backgroundColor: `${activeAura.hex}15`,
                      }}
                    >
                      LVL {level}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#A0A5B5] mt-0.5">
                    @{handle || "learner_sdet"} • <span className="text-[#5A5F70]">{email || "verified_user"}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[10px] text-[#A0A5B5] block uppercase">CURRENT TIER</span>
                  <span className="font-mono text-xs font-bold text-white uppercase flex items-center justify-end gap-1">
                    <Award className="w-3.5 h-3.5 text-[#EFFF4F]" />
                    {rankTier}
                  </span>
                </div>
              </div>

              {/* Level XP Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#A0A5B5]">
                  <span>XP PROGRESSION</span>
                  <span className="text-white font-bold">{xp.toLocaleString()} / 5,000 XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18181A] border border-[#3E3E43] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(100, Math.round((xp / 5000) * 100))}%`,
                      background: `linear-gradient(90deg, ${activeAura.hex}80, ${activeAura.hex})`,
                      boxShadow: `0 0 10px ${activeAura.glow}`,
                    }}
                  />
                </div>
              </div>

              {/* Sub-tabs: Stats, Badges, Gear */}
              <div
                className="flex border-b border-[#3E3E43] pt-2 font-mono text-[11px] font-bold"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("STATS");
                    playSfx(600);
                  }}
                  className={`pb-1.5 px-3 uppercase transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "STATS"
                      ? "border-[#EFFF4F] text-[#EFFF4F]"
                      : "border-transparent text-[#A0A5B5] hover:text-white"
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>ATTRIBUTES</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("BADGES");
                    playSfx(750);
                  }}
                  className={`pb-1.5 px-3 uppercase transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "BADGES"
                      ? "border-[#EFFF4F] text-[#EFFF4F]"
                      : "border-transparent text-[#A0A5B5] hover:text-white"
                  }`}
                >
                  <Award className="w-3 h-3" />
                  <span>EQUIPPED BADGES</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("GEAR");
                    playSfx(900);
                  }}
                  className={`pb-1.5 px-3 uppercase transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === "GEAR"
                      ? "border-[#EFFF4F] text-[#EFFF4F]"
                      : "border-transparent text-[#A0A5B5] hover:text-white"
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>AURA GEAR</span>
                </button>
              </div>

              {/* Tab 1: Attributes */}
              {activeTab === "STATS" && (
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                  <div className="p-2 rounded bg-[#18181A] border border-[#333336] flex items-center justify-between">
                    <span className="text-[#A0A5B5]">AUTOMATION SCORE</span>
                    <span className="text-white font-bold">96%</span>
                  </div>
                  <div className="p-2 rounded bg-[#18181A] border border-[#333336] flex items-center justify-between">
                    <span className="text-[#A0A5B5]">TEST ARCHITECTURE</span>
                    <span className="text-white font-bold">92%</span>
                  </div>
                  <div className="p-2 rounded bg-[#18181A] border border-[#333336] flex items-center justify-between">
                    <span className="text-[#A0A5B5]">ROOT CAUSE SPEED</span>
                    <span className="text-white font-bold">98%</span>
                  </div>
                  <div className="p-2 rounded bg-[#18181A] border border-[#333336] flex items-center justify-between">
                    <span className="text-[#A0A5B5]">STREAK MOMENTUM</span>
                    <span className="text-[#EFFF4F] font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-[#EFFF4F]" /> {streak} DAYS
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Equipped Badges */}
              {activeTab === "BADGES" && (
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                  <div className="p-2 rounded bg-[#18181A] border border-[#333336] flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <div>
                      <div className="text-white font-bold">Selenium Master</div>
                      <div className="text-[#5A5F70] text-[9px]">Zero Flaky Locators</div>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#18181A] border border-[#333336] flex items-center gap-2">
                    <span className="text-base">🛡️</span>
                    <div>
                      <div className="text-white font-bold">ThreadSafe QA</div>
                      <div className="text-[#5A5F70] text-[9px]">Parallel Execution</div>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#18181A] border border-[#333336] flex items-center gap-2">
                    <span className="text-base">🎯</span>
                    <div>
                      <div className="text-white font-bold">CI/CD Veteran</div>
                      <div className="text-[#5A5F70] text-[9px]">Pipeline Automated</div>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-[#18181A] border border-[#333336] flex items-center gap-2">
                    <span className="text-base">🔥</span>
                    <div>
                      <div className="text-white font-bold">Hotshot SDET</div>
                      <div className="text-[#5A5F70] text-[9px]">Top 5% Cohort Rank</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Aura Gear Theme Selector */}
              {activeTab === "GEAR" && (
                <div className="space-y-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <span className="font-mono text-[10px] text-[#A0A5B5] block uppercase">
                    SELECT CYBERNETIC AURA ENERGY
                  </span>
                  <div className="flex items-center gap-2">
                    {AURA_THEMES.map((theme) => {
                      const isSelected = activeAura.id === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => {
                            setActiveAura(theme);
                            playSfx(isSelected ? 400 : 800, "triangle");
                          }}
                          style={{
                            borderColor: isSelected ? theme.hex : "#3E3E43",
                            boxShadow: isSelected ? `0 0 12px ${theme.glow}` : "none",
                          }}
                          className={`px-2.5 py-1.5 rounded-lg border font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                            isSelected ? "bg-[#28282B] text-white" : "bg-[#1C1C1E] text-[#A0A5B5] hover:text-white"
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: theme.hex }}
                          />
                          <span>{theme.name.split(" ")[1]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* BACK FACE: The Whole Avatar of the Persona (Full-Body 3D View)  */}
          {/* ============================================================== */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity duration-300 ${
              isFlipped ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {/* Back Header */}
            <div
              className="flex items-center justify-between border-b border-[#3E3E43] pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: activeAura.hex }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2.5 w-2.5"
                    style={{ backgroundColor: activeAura.hex }}
                  />
                </span>
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#EFFF4F] uppercase">
                  CLASSIFIED // WHOLE AVATAR VIEW
                </span>
              </div>

              {/* Operative Model Switcher + Flip Back Button */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg overflow-hidden border border-[#3E3E43] bg-[#1C1C1F] p-0.5 font-mono text-[9px]">
                  <button
                    type="button"
                    onClick={() => {
                      setFullAvatarGender("female");
                      playSfx(700, "sine");
                    }}
                    className={`px-2 py-1 rounded font-bold uppercase transition-colors ${
                      fullAvatarGender === "female"
                        ? "bg-[#EFFF4F] text-[#1E1E22]"
                        : "text-[#A0A5B5] hover:text-white"
                    }`}
                  >
                    NOVA ♀
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFullAvatarGender("male");
                      playSfx(850, "sine");
                    }}
                    className={`px-2 py-1 rounded font-bold uppercase transition-colors ${
                      fullAvatarGender === "male"
                        ? "bg-[#EFFF4F] text-[#1E1E22]"
                        : "text-[#A0A5B5] hover:text-white"
                    }`}
                  >
                    CIPHER ♂
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleFlip}
                  className="px-2.5 py-1.5 rounded bg-[#EFFF4F] text-[#1E1E22] font-mono font-bold text-[10px] uppercase shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                  title="Flip back to telemetry view"
                >
                  <Repeat className="w-3 h-3" />
                  <span>FLIP BACK</span>
                </button>
              </div>
            </div>

            {/* Whole Avatar Centerpiece Showcase */}
            <div className="relative my-3 flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#141417] via-[#0E0E10] to-[#18181C] border border-white/10 shadow-inner group">
              {/* Volumetric Radial Glow */}
              <div
                className="absolute inset-0 opacity-40 blur-2xl pointer-events-none transition-all duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 60%, ${activeAura.hex}50 0%, transparent 70%)`,
                }}
              />

              {/* Full-Body Avatar Render Image */}
              <div className="relative w-full h-80 sm:h-96 flex items-center justify-center p-2">
                <Image
                  src={
                    fullAvatarGender === "female"
                      ? "/avatars-3d/full-body-operative-female.jpg"
                      : "/avatars-3d/full-body-operative-male.jpg"
                  }
                  alt="Whole Persona Avatar"
                  width={380}
                  height={520}
                  className="w-auto h-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)] filter contrast-105 transition-all duration-500"
                  priority
                />

                {/* Scanline Texture Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] opacity-40" />

                {/* Cyber HUD Floating Elements */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[#101014]/90 border border-white/10 font-mono text-[9px] text-[#A0A5B5] space-y-0.5">
                  <div className="text-white font-bold flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-[#EFFF4F]" />
                    <span>EXOSUIT MK.IV</span>
                  </div>
                  <div>NEURAL SYNC: 99.8%</div>
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#101014]/90 border border-white/10 font-mono text-[9px] text-right space-y-0.5">
                  <div className="text-[#EFFF4F] font-bold">OPERATIVE SPEC</div>
                  <div className="text-white">{rankTier}</div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg bg-[#141418]/95 border border-[#3E3E43] backdrop-blur-md flex items-center justify-between font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-[#EFFF4F]" />
                    <div>
                      <div className="text-white font-bold uppercase">{name || "SDET OPERATOR"}</div>
                      <div className="text-[#A0A5B5] text-[9px]">@{handle || "alex_sdet"}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#EFFF4F] font-bold block">LEVEL {level}</span>
                    <span className="text-[9px] text-emerald-400">100% READY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Footer Action: Return Button */}
            <div className="pt-2 border-t border-[#3E3E43] flex items-center justify-between font-mono text-xs">
              <span className="text-[10px] text-[#5A5F70]">
                * Click anywhere on card to flip back
              </span>

              <button
                type="button"
                onClick={handleFlip}
                className="px-4 py-2 rounded-lg bg-[#EFFF4F] text-[#1E1E22] font-bold text-xs uppercase hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-1.5 shadow-lemon-sm"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>FLIP TO TELEMETRY</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Avatar Persona Quick-Picker */}
      {showAvatarPicker && (
        <div className="p-4 rounded-xl bg-[#28282B] border border-[#3E3E43] space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-white uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EFFF4F]" />
              CHOOSE 3D AVATAR PERSONA
            </span>
            <button
              type="button"
              onClick={() => setShowAvatarPicker(false)}
              className="text-[#A0A5B5] hover:text-white font-mono text-xs uppercase"
            >
              [CLOSE]
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
            {AVATAR_OPTIONS.map((opt) => {
              const isCurrent = avatarUrl === opt.url;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    if (onAvatarChange) onAvatarChange(opt.url);
                    playSfx(950, "sine");
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all p-0.5 ${
                    isCurrent
                      ? "border-[#EFFF4F] ring-2 ring-[#EFFF4F]/40 scale-105"
                      : "border-[#3E3E43] hover:border-white/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={opt.url}
                    alt={opt.label}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded"
                  />
                  {isCurrent && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#EFFF4F] text-[#1E1E22] rounded-full flex items-center justify-center font-bold text-[8px]">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
