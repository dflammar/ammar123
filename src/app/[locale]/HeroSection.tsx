"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

/* ═══════════════════════════════════════════
   3D PARTICLE FIELD — Interactive Background
   ═══════════════════════════════════════════ */

function ParticleField() {
    const meshRef = useRef<THREE.Points>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    const count = 2000;

    const [positions, originalPositions, sizes] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const origPos = new Float32Array(count * 3);
        const sz = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 14;
            const z = (Math.random() - 0.5) * 10;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            origPos[i * 3] = x;
            origPos[i * 3 + 1] = y;
            origPos[i * 3 + 2] = z;

            sz[i] = Math.random() * 2 + 0.5;
        }
        return [pos, origPos, sz];
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.getElapsedTime();

        // Smooth mouse tracking
        const pointer = state.pointer;
        mouseRef.current.x += (pointer.x * viewport.width * 0.5 - mouseRef.current.x) * 0.02;
        mouseRef.current.y += (pointer.y * viewport.height * 0.5 - mouseRef.current.y) * 0.02;

        const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const ox = originalPositions[i3];
            const oy = originalPositions[i3 + 1];
            const oz = originalPositions[i3 + 2];

            // Gentle floating motion
            posArray[i3] = ox + Math.sin(time * 0.3 + i * 0.01) * 0.15 + mouseRef.current.x * 0.08;
            posArray[i3 + 1] = oy + Math.cos(time * 0.2 + i * 0.015) * 0.15 + mouseRef.current.y * 0.08;
            posArray[i3 + 2] = oz + Math.sin(time * 0.1 + i * 0.02) * 0.1;
        }

        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.rotation.y = time * 0.01;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={count}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                    count={count}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.025}
                color="#e2b340"
                transparent
                opacity={0.4}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/* ═══════════════════════════════════════════
   GLOWING WIREFRAME TORUS KNOT
   ═══════════════════════════════════════════ */

function GlowingTorusKnot() {
    const meshRef = useRef<THREE.Mesh>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        const pointer = state.pointer;

        mouseRef.current.x += (pointer.x - mouseRef.current.x) * 0.015;
        mouseRef.current.y += (pointer.y - mouseRef.current.y) * 0.015;

        meshRef.current.rotation.x = time * 0.08 + mouseRef.current.y * 0.3;
        meshRef.current.rotation.y = time * 0.12 + mouseRef.current.x * 0.3;
        meshRef.current.rotation.z = time * 0.05;
    });

    return (
        <mesh ref={meshRef} position={[2.5, 0, -2]}>
            <torusKnotGeometry args={[1.8, 0.4, 200, 32, 2, 3]} />
            <meshBasicMaterial
                color="#e2b340"
                wireframe
                transparent
                opacity={0.06}
            />
        </mesh>
    );
}

/* ═══════════════════════════════════════════
   SCENE SETUP
   ═══════════════════════════════════════════ */

function Scene() {
    return (
        <>
            <ambientLight intensity={0.1} />
            <ParticleField />
            <GlowingTorusKnot />
        </>
    );
}

/* ═══════════════════════════════════════════
   WORD-BY-WORD ANIMATION
   ═══════════════════════════════════════════ */

function AnimatedHeadline({
    text,
    className,
    delay = 0,
}: {
    text: string;
    className?: string;
    delay?: number;
}) {
    const words = text.split(" ");

    return (
        <span className={className}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden">
                    <motion.span
                        className="inline-block"
                        initial={{ y: "110%", rotateX: 40 }}
                        animate={{ y: "0%", rotateX: 0 }}
                        transition={{
                            duration: 0.9,
                            delay: delay + i * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {word}
                    </motion.span>
                    {i < words.length - 1 && "\u00A0"}
                </span>
            ))}
        </span>
    );
}

/* ═══════════════════════════════════════════
   HERO — MAIN EXPORT
   ═══════════════════════════════════════════ */

export function Hero() {
    const t = useTranslations("hero");
    const locale = useLocale();
    const isAr = locale === "ar";

    const headline = isAr ? "أصنع تحفاً رقمية" : "Engineering Digital Masterpieces.";
    const subtitle = t("title");

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* 3D Canvas */}
            <div className="absolute inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 60 }}
                    dpr={[1, 1.5]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: "high-performance",
                    }}
                    style={{ background: "transparent" }}
                >
                    <Scene />
                </Canvas>
            </div>

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />

            {/* Foreground content — mix-blend-difference for text interaction */}
            <div className="relative z-[2] h-full flex flex-col justify-end pb-24 sm:pb-32 lg:pb-40 px-6 sm:px-10 lg:px-16">
                <div className="max-w-[90rem] mx-auto w-full">
                    {/* Subtitle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-8"
                    >
                        <span className="text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-white/40">
                            {isAr ? "عمار محمود فرغلي" : "Ammar Mahmoud Farghaly"} — {subtitle}
                        </span>
                    </motion.div>

                    {/* Massive Headline */}
                    <h1
                        className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white mix-blend-difference"
                    >
                        <AnimatedHeadline text={headline} delay={0.4} />
                    </h1>

                    {/* Bottom row: Status + CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        className="mt-14 sm:mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8"
                    >
                        {/* Status indicators */}
                        <div className="flex gap-12 sm:gap-16">
                            <div>
                                <p className="text-[10px] sm:text-[11px] text-white/30 uppercase tracking-[0.2em] mb-2">
                                    {isAr ? "الحالة" : "Status"}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-white/70 text-sm font-medium">
                                        {isAr ? "متاح للعمل" : "Available for work"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-[11px] text-white/30 uppercase tracking-[0.2em] mb-2">
                                    {isAr ? "الموقع" : "Based in"}
                                </p>
                                <span className="text-white/70 text-sm font-medium">
                                    {isAr ? "مصر 🇪🇬" : "Egypt 🇪🇬"}
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link
                            href="/contact"
                            data-cursor="pointer"
                            data-cursor-text={isAr ? "تواصل" : "LET'S TALK"}
                            className="group flex items-center gap-4"
                        >
                            <span className="text-white/50 text-sm font-medium uppercase tracking-[0.15em] group-hover:text-white/90 transition-colors duration-500">
                                {isAr ? "ابدأ مشروعك" : "Start a project"}
                            </span>
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 group-hover:bg-white/5 transition-all duration-500">
                                <svg
                                    className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-500 rtl:rotate-180"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]"
            >
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/30 to-white/0"
                />
            </motion.div>
        </section>
    );
}
