import React, { useState } from 'react';
import { Cpu, Layers, Terminal, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export function AnatomyPage() {
  const [selectedSubsystem, setSelectedSubsystem] = useState('alu');

  const subsystems = [
    {
      id: 'alu',
      name: 'Arithmetic Logic Unit (ALU) & FPU',
      badge: '32-BIT RISC CORE',
      summary:
        'The primary computational heart of the microcontroller, executing integer arithmetic, bitwise Boolean logic, and single-precision IEEE 754 floating-point operations in hardware.',
      specs: [
        { label: 'Multiplication Cycles', val: 'Single-Cycle (32x32)' },
        { label: 'FPU Support', val: 'Hardware Single-Precision' },
        { label: 'DSP Instructions', val: 'SIMD Saturated Math' },
      ],
      code: `// Hardware FPU and DSP calculation
float kp = 1.85f;
float error = setpoint - sensor_feedback;
float output = kp * error; // Compiled directly into single-cycle 'vadd.f32' & 'vmul.f32'`,
    },
    {
      id: 'nvic',
      name: 'Nested Vectored Interrupt Controller (NVIC)',
      badge: 'LOW-LATENCY ISR',
      summary:
        'Tightly coupled to the CPU core, the NVIC manages asynchronous hardware interrupts with hardware tail-chaining, automatic register stacking, and 16 programmable priority tiers.',
      specs: [
        { label: 'Interrupt Latency', val: '12 Clock Cycles' },
        { label: 'Tail-Chaining', val: 'Hardware Accelerated' },
        { label: 'Priority Grouping', val: '4-bit Preempt/Subpriority' },
      ],
      code: `// NVIC Hardware Interrupt Service Routine
void EXTI0_IRQHandler(void) {
    if (EXTI->PR & EXTI_PR_PR0) {
        GPIOC->ODR ^= GPIO_ODR_OD13; // Toggle LED
        EXTI->PR = EXTI_PR_PR0;      // Clear pending flag atomically
    }
}`,
    },
    {
      id: 'dma',
      name: 'Direct Memory Access (DMA) Engine',
      badge: 'OFFLOADED TRANSFERS',
      summary:
        'High-speed multi-channel bus arbiter performing memory-to-peripheral, peripheral-to-memory, and memory-to-memory data transactions without CPU core intervention.',
      specs: [
        { label: 'Streams / Channels', val: '2 Controllers x 8 Streams' },
        { label: 'FIFO Threshold', val: '1/4, 1/2, 3/4, Full' },
        { label: 'Circular Buffers', val: 'Continuous Sensor Logging' },
      ],
      code: `// DMA Circular Buffer Configuration
DMA1_Stream5->CR |= DMA_SxCR_CIRC; // Circular mode active
DMA1_Stream5->NDTR = BUFFER_SIZE;  // Buffer length auto-reload
DMA1_Stream5->CR |= DMA_SxCR_EN;   // Enable streaming`,
    },
    {
      id: 'gpio',
      name: 'Memory-Mapped GPIO Subsystem',
      badge: 'PERIPHERAL MATRIX',
      summary:
        'Every external physical silicon pin is memory-mapped into a specific 32-bit register address space. Firmware configures mode, output type, speed, pull-up/pull-down, and alternate functions.',
      specs: [
        { label: 'Switching Speed', val: 'Up to 50 MHz' },
        { label: 'Output Topologies', val: 'Push-Pull & Open-Drain' },
        { label: 'Atomic Bit Set/Reset', val: 'BSRR Register' },
      ],
      code: `// Direct Memory-Mapped Register Write
#define GPIOA_MODER  (*(volatile uint32_t*)(0x40020000))
#define GPIOA_BSRR   (*(volatile uint32_t*)(0x40020018))

GPIOA_MODER |= (1 << 10); // Configure Pin 5 as output
GPIOA_BSRR = (1 << 5);    // Atomically set Pin 5 HIGH`,
    },
  ];

  const current = subsystems.find((s) => s.id === selectedSubsystem) || subsystems[0];

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <Cpu className="w-3.5 h-3.5" />
          Silicon Architecture Anatomy
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
          Inside the Silicon Execution Engine
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1 max-w-2xl">
          Inspect the hardware building blocks powering modern microcontrollers: the arithmetic core, interrupt vector matrix, DMA engines, and memory-mapped peripheral buses.
        </p>
      </div>

      {/* Interactive Subsystem Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {subsystems.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubsystem(sub.id)}
            className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
              selectedSubsystem === sub.id
                ? 'bg-[#111E30] border-[#55C7FF] shadow-[0_0_15px_rgba(85,199,255,0.25)] text-[#55C7FF]'
                : 'bg-[#111E30]/50 border-[#192B40] text-[#8FA6BC] hover:text-[#EAF5FF] hover:border-[#55C7FF]/40'
            }`}
          >
            <div className="text-[10px] font-mono uppercase tracking-wider">
              SUBSYSTEM
            </div>
            <div className="font-heading font-bold text-sm mt-0.5 text-[#EAF5FF]">
              {sub.name.split(' (')[0]}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Subsystem Detail Display */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#192B40] pb-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#EAF5FF]">
              {current.name}
            </h2>
            <p className="text-xs text-[#8FA6BC] mt-1 max-w-xl">
              {current.summary}
            </p>
          </div>
          <Badge variant="cyan">{current.badge}</Badge>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          {current.specs.map((sp, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#0B1220] border border-[#192B40]">
              <div className="text-[10px] text-[#8FA6BC]">{sp.label}</div>
              <div className="text-sm font-bold text-[#55C7FF] mt-0.5">{sp.val}</div>
            </div>
          ))}
        </div>

        {/* Bare-Metal C Register Code Snippet */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#8FA6BC] flex items-center justify-between">
            <span>Bare-Metal C Register Implementation</span>
            <span className="text-[#55C7FF]">ARM CORTEX-M4 MMIO</span>
          </div>
          <pre className="p-4 rounded-xl bg-[#07101B] border border-[#192B40] font-mono text-xs text-[#A5E3FF] overflow-x-auto leading-relaxed">
            <code>{current.code}</code>
          </pre>
        </div>
      </Card>
    </div>
  );
}

