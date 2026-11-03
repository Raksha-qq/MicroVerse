import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Zap,
  RotateCw,
  Activity,
  ArrowRight,
  Info,
  Radio,
  Sliders,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { Badge } from '../common/Badge';

export function FollowTheSignal() {
  const [selectedStage, setSelectedStage] = useState('sensors');

  const stages = [
    {
      id: 'sensors',
      stepNumber: '01',
      title: 'Sensors',
      category: 'Physical Transduction',
      shortRole: 'Convert environmental & kinematic phenomena into electrical signals.',
      icon: Radio,
      color: '#55C7FF',
      role: 'Measures continuous physical parameters—such as rotary joint position, angular rate, acceleration, or acoustic echo flight time—and outputs analog voltages or digitized packet bytes.',
      input: 'Physical phenomena (photons, magnetic flux, mechanical rotation, acoustic pressure wave).',
      output: 'Analog voltage (0V–3.3V / 0V–5V) or digitized serial byte packets (I2C / SPI frames).',
      communication: 'I2C (Fast-Mode 400kHz), SPI (up to 20MHz), or analog ADC voltage channels with RC anti-aliasing filtering.',
      exampleData: 'MPU6050 Gyro: { gx: +0.42 deg/s, gy: -1.85 deg/s, gz: +24.10 deg/s } over I2C register 0x43.',
      interconnections: 'Direct PCB traces to Microcontroller SDA/SCL pins with 4.7kΩ pull-up resistors to 3.3V; decoupling capacitor (0.1µF) placed adjacent to VDD.',
    },
    {
      id: 'processing',
      stepNumber: '02',
      title: 'Signal Processing',
      category: 'Filtering & Conditioning',
      shortRole: 'Filter electrical noise, compensate drift & condition inputs.',
      icon: Activity,
      color: '#A5E3FF',
      role: 'Filters high-frequency electrical noise from sensor readings, applies calibration offsets, and fuses disparate sensor streams (e.g. Kalman Filter / Complementary Filter for IMU pose).',
      input: 'Raw quantized ADC integer samples or raw digital gyroscope and accelerometer vectors.',
      output: 'Filtered state estimations (e.g., filtered robot pitch angle: θ = 14.2°, velocity: v = 0.65 m/s).',
      communication: 'Internal CPU registers, ALU mathematical operations, and DMA buffers in microcontroller SRAM.',
      exampleData: 'Complementary Filter: angle = 0.98 * (angle + gyro * dt) + 0.02 * accel_angle = 12.45°',
      interconnections: 'Executes inside microcontroller CPU core; relies on hardware FPU or fixed-point integer math routines.',
    },
    {
      id: 'microcontroller',
      stepNumber: '03',
      title: 'Microcontroller',
      category: 'Real-Time Control Core',
      shortRole: 'Execute closed-loop PID control & command peripherals.',
      icon: Cpu,
      color: '#10B981',
      role: 'The deterministic master controller. Executes closed-loop PID algorithm, updates finite state machine, checks safety limits, and programs hardware timers to output PWM pulses.',
      input: 'Processed state feedback (current angle, encoder counts) and high-level setpoints from host SBC.',
      output: 'Low-voltage digital control logic (Direction signals HIGH/LOW) and hardware timer PWM wave trains (0–100% duty cycle).',
      communication: 'Timer PWM peripheral channels (e.g. TIM1_CH1, TIM1_CH2) and general-purpose digital output GPIO pins.',
      exampleData: 'PID Loop @ 1kHz: Error e = 5.2°, PID Output = 184 (Maps to 72.1% PWM duty cycle on Pin PB8).',
      interconnections: 'Connected to Motor Driver logic input pins (IN1, IN2, PWM) via 3.3V or 5V logic lines with current-limiting series resistors (100Ω).',
    },
    {
      id: 'motordriver',
      stepNumber: '04',
      title: 'Motor Driver',
      category: 'Power Electronics Stage',
      shortRole: 'Switch high-voltage, high-current power using H-Bridge MOSFETs.',
      icon: Zap,
      color: '#FBBF24',
      role: 'Amplifies low-power microcontroller logic into high-voltage, high-current pulses. Employs H-Bridge power MOSFETs to reverse current polarity and modulate power without smoking MCU silicon.',
      input: '3.3V or 5V logic signals (PWM for speed, DIR for direction, ENABLE for safety shutoff).',
      output: 'High-voltage, high-current modulated power (e.g. 12V / 24V pulsed up to 5A peak per motor phase).',
      communication: 'Gate driver transistors, optocouplers for electrical isolation, and internal dead-time insertion logic to prevent shoot-through shorts.',
      exampleData: 'V_out = +12.0V pulsed at 20 kHz carrier with 72% duty cycle; Average current I = 1.45 Amperes.',
      interconnections: 'Inputs connected to MCU GPIOs; high-voltage side connected to DC battery supply and heavy-gauge motor lead wires; bypass bulk electrolytic capacitors (470µF) buffer inductive surges.',
    },
    {
      id: 'actuators',
      stepNumber: '05',
      title: 'Actuators',
      category: 'Electromechanical Output',
      shortRole: 'Convert electromagnetic force into mechanical torque & motion.',
      icon: RotateCw,
      color: '#EC4899',
      role: 'The physical muscles of the machine. Permanent magnet fields interact with stator coil currents (Lorentz force: F = I * L x B) to generate rotational torque, driving wheels, linkages, or grippers.',
      input: 'Pulsed electrical voltage and winding current from the motor driver power stage.',
      output: 'Rotary mechanical torque (Newton-meters) and angular velocity (RPM / rad/s) displacing physical mechanics.',
      communication: 'Electromagnetic induction; magnetic flux lines coupling rotor magnets and copper wire windings.',
      exampleData: 'Torque τ = 0.85 N·m @ 240 RPM; Back-EMF generated = 8.64V counteracting applied voltage.',
      interconnections: 'Heavy twisted-pair copper motor phase wires connected to H-Bridge output terminals; mechanical shaft coupled to gear reduction box and encoder disc.',
    },
  ];

  const current = stages.find((s) => s.id === selectedStage) || stages[0];
  const Icon = current.icon;

  return (
    <div className="space-y-6 rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 sm:p-7 backdrop-blur-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#192B40] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            Interactive Hardware Signal Flow
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#EAF5FF]">
            Follow the Signal: Sensors to Actuation
          </h2>
          <p className="text-xs text-[#8FA6BC] mt-0.5">
            Trace how a physical phenomenon travels through the entire mechatronic pipeline into mechanical torque.
          </p>
        </div>
        <Badge variant="cyan">END-TO-END PIPELINE</Badge>
      </div>

      {/* Animated Signal Pipeline Diagram */}
      <div className="relative py-4">
        {/* Connection Wire Backbone */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-[#192B40] rounded-full hidden md:block z-0">
          {/* Animated Flow Pulse */}
          <div className="h-full w-24 bg-gradient-to-r from-transparent via-[#55C7FF] to-transparent animate-pulse rounded-full opacity-80" />
        </div>

        {/* 5 Stage Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
          {stages.map((stage, idx) => {
            const StageIcon = stage.icon;
            const isSelected = selectedStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`group p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#192B40] border-[#55C7FF] shadow-[0_0_20px_rgba(85,199,255,0.25)] ring-1 ring-[#55C7FF] -translate-y-1'
                    : 'bg-[#0B1220]/90 border-[#192B40] hover:border-[#8FA6BC]/50 hover:bg-[#111E30]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ backgroundColor: `${stage.color}15`, border: `1px solid ${stage.color}40` }}
                    >
                      <StageIcon className="w-4 h-4" style={{ color: stage.color }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#8FA6BC]">
                      STEP {stage.stepNumber}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[#8FA6BC] uppercase tracking-wider">
                    {stage.category}
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#EAF5FF] group-hover:text-[#55C7FF] transition-colors mt-0.5">
                    {stage.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#192B40]/60 text-[11px] text-[#8FA6BC] line-clamp-2">
                  {stage.shortRole}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Component In-Depth Telemetry Inspector */}
      <div className="rounded-xl border border-[#192B40] bg-[#0B1220]/95 p-5 sm:p-6 space-y-5 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#192B40]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${current.color}15`, border: `1px solid ${current.color}50` }}
            >
              <Icon className="w-5 h-5" style={{ color: current.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#55C7FF]">
                  STAGE {current.stepNumber} INSPECTOR
                </span>
                <span className="text-xs text-[#8FA6BC]">•</span>
                <span className="text-xs font-mono text-[#A5E3FF]">{current.category}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#EAF5FF]">{current.title}</h3>
            </div>
          </div>
          <Badge variant="cyan">{current.category.toUpperCase()}</Badge>
        </div>

        {/* Detailed Role Explanation */}
        <p className="text-sm text-[#EAF5FF] leading-relaxed">
          {current.role}
        </p>

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#111E30]/70 border border-[#192B40] space-y-1">
            <div className="text-[11px] font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
              Input & Output Signal Domain
            </div>
            <div className="text-xs font-mono text-[#8FA6BC]">
              <span className="text-[#EAF5FF] font-semibold">Input: </span>
              {current.input}
            </div>
            <div className="text-xs font-mono text-[#8FA6BC] pt-1">
              <span className="text-[#10B981] font-semibold">Output: </span>
              {current.output}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111E30]/70 border border-[#192B40] space-y-1">
            <div className="text-[11px] font-mono text-[#A5E3FF] uppercase tracking-wider font-semibold">
              Communication Protocol & Electrical Levels
            </div>
            <p className="text-xs font-mono text-[#8FA6BC] leading-relaxed">
              {current.communication}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#111E30]/70 border border-[#192B40] space-y-1">
            <div className="text-[11px] font-mono text-[#10B981] uppercase tracking-wider font-semibold">
              Concrete Real-Time Data Sample
            </div>
            <div className="p-2.5 rounded bg-[#0B1220] border border-[#192B40] text-xs font-mono text-[#55C7FF]">
              <code>{current.exampleData}</code>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111E30]/70 border border-[#192B40] space-y-1">
            <div className="text-[11px] font-mono text-[#FBBF24] uppercase tracking-wider font-semibold">
              Hardware Interconnection & Protection
            </div>
            <p className="text-xs font-mono text-[#8FA6BC] leading-relaxed">
              {current.interconnections}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
