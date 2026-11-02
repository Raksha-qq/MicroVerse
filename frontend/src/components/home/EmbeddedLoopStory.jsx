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
      accentColor: '#55C7FF',
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
      accentColor: '#A5E3FF',
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
      accentColor: '#10B981',
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111E30] border border-[#55C7FF]/30 text-xs font-mono text-[#55C7FF]">
          <Activity className="w-3.5 h-3.5" />
          <span>THE EMBEDDED FEEDBACK ARCHITECTURE</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF] tracking-tight">
          How Physical Machines Think
        </h2>
        <p className="text-sm sm:text-base text-[#8FA6BC] leading-relaxed">
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
              className={`p-4 rounded-xl text-left border transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-[#111E30] border-[#55C7FF] shadow-[0_0_20px_rgba(85,199,255,0.2)]'
                  : 'bg-[#111E30]/40 border-[#192B40] hover:border-[#55C7FF]/40 hover:bg-[#111E30]/70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isActive
                      ? 'bg-[#55C7FF] text-[#0B1220] shadow-[0_0_12px_rgba(85,199,255,0.5)]'
                      : 'bg-[#0B1220] text-[#55C7FF] border border-[#192B40]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant={isActive ? 'cyan' : 'muted'}>{stg.badge}</Badge>
              </div>

              <div className="font-mono text-xs font-semibold text-[#55C7FF]">
                {stg.title}
              </div>
              <div className="font-heading text-base font-bold text-[#EAF5FF] mt-0.5">
                {stg.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Story Visualizer Box */}
      <div className="rounded-2xl bg-gradient-to-b from-[#111E30] to-[#0B1220] border border-[#192B40] p-6 lg:p-8 space-y-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Dynamic Stage Explanation & Telemetry Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="cyan">{stages[activeStage].badge}</Badge>
              <span className="text-xs font-mono text-[#8FA6BC]">
                STAGE {activeStage + 1} OF 3
              </span>
            </div>

            <h3 className="font-heading text-2xl font-bold text-[#EAF5FF]">
              {stages[activeStage].subtitle}
            </h3>

            <p className="text-xs sm:text-sm text-[#8FA6BC] leading-relaxed">
              {stages[activeStage].summary}
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#55C7FF]">
                Architectural Execution Details:
              </div>
              {stages[activeStage].technicalPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-mono text-[#EAF5FF]">
                  <CheckCircle className="w-3.5 h-3.5 text-[#55C7FF] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Live Hardware Telemetry Monitor */}
          <div className="lg:col-span-5 bg-[#0B1220] border border-[#192B40] rounded-xl p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#192B40] pb-2 text-xs">
              <span className="flex items-center gap-2 text-[#55C7FF]">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                LIVE HARDWARE TELEMETRY
              </span>
              <span className="text-[10px] text-[#8FA6BC]">SAMPLE: #4192</span>
            </div>

            {/* Interactive Signal Control Slider */}
            <div className="space-y-1.5 bg-[#111E30]/60 p-3 rounded-lg border border-[#192B40]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8FA6BC]">SIMULATED JOINT ANGLE:</span>
                <span className="text-[#55C7FF] font-bold">{targetAngle}°</span>
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
                className="w-full h-1.5 bg-[#192B40] rounded-lg appearance-none cursor-pointer accent-[#55C7FF]"
              />
              <div className="flex justify-between text-[9px] text-[#8FA6BC]/60">
                <span>0° (Min)</span>
                <span>45° (Neutral)</span>
                <span>90° (Max)</span>
              </div>
            </div>

            {/* Telemetry Computed Register Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#111E30]/40 border border-[#192B40]">
                <div className="text-[10px] text-[#8FA6BC]">ADC1_DR (RAW):</div>
                <div className="text-sm font-bold text-[#55C7FF]">
                  0x{adcValue12Bit.toString(16).toUpperCase().padStart(3, '0')} ({adcValue12Bit})
                </div>
                <div className="text-[9px] text-[#8FA6BC]/70">{rawAnalogMv} mV Analog</div>
              </div>

              <div className="p-2.5 rounded bg-[#111E30]/40 border border-[#192B40]">
                <div className="text-[10px] text-[#8FA6BC]">PID_ERROR:</div>
                <div
                  className={`text-sm font-bold ${
                    errorDegrees === 0 ? 'text-[#10B981]' : 'text-[#FBBF24]'
                  }`}
                >
                  {errorDegrees > 0 ? `+${errorDegrees}` : errorDegrees}°
                </div>
                <div className="text-[9px] text-[#8FA6BC]/70">P-Term: {proportionalTerm}</div>
              </div>

              <div className="p-2.5 rounded bg-[#111E30]/40 border border-[#192B40]">
                <div className="text-[10px] text-[#8FA6BC]">TIM1_CCR1 (PWM):</div>
                <div className="text-sm font-bold text-[#A5E3FF]">{pwmDutyCycle}% DUTY</div>
                <div className="text-[9px] text-[#8FA6BC]/70">{pulseWidthUs} µs High</div>
              </div>

              <div className="p-2.5 rounded bg-[#111E30]/40 border border-[#192B40]">
                <div className="text-[10px] text-[#8FA6BC]">LOOP LATENCY:</div>
                <div className="text-sm font-bold text-[#10B981]">11.4 µs</div>
                <div className="text-[9px] text-[#8FA6BC]/70">Deterministic</div>
              </div>
            </div>

            {/* Simulated Mini Waveform Monitor */}
            <div className="h-16 rounded bg-[#07101b] border border-[#192B40] flex items-center justify-center p-2 relative overflow-hidden">
              <svg className="w-full h-full opacity-80" viewBox="0 0 300 50">
                <line x1="0" y1="25" x2="300" y2="25" stroke="#192B40" strokeWidth="1" strokeDasharray="2 2" />
                {activeStage === 0 && (
                  /* Analog Sine / Sensor Waveform */
                  <path
                    d={`M 0 25 Q 75 ${25 - (targetAngle - 45) * 0.4} 150 25 T 300 25`}
                    fill="none"
                    stroke="#55C7FF"
                    strokeWidth="2"
                    className="filter drop-shadow-[0_0_4px_rgba(85,199,255,0.8)]"
                  />
                )}
                {activeStage === 1 && (
                  /* Digital Clock / ALU Cycles */
                  <path
                    d="M 0 40 L 25 40 L 25 10 L 50 10 L 50 40 L 75 40 L 75 10 L 100 10 L 100 40 L 125 40 L 125 10 L 150 10 L 150 40 L 175 40 L 175 10 L 200 10 L 200 40 L 225 40 L 225 10 L 250 10 L 250 40 L 275 40 L 275 10 L 300 10"
                    fill="none"
                    stroke="#A5E3FF"
                    strokeWidth="1.5"
                  />
                )}
                {activeStage === 2 && (
                  /* PWM Output Waveform dynamically sizing with Duty Cycle */
                  <path
                    d={`M 0 40 L ${30 * (1 - pwmDutyCycle / 100)} 40 L ${
                      30 * (1 - pwmDutyCycle / 100)
                    } 10 L 30 10 L 30 40 L ${60 + 30 * (1 - pwmDutyCycle / 100)} 40 L ${
                      60 + 30 * (1 - pwmDutyCycle / 100)
                    } 10 L 90 10 L 90 40 L ${120 + 30 * (1 - pwmDutyCycle / 100)} 40 L ${
                      120 + 30 * (1 - pwmDutyCycle / 100)
                    } 10 L 150 10 L 150 40 L ${180 + 30 * (1 - pwmDutyCycle / 100)} 40 L ${
                      180 + 30 * (1 - pwmDutyCycle / 100)
                    } 10 L 210 10 L 210 40 L ${240 + 30 * (1 - pwmDutyCycle / 100)} 40 L ${
                      240 + 30 * (1 - pwmDutyCycle / 100)
                    } 10 L 270 10 L 270 40 L 300 40`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    className="filter drop-shadow-[0_0_4px_rgba(16,185,129,0.8)]"
                  />
                )}
              </svg>
              <div className="absolute right-2 bottom-1 text-[8px] font-mono text-[#8FA6BC]">
                {activeStage === 0 ? 'ANALOG INPUT' : activeStage === 1 ? 'ALU CLOCK' : 'PWM OUTPUT'}
              </div>
            </div>
          </div>
        </div>

        {/* Step Progression Controller Footer */}
        <div className="pt-4 border-t border-[#192B40] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoCycle(!autoCycle)}
              className="px-3 py-1.5 rounded-md bg-[#192B40] text-[#EAF5FF] hover:text-[#55C7FF] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {autoCycle ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoCycle ? 'PAUSE CYCLE' : 'AUTO-PLAY CYCLE'}</span>
            </button>
            <button
              onClick={() => {
                setActiveStage(0);
                setTargetAngle(45);
              }}
              className="p-1.5 rounded-md text-[#8FA6BC] hover:text-[#EAF5FF] transition-colors cursor-pointer"
              title="Reset parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8FA6BC]">FEEDBACK CONVERGENCE:</span>
            <span className="text-[#10B981] font-bold">100% NOMINAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

