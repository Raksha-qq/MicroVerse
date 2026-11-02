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
    <section className="relative rounded-3xl bg-gradient-to-b from-[#111E30] via-[#0B1220] to-[#0B1220] border border-[#192B40] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#55C7FF]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Circuit line graphics */}
      <div className="absolute inset-0 bg-circuit-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-[#55C7FF]/40 text-xs font-mono text-[#55C7FF] shadow-[0_0_15px_rgba(85,199,255,0.2)]">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          <span>MICROVERSE LABORATORY RUNTIME ONLINE</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#EAF5FF] leading-tight">
          Step Inside the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#55C7FF] via-[#A5E3FF] to-[#EAF5FF]">
            Silicon Workbench
          </span>
        </h2>

        <p className="text-base sm:text-lg text-[#8FA6BC] max-w-2xl mx-auto leading-relaxed">
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
        <div className="mt-12 pt-8 border-t border-[#192B40]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#0B1220]/60 border border-[#192B40]">
            <div className="text-[10px] text-[#8FA6BC]">DATABASE ENGINE</div>
            <div className="text-[#10B981] font-semibold mt-0.5 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              <span>POSTGRESQL READY</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1220]/60 border border-[#192B40]">
            <div className="text-[10px] text-[#8FA6BC]">VIRTUAL INSTRUMENTATION</div>
            <div className="text-[#55C7FF] font-semibold mt-0.5">
              100 MSa/s OSCILLOSCOPE
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1220]/60 border border-[#192B40]">
            <div className="text-[10px] text-[#8FA6BC]">SILICON REGISTRY</div>
            <div className="text-[#55C7FF] font-semibold mt-0.5">
              14 HARDWARE TARGETS
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0B1220]/60 border border-[#192B40]">
            <div className="text-[10px] text-[#8FA6BC]">SECURITY LAYER</div>
            <div className="text-[#10B981] font-semibold mt-0.5 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>JWT AUTH READY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

