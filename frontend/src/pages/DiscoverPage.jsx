import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
  Search,
  Sliders,
  ExternalLink,
  Code2,
  Terminal,
  Layers,
  Sparkles,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { lessonService } from '../services/lessonService';
import { progressService } from '../services/progressService';
import { useAuth } from '../context/AuthContext';
import { ChapterDiagram } from '../components/discover/ChapterDiagrams';
import { ChapterQuiz } from '../components/discover/ChapterQuiz';

// 14 Core Curriculum Fallback Definitions (Guarantees zero-blank screen & offline resilience)
const DISCOVER_SYLLABUS = [
  {
    chapterNumber: 1,
    title: 'What is a Microcontroller?',
    slug: 'what-is-a-microcontroller',
    level: 'BEGINNER',
    estimatedMinutes: 20,
    summary:
      'An introduction to monolithic embedded silicon: discovering how a single chip integrates a CPU, volatile RAM, non-volatile Flash, and physical input/output peripherals.',
    keyTakeaways: [
      'A microcontroller (MCU) integrates CPU, SRAM, Flash, clock generator, and I/O peripherals onto a single monolithic die.',
      'Unlike desktop computers with modular components, MCUs are optimized for dedicated, real-time control with minimal power and cost.',
      'Every embedded system interacts with the physical world through sensors (inputs) and actuators (outputs).',
      'Arduino is a prototyping ecosystem and development board, not the silicon microcontroller itself.',
    ],
  },
  {
    chapterNumber: 2,
    title: 'Microcontroller vs Microprocessor vs SoC',
    slug: 'microcontroller-vs-microprocessor-vs-soc',
    level: 'BEGINNER',
    estimatedMinutes: 25,
    summary:
      'Explore the architectural trade-offs between self-contained MCUs, high-performance general-purpose MPUs, and advanced Systems-on-Chip (SoCs).',
    keyTakeaways: [
      'MCUs contain on-die SRAM and Flash, operating in milliwatts for real-time sensing and control.',
      'MPUs provide gigahertz computing with out-of-order execution pipelines and virtual memory MMUs, but require external RAM and power PMICs.',
      'SoCs bridge both worlds: integrating high-performance application cores (Cortex-A), GPUs, NPUs, and wireless radios.',
      'Harvard architecture separates instruction and data buses, whereas Von Neumann shares a unified bus.',
    ],
  },
  {
    chapterNumber: 3,
    title: 'How a Microcontroller Works: The Instruction Cycle',
    slug: 'how-a-microcontroller-works',
    level: 'BEGINNER',
    estimatedMinutes: 25,
    summary:
      'Trace the heartbeat of silicon execution: from oscillator clock generation to the classical Fetch, Decode, and Execute instruction pipeline.',
    keyTakeaways: [
      'The instruction cycle consists of three fundamental phases: Fetch, Decode, and Execute.',
      'The Program Counter points to the current instruction address in Flash memory.',
      'Pipelining allows the CPU to fetch instruction N+2 while decoding N+1 and executing N simultaneously.',
      'Quartz crystal oscillators stabilized by Phase-Locked Loops (PLL) provide the master clock heartbeat.',
    ],
  },
  {
    chapterNumber: 4,
    title: 'CPU and ALU: The Silicon Computational Core',
    slug: 'cpu-and-alu',
    level: 'BEGINNER',
    estimatedMinutes: 25,
    summary:
      'Inside the computational heart of silicon: how ALUs execute integer math, bitwise logic, and barrel shifts, and how condition flags guide branching.',
    keyTakeaways: [
      'The Arithmetic Logic Unit (ALU) performs hardware binary addition, subtraction, AND, OR, XOR, and bit-shifting.',
      'Condition flags (Negative, Zero, Carry, Overflow) record the mathematical outcome of every ALU operation.',
      'Hardware multipliers and dividers accelerate complex calculations without multi-cycle software loops.',
      'Modern Cortex-M4/M7 cores add single-precision IEEE 754 Floating-Point Units (FPUs) and SIMD DSP instructions.',
    ],
  },
  {
    chapterNumber: 5,
    title: 'Registers: Silicon Scratchpads',
    slug: 'registers',
    level: 'BEGINNER',
    estimatedMinutes: 25,
    summary:
      'Master internal register files: general-purpose registers (R0-R12), AAPCS calling conventions, and special function control registers.',
    keyTakeaways: [
      'Registers are the fastest storage locations in computing, located directly inside the CPU core.',
      'ARM Cortex-M processors feature 16 core registers: R0-R12 (General Purpose), R13 (SP), R14 (LR), and R15 (PC).',
      'Under the AAPCS standard, R0-R3 pass function arguments and return values.',
      'Special Function Registers (SFRs) control on-chip hardware peripherals via memory-mapped addresses.',
    ],
  },
  {
    chapterNumber: 6,
    title: 'Program Counter and Stack Pointer',
    slug: 'program-counter-and-stack-pointer',
    level: 'BEGINNER',
    estimatedMinutes: 30,
    summary:
      'Control program execution flow and context switching: understand the Program Counter (PC), Link Register (LR), and Main vs Process Stack Pointers (MSP/PSP).',
    keyTakeaways: [
      'The Program Counter (PC / R15) holds the address of the next instruction word to be executed.',
      'The Stack Pointer (SP / R13) tracks the current top of the descending call stack in SRAM.',
      'The Link Register (LR / R14) holds the return address when calling functions via BL.',
      'ARM Cortex-M implements banked stack pointers: Main Stack Pointer (MSP) and Process Stack Pointer (PSP) for RTOS isolation.',
    ],
  },
  {
    chapterNumber: 7,
    title: 'Memory Organization & Bus Matrix Topologies',
    slug: 'memory-organization',
    level: 'INTERMEDIATE',
    estimatedMinutes: 30,
    summary:
      'Navigate the 32-bit linear address space: explore code, SRAM, peripheral spaces, memory protection units (MPU), and multi-layer AHB/APB bus matrices.',
    keyTakeaways: [
      '32-bit architectures provide a flat 4 Gigabyte (0x0000_0000 to 0xFFFF_FFFF) address space.',
      'The address space is segmented: Code/Flash (0x0800_0000), SRAM (0x2000_0000), Peripherals (0x4000_0000).',
      'Peripherals are memory-mapped: interacting with hardware pins uses standard memory load/store instructions.',
      'The Multi-Layer AHB bus matrix permits simultaneous concurrent data transfers between multiple bus masters.',
    ],
  },
  {
    chapterNumber: 8,
    title: 'RAM, ROM, Flash and EEPROM',
    slug: 'ram-rom-flash-eeprom',
    level: 'INTERMEDIATE',
    estimatedMinutes: 30,
    summary:
      'Evaluate embedded semiconductor memories: static SRAM cells, non-volatile NOR Flash erase sectors, endurance cycles, and EEPROM emulated storage.',
    keyTakeaways: [
      'SRAM is fast, volatile memory built from 6-transistor latch circuits, losing its state upon power removal.',
      'NOR Flash is non-volatile memory storing firmware code, executing instructions directly in-place (XIP).',
      'Flash memory can be programmed byte-by-byte from 1 to 0, but erasing can only reset cells back to 1 in entire sectors.',
      'EEPROM provides byte-level erasability and high write endurance (1,000,000+ cycles) for device calibration data.',
    ],
  },
  {
    chapterNumber: 9,
    title: 'Digital and Analog Signals',
    slug: 'digital-and-analog-signals',
    level: 'BEGINNER',
    estimatedMinutes: 25,
    summary:
      'Bridge the physical analog world and digital silicon: voltage thresholds (VIH/VIL), noise margins, logic high/low, and Nyquist-Shannon sampling fundamentals.',
    keyTakeaways: [
      'Digital signals represent information as discrete binary logic levels: HIGH (1) and LOW (0).',
      'Analog signals vary continuously in voltage over time, reflecting physical phenomena (sound, temperature, pressure).',
      'CMOS input thresholds (VIH and VIL) define the exact voltages recognized as valid logic levels.',
      'The Nyquist-Shannon theorem dictates that sampling rate must be at least twice the highest frequency present in an analog signal.',
    ],
  },
  {
    chapterNumber: 10,
    title: 'GPIO: General Purpose Input/Output',
    slug: 'gpio',
    level: 'BEGINNER',
    estimatedMinutes: 30,
    summary:
      'Control external electronics: master push-pull vs open-drain transistors, internal pull-up/pull-down resistors, slew rates, and atomic BSRR bitmasking.',
    keyTakeaways: [
      'GPIO pins interface silicon directly with external LEDs, buttons, relays, and communication transceivers.',
      'Push-Pull output actively drives the pin both HIGH (via P-MOS) and LOW (via N-MOS).',
      'Open-Drain output only drives LOW, requiring an external pull-up resistor to reach HIGH (essential for I2C).',
      'Atomic Bit Set/Reset Registers (BSRR) eliminate read-modify-write race conditions in multi-threaded code.',
    ],
  },
  {
    chapterNumber: 11,
    title: 'Timers and Counters: Hardware Timing & PWM',
    slug: 'timers-and-counters',
    level: 'INTERMEDIATE',
    estimatedMinutes: 35,
    summary:
      'Silicon timekeeping without CPU overhead: prescalers, auto-reload registers, input capture edge measurement, and complementary PWM motor drive.',
    keyTakeaways: [
      'Hardware timers run independently of the CPU core, eliminating timing jitter caused by software delay loops.',
      'A timer consists of a clock source, a Prescaler (PSC) frequency divider, and a Counter (CNT) register.',
      'Pulse Width Modulation (PWM) modulates the duty cycle to simulate analog voltages and control motors.',
      'Input Capture registers record exact timestamps of incoming electrical pulses for frequency and tachometer measurement.',
    ],
  },
  {
    chapterNumber: 12,
    title: 'ADC and DAC: Translating Continuous Realities',
    slug: 'adc-and-dac',
    level: 'INTERMEDIATE',
    estimatedMinutes: 35,
    summary:
      'Convert analog voltages into digital words with Successive Approximation Register (SAR) ADCs, manage reference voltages, and synthesize analog voltages via DACs.',
    keyTakeaways: [
      'An ADC samples continuous physical voltages and quantizes them into discrete binary integers.',
      'Most modern microcontrollers utilize 12-bit Successive Approximation Register (SAR) ADCs.',
      'A 12-bit ADC with a 3.3V reference provides a resolution (1 LSB) of approximately 0.806 millivolts.',
      'Digital-to-Analog Converters (DAC) convert digital numbers into genuine continuous analog voltages.',
    ],
  },
  {
    chapterNumber: 13,
    title: 'Interrupts & The NVIC: Real-Time Event Dispatch',
    slug: 'interrupts',
    level: 'INTERMEDIATE',
    estimatedMinutes: 35,
    summary:
      'Respond to real-world stimuli within nanoseconds: Vector Tables, NVIC hardware priority arbitration, tail-chaining, and the critical "volatile" keyword.',
    keyTakeaways: [
      'Interrupts enable microcontrollers to respond asynchronously to physical events without wasteful polling loops.',
      'The Nested Vectored Interrupt Controller (NVIC) handles priority arbitration and subpriority preemption.',
      'The Interrupt Vector Table maps peripheral IRQ lines to dedicated Interrupt Service Routine (ISR) function pointers.',
      'Variables shared between ISRs and main thread code must be qualified with volatile to prevent compiler caching.',
    ],
  },
  {
    chapterNumber: 14,
    title: 'Communication Protocols: UART, SPI and I2C',
    slug: 'communication-protocols-uart-spi-i2c',
    level: 'INTERMEDIATE',
    estimatedMinutes: 40,
    summary:
      'Master the fundamental embedded communication triumvirate: asynchronous UART framing, high-speed synchronous 4-wire SPI, and multi-drop 2-wire open-drain I2C.',
    keyTakeaways: [
      'UART is asynchronous, using matching baud rates, start/stop framing bits, and two wires (TX, RX).',
      'SPI is synchronous, full-duplex, and ultra-fast (50+ MHz), requiring 4 wires plus a dedicated Chip Select (CS) per peripheral.',
      'I2C is a 2-wire half-duplex open-drain bus with 7-bit addressing, supporting multiple devices with pull-up resistors.',
      'Direct Memory Access (DMA) offloads serial communication transfers completely from the CPU core.',
    ],
  },
];

