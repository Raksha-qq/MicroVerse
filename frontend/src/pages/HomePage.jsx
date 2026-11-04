import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  BookOpen,
  Terminal,
  FileText,
  ArrowRight,
  Play,
  Compass,
  Cpu,
  Bot,
  Sliders,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ExplodedMicrocontrollerSketch } from '../components/sketches/ExplodedMicrocontrollerSketch';
import { MicrocontrollerSketch } from '../components/sketches/MicrocontrollerSketch';
import { RoboticArmSketch } from '../components/sketches/RoboticArmSketch';
import { AutonomousRoverSketch } from '../components/sketches/AutonomousRoverSketch';
import { SatelliteSketch } from '../components/sketches/SatelliteSketch';
import { LiveLabPreview } from '../components/home/LiveLabPreview';
import { EmbeddedLoopStory } from '../components/home/EmbeddedLoopStory';
import { ControllerPreviews } from '../components/home/ControllerPreviews';
import { ClosingSection } from '../components/home/ClosingSection';

export function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-2">
      {/* =========================================================================
          SECTION 1: EDITORIAL TWO-COLUMN HERO
          ========================================================================= */}
      <section className="relative pt-4 sm:pt-6" id="hero">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines, Call to Actions & Mission */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* System Status Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono bg-[#FAF5EB] border border-[#C9BDAA] text-[#22201D] shadow-2xs">
              <span className="text-[#8C8275]">//</span>
              <span className="font-semibold tracking-wider">SYSTEM ONLINE</span>
              <span className="w-2 h-2 rounded-full bg-[#87945B] animate-pulse" />
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#22201D] leading-[1.08]">
              Understand
              <br />
              the Machine.
              <br />
              <span className="italic font-normal text-[#D87535]">
                Explore its Intelligence.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-[#655F55] leading-relaxed max-w-xl font-sans">
              An interactive laboratory for embedded systems, robotics and the future of intelligent machines.
            </p>

            {/* Calls to Action */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link to="/lab">
                <Button size="lg" variant="primary" className="gap-2 font-bold shadow-xs">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Enter the Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/discover">
                <Button size="lg" variant="secondary" className="gap-2 font-bold shadow-xs">
                  <BookOpen className="w-4 h-4 text-[#D87535]" />
                  <span>Start Learning</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Exploded Microcontroller Illustration */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <ExplodedMicrocontrollerSketch />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: HORIZONTAL FEATURE STRIP
          ========================================================================= */}
      <section className="border-y border-[#C9BDAA] bg-[#FAF5EB] py-4 px-2 sm:px-6 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#C9BDAA]/50">
          <Link
            to="/archive"
            className="flex items-center gap-3 p-2 group hover:bg-[#EDE1CE]/40 rounded transition-colors"
          >
            <div className="w-9 h-9 rounded border border-[#C9BDAA] bg-[#FAF5EB] flex items-center justify-center text-[#D87535] group-hover:border-[#D87535] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#22201D] group-hover:text-[#D87535]">
                Controller Archive
              </div>
              <div className="text-[11px] text-[#655F55]">
                Explore 19+ silicon targets
              </div>
            </div>
          </Link>

          <Link
            to="/lessons"
            className="flex items-center gap-3 p-2 sm:pl-6 group hover:bg-[#EDE1CE]/40 rounded transition-colors pt-3 sm:pt-2"
          >
            <div className="w-9 h-9 rounded border border-[#C9BDAA] bg-[#FAF5EB] flex items-center justify-center text-[#D87535] group-hover:border-[#D87535] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#22201D] group-hover:text-[#D87535]">
                Learning Paths
              </div>
              <div className="text-[11px] text-[#655F55]">
                From basics to advanced
              </div>
            </div>
          </Link>

          <Link
            to="/lab"
            className="flex items-center gap-3 p-2 sm:pl-6 group hover:bg-[#EDE1CE]/40 rounded transition-colors pt-3 sm:pt-2"
          >
            <div className="w-9 h-9 rounded border border-[#C9BDAA] bg-[#FAF5EB] flex items-center justify-center text-[#D87535] group-hover:border-[#D87535] shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#22201D] group-hover:text-[#D87535]">
                Virtual Laboratory
              </div>
              <div className="text-[11px] text-[#655F55]">
                Run real-time experiments
              </div>
            </div>
          </Link>

          <Link
            to="/research"
            className="flex items-center gap-3 p-2 sm:pl-6 group hover:bg-[#EDE1CE]/40 rounded transition-colors pt-3 sm:pt-2"
          >
            <div className="w-9 h-9 rounded border border-[#C9BDAA] bg-[#FAF5EB] flex items-center justify-center text-[#D87535] group-hover:border-[#D87535] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#22201D] group-hover:text-[#D87535]">
                Research Logbook
              </div>
              <div className="text-[11px] text-[#655F55]">
                Document your journey
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: FOUR NUMBERED EXPLORATION CARDS + LIVE LAB PREVIEW
          ========================================================================= */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Sub-Header Column */}
          <div className="lg:col-span-3 space-y-4 flex flex-col justify-between p-4 bg-[#EDE1CE]/40 rounded-lg border border-[#C9BDAA]">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D87535]">
                <span>[ // EXPLORE PATHS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D87535]" />
                <span>]</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#22201D] leading-snug">
                Your Journey into Embedded Intelligence
              </h2>
              <p className="text-xs text-[#655F55] font-sans">
                Discover. Learn. Experiment. Grow.
              </p>
            </div>

            <div className="pt-4">
              <Link to="/discover">
                <Button variant="secondary" size="sm" className="w-full gap-2 text-xs">
                  <span>Explore All Paths</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D87535]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Center Column: 4 Numbered Illustrated Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 01 — Discover */}
            <Link
              to="/archive"
              className="group block rounded-lg border border-[#C9BDAA] bg-[#FAF5EB] p-4 hover:border-[#D87535] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#C9BDAA]/40 pb-2 text-[11px] font-mono text-[#8C8275]">
                  <span>01 DISCOVER</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D87535]" />
                </div>
                {/* Microcontroller Sketch */}
                <MicrocontrollerSketch />
                <div className="space-y-1 mt-2">
                  <h3 className="font-serif text-lg font-bold text-[#22201D] group-hover:text-[#D87535] transition-colors">
                    Controller Archive
                  </h3>
                  <p className="text-xs text-[#655F55] font-sans">
                    Explore the silicon behind the system.
                  </p>
                </div>
              </div>
              <div className="pt-3 flex justify-end">
                <div className="w-6 h-6 rounded-full border border-[#C9BDAA] group-hover:border-[#D87535] group-hover:bg-[#D87535] group-hover:text-[#FAF5EB] flex items-center justify-center text-[#22201D] transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            {/* Card 02 — Understand */}
            <Link
              to="/lessons"
              className="group block rounded-lg border border-[#C9BDAA] bg-[#FAF5EB] p-4 hover:border-[#D87535] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#C9BDAA]/40 pb-2 text-[11px] font-mono text-[#8C8275]">
                  <span>02 UNDERSTAND</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D87535]" />
                </div>
                {/* Robotic Arm Sketch */}
                <RoboticArmSketch />
                <div className="space-y-1 mt-2">
                  <h3 className="font-serif text-lg font-bold text-[#22201D] group-hover:text-[#D87535] transition-colors">
                    Learning Paths
                  </h3>
                  <p className="text-xs text-[#655F55] font-sans">
                    Build knowledge from fundamentals.
                  </p>
                </div>
              </div>
              <div className="pt-3 flex justify-end">
                <div className="w-6 h-6 rounded-full border border-[#C9BDAA] group-hover:border-[#D87535] group-hover:bg-[#D87535] group-hover:text-[#FAF5EB] flex items-center justify-center text-[#22201D] transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            {/* Card 03 — Experiment */}
            <Link
              to="/lab"
              className="group block rounded-lg border border-[#C9BDAA] bg-[#FAF5EB] p-4 hover:border-[#D87535] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#C9BDAA]/40 pb-2 text-[11px] font-mono text-[#8C8275]">
                  <span>03 EXPERIMENT</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D87535]" />
                </div>
                {/* Autonomous Rover Sketch */}
                <AutonomousRoverSketch />
                <div className="space-y-1 mt-2">
                  <h3 className="font-serif text-lg font-bold text-[#22201D] group-hover:text-[#D87535] transition-colors">
                    Virtual Laboratory
                  </h3>
                  <p className="text-xs text-[#655F55] font-sans">
                    Change inputs. Observe behaviour.
                  </p>
                </div>
              </div>
              <div className="pt-3 flex justify-end">
                <div className="w-6 h-6 rounded-full border border-[#C9BDAA] group-hover:border-[#D87535] group-hover:bg-[#D87535] group-hover:text-[#FAF5EB] flex items-center justify-center text-[#22201D] transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            {/* Card 04 — Investigate */}
            <Link
              to="/research"
              className="group block rounded-lg border border-[#C9BDAA] bg-[#FAF5EB] p-4 hover:border-[#D87535] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#C9BDAA]/40 pb-2 text-[11px] font-mono text-[#8C8275]">
                  <span>04 INVESTIGATE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D87535]" />
                </div>
                {/* Satellite Sketch */}
                <SatelliteSketch />
                <div className="space-y-1 mt-2">
                  <h3 className="font-serif text-lg font-bold text-[#22201D] group-hover:text-[#D87535] transition-colors">
                    Research Logbook
                  </h3>
                  <p className="text-xs text-[#655F55] font-sans">
                    Save findings and experiments.
                  </p>
                </div>
              </div>
              <div className="pt-3 flex justify-end">
                <div className="w-6 h-6 rounded-full border border-[#C9BDAA] group-hover:border-[#D87535] group-hover:bg-[#D87535] group-hover:text-[#FAF5EB] flex items-center justify-center text-[#22201D] transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column: Live Laboratory Preview (Dark Instrument Panel) */}
          <div className="lg:col-span-3 flex flex-col">
            <LiveLabPreview />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SENSE → PROCESS → ACTUATE CLOSED-LOOP INTERACTIVE STORY
          ========================================================================= */}
      <section id="discover">
        <EmbeddedLoopStory />
      </section>

      {/* =========================================================================
          SECTION 5: SILICON ARCHIVE CONTROLLER PREVIEWS
          ========================================================================= */}
      <section id="archive">
        <ControllerPreviews />
      </section>

      {/* =========================================================================
          SECTION 6: CLOSING TRANSITION & CALL TO ACTION
          ========================================================================= */}
      <section>
        <ClosingSection />
      </section>
    </div>
  );
}
