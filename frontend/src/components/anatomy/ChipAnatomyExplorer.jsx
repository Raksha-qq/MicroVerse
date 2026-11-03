import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Layers,
  ArrowRight,
  Info,
  Zap,
  Activity,
  HardDrive,
  Database,
  Radio,
  Sliders,
  Compass,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const CHIP_COMPONENTS = [
  {
    id: 'cpu',
    name: 'Central Processing Unit (CPU Core)',
    badge: 'EXECUTION ENGINE',
    category: 'Core Processor',
    icon: Cpu,
    color: '#55C7FF',
    discoverChapter: 'cpu-and-alu',
    discoverChapterNum: 4,
    summary:
      'The central supervisory engine that coordinates instructions. In modern ARM Cortex-M processors, it features a 3-stage or 6-stage pipeline executing 32-bit Thumb-2 instructions.',
    interactions: [
      { target: 'Flash Memory', desc: 'Fetches opcodes continuously over the high-speed 32-bit I-Code bus.' },
      { target: 'Internal Buses', desc: 'Drives master read/write transactions across the AHB bus matrix.' },
      { target: 'Registers', desc: 'Directly reads and updates operands with zero wait-state cycle time.' },
      { target: 'NVIC / Interrupts', desc: 'Receives IRQ lines and preempts thread execution within 12 clock cycles.' },
    ],
    example: {
      title: 'Thumb-2 Instruction Execution Pipeline',
      code: `// Fetch-Decode-Execute in Hardware
LDR  R0, =0x40020014 // Load GPIO ODR address
LDR  R1, [R0]        // Read current output state
ORR  R1, R1, #0x20   // Set bit 5 (PA5 pin HIGH)
STR  R1, [R0]        // Write back to hardware register`,
    },
    subCircuits: [
      { name: 'Instruction Decoder', detail: 'Decodes 16-bit and 32-bit Thumb-2 opcodes into micro-architectural control words.' },
      { name: 'Branch Predictor', detail: 'Minimizes branch latency penalties on conditional jumps.' },
      { name: 'Control Logic Unit', detail: 'Synchronizes clock pulses and pipeline stall states.' },
    ],
  },
  {
    id: 'alu',
    name: 'Arithmetic Logic Unit (ALU) & FPU',
    badge: '32-BIT MATH ENGINE',
    category: 'Core Processor',
    icon: Zap,
    color: '#38BDF8',
    discoverChapter: 'cpu-and-alu',
    discoverChapterNum: 4,
    summary:
      'The combinational mathematical calculator of the chip, executing integer arithmetic, bitwise logic, barrel shifts, and single-precision IEEE 754 floating-point operations.',
    interactions: [
      { target: 'Registers', desc: 'Accepts two 32-bit operands directly from the register file and writes back results.' },
      { target: 'Status Register (xPSR)', desc: 'Sets condition flags (N, Z, C, V) to guide conditional branches.' },
      { target: 'CPU Core', desc: 'Executes mathematical instructions requested by the instruction decoder.' },
    ],
    example: {
      title: 'Condition Flag Evaluation',
      code: `// ARM Assembly subtraction setting flags
SUBS R0, R1, R2   // R0 = R1 - R2; Updates NZCV flags
BEQ  target_label // Branches if Zero Flag (Z == 1)`,
    },
    subCircuits: [
      { name: '32-Bit Full Adder', detail: 'High-speed carry-lookahead adder for single-cycle additions and subtractions.' },
      { name: '32-Bit Barrel Shifter', detail: 'Rotates and shifts binary words by any offset in a single clock cycle.' },
      { name: 'IEEE 754 FPU', detail: 'Hardware single-precision floating-point multiplier and accumulator.' },
    ],
  },
  {
    id: 'registers',
    name: 'Core Register File (R0 - R15)',
    badge: 'ZERO-LATENCY STORAGE',
    category: 'Core Processor',
    icon: Sliders,
    color: '#818CF8',
    discoverChapter: 'registers',
    discoverChapterNum: 5,
    summary:
      'Sixteen 32-bit ultra-fast flip-flop storage slots located directly on the processor datapath, accessible within a single sub-nanosecond clock phase without bus latency.',
    interactions: [
      { target: 'ALU', desc: 'Supplies operands A and B simultaneously; receives computation results.' },
      { target: 'Program Counter (PC)', desc: 'R15 holds the address of the next instruction word to fetch.' },
      { target: 'Stack Pointer (SP)', desc: 'R13 points to the current active stack frame in volatile SRAM.' },
    ],
    example: {
      title: 'AAPCS Function Calling Convention',
      code: `// R0-R3 pass arguments; R0 returns scalar result
int calculate_torque(int current, int constant) {
    // Compiled: MUL R0, R0, R1; BX LR
    return current * constant;
}`,
    },
    subCircuits: [
      { name: 'General Purpose (R0-R12)', detail: 'Fast working scratchpads for mathematical variables and pointers.' },
      { name: 'Stack Pointers (MSP & PSP)', detail: 'Banked stack pointers isolating OS kernel from user application threads.' },
      { name: 'Link Register (R14 / LR)', detail: 'Stores function return addresses and EXC_RETURN interrupt codes.' },
    ],
  },
  {
    id: 'ram',
    name: 'Static RAM (SRAM Data Memory)',
    badge: 'ZERO-WAIT VOLATILE',
    category: 'Memory Subsystem',
    icon: Database,
    color: '#34D399',
    discoverChapter: 'ram-rom-flash-eeprom',
    discoverChapterNum: 8,
    summary:
      'High-speed volatile memory constructed from 6-transistor (6T) CMOS bistable latches. Provides single-cycle read and write access for program variables, heaps, and call stacks.',
    interactions: [
      { target: 'CPU Core', desc: 'Serves thread stack frames and local variables via the System Bus.' },
      { target: 'DMA Controllers', desc: 'Permits autonomous bulk data transfers from ADC and communication streams.' },
      { target: 'Internal Buses', desc: 'Interconnected via multi-layer AHB matrix to prevent CPU/DMA stalls.' },
    ],
    example: {
      title: 'SRAM Variable Allocation & Pointer Access',
      code: `// Placed in SRAM section (.bss / .data)
static uint8_t rx_buffer[512]; // Zero-wait state access
volatile int sensor_readings[10];`,
    },
    subCircuits: [
      { name: '6T CMOS Memory Array', detail: 'Cross-coupled inverter latch cells requiring zero capacitive refresh cycles.' },
      { name: 'Row & Column Decoders', detail: 'Rapid byte and 32-bit word address line activation.' },
      { name: 'Sense Amplifiers', detail: 'Detects microscopic bitline differential voltages for fast single-cycle reads.' },
    ],
  },
  {
    id: 'flash',
    name: 'Non-Volatile NOR Flash Memory',
    badge: 'PROGRAM STORAGE',
    category: 'Memory Subsystem',
    icon: HardDrive,
    color: '#F472B6',
    discoverChapter: 'ram-rom-flash-eeprom',
    discoverChapterNum: 8,
    summary:
      'Non-volatile semiconductor storage holding compiled machine instructions, interrupt vector tables, and constant lookup tables. Retains code for decades without electrical power.',
    interactions: [
      { target: 'CPU Core', desc: 'Delivers Thumb-2 instruction stream over dedicated I-Code bus.' },
      { target: 'Memory Accelerator', desc: 'Integrates prefetch buffers and cache to eliminate wait-state stalls at high clock speeds.' },
      { target: 'Reset Circuit', desc: 'Loads initial Stack Pointer from address 0x08000000 at power-on.' },
    ],
    example: {
      title: 'Vector Table in Flash Memory',
      code: `// Address 0x0800_0000: Initial Stack Pointer
// Address 0x0800_0004: Reset_Handler entry point
__attribute__((section(".vectors")))
const uint32_t vector_table[] = {
    (uint32_t)&_estack,
    (uint32_t)&Reset_Handler,
};`,
    },
    subCircuits: [
      { name: 'Floating-Gate Array', detail: 'Stores non-volatile charge traps representing programmed bits.' },
      { name: 'Charge Pump Circuit', detail: 'Generates high programming and sector erase voltages on-die.' },
      { name: 'ART Cache Accelerator', detail: 'Prefetch buffer providing 0-wait-state equivalent execution at 84+ MHz.' },
    ],
  },
  {
    id: 'gpio',
    name: 'General-Purpose I/O (GPIO Matrix)',
    badge: 'PHYSICAL INTERFACE',
    category: 'Peripherals',
    icon: Radio,
    color: '#FBBF24',
    discoverChapter: 'gpio',
    discoverChapterNum: 10,
    summary:
      'Physical silicon pins interface directly with external circuits. Each pin is software-configurable as Push-Pull, Open-Drain, Input with pull-up/pull-down, or Alternate Function.',
    interactions: [
      { target: 'External Pins', desc: 'Directly drives 3.3V or sinks up to 25 mA current to switch external circuits.' },
      { target: 'APB Bus', desc: 'Receives memory-mapped control register commands (MODER, ODR, BSRR).' },
      { target: 'NVIC / EXTI', desc: 'Routes pin voltage edges to External Interrupt lines.' },
    ],
    example: {
      title: 'Atomic BSRR Pin Manipulation',
      code: `// Atomic bit manipulation without read-modify-write race conditions
GPIOA->BSRR = (1 << 5);        // Set Pin 5 HIGH
GPIOA->BSRR = (1 << (5 + 16)); // Clear Pin 5 LOW`,
    },
    subCircuits: [
      { name: 'Push-Pull Transistor Stage', detail: 'Complementary P-MOS and N-MOS transistors driving rail-to-rail voltages.' },
      { name: 'Input Schmitt Trigger', detail: 'Provides hysteresis to reject electrical noise on digital input lines.' },
      { name: 'ESD Protection Diodes', detail: 'Clamps over-voltage static discharges to power and ground rails.' },
    ],
  },
  {
    id: 'timers',
    name: 'Hardware Timers & PWM Modules',
    badge: 'TIMEKEEPING ENGINE',
    category: 'Peripherals',
    icon: Activity,
    color: '#A78BFA',
    discoverChapter: 'timers-and-counters',
    discoverChapterNum: 11,
    summary:
      'Autonomous counter blocks that tick independently of the CPU core. Features prescalers, auto-reload registers, input capture for frequency measurement, and PWM motor drive.',
    interactions: [
      { target: 'GPIO Pins', desc: 'Modulates digital pins at kilohertz frequencies to generate PWM waveforms.' },
      { target: 'NVIC', desc: 'Fires periodic timer update interrupts for RTOS schedulers and control loops.' },
      { target: 'ADC', desc: 'Triggers synchronized analog conversions without CPU intervention.' },
    ],
    example: {
      title: 'Hardware Timer PWM Generation',
      code: `// 20 kHz PWM for motor driver
TIM1->PSC = 3;    // Prescaler
TIM1->ARR = 1049; // Auto-reload period
TIM1->CCR1 = 525; // 50% Duty cycle`,
    },
    subCircuits: [
      { name: '16/32-Bit Up/Down Counter', detail: 'Increments or decrements synchronously on every prescaled clock pulse.' },
      { name: 'Capture/Compare Channels', detail: 'Compares counter value against register threshold to flip output pins.' },
      { name: 'Dead-Time Insertion Unit', detail: 'Guarantees non-overlapping switching intervals for motor H-Bridges.' },
    ],
  },
  {
    id: 'adc',
    name: 'Successive Approximation ADC',
    badge: 'ANALOG TRANSLATOR',
    category: 'Peripherals',
    icon: Compass,
    color: '#10B981',
    discoverChapter: 'adc-and-dac',
    discoverChapterNum: 12,
    summary:
      'Translates real-world continuous analog voltages into 12-bit digital numbers (0 to 4095). Features high conversion speeds (1 to 5 Msps) and multi-channel input multiplexing.',
    interactions: [
      { target: 'Analog Input Pins', desc: 'Samples voltage onto internal sample-and-hold capacitors.' },
      { target: 'DMA Controller', desc: 'Streams completed conversions directly into SRAM without CPU polling.' },
      { target: 'Internal Bus', desc: 'Stores completed 12-bit conversion results into the ADC_DR register.' },
    ],
    example: {
      title: '12-bit ADC Voltage Conversion',
      code: `// Read analog sensor and convert to millivolts
uint16_t raw = ADC1->DR; // 0 to 4095
uint32_t mv = (raw * 3300UL) / 4095UL;`,
    },
    subCircuits: [
      { name: 'Sample & Hold Capacitor', detail: 'Captures and stores instantaneous input voltage during sampling.' },
      { name: 'Internal R-2R Ladder DAC', detail: 'Generates binary search comparison voltages for the analog comparator.' },
      { name: 'High-Speed Comparator', detail: 'Determines whether Vin is greater than the internal DAC threshold.' },
    ],
  },
  {
    id: 'comms',
    name: 'Serial Interfaces: UART, SPI & I2C',
    badge: 'COMMUNICATION HUB',
    category: 'Peripherals',
    icon: Radio,
    color: '#F97316',
    discoverChapter: 'communication-protocols-uart-spi-i2c',
    discoverChapterNum: 14,
    summary:
      'Dedicated hardware transceivers executing asynchronous UART, high-speed 50+ Mbps synchronous SPI, and 2-wire open-drain I2C serial communications.',
    interactions: [
      { target: 'External Transceivers', desc: 'Exchanges serial data bits over TX/RX, MOSI/MISO, or SDA/SCL lines.' },
      { target: 'DMA Controller', desc: 'Streams packets to/from SRAM buffers with zero CPU overhead.' },
      { target: 'NVIC', desc: 'Asserts interrupts upon character reception (RXNE) or buffer empty (TXE).' },
    ],
    example: {
      title: 'Hardware Serial Byte Transmission',
      code: `// Send character via hardware shift register
while (!(USART2->SR & USART_SR_TXE));
USART2->DR = 'M'; // Transmit ASCII 'M'`,
    },
    subCircuits: [
      { name: 'Baud Rate Generator', detail: 'Fractional clock divider for precision asynchronous communication speeds.' },
      { name: 'Shift Register Engine', detail: 'Converts parallel 8-bit bytes into sequential serial bitstreams.' },
      { name: 'FIFO Buffers', detail: 'Holds incoming and outgoing bytes to prevent buffer overrun errors.' },
    ],
  },
  {
    id: 'buses',
    name: 'Multi-Layer AHB/APB Bus Matrix',
    badge: 'SILICON HIGHWAY',
    category: 'Interconnects',
    icon: Layers,
    color: '#A5E3FF',
    discoverChapter: 'memory-organization',
    discoverChapterNum: 7,
    summary:
      'The multi-channel crossbar interconnect linking master cores (CPU, DMA) to slave memories (Flash, SRAM) and peripheral controllers, enabling simultaneous parallel transactions.',
    interactions: [
      { target: 'CPU Core', desc: 'Routes instruction fetches over I-Code and data loads over D-Code/System buses.' },
      { target: 'DMA Controllers', desc: 'Grants concurrent access to memories without blocking CPU execution.' },
      { target: 'Peripherals', desc: 'Translates high-speed AHB transactions to APB peripheral buses via bridges.' },
    ],
    example: {
      title: 'Bus Concurrent Data Routing',
      code: `// DMA streams ADC to SRAM on Layer 1
// CPU executes math from Flash on Layer 2
// Simultaneous execution with ZERO bus stalls!`,
    },
    subCircuits: [
      { name: 'AHB Multi-Layer Matrix', detail: 'High-bandwidth crossbar switch supporting concurrent master-slave routing.' },
      { name: 'APB Bus Bridges', detail: 'Down-scales bus frequency for low-power peripheral interfaces.' },
      { name: 'Arbiter Logic', detail: 'Resolves priority contention when two masters target the same slave bank.' },
    ],
  },
];

