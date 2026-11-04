import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Zap,
  Clock,
  ArrowRight,
  ShieldAlert,
  Binary,
  Layers,
  ChevronRight,
  Cpu,
} from 'lucide-react';

const SIGNAL_MODES = [
  {
    id: 'binary',
    label: 'Binary Logic & CMOS Levels',
    icon: Binary,
    desc: 'Interactive 3.3V / 0V CMOS thresholds, noise margins & slew rate',
  },
  {
    id: 'clock',
    label: 'System Clock Oscillator',
    icon: Clock,
    desc: 'Variable frequency, duty cycle & edge-triggered sampling',
  },
  {
    id: 'timing',
    label: 'SPI Bus Timing Analyzer',
    icon: Activity,
    desc: 'Synchronized multi-channel digital waveform transmission',
  },
  {
    id: 'interrupt',
    label: 'Interrupt Dispatch Flow',
    icon: ShieldAlert,
    desc: 'Deterministic NVIC arbitration & 12-cycle context stacking',
  },
  {
    id: 'datamovement',
    label: 'Internal Bus Data Movement',
    icon: Layers,
    desc: 'Instruction fetch & operand routing along the AHB matrix',
  },
];

export function SignalVisualizer({ defaultMode = 'binary', className = '' }) {
  const [activeMode, setActiveMode] = useState(defaultMode);

  // Binary mode state
  const [logicState, setLogicState] = useState(1);
  const [slewRate, setSlewRate] = useState(25); // ns

  // Clock mode state
  const [clockFreqMHz, setClockFreqMHz] = useState(16);
  const [dutyCycle, setDutyCycle] = useState(50);
  const [isPlaying, setIsPlaying] = useState(true);
  const [clockPhase, setClockPhase] = useState(0);

  // Timing diagram state
  const [timingStep, setTimingStep] = useState(0);
  const [timingPlaying, setTimingPlaying] = useState(true);

  // Interrupt flow state
  const [interruptStep, setInterruptStep] = useState(0);
  const [isInterruptActive, setIsInterruptActive] = useState(false);

  // Data movement state
  const [pipelineStage, setPipelineStage] = useState(0);

  // Animation ticker for continuous modes
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setClockPhase((p) => (p + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (!timingPlaying) return;
    const interval = setInterval(() => {
      setTimingStep((s) => (s + 1) % 8);
    }, 800);
    return () => clearInterval(interval);
  }, [timingPlaying]);

  // Interrupt step auto-advance if triggered
  useEffect(() => {
    if (!isInterruptActive) return;
    const timer = setTimeout(() => {
      if (interruptStep < 5) {
        setInterruptStep((s) => s + 1);
      } else {
        setIsInterruptActive(false);
        setInterruptStep(0);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [isInterruptActive, interruptStep]);

  // Data movement loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineStage((s) => (s + 1) % 5);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`rounded-2xl bg-[#FAF5EB] border border-[#C9BDAA] overflow-hidden shadow-xs bg-drafting-grid-subtle ${className}`}
    >
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border-b border-[#C9BDAA] bg-[#EDE1CE]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] flex items-center justify-center text-[#D87535]">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[#22201D]">
                Real-Time Silicon Signal Visualizer
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#FAF5EB] text-[#D87535] border border-[#C9BDAA]">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#655F55] mt-0.5 font-sans">
              Interactive physics simulation of voltage transitions, bus clocks, and hardware triggers.
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF5EB] hover:bg-[#EDE1CE] text-xs font-mono font-bold text-[#22201D] border border-[#C9BDAA] transition-colors cursor-pointer shadow-xs"
            title="Toggle Clock Animation"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#D87535]" /> PAUSE
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#D87535]" /> RUN
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-[#C9BDAA] bg-[#EDE1CE]/60">
        {SIGNAL_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`p-3 text-left transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'border-[#D87535] bg-[#FAF5EB] text-[#22201D] font-bold shadow-xs'
                  : 'border-transparent text-[#655F55] hover:text-[#22201D] hover:bg-[#FAF5EB]/50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D87535]' : ''}`} />
              <div className="min-w-0">
                <div className="text-xs font-serif font-bold truncate">
                  {mode.label.split(' ')[0]} {mode.label.split(' ')[1]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Canvas / Display Area */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* ============================================================== */}
        {/* MODE 1: BINARY LOGIC & CMOS THRESHOLDS                         */}
        {/* ============================================================== */}
        {activeMode === 'binary' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#22201D] flex items-center gap-2">
                  <span>CMOS 3.3V Logic Transition & Thresholds</span>
                </h4>
                <p className="text-xs text-[#655F55] mt-0.5 font-sans">
                  Observe standard 3.3V CMOS digital voltage thresholds (V<sub>IH</sub>, V<sub>IL</sub>) and finite rise/fall slew times.
                </p>
              </div>

              {/* Logic Toggle Control */}
              <div className="flex items-center gap-3 bg-[#EDE1CE] p-1.5 rounded-xl border border-[#C9BDAA]">
                <span className="text-xs font-mono text-[#655F55] px-2 font-bold">DRIVE INPUT:</span>
                <button
                  onClick={() => setLogicState(0)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    logicState === 0
                      ? 'bg-[#22201D] text-[#FAF5EB] shadow-xs'
                      : 'text-[#655F55] hover:text-[#22201D]'
                  }`}
                >
                  LOW (0V / '0')
                </button>
                <button
                  onClick={() => setLogicState(1)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    logicState === 1
                      ? 'bg-[#D87535] text-[#FAF5EB] shadow-xs'
                      : 'text-[#655F55] hover:text-[#22201D]'
                  }`}
                >
                  HIGH (3.3V / '1')
                </button>
              </div>
            </div>

            {/* Voltage Waveform & Threshold Graphic */}
            <div className="relative h-64 w-full bg-[#242522] rounded-xl border border-[#3D3A36] p-4 flex flex-col justify-between overflow-hidden shadow-inner">
              {/* Threshold Band Lines */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-6 px-12 opacity-80">
                {/* 3.3V Rail */}
                <div className="border-b border-dashed border-[#55C7FF]/40 flex justify-between text-[10px] font-mono text-[#55C7FF]">
                  <span>VDD (3.30 V)</span>
                  <span>LOGIC HIGH RAIL</span>
                </div>
                {/* VIH (2.31V) */}
                <div className="border-b border-dashed border-[#87945B]/60 flex justify-between text-[10px] font-mono text-[#87945B]">
                  <span>VIH MIN (2.31 V = 0.7 × VDD)</span>
                  <span>GUARANTEED LOGIC '1' REGION</span>
                </div>
                {/* Indeterminate Region */}
                <div className="bg-[#B95D32]/10 h-10 -my-2 flex items-center justify-center text-[10px] font-mono text-[#D87535] border-y border-[#B95D32]/30 font-bold">
                  INDETERMINATE FORBIDDEN ZONE (Potential Crowbar Shoot-Through)
                </div>
                {/* VIL (0.99V) */}
                <div className="border-b border-dashed border-[#B95D32]/50 flex justify-between text-[10px] font-mono text-[#B95D32]">
                  <span>VIL MAX (0.99 V = 0.3 × VDD)</span>
                  <span>GUARANTEED LOGIC '0' REGION</span>
                </div>
                {/* GND (0.0V) */}
                <div className="border-b border-dashed border-[#8C8275]/40 flex justify-between text-[10px] font-mono text-[#8C8275]">
                  <span>VSS (0.00 V)</span>
                  <span>LOGIC LOW RAIL</span>
                </div>
              </div>

              {/* Live Signal Waveform Path */}
              <div className="relative z-10 h-full flex items-center px-12">
                <svg className="w-full h-full overflow-visible">
                  <motion.path
                    d={
                      logicState === 1
                        ? 'M 0 170 Q 150 170, 220 30 L 700 30'
                        : 'M 0 30 Q 150 30, 220 170 L 700 170'
                    }
                    fill="none"
                    stroke={logicState === 1 ? '#C8DE72' : '#B95D32'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    animate={{
                      d:
                        logicState === 1
                          ? 'M 0 170 Q 120 170, 200 30 L 700 30'
                          : 'M 0 30 Q 120 30, 200 170 L 700 170',
                    }}
                    transition={{ duration: slewRate / 50, ease: 'easeInOut' }}
                  />
                  {/* Real-time probe marker */}
                  <motion.circle
                    cx="200"
                    cy={logicState === 1 ? 30 : 170}
                    r="7"
                    fill={logicState === 1 ? '#C8DE72' : '#B95D32'}
                    animate={{
                      cy: logicState === 1 ? 30 : 170,
                    }}
                    transition={{ duration: slewRate / 50, ease: 'easeInOut' }}
                  />
                </svg>
              </div>

              {/* Bottom Voltage & Telemetry Readout */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-2 border-t border-[#3D3A36]">
                <div className="flex items-center gap-4 text-[#8C8275]">
                  <span>
                    STATE:{' '}
                    <strong
                      className={logicState === 1 ? 'text-[#C8DE72]' : 'text-[#B95D32]'}
                    >
                      {logicState === 1 ? 'HIGH (1)' : 'LOW (0)'}
                    </strong>
                  </span>
                  <span>
                    VOLTAGE:{' '}
                    <strong className="text-[#E5E5DF]">
                      {logicState === 1 ? '3.30 V' : '0.00 V'}
                    </strong>
                  </span>
                  <span>
                    SLEW TIME: <strong className="text-[#D87535]">{slewRate} ns</strong>
                  </span>
                </div>
                <div className="text-[11px] text-[#C8DE72] flex items-center gap-1 font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  CMOS Schmitt Trigger Hysteresis Active
                </div>
              </div>
            </div>

            {/* Slew Rate Slider */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA]">
              <Sliders className="w-4 h-4 text-[#D87535] shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-mono text-[#655F55]">
                  <span className="font-bold text-[#22201D]">Output Driver Slew Rate / Pin Rise Time</span>
                  <span className="text-[#D87535] font-bold">{slewRate} nanoseconds</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={slewRate}
                  onChange={(e) => setSlewRate(Number(e.target.value))}
                  className="w-full accent-[#D87535] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 2: SYSTEM CLOCK OSCILLATOR                                */}
        {/* ============================================================== */}
        {activeMode === 'clock' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#22201D]">
                  System Clock Generator & Duty Cycle
                </h4>
                <p className="text-xs text-[#655F55] mt-0.5 font-sans">
                  The central silicon heartbeat. Notice rising-edge (↑) and falling-edge (↓) trigger points.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="p-2 rounded-lg bg-[#EDE1CE] border border-[#C9BDAA] text-[#D87535] font-bold">
                  Period T = {(1000 / clockFreqMHz).toFixed(1)} ns
                </span>
                <span className="p-2 rounded-lg bg-[#EDE1CE] border border-[#C9BDAA] text-[#22201D] font-bold">
                  f_SYS = {clockFreqMHz} MHz
                </span>
              </div>
            </div>

            {/* Animated Square Wave Canvas */}
            <div className="h-56 w-full bg-[#242522] rounded-xl border border-[#3D3A36] p-4 flex flex-col justify-between relative overflow-hidden shadow-inner">
              <div className="absolute top-3 left-4 text-[10px] font-mono text-[#8C8275]">
                SYSCLK_OUT (Single-Ended CMOS Square Wave)
              </div>

              {/* Dynamic Square Wave SVG */}
              <div className="h-32 flex items-center justify-center">
                <svg className="w-full h-28 overflow-hidden" viewBox="0 0 800 100">
                  <defs>
                    <linearGradient id="clockGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C8DE72" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#C8DE72" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Repeated Square Wave Pulse Train */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const periodWidth = 100;
                    const highWidth = (periodWidth * dutyCycle) / 100;
                    const lowWidth = periodWidth - highWidth;
                    const xOffset = i * periodWidth - (clockPhase % 100);

                    return (
                      <g key={i} transform={`translate(${xOffset}, 0)`}>
                        <path
                          d={`M 0 80 L 0 20 L ${highWidth} 20 L ${highWidth} 80 L ${periodWidth} 80`}
                          fill="none"
                          stroke="#C8DE72"
                          strokeWidth="2.5"
                        />
                        {/* Shaded Area under high pulse */}
                        <polygon
                          points={`0,80 0,20 ${highWidth},20 ${highWidth},80`}
                          fill="url(#clockGlow)"
                        />
                        {/* Rising Edge Arrow */}
                        <circle cx="0" cy="20" r="3" fill="#FAF5EB" />
                        <text
                          x="-4"
                          y="14"
                          fill="#C8DE72"
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          ↑
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Interactive Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#3D3A36]">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-[#8C8275]">
                    <span className="text-[#E5E5DF]">Clock Frequency (f_SYS)</span>
                    <span className="text-[#D87535] font-bold">{clockFreqMHz} MHz</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="84"
                    value={clockFreqMHz}
                    onChange={(e) => setClockFreqMHz(Number(e.target.value))}
                    className="w-full accent-[#D87535] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-[#8C8275]">
                    <span className="text-[#E5E5DF]">Duty Cycle (t_HIGH / T)</span>
                    <span className="text-[#D87535] font-bold">{dutyCycle}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={dutyCycle}
                    onChange={(e) => setDutyCycle(Number(e.target.value))}
                    className="w-full accent-[#D87535] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 3: SPI BUS TIMING ANALYZER                                */}
        {/* ============================================================== */}
        {activeMode === 'timing' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#22201D]">
                  Synchronous SPI Multi-Channel Bus Analyzer
                </h4>
                <p className="text-xs text-[#655F55] mt-0.5 font-sans">
                  Synchronous 4-wire serial bus transmitting byte <code className="text-[#D87535] font-bold">0xA5</code> (10100101b).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimingPlaying(!timingPlaying)}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] text-xs font-mono text-[#22201D] font-bold cursor-pointer hover:bg-[#EDE1CE] shadow-xs"
                >
                  {timingPlaying ? 'PAUSE CLOCK' : 'RESUME CLOCK'}
                </button>
                <button
                  onClick={() => setTimingStep((s) => (s + 1) % 8)}
                  className="px-3 py-1.5 rounded-lg bg-[#22201D] text-xs font-mono text-[#FAF5EB] font-bold cursor-pointer hover:bg-[#3D3A36] shadow-xs"
                >
                  STEP BIT ➜
                </button>
              </div>
            </div>

            {/* Oscilloscope Channel View */}
            <div className="space-y-3 bg-[#242522] rounded-xl border border-[#3D3A36] p-4 font-mono text-xs shadow-inner">
              {/* Channel 1: CS (Active Low) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#8C8275]">
                  <span className="text-[#D87535] font-bold">CH1: /CS (Chip Select, Active-Low)</span>
                  <span className="text-[#E5E5DF]">LOW (ASSERTED)</span>
                </div>
                <div className="h-6 bg-[#1C1D1A] rounded border border-[#3D3A36] relative flex items-center px-2">
                  <div className="w-full h-0.5 bg-[#D87535]" />
                </div>
              </div>

              {/* Channel 2: SCK (Clock) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#8C8275]">
                  <span className="text-[#C8DE72] font-bold">CH2: SCK (Serial Clock - Mode 0)</span>
                  <span className="text-[#E5E5DF]">BIT INDEX: {7 - timingStep} (MSB First)</span>
                </div>
                <div className="h-9 bg-[#1C1D1A] rounded border border-[#3D3A36] flex items-center px-2 relative overflow-hidden">
                  <div className="grid grid-cols-8 w-full h-full items-center">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full border-r border-[#3D3A36] flex flex-col justify-center items-center ${
                          timingStep === i ? 'bg-[#C8DE72]/20 font-bold text-[#C8DE72]' : ''
                        }`}
                      >
                        <div className="w-full h-3 border-t-2 border-r-2 border-l-2 border-[#C8DE72]" />
                        <span className="text-[9px] mt-0.5 text-[#8C8275]">B{7 - i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Channel 3: MOSI (Master Out Slave In: 0xA5 = 1 0 1 0 0 1 0 1) */}
              {(() => {
                const bits = [1, 0, 1, 0, 0, 1, 0, 1];
                return (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#8C8275]">
                      <span className="text-[#87945B] font-bold">CH3: MOSI (TX Payload: 0xA5)</span>
                      <span className="text-[#E5E5DF]">ACTIVE BIT = {bits[timingStep]}</span>
                    </div>
                    <div className="h-9 bg-[#1C1D1A] rounded border border-[#3D3A36] flex items-center px-2">
                      <div className="grid grid-cols-8 w-full h-full items-center">
                        {bits.map((bit, idx) => (
                          <div
                            key={idx}
                            className={`h-full border-r border-[#3D3A36] flex items-center justify-center font-bold ${
                              timingStep === idx
                                ? 'bg-[#87945B]/25 text-[#87945B]'
                                : 'text-[#8C8275]/50'
                            }`}
                          >
                            <span className="text-sm">{bit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Channel 4: MISO (Master In Slave Out) */}
              {(() => {
                const bits = [0, 1, 1, 0, 1, 0, 0, 1];
                return (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#8C8275]">
                      <span className="text-[#71818B] font-bold">CH4: MISO (RX Response: 0x69)</span>
                      <span className="text-[#E5E5DF]">FULL-DUPLEX RETURN</span>
                    </div>
                    <div className="h-9 bg-[#1C1D1A] rounded border border-[#3D3A36] flex items-center px-2">
                      <div className="grid grid-cols-8 w-full h-full items-center">
                        {bits.map((bit, idx) => (
                          <div
                            key={idx}
                            className={`h-full border-r border-[#3D3A36] flex items-center justify-center font-bold ${
                              timingStep === idx
                                ? 'bg-[#71818B]/25 text-[#FAF5EB]'
                                : 'text-[#8C8275]/50'
                            }`}
                          >
                            <span className="text-sm">{bit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 4: INTERRUPT DISPATCH FLOW                                */}
        {/* ============================================================== */}
        {activeMode === 'interrupt' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#22201D]">
                  Deterministic NVIC Interrupt Handling Flow
                </h4>
                <p className="text-xs text-[#655F55] mt-0.5 font-sans">
                  Trace asynchronous hardware triggers from peripheral IRQ lines through the 12-cycle context stacker.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsInterruptActive(true);
                  setInterruptStep(1);
                }}
                disabled={isInterruptActive}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
                  isInterruptActive
                    ? 'bg-[#D87535]/20 text-[#D87535] border border-[#D87535]/50 animate-pulse'
                    : 'bg-[#B95D32] hover:bg-[#8C4623] text-[#FAF5EB] border border-[#B95D32]'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                {isInterruptActive ? 'DISPATCHING IRQ...' : 'SIMULATE EXTERNAL IRQ'}
              </button>
            </div>

            {/* Step-by-Step Flow Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
              {[
                {
                  step: 0,
                  label: '1. Thread Mode',
                  sub: 'Main execution loop running in user space',
                  badge: 'Normal',
                },
                {
                  step: 1,
                  label: '2. IRQ Trigger',
                  sub: 'Physical falling edge on pin EXTI0',
                  badge: 'Hardware',
                },
                {
                  step: 2,
                  label: '3. NVIC Priority',
                  sub: 'Preemption check vs active execution priority',
                  badge: 'Arbitration',
                },
                {
                  step: 3,
                  label: '4. Context Stacking',
                  sub: 'Hardware pushes R0-R3, R12, LR, PC, xPSR (12 cycles)',
                  badge: 'Auto Stack',
                },
                {
                  step: 4,
                  label: '5. ISR Execution',
                  sub: 'CPU branches to EXTI0_IRQHandler() in Handler Mode',
                  badge: 'Handler Mode',
                },
                {
                  step: 5,
                  label: '6. Un-stack & Return',
                  sub: 'EXC_RETURN pops registers, restores main thread',
                  badge: 'Resume',
                },
              ].map((phase) => {
                const isCurrent = interruptStep === phase.step;
                const isPassed = interruptStep > phase.step;
                return (
                  <div
                    key={phase.step}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#22201D] border-[#D87535] text-[#FAF5EB] shadow-xs'
                        : isPassed
                        ? 'bg-[#87945B]/15 border-[#87945B]/40 text-[#22201D]'
                        : 'bg-[#FAF5EB] border-[#C9BDAA] text-[#655F55]'
                    }`}
                  >
                    <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                      isCurrent ? 'text-[#D87535]' : isPassed ? 'text-[#87945B]' : 'text-[#8C8275]'
                    }`}>
                      {phase.badge}
                    </div>
                    <div className={`font-serif font-bold text-xs mt-1 ${isCurrent ? 'text-[#FAF5EB]' : 'text-[#22201D]'}`}>
                      {phase.label}
                    </div>
                    <p className={`text-[11px] mt-1 leading-snug font-sans ${isCurrent ? 'text-[#FAF5EB]/80' : 'text-[#655F55]'}`}>
                      {phase.sub}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Register Stack Visualizer */}
            <div className="p-4 rounded-xl bg-[#242522] border border-[#3D3A36] space-y-2 shadow-inner">
              <div className="text-[10px] font-mono text-[#8C8275] uppercase tracking-wider flex justify-between">
                <span>Hardware Automatic Stack Frame (Pushed to SRAM top)</span>
                <span className="text-[#D87535] font-bold">12 CLOCK CYCLES LATENCY</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 font-mono text-xs text-center">
                {['R0', 'R1', 'R2', 'R3', 'R12', 'LR (R14)', 'PC (R15)', 'xPSR'].map((reg, idx) => (
                  <div
                    key={reg}
                    className={`p-2 rounded border transition-all ${
                      interruptStep >= 3 && interruptStep < 5
                        ? 'bg-[#D87535]/25 border-[#D87535] text-[#FAF5EB] font-bold shadow-xs'
                        : 'bg-[#1C1D1A] border-[#3D3A36] text-[#8C8275]'
                    }`}
                  >
                    <div className="text-[9px] text-[#8C8275]">+{idx * 4}B</div>
                    <div className="text-xs mt-0.5">{reg}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE 5: INTERNAL BUS DATA MOVEMENT                             */}
        {/* ============================================================== */}
        {activeMode === 'datamovement' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-lg text-[#22201D]">
                  Internal Bus Matrix & Instruction Pipeline
                </h4>
                <p className="text-xs text-[#655F55] mt-0.5 font-sans">
                  Follow the data trajectory as instructions are fetched from Flash and executed on GPIO registers.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#655F55] font-bold">ACTIVE STAGE:</span>
                <span className="px-2.5 py-1 rounded bg-[#EDE1CE] text-[#D87535] border border-[#C9BDAA] font-bold">
                  {['1. FETCH', '2. DECODE', '3. OPERAND READ', '4. ALU EXECUTE', '5. WRITEBACK'][pipelineStage]}
                </span>
              </div>
            </div>

            {/* Architecture Block Interconnects */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              {[
                {
                  id: 0,
                  name: 'NOR Flash',
                  tag: 'INSTRUCTION FETCH',
                  detail: 'Reads Thumb-2 opcode from 0x08000210 over I-Code Bus',
                },
                {
                  id: 1,
                  name: 'Decoder Matrix',
                  tag: 'INSTRUCTION DECODE',
                  detail: 'Decodes: LDR R0, [GPIO_BASE + 0x14] (ODR read)',
                },
                {
                  id: 2,
                  name: 'Register File',
                  tag: 'OPERAND LOAD',
                  detail: 'Pulls GPIO base address 0x40020000 into address bus',
                },
                {
                  id: 3,
                  name: 'ALU & Shifter',
                  tag: 'EXECUTE',
                  detail: 'Calculates bitwise OR mask (ODR | (1 << 5))',
                },
                {
                  id: 4,
                  name: 'GPIO Pin PA5',
                  tag: 'PERIPHERAL WRITE',
                  detail: 'AHB bridge routes 32-bit word; Pin PA5 drives 3.3V',
                },
              ].map((block) => {
                const isHighlight = pipelineStage === block.id;
                return (
                  <motion.div
                    key={block.id}
                    animate={{
                      scale: isHighlight ? 1.03 : 1.0,
                    }}
                    className={`p-4 rounded-xl border transition-all ${
                      isHighlight
                        ? 'bg-[#22201D] border-[#D87535] text-[#FAF5EB] shadow-xs'
                        : 'bg-[#FAF5EB] border-[#C9BDAA] text-[#655F55]'
                    }`}
                  >
                    <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                      isHighlight ? 'text-[#D87535]' : 'text-[#8C8275]'
                    }`}>
                      {block.tag}
                    </div>
                    <div className={`font-serif font-bold text-sm mt-1 ${isHighlight ? 'text-[#FAF5EB]' : 'text-[#22201D]'}`}>
                      {block.name}
                    </div>
                    <p className={`text-[11px] mt-1 leading-snug font-sans ${isHighlight ? 'text-[#FAF5EB]/80' : 'text-[#655F55]'}`}>
                      {block.detail}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Bus Activity Status Bar */}
            <div className="p-3.5 rounded-lg bg-[#EDE1CE] border border-[#C9BDAA] flex items-center justify-between text-xs font-mono text-[#22201D]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D87535] animate-ping" />
                Bus Matrix Transaction: I-Code Bus ➜ AHB System Bus ➜ APB1 Peripheral Bridge
              </span>
              <span className="text-[#D87535] font-bold">32-BIT TRANSIT</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
