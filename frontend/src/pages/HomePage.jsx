import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu,
  Layers,
  Terminal,
  ArrowRight,
  Zap,
  Activity,
  Sliders,
  Shield,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Chip3DVisualizer } from '../components/home/Chip3DVisualizer';
import { EmbeddedLoopStory } from '../components/home/EmbeddedLoopStory';
import { FeaturedExplorations } from '../components/home/FeaturedExplorations';
import { ControllerPreviews } from '../components/home/ControllerPreviews';
import { ClosingSection } from '../components/home/ClosingSection';

// Framer Motion reveal variants (subtle, non-distracting)
const revealVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HomePage() {
  return (
    <div className="space-y-24 sm:space-y-32 py-4">
      {/* =========================================================================
          SECTION 2: HERO SECTION
          ========================================================================= */}
      <section className="relative pt-4 sm:pt-8" id="hero">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <motion.div
            className="lg:col-span-6 space-y-6 text-left"
            initial="hidden"
            animate="visible"
            variants={revealVariant}
          >
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111E30] border border-[#55C7FF]/30 text-xs font-mono text-[#55C7FF] shadow-[0_0_15px_rgba(85,199,255,0.15)]">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>INTERACTIVE EMBEDDED SYSTEMS BENCH</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EAF5FF] leading-[1.08]">
              THE INTELLIGENCE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#55C7FF] via-[#A5E3FF] to-[#EAF5FF]">
                INSIDE MACHINES.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#8FA6BC] leading-relaxed max-w-xl">
              An interactive exploration of microcontrollers, embedded systems and physical intelligence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/experiment">
                <Button size="lg" icon={Terminal}>
                  Launch Interactive Lab
                </Button>
              </Link>
              <Link to="/archive">
                <Button size="lg" variant="outline" icon={Layers}>
                  Explore Silicon Catalog
                </Button>
              </Link>
            </div>

            {/* Real-time Architecture Highlights */}
            <div className="pt-6 border-t border-[#192B40] grid grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <div className="text-[#8FA6BC] text-[10px]">CORES & TARGETS:</div>
                <div className="text-[#55C7FF] font-semibold mt-0.5">8 Silicon Families</div>
              </div>
              <div>
                <div className="text-[#8FA6BC] text-[10px]">EXECUTION MODEL:</div>
                <div className="text-[#55C7FF] font-semibold mt-0.5">Bare-Metal MMIO</div>
              </div>
              <div>
                <div className="text-[#8FA6BC] text-[10px]">TIME RESOLUTION:</div>
                <div className="text-[#10B981] font-semibold mt-0.5">Sub-Microsecond</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Central 3D Microcontroller / Chip Visualizer */}
          <motion.div
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Chip3DVisualizer />
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INTRODUCTION (Embedded Intelligence & Sense-Process-Actuate)
          ========================================================================= */}
      <motion.section
        id="discover"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={revealVariant}
      >
        <EmbeddedLoopStory />
      </motion.section>

      {/* =========================================================================
          SECTION 4: FEATURED EXPLORATIONS
          ========================================================================= */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={revealVariant}
      >
        <FeaturedExplorations />
      </motion.section>

      {/* =========================================================================
          SECTION 5: CONTROLLER PREVIEWS (Silicon Archive Profiles)
          ========================================================================= */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={revealVariant}
      >
        <ControllerPreviews />
      </motion.section>

      {/* =========================================================================
          SECTION 6: CLOSING TRANSITION SECTION
          ========================================================================= */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={revealVariant}
      >
        <ClosingSection />
      </motion.section>
    </div>
  );
}
