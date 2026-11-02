import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Cpu,
  Bot,
  ArrowRight,
  Terminal,
  Activity,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export function FeaturedExplorations() {
  const explorations = [
    {
      id: 'controllers',
      title: 'Explore Microcontrollers',
      category: 'SILICON ARCHIVE',
      headline: 'The Multi-Architecture Hardware Matrix',
      description:
        'A comprehensive engineering index across 8 silicon families. Compare clock frequencies, flash and SRAM memory envelopes, peripheral matrices, and logic voltages from vintage 8051 to dual-core ESP32 and ARM Cortex-M.',
      icon: Layers,
      href: '/archive',
      metrics: [
        { label: 'SUPPORTED TARGETS', val: '14 Silicon Cores' },
        { label: 'BIT WIDTHS', val: '8-bit • 16-bit • 32-bit' },
        { label: 'REGISTER PROFILES', val: 'Full MMIO Maps' },
      ],
      features: [
        'Side-by-side hardware spec comparison tool',
        'Direct download links to official manufacturer datasheets',
        'Interactive pinout multiplexing and packaging visualizer',
      ],
      ctaText: 'Open Silicon Archive',
      badgeVariant: 'cyan',
    },
    {
      id: 'anatomy',
      title: 'Understand Chip Architecture',
      category: 'SILICON ANATOMY',
      headline: 'Inside the Core Execution Engine',
      description:
        'Demystify what happens inside silicon package dies. Trace how the ALU manipulates working registers, how Harvard buses arbitrate concurrent instruction and data streams, and how DMA engines offload high-throughput communications.',
      icon: Cpu,
      href: '/anatomy',
      metrics: [
        { label: 'EXECUTION ARCHITECTURE', val: 'Harvard Dual-Bus' },
        { label: 'INTERRUPT CONTROLLER', val: 'Hardware NVIC' },
        { label: 'PERIPHERAL BUSES', val: 'AHB / APB Bridges' },
      ],
      features: [
        'Interactive memory-mapped I/O register bitmasking',
        'Interrupt vector table (IVT) dispatch & tail-chaining simulator',
        'Bare-metal C pointer mechanics & volatile keyword analysis',
      ],
      ctaText: 'Explore Chip Anatomy',
      badgeVariant: 'ice',
    },
    {
      id: 'robotics',
      title: 'Enter the Robotics Lab',
      category: 'PHYSICAL AI & MECHATRONICS',
      headline: 'Where Firmware Meets Physical Dynamics',
      description:
        'Bridge computational logic and physical kinematics. Design closed-loop PID controllers, calibrate complementary PWM motor drivers with dead-time protection, and deploy quantized TinyML neural models to edge microcontrollers.',
      icon: Bot,
      href: '/robotics',
      metrics: [
        { label: 'CONTROL FREQUENCY', val: 'Up to 50 kHz PID' },
        { label: 'FEEDBACK MECHANISM', val: 'Quadrature Encoders' },
        { label: 'TINYML RUNTIME', val: 'CMSIS-NN Quantized' },
      ],
      features: [
        'Real-time PID step-response tuning oscilloscope',
        'H-Bridge transistor commutation and dead-time insertion',
        'Kalman filter sensor fusion for IMU orientation tracking',
      ],
      ctaText: 'Launch Robotics Lab',
      badgeVariant: 'emerald',
    },
  ];

  return (
    <section className="space-y-8" id="explorations">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#55C7FF]">
            <Activity className="w-3.5 h-3.5" />
            CORE LABORATORY GATEWAYS
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF] tracking-tight">
            Featured Engineering Explorations
          </h2>
          <p className="text-sm text-[#8FA6BC] max-w-2xl">
            Choose your learning vector into low-level silicon computing, bare-metal firmware design, and physical intelligence.
          </p>
        </div>

        <div className="text-xs font-mono text-[#8FA6BC] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>3 LABORATORY MODULES ONLINE</span>
        </div>
      </div>

      {/* Explorations 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {explorations.map((exp) => {
          const Icon = exp.icon;
          return (
            <Card
              key={exp.id}
              className="flex flex-col justify-between space-y-6 group hover:border-[#55C7FF]/60 hover:shadow-[0_0_30px_rgba(85,199,255,0.18)] transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0B1220] border border-[#192B40] group-hover:border-[#55C7FF]/50 flex items-center justify-center text-[#55C7FF] shadow-inner transition-colors">
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge variant={exp.badgeVariant}>{exp.category}</Badge>
                </div>

                {/* Title & Headline */}
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#EAF5FF] group-hover:text-[#55C7FF] transition-colors">
                    {exp.title}
                  </h3>
                  <div className="text-xs font-mono text-[#A5E3FF] mt-1 font-medium">
                    {exp.headline}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#8FA6BC] leading-relaxed">
                  {exp.description}
                </p>

                {/* Metrics Matrix Strip */}
                <div className="p-3 rounded-lg bg-[#0B1220]/80 border border-[#192B40] grid grid-cols-3 gap-2 text-center font-mono">
                  {exp.metrics.map((m, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="text-[9px] text-[#8FA6BC] truncate">{m.label}</div>
                      <div className="text-[11px] font-bold text-[#EAF5FF] truncate">{m.val}</div>
                    </div>
                  ))}
                </div>

                {/* Features Bullet List */}
                <div className="space-y-1.5 pt-1">
                  {exp.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs font-mono text-[#8FA6BC]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#55C7FF] shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Action Button */}
              <div className="pt-4 border-t border-[#192B40]">
                <Link to={exp.href} className="block">
                  <Button
                    size="md"
                    className="w-full justify-between group-hover:bg-[#55C7FF] group-hover:text-[#0B1220] transition-colors"
                    icon={ArrowRight}
                  >
                    <span>{exp.ctaText}</span>
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

