import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Zap,
  ArrowRight,
  Radio,
  Sliders,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export function EmbeddedLoopStory() {
  const [activeStage, setActiveStage] = useState(0); // 0: Sense, 1: Process, 2: Actuate
  const [targetAngle, setTargetAngle] = useState(45); // Degrees (0 to 90)
  const [autoCycle, setAutoCycle] = useState(true);

  // Closed loop mathematical model calculations
  const rawAnalogMv = Math.round((targetAngle / 90) * 3300); // 0 to 3.3V
  const adcValue12Bit = Math.round((rawAnalogMv / 3300) * 4095); // 0 to 4095
  const errorDegrees = targetAngle - 45;
  const proportionalTerm = (errorDegrees * 1.8).toFixed(1);
  const pwmDutyCycle = Math.min(Math.max(Math.round(50 + (errorDegrees / 45) * 40), 10), 90);
  const pulseWidthUs = Math.round(1000 + (pwmDutyCycle / 100) * 1000); // 1.0ms to 2.0ms servo pulse

  // Auto progression across the 3 stages
  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoCycle]);

  const stages = [
    {
      id: 'sense',
      title: '01. SENSE',
      subtitle: 'Continuous Physical Acquisition',
      icon: Radio,
      badge: 'SAR ADC & TRANSDUCERS',
      accentColor: '#D87535',
      summary:
        'Continuous environmental dynamics (acceleration, joint angle, current, temperature) are transformed by silicon transducers into continuous analog millivolts, conditioned through anti-aliasing filters, and quantized into discrete digital registers.',
      technicalPoints: [
        'Successive Approximation Register (SAR) ADC conversion at 2.4 MSps',
        '12-bit quantization resolution: 4096 discrete voltage steps across 3.3V',
        'Direct Memory Access (DMA) circular buffer storage with zero CPU overhead',
      ],
    },
    {
      id: 'process',
      title: '02. PROCESS',
      subtitle: 'Deterministic Real-Time Computation',
      icon: Cpu,
      badge: 'ALU, REGISTERS & NVIC',
      accentColor: '#71818B',
      summary:
        'The core execution engine evaluates state estimates and control laws. Instruction and data buses operate in parallel across a Harvard bus matrix, while hardware timers and interrupt vector tables guarantee sub-microsecond determinism.',
      technicalPoints: [
        'Single-cycle 32-bit hardware multiply & accumulate (MAC) operations',
        'Nested Vectored Interrupt Controller (NVIC) with 16 programmable priorities',
        'Proportional-Integral-Derivative (PID) loop convergence in 14 clock cycles',
      ],
    },
    {
      id: 'actuate',
      title: '03. ACTUATE',
      subtitle: 'Physical Electro-Mechanical Drive',
      icon: Zap,
      badge: 'TIMERS, PWM & H-BRIDGES',
      accentColor: '#87945B',
      summary:
        'Computed control commands are converted into high-frequency hardware Pulse-Width Modulation (PWM) waveforms. Gate drivers switch power MOSFETs, applying torque to robotic joints and returning physical telemetry into the sensors.',
      technicalPoints: [
        'Advanced timer (TIM1) complementary PWM with programmable dead-time',
        'Center-aligned counter mode reducing harmonic electromagnetic interference',
        'Closed-loop feedback completes the loop with sub-millisecond settling time',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Narrative Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono bg-[#FAF5EB] border border-[#C9BDAA] text-[#22201D]">
          <Activity className="w-3.5 h-3.5 text-[#D87535]" />
          <span>// THE EMBEDDED FEEDBACK ARCHITECTURE</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D] tracking-tight">
          How Physical Machines Think
        </h2>
        <p className="text-sm sm:text-base text-[#655F55] leading-relaxed font-sans">
          Unlike desktop computers that wait for human input, embedded microcontrollers exist inside continuous physical reality. They bridge sensors, processing logic, and mechanical actuators in deterministic, microsecond feedback loops.
        </p>
      </div>

      {/* Stage Step Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stages.map((stg, index) => {
          const Icon = stg.icon;
          const isActive = activeStage === index;
          return (
            <button
              key={stg.id}
              onClick={() => {
                setActiveStage(index);
                setAutoCycle(false);
              }}
              className={`p-4 rounded-lg text-left border transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#FAF5EB] border-[#D87535] shadow-sm'
                  : 'bg-[#EDE1CE]/50 border-[#C9BDAA] hover:border-[#D87535]/60 hover:bg-[#FAF5EB]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded flex items-center justify-center ${
                    isActive
                      ? 'bg-[#22201D] text-[#FAF5EB]'
                      : 'bg-[#EDE1CE] text-[#D87535] border border-[#C9BDAA]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant={isActive ? 'cyan' : 'muted'}>{stg.badge}</Badge>
              </div>

              <div className="font-mono text-xs font-semibold text-[#D87535]">
                {stg.title}
              </div>
              <div className="font-serif text-lg font-bold text-[#22201D] mt-0.5">
                {stg.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Story Visualizer Box */}
      <div className="rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] p-6 lg:p-8 space-y-8 shadow-xs">
        {/* Dynamic Stage Explanation & Telemetry Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="cyan">{stages[activeStage].badge}</Badge>
              <span className="text-xs font-mono text-[#8C8275]">
                STAGE {activeStage + 1} OF 3
              </span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#22201D]">
              {stages[activeStage].subtitle}
            </h3>

            <p className="text-xs sm:text-sm text-[#655F55] leading-relaxed font-sans">
              {stages[activeStage].summary}
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#D87535] font-bold">
                // Architectural Execution Details:
              </div>
              {stages[activeStage].technicalPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-mono text-[#22201D]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#87945B] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Live Hardware Telemetry Monitor */}
          <div className="lg:col-span-5 bg-[#EDE1CE]/60 border border-[#C9BDAA] rounded-lg p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#C9BDAA] pb-2 text-xs">
              <span className="flex items-center gap-2 text-[#D87535] font-bold">
                <Activity className="w-3.5 h-3.5" />
                // LIVE HARDWARE TELEMETRY
              </span>
              <span className="text-[10px] text-[#8C8275]">SAMPLE: #4192</span>
            </div>

            {/* Interactive Signal Control Slider */}
            <div className="space-y-1.5 bg-[#FAF5EB] p-3 rounded border border-[#C9BDAA]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#655F55]">SIMULATED JOINT ANGLE:</span>
                <span className="text-[#D87535] font-bold">{targetAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={targetAngle}
                onChange={(e) => {
                  setTargetAngle(parseInt(e.target.value, 10));
                  setAutoCycle(false);
                }}
                className="w-full h-1.5 bg-[#EDE1CE] rounded appearance-none cursor-pointer accent-[#D87535]"
              />
              <div className="flex justify-between text-[9px] text-[#8C8275]">
                <span>0° (Min)</span>
                <span>45° (Neutral)</span>
                <span>90° (Max)</span>
              </div>
            </div>

            {/* Telemetry Computed Register Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA]">
                <div className="text-[10px] text-[#8C8275]">ADC1_DR (RAW):</div>
                <div className="text-sm font-bold text-[#22201D]">
                  0x{adcValue12Bit.toString(16).toUpperCase().padStart(3, '0')} ({adcValue12Bit})
                </div>
                <div className="text-[9px] text-[#655F55]">{rawAnalogMv} mV Analog</div>
              </div>

              <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA]">
                <div className="text-[10px] text-[#8C8275]">PID_ERROR:</div>
                <div
                  className={`text-sm font-bold ${
                    errorDegrees === 0 ? 'text-[#87945B]' : 'text-[#D87535]'
                  }`}
                >
                  {errorDegrees > 0 ? `+${errorDegrees}` : errorDegrees}°
                </div>
                <div className="text-[9px] text-[#655F55]">P-Term: {proportionalTerm}</div>
              </div>

              <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA]">
                <div className="text-[10px] text-[#8C8275]">TIM1_CCR1 (PWM):</div>
                <div className="text-sm font-bold text-[#D87535]">{pwmDutyCycle}% DUTY</div>
                <div className="text-[9px] text-[#655F55]">{pulseWidthUs} µs High</div>
              </div>

              <div className="p-2.5 rounded bg-[#FAF5EB] border border-[#C9BDAA]">
                <div className="text-[10px] text-[#8C8275]">LOOP LATENCY:</div>
                <div className="text-sm font-bold text-[#87945B]">11.4 µs</div>
                <div className="text-[9px] text-[#655F55]">Deterministic</div>
              </div>
            </div>

            {/* Simulated Mini Waveform Monitor (Dark Instrument Oscilloscope Screen) */}
            <div className="h-16 rounded bg-[#242522] border border-[#3A3A34] flex items-center justify-center p-2 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 50">
                <defs>
                  <pattern id="mini-grid" width="20" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 10" fill="none" stroke="rgba(200,222,114,0.15)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="300" height="50" fill="url(#mini-grid)" />
                {/* Real-time PWM Square Wave based on slider duty cycle */}
                {(() => {
                  const period = 50;
                  const highWidth = (pwmDutyCycle / 100) * period;
                  let pathData = '';
                  for (let i = 0; i < 6; i++) {
                    const startX = i * period;
                    pathData += `M ${startX} 38 L ${startX} 12 L ${startX + highWidth} 12 L ${startX + highWidth} 38 L ${startX + period} 38 `;
                  }
                  return (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#C8DE72"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  );
                })()}
              </svg>
              <span className="absolute bottom-1 right-2 text-[8px] font-mono text-[#C8DE72]/70">
                PWM CARRIER: 20.0 kHz
              </span>
            </div>

            {/* Simulation Cycle Play/Pause Toggle */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setAutoCycle(!autoCycle)}
                className="text-[11px] text-[#D87535] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                {autoCycle ? (
                  <>
                    <Pause className="w-3 h-3" /> Pause Auto Cycle
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" /> Resume Auto Cycle
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setTargetAngle(45);
                  setAutoCycle(true);
                }}
                className="text-[10px] text-[#8C8275] hover:text-[#22201D] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset Neutral (45°)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
