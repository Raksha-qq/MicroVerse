import React, { useState } from 'react';
import { Layers, HelpCircle, ChevronDown, ChevronUp, Cpu, HardDrive, Layout, Terminal } from 'lucide-react';
import { Badge } from '../common/Badge';

export function TaxonomyClarifier() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('architecture');

  const levels = [
    {
      id: 'architecture',
      title: '1. Processor Architecture',
      subtitle: 'Instruction Set & Execution Core',
      icon: Cpu,
      color: '#55C7FF',
      description:
        'The conceptual instruction set architecture (ISA), register model, memory addressing mode, and execution pipeline defined by computer architects. It specifies the assembly instructions the CPU understands.',
      examples: 'ARMv7E-M (Cortex-M4), AVR 8-bit RISC, Xtensa LX7, RISC-V RV32IMC, Intel MCS-51, MIPS32',
      commonMistake: 'Saying "I am programming an STM32 architecture" (STM32 is a family; the architecture is ARM Cortex-M).',
    },
    {
      id: 'family',
      title: '2. Microcontroller Family',
      subtitle: 'Manufacturer Product Series',
      icon: Layers,
      color: '#A5E3FF',
      description:
        'A proprietary brand and product line engineered by a semiconductor manufacturer that shares common silicon peripherals, bus interconnects, and pin conventions across various memory and pin configurations.',
      examples: 'STM32 (STMicroelectronics), ESP32 (Espressif), AVR / ATmega (Microchip), PIC18 / PIC32 (Microchip), RP2040 (Raspberry Pi)',
      commonMistake: 'Treating ESP32 as a single chip with fixed specs (the ESP32 family includes dual-core LX6, single-core RISC-V C3, and dual-core LX7 S3).',
    },
    {
      id: 'chip',
      title: '3. Individual Chip (Silicon IC)',
      subtitle: 'Physical Silicon Part Number',
      icon: HardDrive,
      color: '#10B981',
      description:
        'The exact fabricated monolithic silicon integrated circuit with specific Flash ROM, SRAM, clock oscillator, peripheral instances, package type (QFP, QFN, DIP), and errata sheet.',
      examples: 'STM32F401RET6 (LQFP64, 512KB Flash), ATmega328P-PU (DIP28, 32KB Flash), ESP32-WROOM-32E, RP2040 (QFN56)',
      commonMistake: 'Assuming every ATmega has 32KB flash (ATmega2560 has 256KB; ATtiny85 has 8KB).',
    },
    {
      id: 'board',
      title: '4. Development Board',
      subtitle: 'PCB Carrier & Prototyping Platform',
      icon: Layout,
      color: '#FBBF24',
      description:
        'A printed circuit board carrier that mounts the silicon chip and supplies auxiliary infrastructure: 3.3V/5V LDO regulators, crystal oscillators, USB-to-UART bridge chips, reset buttons, and breadboard-friendly pin headers.',
      examples: 'Arduino Uno Rev3 (carries ATmega328P), ST Nucleo-F401RE (carries STM32F401RET6), Raspberry Pi Pico (carries RP2040), NodeMCU (carries ESP8266 or ESP32)',
      commonMistake: 'Referring to "an Arduino" as the microcontroller (Arduino Uno is a board; the MCU is the Microchip ATmega328P).',
    },
    {
      id: 'ecosystem',
      title: '5. Programming Ecosystem',
      subtitle: 'Toolchains, Compilers & Debuggers',
      icon: Terminal,
      color: '#EC4899',
      description:
        'The software stack, compilers, C/C++ runtime libraries, Hardware Abstraction Layers (HAL), Real-Time Operating Systems (RTOS), and hardware debug probes used to develop and flash firmware.',
      examples: 'GCC / Clang toolchains, STM32CubeIDE + ST-LINK/V2, ESP-IDF + FreeRTOS + OpenOCD, avr-gcc + avrdude, Pico SDK + CMake',
      commonMistake: 'Believing an STM32 can only be programmed with Arduino IDE (in industrial engineering, bare-metal CMSIS or STM32CubeIDE is standard).',
    },
  ];

  return (
    <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/60 backdrop-blur-sm overflow-hidden transition-all">
      {/* Header Banner */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-[#192B40]/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#55C7FF]/10 border border-[#55C7FF]/30 flex items-center justify-center text-[#55C7FF]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#55C7FF]">
                Engineering Fundamental
              </span>
              <Badge variant="cyan">Crucial Taxonomy</Badge>
            </div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-[#EAF5FF]">
              Architecture vs Family vs Chip vs Board vs Ecosystem
            </h3>
            <p className="text-xs text-[#8FA6BC] hidden sm:block">
              Understanding the 5 distinct hierarchical layers of embedded systems hardware and firmware.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#8FA6BC]">
          <span>{isOpen ? 'Collapse Guide' : 'Expand Guide'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#55C7FF]" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expandable Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-[#192B40] space-y-6">
          {/* Level Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {levels.map((lvl) => {
              const Icon = lvl.icon;
              const isActive = activeTab === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setActiveTab(lvl.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#192B40] border-[#55C7FF] shadow-[0_0_15px_rgba(85,199,255,0.2)]'
                      : 'bg-[#0B1220]/70 border-[#192B40] hover:border-[#8FA6BC]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4" style={{ color: lvl.color }} />
                    <span className="text-[10px] font-mono text-[#8FA6BC]">Level</span>
                  </div>
                  <div className="font-heading text-xs font-bold text-[#EAF5FF] line-clamp-1">
                    {lvl.title.split('. ')[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Level Detail Panel */}
          {(() => {
            const current = levels.find((l) => l.id === activeTab);
            const Icon = current.icon;
            return (
              <div className="rounded-xl border border-[#192B40] bg-[#0B1220]/90 p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${current.color}15`, border: `1px solid ${current.color}40` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: current.color }} />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-bold text-[#EAF5FF]">
                        {current.title}
                      </h4>
                      <div className="text-xs font-mono" style={{ color: current.color }}>
                        {current.subtitle}
                      </div>
                    </div>
                  </div>
                  <Badge variant="cyan">{current.id.toUpperCase()}</Badge>
                </div>

                <p className="text-sm text-[#EAF5FF] leading-relaxed">
                  {current.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#192B40]">
                  <div className="p-3 rounded-lg bg-[#111E30]/70 border border-[#192B40]">
                    <div className="text-[11px] font-mono text-[#55C7FF] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span>Representative Real-World Examples</span>
                    </div>
                    <p className="text-xs font-mono text-[#8FA6BC]">{current.examples}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F87171]/10 border border-[#F87171]/25">
                    <div className="text-[11px] font-mono text-[#F87171] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Frequent Engineering Misconception</span>
                    </div>
                    <p className="text-xs text-[#EAF5FF]">{current.commonMistake}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Concrete End-to-End Walkthrough */}
          <div className="rounded-xl border border-[#192B40] bg-[#111E30]/40 p-4">
            <div className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-2 font-semibold">
              Full Stack Concrete Example: From Architecture down to Firmware
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0B1220] border border-[#192B40]">
                <div className="text-[10px] text-[#8FA6BC]">1. Architecture</div>
                <div className="font-bold text-[#55C7FF] mt-0.5">ARMv7E-M</div>
                <div className="text-[10px] text-[#8FA6BC] mt-1">Cortex-M4 ISA + FPU</div>
              </div>
              <div className="p-2.5 rounded bg-[#0B1220] border border-[#192B40]">
                <div className="text-[10px] text-[#8FA6BC]">2. Family</div>
                <div className="font-bold text-[#A5E3FF] mt-0.5">STM32F4</div>
                <div className="text-[10px] text-[#8FA6BC] mt-1">STMicroelectronics line</div>
              </div>
              <div className="p-2.5 rounded bg-[#0B1220] border border-[#192B40]">
                <div className="text-[10px] text-[#8FA6BC]">3. Chip (IC)</div>
                <div className="font-bold text-[#10B981] mt-0.5">STM32F401RET6</div>
                <div className="text-[10px] text-[#8FA6BC] mt-1">512KB Flash, LQFP64</div>
              </div>
              <div className="p-2.5 rounded bg-[#0B1220] border border-[#192B40]">
                <div className="text-[10px] text-[#8FA6BC]">4. Dev Board</div>
                <div className="font-bold text-[#FBBF24] mt-0.5">Nucleo-F401RE</div>
                <div className="text-[10px] text-[#8FA6BC] mt-1">PCB + ST-LINK probe</div>
              </div>
              <div className="p-2.5 rounded bg-[#0B1220] border border-[#192B40]">
                <div className="text-[10px] text-[#8FA6BC]">5. Ecosystem</div>
                <div className="font-bold text-[#EC4899] mt-0.5">STM32CubeIDE</div>
                <div className="text-[10px] text-[#8FA6BC] mt-1">arm-none-eabi-gcc + HAL</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

