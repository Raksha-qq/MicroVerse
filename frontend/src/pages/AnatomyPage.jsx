import React from 'react';
import { Cpu, Activity, Layers, Terminal, Sparkles, BookOpen } from 'lucide-react';
import { ChipAnatomyExplorer } from '../components/anatomy/ChipAnatomyExplorer';
import { SignalVisualizer } from '../components/anatomy/SignalVisualizer';
import { Link } from 'react-router-dom';

export function AnatomyPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="border-b border-[#192B40] pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1.5">
              <Cpu className="w-4 h-4" />
              Microcontroller Silicon Execution Engine
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
              Interactive Chip Anatomy & Silicon Physics
            </h1>
            <p className="text-sm text-[#8FA6BC] mt-1.5 max-w-3xl leading-relaxed">
              Explore the internal execution mechanics of 32-bit RISC microcontrollers. Inspect how the CPU, ALU, registers, internal bus matrices, and memory-mapped peripheral subsystems collaborate in hardware to achieve deterministic real-time control.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/discover"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111E30] hover:bg-[#192B40] text-xs font-mono text-[#55C7FF] border border-[#55C7FF]/40 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              14-Chapter Syllabus
            </Link>
          </div>
        </div>
      </div>

      {/* Part B: Interactive Chip Anatomy Explorer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#55C7FF] font-bold">
              SECTION 01 // ARCHITECTURAL TAXONOMY
            </div>
            <h2 className="font-heading font-bold text-2xl text-[#EAF5FF] mt-0.5">
              Monolithic Microcontroller Functional Diagram
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8FA6BC] hidden sm:inline">
            10 Functional Blocks Active
          </span>
        </div>

        <ChipAnatomyExplorer />
      </section>

      {/* Part C: Interactive Signal Visualization */}
      <section className="space-y-4 pt-6 border-t border-[#192B40]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#55C7FF] font-bold">
              SECTION 02 // WAVEFORM & TIMING LABORATORY
            </div>
            <h2 className="font-heading font-bold text-2xl text-[#EAF5FF] mt-0.5">
              Interactive Signal Dynamics & Bus Waveforms
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8FA6BC] hidden sm:inline">
            5 Interactive Signal Modes
          </span>
        </div>

        <SignalVisualizer />
      </section>
    </div>
  );
}
