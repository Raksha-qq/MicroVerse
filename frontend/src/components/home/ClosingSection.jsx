import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Activity,
  Sliders,
  Zap,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { healthService } from '../../services/healthService';

export function ClosingSection() {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    healthService
      .getHealth()
      .then(setTelemetry)
      .catch(() => {});
  }, []);

  return (
    <section className="relative rounded-2xl bg-[#FAF5EB] border border-[#C9BDAA] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-sm bg-drafting-grid-subtle">
      {/* Corner crosshairs */}
      <div className="absolute top-3 left-3 text-[10px] font-mono text-[#8C8275] select-none pointer-events-none">
        + 00.99 // BENCH-SYS
      </div>
      <div className="absolute top-3 right-3 text-[10px] font-mono text-[#8C8275] select-none pointer-events-none">
        REF: MV-SEC-99
      </div>
      <div className="absolute bottom-3 left-3 text-[10px] font-mono text-[#8C8275] select-none pointer-events-none">
        [ DIAGNOSTICS OK ]
      </div>
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#8C8275] select-none pointer-events-none">
        CALIB: 2026.11
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE1CE] border border-[#C9BDAA] text-[11px] font-mono text-[#655F55]">
          <Zap className="w-3.5 h-3.5 text-[#D87535]" />
          <span className="font-semibold text-[#22201D]">MICROVERSE LABORATORY RUNTIME ONLINE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#87945B]" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#22201D] leading-tight">
          Step Inside the{' '}
          <span className="italic font-serif text-[#D87535]">
            Silicon Workbench.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-[#655F55] max-w-2xl mx-auto leading-relaxed font-sans">
          Connect to virtual hardware instrumentation, analyze real-time PWM oscilloscope traces, write bare-metal register bitmasks, and master physical artificial intelligence.
        </p>

        {/* Action Button Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/experiment">
            <Button size="lg" icon={Terminal}>
              Launch Simulation Bench
            </Button>
          </Link>
          <Link to="/lessons">
            <Button size="lg" variant="outline" icon={BookOpen}>
              Inspect Syllabus
            </Button>
          </Link>
          <Link to="/compare">
            <Button size="lg" variant="secondary" icon={Sliders}>
              Compare Hardware Cores
            </Button>
          </Link>
        </div>

        {/* Live Subsystem Readiness Telemetry Strip */}
        <div className="mt-12 pt-8 border-t border-[#C9BDAA]/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-left">
          <div className="p-3.5 rounded-lg bg-[#F5EBDD] border border-[#C9BDAA]">
            <div className="text-[10px] font-mono text-[#8C8275] uppercase tracking-wider">DATABASE ENGINE</div>
            <div className="text-[#87945B] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#87945B]" />
              <span>POSTGRESQL READY</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F5EBDD] border border-[#C9BDAA]">
            <div className="text-[10px] font-mono text-[#8C8275] uppercase tracking-wider">INSTRUMENTATION</div>
            <div className="text-[#22201D] font-semibold mt-1">
              100 MSa/s OSCILLOSCOPE
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F5EBDD] border border-[#C9BDAA]">
            <div className="text-[10px] font-mono text-[#8C8275] uppercase tracking-wider">SILICON REGISTRY</div>
            <div className="text-[#D87535] font-semibold mt-1">
              14 HARDWARE TARGETS
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F5EBDD] border border-[#C9BDAA]">
            <div className="text-[10px] font-mono text-[#8C8275] uppercase tracking-wider">SECURITY LAYER</div>
            <div className="text-[#87945B] font-semibold mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>JWT AUTH READY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

