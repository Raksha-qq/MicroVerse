import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  BookOpen,
  Terminal,
  CheckSquare,
  FileText,
  Activity,
  ArrowRight,
  Database,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { healthService } from '../services/healthService';

export function HomePage() {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    healthService
      .getHealth()
      .then((res) => setTelemetry(res))
      .catch(() => {});
  }, []);

  const architecturePillars = [
    {
      title: 'Microcontroller Registry',
      desc: 'Comparative architecture matrix spanning 8051, AVR, PIC, ARM Cortex-M, STM32, ESP32, and RP2040.',
      icon: Layers,
      href: '/controllers',
      badge: '14 SILICON TARGETS',
      variant: 'cyan',
    },
    {
      title: 'Curriculum & Lessons',
      desc: 'Deep bare-metal instruction covering memory-mapped I/O, interrupts, clock trees, DMA, and TinyML.',
      icon: BookOpen,
      href: '/lessons',
      badge: '8 CHAPTERS • 16 LESSONS',
      variant: 'ice',
    },
    {
      title: 'Simulation Laboratory',
      desc: 'Real-time oscilloscope, logic analyzer, and breadboard circuitry execution with interactive register configs.',
      icon: Terminal,
      href: '/lab',
      badge: 'PHYSICAL AI READY',
      variant: 'emerald',
    },
    {
      title: 'Knowledge Assessments',
      desc: 'Comprehensive silicon engineering evaluations with granular scoring, register quizzes, and badge unlocks.',
      icon: CheckSquare,
      href: '/quizzes',
      badge: '3 ASSESSMENTS',
      variant: 'amber',
    },
    {
      title: 'Research Notebook',
      desc: 'Engineering telemetry logs, peripheral timing observations, and collaborative embedded lab notes.',
      icon: FileText,
      href: '/research',
      badge: 'COMMUNITY LOGBOOK',
      variant: 'muted',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Architecture Hero Banner */}
      <section className="relative rounded-2xl bg-gradient-to-b from-[#111E30] to-[#0B1220] border border-[#192B40] p-8 md:p-12 overflow-hidden shadow-[0_0_30px_rgba(85,199,255,0.1)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#55C7FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#192B40]/60 border border-[#55C7FF]/30 text-xs font-mono text-[#55C7FF]">
            <Zap className="w-3.5 h-3.5" />
            <span>MILESTONE 1: ARCHITECTURE & FOUNDATION ESTABLISHED</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EAF5FF] leading-tight">
            Interactive Laboratory of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#55C7FF] via-[#A5E3FF] to-[#EAF5FF]">
              Embedded Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8FA6BC] leading-relaxed">
            MICROVERSE is a full-stack educational and simulation engine for microcontrollers, embedded firmware, real-time operating systems, and Physical AI.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/controllers">
              <Button size="lg" icon={ArrowRight}>
                Explore Silicon Architecture
              </Button>
            </Link>
            <Link to="/lessons">
              <Button size="lg" variant="outline" icon={BookOpen}>
                View Curriculum
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Engine Telemetry Strip */}
        <div className="mt-8 pt-6 border-t border-[#192B40]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <div className="text-[#8FA6BC]">CORE RUNTIME:</div>
            <div className="text-[#55C7FF] font-semibold mt-0.5">Node.js + Express 4</div>
          </div>
          <div>
            <div className="text-[#8FA6BC]">DATABASE:</div>
            <div className="text-[#55C7FF] font-semibold mt-0.5">PostgreSQL + Prisma ORM</div>
          </div>
          <div>
            <div className="text-[#8FA6BC]">INTERFACE:</div>
            <div className="text-[#55C7FF] font-semibold mt-0.5">React 19 + Vite 8</div>
          </div>
          <div>
            <div className="text-[#8FA6BC]">DATABASE PING:</div>
            <div className="text-[#10B981] font-semibold mt-0.5">
              {telemetry?.database?.latencyMs !== undefined
                ? `${telemetry.database.latencyMs}ms (CONNECTED)`
                : 'VERIFYING...'}
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Pillars Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-[#EAF5FF] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#55C7FF]" />
            Core Laboratory Modules
          </h2>
          <span className="text-xs font-mono text-[#8FA6BC]">FOUNDATION SUITE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {architecturePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link key={pillar.href} to={pillar.href} className="block group">
                <Card className="h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#0B1220] border border-[#192B40] group-hover:border-[#55C7FF]/50 flex items-center justify-center text-[#55C7FF] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant={pillar.variant}>{pillar.badge}</Badge>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#EAF5FF] group-hover:text-[#55C7FF] transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs text-[#8FA6BC] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#192B40] flex items-center text-xs font-mono text-[#55C7FF] gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Initialize Subsystem</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Design System & Token Showcase */}
      <section className="rounded-xl bg-[#111E30]/60 border border-[#192B40] p-6 space-y-4">
        <h3 className="font-heading text-lg font-bold text-[#EAF5FF] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#55C7FF]" />
          Visual Foundation Design Tokens
        </h3>
        <p className="text-xs text-[#8FA6BC]">
          Defined palette and typography variables applied across the full stack interface:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#0B1220] border border-[#192B40] text-center">
            <div className="w-full h-6 rounded bg-[#0B1220] border border-[#55C7FF]/20 mb-2"></div>
            <div className="font-semibold text-[#EAF5FF]">Midnight</div>
            <div className="text-[10px] text-[#8FA6BC]">#0B1220</div>
          </div>
          <div className="p-3 rounded-lg bg-[#111E30] border border-[#192B40] text-center">
            <div className="w-full h-6 rounded bg-[#111E30] border border-[#55C7FF]/20 mb-2"></div>
            <div className="font-semibold text-[#EAF5FF]">Deep Blue</div>
            <div className="text-[10px] text-[#8FA6BC]">#111E30</div>
          </div>
          <div className="p-3 rounded-lg bg-[#192B40] border border-[#192B40] text-center">
            <div className="w-full h-6 rounded bg-[#192B40] border border-[#55C7FF]/20 mb-2"></div>
            <div className="font-semibold text-[#EAF5FF]">Slate Blue</div>
            <div className="text-[10px] text-[#8FA6BC]">#192B40</div>
          </div>
          <div className="p-3 rounded-lg bg-[#111E30] border border-[#55C7FF]/40 text-center shadow-[0_0_15px_rgba(85,199,255,0.2)]">
            <div className="w-full h-6 rounded bg-[#55C7FF] mb-2"></div>
            <div className="font-semibold text-[#55C7FF]">Cyan Glow</div>
            <div className="text-[10px] text-[#8FA6BC]">#55C7FF</div>
          </div>
          <div className="p-3 rounded-lg bg-[#111E30] border border-[#192B40] text-center">
            <div className="w-full h-6 rounded bg-[#A5E3FF] mb-2"></div>
            <div className="font-semibold text-[#A5E3FF]">Ice Blue</div>
            <div className="text-[10px] text-[#8FA6BC]">#A5E3FF</div>
          </div>
          <div className="p-3 rounded-lg bg-[#111E30] border border-[#192B40] text-center">
            <div className="w-full h-6 rounded bg-[#EAF5FF] mb-2"></div>
            <div className="font-semibold text-[#EAF5FF]">Cool White</div>
            <div className="text-[10px] text-[#8FA6BC]">#EAF5FF</div>
          </div>
          <div className="p-3 rounded-lg bg-[#111E30] border border-[#192B40] text-center">
            <div className="w-full h-6 rounded bg-[#8FA6BC] mb-2"></div>
            <div className="font-semibold text-[#8FA6BC]">Muted Blue</div>
            <div className="text-[10px] text-[#8FA6BC]">#8FA6BC</div>
          </div>
        </div>
      </section>
    </div>
  );
}

