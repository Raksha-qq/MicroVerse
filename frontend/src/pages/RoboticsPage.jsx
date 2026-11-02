import React, { useState } from 'react';
import { Bot, Activity, Sliders, Cpu, Zap, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export function RoboticsPage() {
  const [kp, setKp] = useState(2.2);
  const [ki, setKi] = useState(0.5);
  const [kd, setKd] = useState(0.8);

  const pillars = [
    {
      title: 'Closed-Loop PID Control',
      badge: 'FEEDBACK MECHANICS',
      desc: 'Minimizing joint error using proportional, integral, and derivative algorithms. Calibrate convergence rates to avoid oscillation and mechanical overshoot.',
      metrics: '50 kHz Loop Rate • Zero Steady-State Error',
    },
    {
      title: 'Field-Oriented Control (FOC)',
      badge: 'BLDC MOTOR DRIVE',
      desc: 'Clarke and Park transformations decompose stator currents into torque and flux vectors, achieving whisper-quiet, high-torque robotic limb articulation.',
      metrics: 'Space-Vector PWM • 3-Phase Shunt Sensing',
    },
    {
      title: 'Sensor Fusion (Kalman Filter)',
      badge: 'IMU POSE ESTIMATION',
      desc: 'Combining noisy accelerometer vectors with high-drift gyroscope rates to compute rock-solid roll and pitch orientations for balancing robots and drones.',
      metrics: '6-DOF Inertial Fusion • 1 ms Estimation',
    },
    {
      title: 'Physical AI & Edge TinyML',
      badge: 'NEURAL INFERENCE',
      desc: 'Deploying quantized int8 neural networks onto ARM Cortex-M microcontrollers using CMSIS-NN kernels for vibration anomaly detection and gesture control.',
      metrics: '35KB RAM Footprint • 14ms Inference',
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <Bot className="w-3.5 h-3.5" />
          Physical Artificial Intelligence
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
          Robotics & Mechatronics Laboratory
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1 max-w-2xl">
          Where deterministic firmware controls physical mechanics. Explore closed-loop motor commutation, sensor fusion, and real-time kinematic control.
        </p>
      </div>

      {/* 4 Robotics Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pillars.map((pil, idx) => (
          <Card key={idx} className="space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={idx === 0 ? 'cyan' : idx === 1 ? 'ice' : idx === 2 ? 'amber' : 'emerald'}>
                  {pil.badge}
                </Badge>
                <span className="text-[10px] font-mono text-[#8FA6BC]">MODULE 0{idx + 1}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#EAF5FF]">
                {pil.title}
              </h3>
              <p className="text-xs text-[#8FA6BC] leading-relaxed">
                {pil.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-[#192B40] text-xs font-mono text-[#55C7FF]">
              {pil.metrics}
            </div>
          </Card>
        ))}
      </div>

      {/* Interactive PID Simulator Card */}
      <Card className="p-6 sm:p-8 space-y-6 border-[#55C7FF]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#192B40] pb-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#EAF5FF] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#55C7FF]" />
              Interactive Joint PID Step Response Tuning
            </h2>
            <p className="text-xs text-[#8FA6BC] mt-0.5">
              Adjust gains to observe robotic joint settling time and damping ratio.
            </p>
          </div>
          <Badge variant="cyan">REAL-TIME SIMULATION</Badge>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
          <div className="space-y-2 bg-[#0B1220] p-4 rounded-xl border border-[#192B40]">
            <div className="flex justify-between">
              <span className="text-[#8FA6BC]">Kp (PROPORTIONAL):</span>
              <span className="text-[#55C7FF] font-bold">{kp.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={kp}
              onChange={(e) => setKp(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#192B40] rounded-lg appearance-none cursor-pointer accent-[#55C7FF]"
            />
            <div className="text-[10px] text-[#8FA6BC]/70">Controls direct reaction to error magnitude</div>
          </div>

          <div className="space-y-2 bg-[#0B1220] p-4 rounded-xl border border-[#192B40]">
            <div className="flex justify-between">
              <span className="text-[#8FA6BC]">Ki (INTEGRAL):</span>
              <span className="text-[#A5E3FF] font-bold">{ki.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={ki}
              onChange={(e) => setKi(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#192B40] rounded-lg appearance-none cursor-pointer accent-[#A5E3FF]"
            />
            <div className="text-[10px] text-[#8FA6BC]/70">Eliminates persistent steady-state offset</div>
          </div>

          <div className="space-y-2 bg-[#0B1220] p-4 rounded-xl border border-[#192B40]">
            <div className="flex justify-between">
              <span className="text-[#8FA6BC]">Kd (DERIVATIVE):</span>
              <span className="text-[#10B981] font-bold">{kd.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.1"
              value={kd}
              onChange={(e) => setKd(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#192B40] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
            />
            <div className="text-[10px] text-[#8FA6BC]/70">Dampens oscillation & anticipates motion</div>
          </div>
        </div>

        {/* Step Response Simulated Curve */}
        <div className="h-44 rounded-xl oscilloscope-screen p-4 flex flex-col justify-between relative">
          <div className="flex justify-between text-[10px] font-mono text-[#8FA6BC] z-10">
            <span>SETPOINT: 90.0° TARGET</span>
            <span>SETTLING TIME: ~120 ms</span>
          </div>

          <svg className="w-full h-28 opacity-90 z-10" viewBox="0 0 500 100">
            {/* Target line */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#192B40" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Dynamic Step Response Curve */}
            <path
              d={`M 0 90 Q 60 ${20 - (kp - 2.5) * 15} 120 ${30 + (ki - 0.5) * 10} T 240 ${
                30 - (kd - 1) * 8
              } T 360 30 L 500 30`}
              fill="none"
              stroke="#55C7FF"
              strokeWidth="2.5"
              className="filter drop-shadow-[0_0_8px_rgba(85,199,255,0.7)]"
            />
          </svg>

          <div className="flex justify-between text-[10px] font-mono text-[#55C7FF] z-10">
            <span>0 ms</span>
            <span>CRITICALLY DAMPED NOMINAL CONVERGENCE</span>
            <span>300 ms</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

