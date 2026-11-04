import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, Layers, Radio, Clock, Compass, Database, HardDrive, Binary, ShieldAlert } from 'lucide-react';

export function ChapterDiagram({ chapterNumber, className = '' }) {
  const [toggleState, setToggleState] = useState(0);

  switch (chapterNumber) {
    case 1: // What is a Microcontroller?
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="flex items-center justify-between text-[#655F55] text-[11px] pb-2 border-b border-[#C9BDAA]">
            <span className="text-[#22201D] font-bold">FIG 1.1: MONOLITHIC SILICON INTEGRATION TOPOLOGY</span>
            <div className="flex gap-2">
              <button
                onClick={() => setToggleState(0)}
                className={`px-2.5 py-0.5 rounded cursor-pointer transition-colors ${toggleState === 0 ? 'bg-[#22201D] text-[#FAF5EB] font-bold' : 'bg-[#FAF5EB] text-[#655F55] border border-[#C9BDAA]'}`}
              >
                MICROCONTROLLER DIE
              </button>
              <button
                onClick={() => setToggleState(1)}
                className={`px-2.5 py-0.5 rounded cursor-pointer transition-colors ${toggleState === 1 ? 'bg-[#22201D] text-[#FAF5EB] font-bold' : 'bg-[#FAF5EB] text-[#655F55] border border-[#C9BDAA]'}`}
              >
                DISCRETE PC
              </button>
            </div>
          </div>

          {toggleState === 0 ? (
            <div className="p-4 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] space-y-3">
              <div className="text-center font-serif font-bold text-[#D87535] text-sm">
                SINGLE SILICON CHIP (&lt; 25 mm²)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded bg-[#EDE1CE] border border-[#C9BDAA] text-[#22201D]">
                  <Cpu className="w-4 h-4 mx-auto mb-1 text-[#D87535]" />
                  CPU Core & ALU
                </div>
                <div className="p-2.5 rounded bg-[#EDE1CE] border border-[#C9BDAA] text-[#22201D]">
                  <Database className="w-4 h-4 mx-auto mb-1 text-[#87945B]" />
                  SRAM (96 KB)
                </div>
                <div className="p-2.5 rounded bg-[#EDE1CE] border border-[#C9BDAA] text-[#22201D]">
                  <HardDrive className="w-4 h-4 mx-auto mb-1 text-[#71818B]" />
                  NOR Flash (512 KB)
                </div>
              </div>
              <div className="py-1 px-3 rounded bg-[#EDE1CE] text-center text-[#22201D] font-bold text-[11px] border border-[#C9BDAA]/70">
                INTERNAL MULTI-LAYER AHB BUS MATRIX (0 external PCB traces)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-[#EDE1CE] text-[#B95D32] border border-[#C9BDAA]">GPIO Controller</div>
                <div className="p-2 rounded bg-[#EDE1CE] text-[#71818B] border border-[#C9BDAA]">Timers & PWM</div>
                <div className="p-2 rounded bg-[#EDE1CE] text-[#87945B] border border-[#C9BDAA]">12-Bit SAR ADC</div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] space-y-3">
              <div className="text-center font-serif font-bold text-[#655F55] text-sm">
                DISCRETE MOTHERBOARD (Requires External Components)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded bg-[#EDE1CE] border border-[#C9BDAA] text-[#22201D]">
                  <Cpu className="w-4 h-4 mx-auto mb-1 text-[#B95D32]" />
                  MPU (Requires Fan)
                </div>
                <div className="p-2.5 rounded bg-[#EDE1CE] border border-[#C9BDAA] text-[#22201D]">
                  <Database className="w-4 h-4 mx-auto mb-1 text-[#87945B]" />
                  Ext DDR5 Sticks
                </div>
                <div className="p-2.5 rounded bg-[#EDE1CE] border border-[#C9BDAA] text-[#22201D]">
                  <HardDrive className="w-4 h-4 mx-auto mb-1 text-[#71818B]" />
                  NVMe M.2 SSD
                </div>
              </div>
              <div className="py-1 px-3 rounded bg-[#B95D32]/10 border border-[#B95D32]/30 text-center text-[#B95D32] text-[11px] font-bold">
                HIGH-SPEED PCB DIFFERENTIAL TRACES (High EMI, High Power, High BOM Cost)
              </div>
            </div>
          )}
        </div>
      );

    case 2: // MCU vs MPU vs SoC
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 2.1: HARVARD VS VON NEUMANN MEMORY BUS TOPOLOGIES
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] space-y-2">
              <div className="font-bold text-[#D87535] text-xs">HARVARD ARCHITECTURE (MCU Standard)</div>
              <div className="text-[11px] text-[#655F55] leading-relaxed">
                Physically segregated instruction and data buses permit concurrent single-cycle fetch and memory load.
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="p-1.5 rounded bg-[#EDE1CE] text-[#22201D] border border-[#C9BDAA]">Instruction Bus ➜ Flash Code</div>
                <div className="p-1.5 rounded bg-[#EDE1CE] text-[#87945B] border border-[#C9BDAA]">Data Bus ➜ SRAM Variables</div>
              </div>
              <div className="text-[10px] text-[#87945B] font-bold">✓ 0-Wait-State Concurrent Access</div>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] space-y-2">
              <div className="font-bold text-[#655F55] text-xs">VON NEUMANN ARCHITECTURE (Classic PC)</div>
              <div className="text-[11px] text-[#655F55] leading-relaxed">
                Instructions and data share a single physical bus and memory space.
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="p-1.5 rounded bg-[#EDE1CE] text-[#655F55] border border-[#C9BDAA]">Shared Bus ➜ Code & Data</div>
              </div>
              <div className="text-[10px] text-[#B95D32] font-bold">⚠ Von Neumann Bottleneck (Sequential)</div>
            </div>
          </div>
        </div>
      );

    case 3: // How a Microcontroller Works
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 3.1: 3-STAGE PIPELINED INSTRUCTION CYCLE
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] text-[#22201D]">
                <div className="text-[10px] uppercase font-bold text-[#D87535]">STAGE 1: FETCH</div>
                <div className="text-xs mt-1 text-[#22201D] font-bold">Read Opcode from Flash</div>
                <div className="text-[10px] text-[#655F55] mt-0.5">PC ➜ Address Bus</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] text-[#22201D]">
                <div className="text-[10px] uppercase font-bold text-[#71818B]">STAGE 2: DECODE</div>
                <div className="text-xs mt-1 text-[#22201D] font-bold">Decipher Opcode Bits</div>
                <div className="text-[10px] text-[#655F55] mt-0.5">Control Unit Active</div>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] text-[#22201D]">
                <div className="text-[10px] uppercase font-bold text-[#87945B]">STAGE 3: EXECUTE</div>
                <div className="text-xs mt-1 text-[#22201D] font-bold">ALU Math or Pin Write</div>
                <div className="text-[10px] text-[#655F55] mt-0.5">Registers Updated</div>
              </div>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] text-center text-[#655F55] text-[11px]">
              Continuous pipelining approaches <strong className="text-[#D87535]">1 Instruction Per Clock Cycle (1 CPI)</strong>.
            </div>
          </div>
        </div>
      );

    case 4: // CPU and ALU
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 4.1: 32-BIT ARITHMETIC LOGIC UNIT & CONDITION REGISTER
          </div>
          <div className="p-3 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#655F55]">Operand A (R1: 0x00000005)</span>
              <span className="text-[#655F55]">Operand B (R2: 0x00000005)</span>
            </div>
            <div className="p-3 rounded bg-[#EDE1CE] border border-[#C9BDAA] text-center font-bold text-[#22201D]">
              ALU 32-BIT FULL ADDER / SUBTRACTOR / BARREL SHIFTER
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#C9BDAA]">
              <span className="text-[#22201D] font-bold">Result = 0x00000000 (R0)</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-[#87945B]/15 text-[#87945B] font-bold border border-[#87945B]/40">Z = 1 (Zero)</span>
                <span className="px-2 py-0.5 rounded bg-[#EDE1CE] text-[#655F55] border border-[#C9BDAA]">N = 0</span>
                <span className="px-2 py-0.5 rounded bg-[#EDE1CE] text-[#655F55] border border-[#C9BDAA]">C = 1</span>
                <span className="px-2 py-0.5 rounded bg-[#EDE1CE] text-[#655F55] border border-[#C9BDAA]">V = 0</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 5: // Registers
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 5.1: ARM CORTEX-M CORE REGISTER MAP & AAPCS ROLES
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
            {['R0 (Arg 1 / Return)', 'R1 (Arg 2)', 'R2 (Arg 3)', 'R3 (Arg 4)'].map((r) => (
              <div key={r} className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] text-[#D87535] font-bold">
                {r}
              </div>
            ))}
            {['R4 (Local Var)', 'R5 (Local Var)', 'R6 (Local Var)', 'R7 (Local Var)'].map((r) => (
              <div key={r} className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] text-[#655F55]">
                {r}
              </div>
            ))}
            {['R12 (Intra-Proc)', 'R13 / SP (Stack)', 'R14 / LR (Link)', 'R15 / PC (Program)'].map((r) => (
              <div key={r} className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] text-[#B95D32] font-bold">
                {r}
              </div>
            ))}
          </div>
        </div>
      );

    case 6: // Program Counter & Stack Pointer
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 6.1: FULL DESCENDING CALL STACK IN SRAM
          </div>
          <div className="space-y-1.5">
            <div className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] flex justify-between text-[#655F55]">
              <span>0x2001_FFFF (High SRAM)</span>
              <span>Initial Top of Stack (MSP)</span>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] flex justify-between text-[#655F55]">
              <span>0x2001_FFDC</span>
              <span>Parent Function Stack Frame [Saved LR, R4-R7]</span>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] border border-[#D87535] flex justify-between text-[#22201D] font-bold ring-1 ring-[#D87535]/30">
              <span>0x2001_FFB0 (Current SP ➜)</span>
              <span>Active Function Stack Frame [Local Vars]</span>
            </div>
            <div className="p-2 rounded bg-[#B95D32]/10 border border-dashed border-[#B95D32]/40 flex justify-between text-[#B95D32] text-[10px] font-bold">
              <span>0x2000_0000 (Low SRAM)</span>
              <span>MPU Guard Region: Stack Overflow Barrier</span>
            </div>
          </div>
        </div>
      );

    case 7: // Memory Organization
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 7.1: 4GB LINEAR MEMORY ADDRESS SPACE MAPPING
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="p-2 rounded bg-[#FAF5EB] flex justify-between text-[#71818B] border border-[#C9BDAA]">
              <span>0xE000_0000 - 0xFFFF_FFFF</span>
              <span className="font-bold">System Control Space (NVIC, MPU, SysTick)</span>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] flex justify-between text-[#B95D32] border border-[#C9BDAA]">
              <span>0x4000_0000 - 0x5FFF_FFFF</span>
              <span className="font-bold">Peripheral MMIO (GPIOA-E, TIM1-8, USART1-3)</span>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] flex justify-between text-[#87945B] border border-[#C9BDAA]">
              <span>0x2000_0000 - 0x3FFF_FFFF</span>
              <span className="font-bold">SRAM Data Memory (.data, .bss, heap, stack)</span>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] flex justify-between text-[#D87535] border border-[#C9BDAA]">
              <span>0x0800_0000 - 0x0807_FFFF</span>
              <span className="font-bold">NOR Flash Code (.text, vector table, constants)</span>
            </div>
          </div>
        </div>
      );

    case 8: // RAM, ROM, Flash, EEPROM
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 8.1: SEMICONDUCTOR MEMORY LATENCY & ENDURANCE LADDER
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-3 rounded bg-[#FAF5EB] border border-[#C9BDAA] space-y-1">
              <div className="text-[#87945B] font-bold">STATIC RAM (6T)</div>
              <div className="text-[#655F55]">Latency: &lt; 10 ns (0 Wait)</div>
              <div className="text-[#655F55]">Endurance: Unlimited</div>
              <div className="text-[#87945B] text-[10px] font-bold">Volatile Scratchpad</div>
            </div>
            <div className="p-3 rounded bg-[#FAF5EB] border border-[#C9BDAA] space-y-1">
              <div className="text-[#D87535] font-bold">NOR FLASH (XIP)</div>
              <div className="text-[#655F55]">Latency: ~20-30 ns (Wait)</div>
              <div className="text-[#655F55]">Endurance: ~100k Cycles</div>
              <div className="text-[#D87535] text-[10px] font-bold">Sector Erase Required</div>
            </div>
            <div className="p-3 rounded bg-[#FAF5EB] border border-[#C9BDAA] space-y-1">
              <div className="text-[#71818B] font-bold">EEPROM (FLOTOX)</div>
              <div className="text-[#655F55]">Latency: ~3 ms (Write)</div>
              <div className="text-[#655F55]">Endurance: 1,000,000+ Cycles</div>
              <div className="text-[#71818B] text-[10px] font-bold">Byte-Level Erasable</div>
            </div>
          </div>
        </div>
      );

    case 9: // Digital and Analog Signals
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 9.1: CMOS 3.3V VOLTAGE SWITCHING THRESHOLDS & NOISE MARGINS
          </div>
          <div className="h-28 bg-[#FAF5EB] rounded border border-[#C9BDAA] p-3 flex flex-col justify-between text-[10px]">
            <div className="flex justify-between text-[#D87535] border-b border-dashed border-[#C9BDAA] pb-0.5">
              <span>3.30V (VDD)</span>
              <span className="font-bold">LOGIC 1 (HIGH)</span>
            </div>
            <div className="flex justify-between text-[#87945B] border-b border-dashed border-[#C9BDAA] pb-0.5">
              <span>2.31V (VIH MIN = 0.7 × VDD)</span>
              <span>MINIMUM INPUT HIGH THRESHOLD</span>
            </div>
            <div className="text-center text-[#B95D32] bg-[#EDE1CE] py-0.5 border-y border-[#C9BDAA] font-bold">
              INDETERMINATE UNCERTAINTY REGION
            </div>
            <div className="flex justify-between text-[#B95D32] border-b border-dashed border-[#C9BDAA] pb-0.5">
              <span>0.99V (VIL MAX = 0.3 × VDD)</span>
              <span>MAXIMUM INPUT LOW THRESHOLD</span>
            </div>
            <div className="flex justify-between text-[#655F55]">
              <span>0.00V (GND)</span>
              <span className="font-bold">LOGIC 0 (LOW)</span>
            </div>
          </div>
        </div>
      );

    case 10: // GPIO
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 10.1: PUSH-PULL VS OPEN-DRAIN OUTPUT TRANSISTOR TOPOLOGY
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 rounded bg-[#FAF5EB] border border-[#C9BDAA] space-y-1.5">
              <div className="text-[#D87535] font-bold">PUSH-PULL STAGE</div>
              <p className="text-[#655F55] text-[10px]">
                High-side P-MOS drives 3.3V; low-side N-MOS sinks to GND. Low impedance, fast rise times.
              </p>
              <div className="p-1 rounded bg-[#EDE1CE] text-[#22201D] text-center text-[10px] border border-[#C9BDAA]">
                Ideal for SPI, UART TX, LED drivers
              </div>
            </div>
            <div className="p-3 rounded bg-[#FAF5EB] border border-[#C9BDAA] space-y-1.5">
              <div className="text-[#B95D32] font-bold">OPEN-DRAIN STAGE</div>
              <p className="text-[#655F55] text-[10px]">
                P-MOS removed. N-MOS pulls to GND; external pull-up resistor pulls to 3.3V.
              </p>
              <div className="p-1 rounded bg-[#EDE1CE] text-[#B95D32] text-center text-[10px] border border-[#C9BDAA]">
                Mandatory for I2C (Wired-AND bus)
              </div>
            </div>
          </div>
        </div>
      );

    case 11: // Timers and Counters
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 11.1: HARDWARE TIMER COUNTER & PWM COMPARATOR CIRCUIT
          </div>
          <div className="p-3 rounded bg-[#FAF5EB] border border-[#C9BDAA] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#22201D] font-bold">TIMx_CLK (84 MHz)</span>
              <span className="text-[#D87535]">Prescaler (PSC = 3) ➜ 21 MHz</span>
            </div>
            <div className="p-2 rounded bg-[#EDE1CE] border border-[#C9BDAA] flex justify-between items-center text-xs font-bold text-[#22201D]">
              <span>Counter (CNT): 0 ➜ 1049</span>
              <span className="text-[#D87535]">Auto-Reload (ARR = 1049)</span>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] flex justify-between items-center text-[11px]">
              <span className="text-[#655F55]">Compare Threshold (CCR1 = 525)</span>
              <span className="text-[#87945B] font-bold">50.0% PWM Duty Cycle</span>
            </div>
          </div>
        </div>
      );

    case 12: // ADC and DAC
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 12.1: 12-BIT SAR ADC BINARY SEARCH RESOLUTION TREE
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] flex justify-between text-[#655F55]">
              <span>Sample & Hold Capacitor</span>
              <span>Vin = 2.100 V (Sampled)</span>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] flex justify-between text-[#22201D]">
              <span>Step 1: Test MSB Bit 11 (1.650 V)</span>
              <span className="font-bold text-[#D87535]">2.10V &gt; 1.65V ➜ Keep Bit 11 = 1</span>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] flex justify-between text-[#22201D]">
              <span>Step 2: Test Bit 10 (2.475 V)</span>
              <span className="font-bold text-[#B95D32]">2.10V &lt; 2.48V ➜ Clear Bit 10 = 0</span>
            </div>
            <div className="p-2 rounded bg-[#FAF5EB] border border-[#87945B]/60 flex justify-between text-[#22201D] bg-[#87945B]/10">
              <span className="font-bold">Final 12-Bit Quantization</span>
              <span className="font-bold text-[#87945B]">Result = 2608 / 4095 (0xA30)</span>
            </div>
          </div>
        </div>
      );

    case 13: // Interrupts
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 13.1: NVIC HARDWARE CONTEXT STACKING SEQUENCE (12 CYCLES)
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center text-[10px]">
            {['R0', 'R1', 'R2', 'R3', 'R12', 'LR', 'PC', 'xPSR'].map((reg) => (
              <div key={reg} className="p-2 rounded bg-[#FAF5EB] border border-[#C9BDAA] text-[#D87535] font-bold">
                {reg}
              </div>
            ))}
          </div>
          <div className="p-2 rounded bg-[#FAF5EB] border border-[#87945B]/50 text-center text-[#87945B] text-[11px] font-bold">
            Hardware automatically pushes 8 registers to SRAM in 12 clock cycles before entering ISR.
          </div>
        </div>
      );

    case 14: // Communication Protocols
      return (
        <div className={`p-5 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3 font-mono text-xs shadow-xs ${className}`}>
          <div className="text-[#22201D] font-bold text-[11px] pb-2 border-b border-[#C9BDAA]">
            FIG 14.1: SERIAL PROTOCOL ELECTRICAL BUS COMPARISON
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA] space-y-1">
              <div className="text-[#D87535] font-bold">UART (2 Wires)</div>
              <div className="text-[#655F55]">TX ➜ RX (Asynchronous)</div>
              <div className="text-[#655F55]">Speed: ~115.2 kbps</div>
              <div className="text-[#D87535] text-[10px] font-bold">Point-to-Point Debug</div>
            </div>
            <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA] space-y-1">
              <div className="text-[#87945B] font-bold">SPI (4 Wires)</div>
              <div className="text-[#655F55]">MOSI, MISO, SCK, CS</div>
              <div className="text-[#655F55]">Speed: 50+ Mbps Full-Duplex</div>
              <div className="text-[#87945B] text-[10px] font-bold">Displays & SD Cards</div>
            </div>
            <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA] space-y-1">
              <div className="text-[#B95D32] font-bold">I2C (2 Wires)</div>
              <div className="text-[#655F55]">SDA, SCL + Pull-ups</div>
              <div className="text-[#655F55]">Speed: 400 kbps (7-bit Addr)</div>
              <div className="text-[#B95D32] text-[10px] font-bold">Multi-Sensor Network</div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

