"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /**
   * CAMERA PUSH-IN EFFECT
   * Background slowly scales up while fading
   * to create cinematic depth.
   */
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  /**
   * Optional text movement for extra depth
   */
  const textY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-[200vh]"
      >
        {/* Sticky viewport */}
        <div className="fixed top-0 w-full h-screen overflow-hidden">
          {/* BACKGROUND IMAGE */}
          <motion.div
            style={{ scale, opacity }}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src="bg2.png"
              alt="Concrete Architecture"
              fill
              priority
              className="object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55" />

            {/* Atmospheric glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-black" />

            {/* Subtle vignette */}
            <div
              className="
                absolute inset-0
                [box-shadow:inset_0_0_200px_rgba(0,0,0,0.9)]
              "
            />
          </motion.div>

          {/* CONTENT */}
          <motion.div
            style={{
              y: textY,
              opacity: textOpacity,
            }}
            className="
              relative z-10
              flex h-full items-center justify-center
              px-6
            "
          >
            <div className="max-w-5xl text-center">
              <p className="mb-4 text-sm tracking-[0.35em] text-white/60 uppercase">
                Spatial Experience
              </p>

              <h1
                className="
                  text-5xl
                  md:text-7xl
                  lg:text-8xl
                  font-semibold
                  tracking-tight
                  leading-[0.9]
                "
              >
                Enter The
                <br />
                Concrete Light
              </h1>

              <p
                className="
                  mx-auto mt-8 max-w-2xl
                  text-base md:text-lg
                  text-white/60
                  leading-relaxed
                "
              >
                A cinematic scroll experience inspired by brutalist
                architecture, volumetric light, and Apple-grade motion depth.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEXT SECTION */}
      <section
        className="
          relative z-20
          min-h-screen
          bg-[#050505]
          px-6 py-32
        "
      >
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm tracking-[0.3em] text-white/40 uppercase">
            Next Layer
          </p>

          <h2 className="text-4xl md:text-6xl font-semibold">
            Emerging Through The Structure
          </h2>

          <p className="mt-8 max-w-2xl text-white/60 text-lg leading-relaxed">
            The transition above creates a physical sensation of moving deeper
            into the environment rather than simply scrolling between sections.
          </p>
        </div>
      </section>
    </main>
  );
}