export function ChipAnatomyExplorer({ className = '' }) {
  const [selectedId, setSelectedId] = useState('cpu');
  const [viewMode, setViewMode] = useState('normal'); // 'normal' | 'focused' | 'exploded'

  const selected =
    CHIP_COMPONENTS.find((c) => c.id === selectedId) || CHIP_COMPONENTS[0];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Distinction Header Callout */}
      <div className="p-4 rounded-xl bg-[#111E30]/70 border border-[#55C7FF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#0B1220] border border-[#55C7FF]/40 flex items-center justify-center text-[#55C7FF] shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono font-bold text-[#55C7FF] uppercase tracking-wider">
              Architectural Clarity Note:
            </span>{' '}
            <span className="text-[#8FA6BC]">
              This is a <strong>Conceptual Functional Architecture Model</strong> illustrating logical signal and bus interconnects. Real physical silicon photolithography distributes transistors across multi-layer metallization (M1–M8) to optimize parasitics, heat dissipation, and clock tree skew.
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#0B1220] p-1 rounded-lg border border-[#192B40] shrink-0">
          <button
            onClick={() => setViewMode('normal')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${viewMode === 'normal'
                ? 'bg-[#55C7FF] text-[#0B1220] shadow-[0_0_10px_rgba(85,199,255,0.4)]'
                : 'text-[#8FA6BC] hover:text-[#EAF5FF]'
              }`}
          >
            NORMAL
          </button>
          <button
            onClick={() => setViewMode('focused')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${viewMode === 'focused'
                ? 'bg-[#55C7FF] text-[#0B1220] shadow-[0_0_10px_rgba(85,199,255,0.4)]'
                : 'text-[#8FA6BC] hover:text-[#EAF5FF]'
              }`}
          >
            FOCUSED
          </button>
          <button
            onClick={() => setViewMode('exploded')}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${viewMode === 'exploded'
                ? 'bg-[#55C7FF] text-[#0B1220] shadow-[0_0_10px_rgba(85,199,255,0.4)]'
                : 'text-[#8FA6BC] hover:text-[#EAF5FF]'
              }`}
          >
            EXPLODED
          </button>
        </div>
      </div>

      {/* Main Diagram & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT / CENTER: THE INTERACTIVE ARCHITECTURE CANVAS (7 cols)    */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#080D17] border border-[#192B40] p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-[#8FA6BC] mb-4 pb-2 border-b border-[#192B40]/80">
              <span className="flex items-center gap-1.5 text-[#55C7FF]">
                <Cpu className="w-3.5 h-3.5" />
                MONOLITHIC SILICON DIE: 32-BIT RISC TOPOLOGY
              </span>
              <span className="uppercase text-[10px] tracking-wider text-[#8FA6BC]">
                CLICK ANY BLOCK TO INSPECT
              </span>
            </div>

            {/* VIEW 1: NORMAL INTEGRATED ARCHITECTURE */}
            {viewMode === 'normal' && (
              <div className="space-y-4">
                {/* Processing Subsystem */}
                <div className="p-3.5 rounded-xl bg-[#111E30]/70 border border-[#55C7FF]/30 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#55C7FF] font-bold">
                    PROCESSING CORE & REGISTER CLUSTER
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['cpu', 'alu', 'registers'].map((id) => {
                      const item = CHIP_COMPONENTS.find((c) => c.id === id);
                      const isSelected = selectedId === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedId(id)}
                          className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${isSelected
                              ? 'bg-[#55C7FF]/20 border-[#55C7FF] shadow-[0_0_15px_rgba(85,199,255,0.4)] text-[#EAF5FF]'
                              : 'bg-[#0B1220] border-[#192B40] text-[#8FA6BC] hover:border-[#55C7FF]/40 hover:text-[#EAF5FF]'
                            }`}
                        >
                          <div className="text-[9px] font-mono uppercase text-[#55C7FF]">
                            {item.badge}
                          </div>
                          <div className="font-heading font-bold text-xs mt-0.5 truncate">
                            {item.name.split(' (')[0]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Central Bus Matrix Highway */}
                <button
                  onClick={() => setSelectedId('buses')}
                  className={`w-full py-2.5 px-4 rounded-xl border text-center transition-all cursor-pointer font-mono text-xs flex items-center justify-between ${selectedId === 'buses'
                      ? 'bg-[#55C7FF]/20 border-[#55C7FF] text-[#55C7FF] shadow-[0_0_18px_rgba(85,199,255,0.4)] font-bold'
                      : 'bg-[#111E30]/90 border-[#192B40] text-[#8FA6BC] hover:border-[#55C7FF]/50 hover:text-[#EAF5FF]'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#55C7FF] animate-ping" />
                    MULTI-LAYER AHB / APB CROSSBAR BUS MATRIX
                  </span>
                  <span className="text-[10px] text-[#55C7FF] uppercase">32-Bit Concurrent Highway</span>
                </button>

                {/* Memory Subsystem */}
                <div className="p-3.5 rounded-xl bg-[#111E30]/70 border border-[#34D399]/30 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#34D399] font-bold">
                    ON-DIE EMBEDDED MEMORY SUBSYSTEM
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {['ram', 'flash'].map((id) => {
                      const item = CHIP_COMPONENTS.find((c) => c.id === id);
                      const isSelected = selectedId === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedId(id)}
                          className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${isSelected
                              ? 'bg-[#34D399]/20 border-[#34D399] shadow-[0_0_15px_rgba(52,211,153,0.4)] text-[#EAF5FF]'
                              : 'bg-[#0B1220] border-[#192B40] text-[#8FA6BC] hover:border-[#34D399]/40 hover:text-[#EAF5FF]'
                            }`}
                        >
                          <div className="text-[9px] font-mono uppercase text-[#34D399]">
                            {item.badge}
                          </div>
                          <div className="font-heading font-bold text-xs mt-0.5 truncate">
                            {item.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Peripheral Subsystem */}
                <div className="p-3.5 rounded-xl bg-[#111E30]/70 border border-[#FBBF24]/30 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#FBBF24] font-bold">
                    PERIPHERAL MATRIX & EXTERNAL I/O
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['gpio', 'timers', 'adc', 'comms'].map((id) => {
                      const item = CHIP_COMPONENTS.find((c) => c.id === id);
                      const isSelected = selectedId === id;
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedId(id)}
                          className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${isSelected
                              ? 'bg-[#FBBF24]/20 border-[#FBBF24] shadow-[0_0_15px_rgba(251,191,36,0.4)] text-[#EAF5FF]'
                              : 'bg-[#0B1220] border-[#192B40] text-[#8FA6BC] hover:border-[#FBBF24]/40 hover:text-[#EAF5FF]'
                            }`}
                        >
                          <div className="text-[9px] font-mono uppercase text-[#FBBF24]">
                            {item.badge}
                          </div>
                          <div className="font-heading font-bold text-xs mt-0.5 truncate">
                            {item.name.split(' (')[0]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: COMPONENT-FOCUSED VIEW */}
            {viewMode === 'focused' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#111E30] border border-[#55C7FF] shadow-[0_0_20px_rgba(85,199,255,0.2)]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#192B40]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#0B1220] border border-[#55C7FF]/40 flex items-center justify-center text-[#55C7FF]">
                        <selected.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#55C7FF]">
                          FOCUSED SUB-CIRCUIT SCHEMATIC
                        </div>
                        <h4 className="font-heading font-bold text-sm text-[#EAF5FF]">
                          {selected.name}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#8FA6BC]">
                      CATEGORY: <strong className="text-[#55C7FF]">{selected.category}</strong>
                    </span>
                  </div>

                  {/* Internal Sub-Circuits Grid */}
                  <div className="pt-4 space-y-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#8FA6BC]">
                      Internal Silicon Sub-Circuits & Execution Blocks:
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {selected.subCircuits.map((sub, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#0B1220] border border-[#192B40] flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#55C7FF]/10 border border-[#55C7FF]/40 flex items-center justify-center font-mono text-[10px] text-[#55C7FF] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-heading font-bold text-xs text-[#EAF5FF]">
                              {sub.name}
                            </div>
                            <p className="text-[11px] text-[#8FA6BC] mt-0.5">
                              {sub.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick switcher tabs */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {CHIP_COMPONENTS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${selectedId === c.id
                          ? 'bg-[#55C7FF] text-[#0B1220] font-bold'
                          : 'bg-[#111E30] text-[#8FA6BC] hover:text-[#EAF5FF]'
                        }`}
                    >
                      {c.name.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: EXPLODED CONCEPTUAL HIERARCHY */}
            {viewMode === 'exploded' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-[10px] uppercase tracking-wider text-[#8FA6BC] mb-2">
                  Layered Silicon Hierarchy (Physical Pins ➜ Core CPU)
                </div>

                {[
                  {
                    layer: 'LAYER 4: PROCESSING & INTERNAL STORAGE',
                    items: ['CPU Core', 'ALU & FPU', 'Registers', 'SRAM (Data)', 'NOR Flash (Code)'],
                    color: 'border-[#55C7FF] bg-[#55C7FF]/10 text-[#55C7FF]',
                  },
                  {
                    layer: 'LAYER 3: CROSSBAR BUS MATRIX',
                    items: ['AHB Multi-Layer Master Matrix', 'APB1 / APB2 Peripheral Bridges', 'DMA Streams'],
                    color: 'border-emerald-400 bg-emerald-500/10 text-emerald-400',
                  },
                  {
                    layer: 'LAYER 2: PERIPHERAL CONTROL ENGINES',
                    items: ['GPIO Registers', 'Hardware Timers (TIM1-TIM8)', 'SAR ADC & Comparator', 'USART / SPI / I2C / CAN'],
                    color: 'border-amber-400 bg-amber-500/10 text-amber-400',
                  },
                  {
                    layer: 'LAYER 1: PHYSICAL LEADFRAME & PINS',
                    items: ['LQFP64 / QFN56 Silicon Pads', 'ESD Protection Diodes', '3.3V VDD / VSS Rails', 'Quartz Crystal Resonator Pins'],
                    color: 'border-purple-400 bg-purple-500/10 text-purple-400',
                  },
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border ${st.color} space-y-1.5 transition-all hover:scale-[1.01]`}
                  >
                    <div className="text-[10px] font-bold tracking-widest">{st.layer}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {st.items.map((it, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#0B1220]/80 border border-current text-[11px] text-[#EAF5FF]"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT: COMPONENT TECHNICAL INSPECTION DRAWER (5 cols)          */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-[#0B1220] border border-[#192B40] p-5 sm:p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#192B40]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#55C7FF]">
                    {selected.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#55C7FF]/10 text-[#55C7FF] border border-[#55C7FF]/30">
                    {selected.badge}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-[#EAF5FF] mt-1">
                  {selected.name}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#111E30] border border-[#55C7FF]/40 flex items-center justify-center text-[#55C7FF] shrink-0 shadow-[0_0_15px_rgba(85,199,255,0.2)]">
                <selected.icon className="w-5 h-5" />
              </div>
            </div>

            {/* Purpose & Description */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#8FA6BC]">
                Formal Silicon Purpose
              </div>
              <p className="text-xs text-[#EAF5FF] leading-relaxed">
                {selected.summary}
              </p>
            </div>

            {/* Component Interactions */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#8FA6BC]">
                How It Interacts with Other Subsystems:
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {selected.interactions.map((inter, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#080D17] border border-[#192B40] space-y-0.5"
                  >
                    <div className="text-[11px] font-bold text-[#55C7FF] flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-[#55C7FF]" />
                      {inter.target}
                    </div>
                    <p className="text-[11px] text-[#8FA6BC] font-sans">
                      {inter.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Code Example */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#8FA6BC] flex items-center justify-between">
                <span>Practical Bare-Metal Implementation</span>
                <span className="text-[#55C7FF]">CORTEX-M MMIO</span>
              </div>
              <div className="p-3 rounded-lg bg-[#080D17] border border-[#192B40] font-mono text-[11px] text-[#A5E3FF] overflow-x-auto leading-relaxed">
                <div className="text-[#8FA6BC] text-[10px] mb-1 font-bold">
                  // {selected.example.title}
                </div>
                <pre>{selected.example.code}</pre>
              </div>
            </div>

            {/* Link to Discover Syllabus Lesson */}
            <Link
              to={`/discover?chapter=${selected.discoverChapter}`}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#111E30] hover:bg-[#55C7FF] hover:text-[#0B1220] border border-[#55C7FF]/40 text-[#55C7FF] font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(85,199,255,0.15)] group"
            >
              <span>Explore Chapter {selected.discoverChapterNum} in Discover Syllabus</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

