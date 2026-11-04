import React from 'react';
import { Cpu, Activity, Layers, Terminal, Sparkles, BookOpen } from 'lucide-react';
import { ChipAnatomyExplorer } from '../components/anatomy/ChipAnatomyExplorer';
import { SignalVisualizer } from '../components/anatomy/SignalVisualizer';
import { Link } from 'react-router-dom';

export function AnatomyPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Page Header */}
      <div className="border-b border-[#C9BDAA] pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider mb-1.5 font-bold">
              <Cpu className="w-4 h-4" />
              <span>Silicon Architecture & Physics Laboratory // REF: MV-ANAT-32</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D] tracking-tight">
              Interactive Chip Anatomy & Silicon Physics
            </h1>
            <p className="text-sm text-[#655F55] mt-1.5 max-w-3xl leading-relaxed font-sans">
              Explore the internal execution mechanics of 32-bit RISC microcontrollers. Inspect how the CPU, ALU, registers, internal bus matrices, and memory-mapped peripheral subsystems collaborate in hardware to achieve deterministic real-time control.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/discover"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#EDE1CE] text-xs font-mono text-[#22201D] border border-[#C9BDAA] transition-colors font-bold shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-[#D87535]" />
              <span>14-Chapter Syllabus →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Part B: Interactive Chip Anatomy Explorer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#D87535] font-bold">
              SECTION 01 // ARCHITECTURAL TAXONOMY
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#22201D] mt-0.5">
              Monolithic Microcontroller Functional Diagram
            </h2>
          </div>
          <span className="text-xs font-mono text-[#655F55] hidden sm:inline bg-[#EDE1CE] px-2.5 py-1 rounded border border-[#C9BDAA]">
            10 Functional Blocks Active
          </span>
        </div>

        <ChipAnatomyExplorer />
      </section>

      {/* Part C: Interactive Signal Visualization */}
      <section className="space-y-4 pt-6 border-t border-[#C9BDAA]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#D87535] font-bold">
              SECTION 02 // WAVEFORM & TIMING LABORATORY
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#22201D] mt-0.5">
              Interactive Signal Dynamics & Bus Waveforms
            </h2>
          </div>
          <span className="text-xs font-mono text-[#655F55] hidden sm:inline bg-[#EDE1CE] px-2.5 py-1 rounded border border-[#C9BDAA]">
            5 Interactive Signal Modes
          </span>
        </div>

        <SignalVisualizer />
      </section>
    </div>
  );
}