export function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, openAuth } = useAuth();

  const [chapters, setChapters] = useState(DISCOVER_SYLLABUS);
  const [backendChapterSlugs, setBackendChapterSlugs] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [currentChapterDetail, setCurrentChapterDetail] = useState(null);
  const [completedMap, setCompletedMap] = useState({});

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL'); // ALL, BEGINNER, INTERMEDIATE, ADVANCED

  // Tab inside chapter: 'theory' | 'diagram' | 'practical' | 'glossary' | 'deepdive' | 'quiz'
  const [activeTab, setActiveTab] = useState('theory');

  // Load curriculum chapters from backend
  useEffect(() => {
    lessonService
      .getChapters()
      .then((res) => {
        const backendChapters = res.data || [];
        setBackendChapterSlugs(new Set(backendChapters.map((chapter) => chapter.slug)));
        if (backendChapters.length > 0) setChapters(backendChapters);
      })
      .catch((err) => {
        setBackendChapterSlugs(new Set());
        console.warn('Backend chapters fetch failed; using embedded syllabus:', err.message);
      });
  }, []);

  // Load progress if user is authenticated
  useEffect(() => {
    if (!user) {
      setCompletedMap({});
      return;
    }
    progressService
      .getProgress()
      .then((res) => {
        if (res.data?.chapterProgress) {
          const map = {};
          res.data.chapterProgress.forEach((p) => {
            if (p.isCompleted) map[p.chapterId] = true;
          });
          setCompletedMap(map);
        }
      })
      .catch(() => {});
  }, [user]);

  // Handle URL query parameters (e.g. ?chapter=what-is-a-microcontroller)
  useEffect(() => {
    const slugParam = searchParams.get('chapter') || searchParams.get('topic');
    if (slugParam && chapters.length > 0) {
      const idx = chapters.findIndex((c) => c.slug === slugParam);
      if (idx !== -1) {
        setActiveChapterIndex(idx);
      }
    }
  }, [searchParams, chapters]);

  // Load current chapter full details from backend
  const activeChapter = chapters[activeChapterIndex] || chapters[0];
  const activeChapterDetail =
    currentChapterDetail?.slug === activeChapter?.slug ? currentChapterDetail : null;

  useEffect(() => {
    let isCurrentChapter = true;

    if (activeChapter?.slug && backendChapterSlugs?.has(activeChapter.slug)) {
      lessonService
        .getChapterBySlug(activeChapter.slug)
        .then((res) => {
          if (isCurrentChapter) setCurrentChapterDetail(res.data);
        })
        .catch((err) => {
          if (isCurrentChapter) {
            console.warn('Could not load chapter detail from backend; fallback active.', err.message);
          }
        });
    }

    return () => {
      isCurrentChapter = false;
    };
  }, [activeChapter?.slug, backendChapterSlugs]);

  // Handle Mark Chapter Completed
  const handleMarkCompleted = async () => {
    if (!user) {
      openAuth('login');
      return;
    }
    if (!activeChapter?.id) return;
    try {
      await progressService.markChapterCompleted(activeChapter.id);
      setCompletedMap((prev) => ({ ...prev, [activeChapter.id]: true }));
    } catch (err) {
      console.error('Failed to mark chapter completed:', err);
    }
  };

  // Filtered chapters for the sidebar
  const filteredChapters = chapters.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const isCompleted = activeChapter?.id
    ? !!completedMap[activeChapter.id] || !!activeChapter.isCompleted
    : false;

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner / Engineering Header */}
      <div className="border-b border-[#C9BDAA] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Syllabus Blueprint // Ref: MV-DISC-14</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D] tracking-tight">
            Discover the Intelligence Inside Silicon
          </h1>
          <p className="text-sm text-[#655F55] mt-1.5 max-w-2xl leading-relaxed font-sans">
            Fourteen foundational engineering modules taking you from semiconductor physics and register files to real-time interrupts and communication protocols.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <Link
            to="/anatomy"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#EDE1CE] border border-[#C9BDAA] text-[#22201D] hover:text-[#D87535] transition-all font-semibold shadow-sm"
          >
            <Cpu className="w-4 h-4 text-[#D87535]" />
            <span>3D Chip Anatomy Explorer →</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Sidebar Navigator + Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================== */}
        {/* LEFT: 14-MODULE SYLLABUS NAVIGATOR (4 cols)                    */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EB] border border-[#C9BDAA] space-y-4 shadow-sm bg-drafting-grid-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-[#C9BDAA]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#22201D] font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#D87535]" />
                Curriculum Blueprint (14)
              </span>
              <span className="text-[11px] font-mono text-[#8C8275] bg-[#EDE1CE] px-2 py-0.5 rounded border border-[#C9BDAA]">
                {Object.keys(completedMap).length} / {chapters.length} Completed
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8C8275]" />
              <input
                type="text"
                placeholder="Search topics, ALU, registers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA] text-xs font-mono text-[#22201D] placeholder-[#8C8275] focus:outline-none focus:border-[#D87535]"
              />
            </div>

            {/* Level Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] text-[10px] font-mono">
              {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`py-1 rounded text-center cursor-pointer transition-colors ${
                    levelFilter === lvl
                      ? 'bg-[#FAF5EB] text-[#22201D] font-bold border border-[#C9BDAA] shadow-xs'
                      : 'text-[#655F55] hover:text-[#22201D]'
                  }`}
                >
                  {lvl.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Chapter List */}
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredChapters.map((ch) => {
                const globalIndex = chapters.findIndex((c) => c.slug === ch.slug);
                const isActive = activeChapterIndex === globalIndex;
                const done = ch.id ? !!completedMap[ch.id] || !!ch.isCompleted : false;

                return (
                  <button
                    key={ch.slug}
                    onClick={() => {
                      setActiveChapterIndex(globalIndex);
                      setSearchParams({ chapter: ch.slug });
                      setActiveTab('theory');
                    }}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isActive
                        ? 'bg-[#FAF5EB] border-[#D87535] shadow-xs text-[#22201D] ring-1 ring-[#D87535]/30'
                        : 'bg-[#F5EBDD]/70 border-[#C9BDAA]/70 text-[#655F55] hover:border-[#C9BDAA] hover:bg-[#FAF5EB] hover:text-[#22201D]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 h-6 rounded font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border ${
                        isActive
                          ? 'bg-[#D87535] text-[#FAF5EB] border-[#D87535]'
                          : 'bg-[#EDE1CE] text-[#655F55] border-[#C9BDAA]'
                      }`}>
                        {String(ch.chapterNumber).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <div className={`text-xs font-serif font-bold truncate ${isActive ? 'text-[#22201D]' : 'text-[#4A453E]'}`}>
                          {ch.title}
                        </div>
                        <div className="text-[10px] font-mono text-[#8C8275] flex items-center gap-2">
                          <span>{ch.estimatedMinutes}m</span>
                          <span>•</span>
                          <span className="uppercase">{ch.level}</span>
                        </div>
                      </div>
                    </div>

                    {done && (
                      <CheckCircle2 className="w-4 h-4 text-[#87945B] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT: CHAPTER EDITORIAL READER & INTERACTIVE BENCH (8 cols)  */}
        {/* ============================================================== */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl bg-[#FAF5EB] border border-[#C9BDAA] p-6 sm:p-8 space-y-6 shadow-sm relative bg-drafting-grid-subtle">
            {/* Active Chapter Header */}
            <div className="space-y-3 pb-5 border-b border-[#C9BDAA]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EDE1CE] text-[#D87535] border border-[#C9BDAA] font-bold">
                    MODULE {String(activeChapter.chapterNumber).padStart(2, '0')} OF 14
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EDE1CE] text-[#655F55] border border-[#C9BDAA] uppercase">
                    {activeChapter.level}
                  </span>
                  <span className="flex items-center gap-1 text-[#8C8275]">
                    <Clock className="w-3.5 h-3.5 text-[#D87535]" />
                    {activeChapter.estimatedMinutes} Minutes
                  </span>
                </div>

                {/* Mark as Completed Button */}
                <button
                  onClick={handleMarkCompleted}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-[#87945B]/15 text-[#87945B] border border-[#87945B]/50'
                      : 'bg-[#22201D] hover:bg-[#3D3A36] text-[#FAF5EB] border border-[#22201D]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isCompleted ? 'COMPLETED' : 'MARK COMPLETE'}
                </button>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#22201D] tracking-tight">
                {activeChapter.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#655F55] leading-relaxed font-sans">
                {activeChapter.summary}
              </p>
            </div>

            {/* Editorial Navigation Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-[#C9BDAA] pb-3 text-xs font-mono">
              {[
                { id: 'theory', label: 'Overview & Theory' },
                { id: 'diagram', label: 'Technical Diagram' },
                { id: 'practical', label: 'Industrial Firmware' },
                { id: 'deepdive', label: 'Engineering Deep Dive' },
                { id: 'quiz', label: 'Knowledge Check' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#22201D] text-[#FAF5EB] font-bold shadow-xs'
                      : 'bg-[#EDE1CE] text-[#655F55] hover:text-[#22201D] border border-[#C9BDAA]/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: THEORY & FORMAL DEFINITION */}
            {activeTab === 'theory' && (
              <div className="space-y-6 text-sm text-[#22201D] leading-relaxed">
                {/* Key Takeaways Callout */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA] space-y-2 relative">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#D87535] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Core Architectural Takeaways
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#655F55] font-sans">
                    {(activeChapter.keyTakeaways || []).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#D87535] font-bold font-mono">›</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Markdown Body or Section Rendering */}
                {activeChapterDetail?.content ? (
                  <div className="prose max-w-none text-xs leading-relaxed space-y-4">
                    <div className="whitespace-pre-wrap font-sans text-xs text-[#655F55]">
                      {activeChapterDetail.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs text-[#655F55] leading-relaxed font-sans">
                    <div className="p-4 rounded-xl bg-[#FAF5EB] border border-[#C9BDAA] space-y-2">
                      <div className="text-[10px] font-mono uppercase text-[#D87535] font-bold">
                        Beginner-Friendly Explanation
                      </div>
                      <p>
                        A microcontroller is a self-contained computer on a single silicon chip. Rather than routing wires across a desktop motherboard, the processor, memory, and physical pin transceivers are integrated on a monolithic die.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF5EB] border border-[#C9BDAA] space-y-2">
                      <div className="text-[10px] font-mono uppercase text-[#87945B] font-bold">
                        Formal Technical Definition
                      </div>
                      <p>
                        A monolithic integrated circuit incorporating an execution core, on-die non-volatile storage, static volatile memory, and memory-mapped peripheral controllers governed by deterministic timing constraints.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: TECHNICAL DIAGRAM */}
            {activeTab === 'diagram' && (
              <div className="space-y-4">
                <ChapterDiagram chapterNumber={activeChapter.chapterNumber} />
                <p className="text-xs text-[#8C8275] font-mono leading-relaxed">
                  // Fig {activeChapter.chapterNumber}.0: Technical schematic depicting signal routing, bus matrices, and silicon cell arrangements.
                </p>
              </div>
            )}

            {/* TAB 3: INDUSTRIAL FIRMWARE & PRACTICAL APPLICATION */}
            {activeTab === 'practical' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#B95D32] font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    Industrial Mission-Critical Deployment
                  </div>
                  <p className="text-xs text-[#22201D] leading-relaxed font-sans">
                    Automotive, aerospace, and biomedical systems employ this architectural subsystem for deterministic safety-critical reflexes (e.g. ABS brake modulation, cardiac telemetry, quadcopter attitude control).
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#655F55] flex items-center justify-between">
                    <span>Bare-Metal C Register Driver</span>
                    <span className="text-[#D87535] font-bold">ARM CORTEX-M MMIO</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#242522] border border-[#3D3A36] font-mono text-xs text-[#E5E5DF] overflow-x-auto leading-relaxed shadow-sm">
                    <pre>{`// Production Bare-Metal Register Access Example
#define PERIPH_BASE     0x40000000UL
#define AHB1PERIPH_BASE (PERIPH_BASE + 0x00020000UL)
#define GPIOA_BASE      (AHB1PERIPH_BASE + 0x0000UL)

// Configure Output & Perform Atomic Bit-Set
(*(volatile uint32_t*)(GPIOA_BASE + 0x00)) |= (1 << 10); // MODER: Pin 5 Output
(*(volatile uint32_t*)(GPIOA_BASE + 0x18))  = (1 << 5);  // BSRR: Set Pin 5 HIGH`}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: EXPANDABLE ENGINEERING DEEP DIVE */}
            {activeTab === 'deepdive' && (
              <div className="space-y-4 text-xs leading-relaxed text-[#655F55] font-sans">
                <div className="p-5 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA] space-y-3">
                  <div className="text-xs font-mono uppercase text-[#D87535] font-bold flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Silicon Gate Propagation & Wait-State Physics
                  </div>
                  <p>
                    Silicon gates incur propagation delay governed by channel length, gate capacitance, and supply voltage. When operating at frequencies beyond 50 MHz, memory access times mandate wait-state insertion unless bridged by prefetch instruction caches.
                  </p>
                  <p>
                    Furthermore, compiler optimization flags (<code className="px-1.5 py-0.5 rounded bg-[#EDE1CE] text-[#22201D] font-mono font-bold">-O2</code>) perform register allocation and dead-code elimination, necessitating the <code className="px-1.5 py-0.5 rounded bg-[#EDE1CE] text-[#22201D] font-mono font-bold">volatile</code> keyword on hardware registers to prevent the compiler from caching asynchronous memory accesses into CPU registers.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: KNOWLEDGE CHECK ASSESSMENT */}
            {activeTab === 'quiz' && (
              <ChapterQuiz
                chapterId={activeChapter.id || activeChapterDetail?.id}
                quizMetadata={activeChapter.quiz || activeChapterDetail?.quiz}
                onQuizPassed={() => {
                  if (activeChapter.id) {
                    setCompletedMap((prev) => ({ ...prev, [activeChapter.id]: true }));
                  }
                }}
              />
            )}

            {/* Chapter Footer Navigation */}
            <div className="pt-6 border-t border-[#C9BDAA] flex items-center justify-between gap-4">
              <button
                disabled={activeChapterIndex === 0}
                onClick={() => {
                  if (activeChapterIndex > 0) {
                    const prevIdx = activeChapterIndex - 1;
                    setActiveChapterIndex(prevIdx);
                    setSearchParams({ chapter: chapters[prevIdx].slug });
                    setActiveTab('theory');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EDE1CE] hover:bg-[#FAF5EB] text-xs font-mono text-[#22201D] border border-[#C9BDAA] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" /> PREVIOUS CHAPTER
              </button>

              <button
                disabled={activeChapterIndex >= chapters.length - 1}
                onClick={() => {
                  if (activeChapterIndex < chapters.length - 1) {
                    const nextIdx = activeChapterIndex + 1;
                    setActiveChapterIndex(nextIdx);
                    setSearchParams({ chapter: chapters[nextIdx].slug });
                    setActiveTab('theory');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22201D] hover:bg-[#3D3A36] text-[#FAF5EB] text-xs font-mono font-bold transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                NEXT CHAPTER <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
