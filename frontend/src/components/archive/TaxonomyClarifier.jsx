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
      color: '#D87535',
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
      color: '#71818B',
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
      color: '#87945B',
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
      color: '#B95D32',
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
      color: '#22201D',
      description:
        'The software stack, compilers, C/C++ runtime libraries, Hardware Abstraction Layers (HAL), Real-Time Operating Systems (RTOS), and hardware debug probes used to develop and flash firmware.',
      examples: 'GCC / Clang toolchains, STM32CubeIDE + ST-LINK/V2, ESP-IDF + FreeRTOS + OpenOCD, avr-gcc + avrdude, Pico SDK + CMake',
      commonMistake: 'Believing an STM32 can only be programmed with Arduino IDE (in industrial engineering, bare-metal CMSIS or STM32CubeIDE is standard).',
    },
  ];

  return (
    <div className="rounded-2xl border border-[#C9BDAA] bg-[#FAF5EB] shadow-xs overflow-hidden transition-all bg-drafting-grid-subtle">
      {/* Header Banner */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-[#EDE1CE]/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] flex items-center justify-center text-[#D87535]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D87535] font-bold">
                Engineering Fundamental
              </span>
              <Badge variant="cyan">Crucial Taxonomy</Badge>
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#22201D]">
              Architecture vs Family vs Chip vs Board vs Ecosystem
            </h3>
            <p className="text-xs text-[#655F55] hidden sm:block font-sans">
              Understanding the 5 distinct hierarchical layers of embedded systems hardware and firmware.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#655F55]">
          <span>{isOpen ? 'Collapse Guide' : 'Expand Guide'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#D87535]" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expandable Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-[#C9BDAA] space-y-6">
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
                      ? 'bg-[#22201D] text-[#FAF5EB] border-[#22201D] shadow-xs'
                      : 'bg-[#EDE1CE] border-[#C9BDAA] text-[#22201D] hover:bg-[#FAF5EB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4" style={{ color: isActive ? '#D87535' : lvl.color }} />
                    <span className={`text-[10px] font-mono ${isActive ? 'text-[#FAF5EB]/60' : 'text-[#8C8275]'}`}>Level</span>
                  </div>
                  <div className="font-serif text-xs font-bold line-clamp-1">
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
              <div className="rounded-xl border border-[#C9BDAA] bg-[#FAF5EB] p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#EDE1CE] border border-[#C9BDAA]"
                    >
                      <Icon className="w-5 h-5 text-[#D87535]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#22201D]">
                        {current.title}
                      </h4>
                      <div className="text-xs font-mono text-[#D87535] font-semibold">
                        {current.subtitle}
                      </div>
                    </div>
                  </div>
                  <Badge variant="cyan">{current.id.toUpperCase()}</Badge>
                </div>

                <p className="text-sm text-[#22201D] leading-relaxed font-sans">
                  {current.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#C9BDAA]">
                  <div className="p-3.5 rounded-lg bg-[#EDE1CE] border border-[#C9BDAA]">
                    <div className="text-[11px] font-mono text-[#22201D] uppercase tracking-wider mb-1 font-bold">
                      Representative Real-World Examples
                    </div>
                    <p className="text-xs font-mono text-[#655F55]">{current.examples}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#B95D32]/10 border border-[#B95D32]/30">
                    <div className="text-[11px] font-mono text-[#B95D32] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Frequent Engineering Misconception</span>
                    </div>
                    <p className="text-xs text-[#22201D] font-sans">{current.commonMistake}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Concrete End-to-End Walkthrough */}
          <div className="rounded-xl border border-[#C9BDAA] bg-[#EDE1CE] p-4">
            <div className="text-xs font-mono text-[#22201D] uppercase tracking-wider mb-2 font-bold">
              Full Stack Concrete Example: From Architecture down to Firmware
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA]">
                <div className="text-[10px] text-[#8C8275]">1. Architecture</div>
                <div className="font-bold text-[#D87535] mt-0.5">ARMv7E-M</div>
                <div className="text-[10px] text-[#655F55] mt-1">Cortex-M4 ISA + FPU</div>
              </div>
              <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA]">
                <div className="text-[10px] text-[#8C8275]">2. Family</div>
                <div className="font-bold text-[#22201D] mt-0.5">STM32F4</div>
                <div className="text-[10px] text-[#655F55] mt-1">STMicroelectronics line</div>
              </div>
              <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA]">
                <div className="text-[10px] text-[#8C8275]">3. Chip (IC)</div>
                <div className="font-bold text-[#87945B] mt-0.5">STM32F401RET6</div>
                <div className="text-[10px] text-[#655F55] mt-1">512KB Flash, LQFP64</div>
              </div>
              <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA]">
                <div className="text-[10px] text-[#8C8275]">4. Dev Board</div>
                <div className="font-bold text-[#B95D32] mt-0.5">Nucleo-F401RE</div>
                <div className="text-[10px] text-[#655F55] mt-1">PCB + ST-LINK probe</div>
              </div>
              <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA]">
                <div className="text-[10px] text-[#8C8275]">5. Ecosystem</div>
                <div className="font-bold text-[#71818B] mt-0.5">STM32CubeIDE</div>
                <div className="text-[10px] text-[#655F55] mt-1">arm-none-eabi-gcc + HAL</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

