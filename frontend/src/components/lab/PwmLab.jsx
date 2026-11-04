import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  RotateCw,
  Sun,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export function PwmLab({ onSaveConfig, initialConfig }) {
  // Parameters
  const [dutyCycle, setDutyCycle] = useState(initialConfig?.dutyCycle ?? 50.0);
  const [frequencyHz, setFrequencyHz] = useState(initialConfig?.frequencyHz ?? 1000);
  const [supplyVoltage, setSupplyVoltage] = useState(initialConfig?.supplyVoltage ?? 5.0);
  const [loadType, setLoadType] = useState(initialConfig?.loadType ?? 'BOTH'); // 'LED' | 'MOTOR' | 'BOTH'
  const [isRunning, setIsRunning] = useState(true);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const phaseRef = useRef(0);
  const motorAngleRef = useRef(0);

  // Derived math
  const periodSeconds = 1 / frequencyHz;
  const periodMs = periodSeconds * 1000;
  const tOnMs = periodMs * (dutyCycle / 100);
  const tOffMs = periodMs * (1 - dutyCycle / 100);
  const vAvg = (dutyCycle / 100) * supplyVoltage;
  const vRms = supplyVoltage * Math.sqrt(dutyCycle / 100);

  // Estimated Motor RPM (ideal DC motor proportional to Vavg)
  const maxRpm = supplyVoltage === 24 ? 6000 : supplyVoltage === 12 ? 3500 : 1200;
  const estimatedRpm = Math.round((dutyCycle / 100) * maxRpm);

  // Reset
  const handleReset = () => {
    setDutyCycle(50.0);
    setFrequencyHz(1000);
    setSupplyVoltage(5.0);
    setLoadType('BOTH');
    setIsRunning(true);
  };

  // Oscilloscope & Actuator Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let lastTime = performance.now();

    const render = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isRunning) {
        // Increment phase for waveform scrolling
        // Modulate scroll speed by frequency for visual realism
        const visualSpeed = Math.min(frequencyHz, 60) * 4;
        phaseRef.current = (phaseRef.current + dt * visualSpeed) % 1;

        // Increment motor rotation angle
        const angularVelocity = (estimatedRpm * 2 * Math.PI) / 60;
        motorAngleRef.current = (motorAngleRef.current + angularVelocity * dt) % (2 * Math.PI);
      }

      // Draw Oscilloscope
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(101, 95, 85, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Rails
      const highY = 35;
      const lowY = h - 35;

      // Draw VCC line
      ctx.strokeStyle = 'rgba(200, 222, 114, 0.25)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, highY);
      ctx.lineTo(w, highY);
      ctx.stroke();

      // Draw Average Voltage line
      const vAvgY = lowY - (dutyCycle / 100) * (lowY - highY);
      ctx.strokeStyle = '#87945B';
      ctx.beginPath();
      ctx.moveTo(0, vAvgY);
      ctx.lineTo(w, vAvgY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw PWM Waveform
      ctx.strokeStyle = '#C8DE72';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(200, 222, 114, 0.7)';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const wavelengthPx = 160;
      const onPx = wavelengthPx * (dutyCycle / 100);
      const startOffset = -(phaseRef.current * wavelengthPx);

      let currentX = startOffset;
      let first = true;

      while (currentX < w + wavelengthPx) {
        const nextFallingX = currentX + onPx;
        const nextCycleX = currentX + wavelengthPx;

        if (first) {
          ctx.moveTo(Math.max(0, currentX), highY);
          first = false;
        }

        ctx.lineTo(nextFallingX, highY);
        ctx.lineTo(nextFallingX, lowY);
        ctx.lineTo(nextCycleX, lowY);
        ctx.lineTo(nextCycleX, highY);

        currentX = nextCycleX;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isRunning, dutyCycle, frequencyHz, estimatedRpm]);

  // Flicker factor for low frequency (< 35 Hz)
  const isFlickering = frequencyHz < 35;
  const ledIntensity = dutyCycle / 100;

  return (
    <div className="space-y-6">
      {/* Simulation Controls & Parameters Bar */}
      <div className="rounded-2xl border border-[#655F55] bg-[#242522]/70 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#655F55] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C8DE72] uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              Pulse-Width Modulation Engine
            </div>
            <h3 className="font-heading text-xl font-bold text-[#FAF5EB]">
              PWM Signal & Power Modulation Lab
            </h3>
            <p className="text-xs text-[#C9BDAA] mt-0.5">
              Adjust duty cycle and carrier frequency to analyze average voltage, inductive motor RPM, and LED dimming.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isRunning ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-1.5"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? 'Pause Waveform' : 'Resume'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} title="Reset to defaults">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            {onSaveConfig && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onSaveConfig({
                    experimentType: 'PWM',
                    title: `PWM Lab: ${dutyCycle}% Duty @ ${frequencyHz}Hz (${supplyVoltage}V)`,
                    configState: { dutyCycle, frequencyHz, supplyVoltage, loadType },
                  })
                }
              >
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Duty Cycle Slider */}
          <div className="space-y-1.5 bg-[#1E1C19] p-3 rounded-xl border border-[#655F55]">
            <div className="flex justify-between">
              <span className="text-[#C9BDAA]">DUTY CYCLE (D):</span>
              <span className="text-[#C8DE72] font-bold">{dutyCycle.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="100.0"
              step="0.5"
              value={dutyCycle}
              onChange={(e) => setDutyCycle(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#655F55] rounded-lg appearance-none cursor-pointer accent-[#C8DE72]"
            />
            <div className="flex justify-between text-[10px] text-[#C9BDAA]">
              <span>Ton: {tOnMs < 1 ? `${(tOnMs * 1000).toFixed(0)} µs` : `${tOnMs.toFixed(2)} ms`}</span>
              <span>Toff: {tOffMs < 1 ? `${(tOffMs * 1000).toFixed(0)} µs` : `${tOffMs.toFixed(2)} ms`}</span>
            </div>
          </div>

          {/* Carrier Frequency Slider */}
          <div className="space-y-1.5 bg-[#1E1C19] p-3 rounded-xl border border-[#655F55]">
            <div className="flex justify-between">
              <span className="text-[#C9BDAA]">FREQUENCY (f):</span>
              <span className="text-[#C8DE72] font-bold">
                {frequencyHz >= 1000 ? `${(frequencyHz / 1000).toFixed(1)} kHz` : `${frequencyHz} Hz`}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="40000"
              step="5"
              value={frequencyHz}
              onChange={(e) => setFrequencyHz(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#655F55] rounded-lg appearance-none cursor-pointer accent-[#C8DE72]"
            />
            <div className="flex justify-between text-[10px] text-[#C9BDAA]">
              <span>Period T: {periodMs < 1 ? `${(periodMs * 1000).toFixed(0)} µs` : `${periodMs.toFixed(2)} ms`}</span>
              <span className={frequencyHz > 20000 ? 'text-emerald-400' : 'text-amber-400'}>
                {frequencyHz >= 20000 ? 'Inaudible' : 'Audible range'}
              </span>
            </div>
          </div>

          {/* Supply Voltage Selection */}
          <div className="space-y-1.5 bg-[#1E1C19] p-3 rounded-xl border border-[#655F55]">
            <span className="text-[#C9BDAA]">SUPPLY VOLTAGE (V_CC):</span>
            <select
              value={supplyVoltage}
              onChange={(e) => setSupplyVoltage(parseFloat(e.target.value))}
              className="w-full bg-[#242522] border border-[#655F55] focus:border-[#C8DE72] rounded-lg p-2 text-xs text-[#FAF5EB] outline-none font-mono"
            >
              <option value="3.3">3.3V (Logic rail / Microcontroller core)</option>
              <option value="5.0">5.0V (Standard USB / TTL rail)</option>
              <option value="12.0">12.0V (Standard Robotics DC Motor)</option>
              <option value="24.0">24.0V (Industrial BLDC Inverter)</option>
            </select>
          </div>

          {/* Target Load Selection */}
          <div className="space-y-1.5 bg-[#1E1C19] p-3 rounded-xl border border-[#655F55]">
            <span className="text-[#C9BDAA]">SIMULATED LOAD:</span>
            <div className="flex gap-1.5">
              {['LED', 'MOTOR', 'BOTH'].map((t) => (
                <button
                  key={t}
                  onClick={() => setLoadType(t)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    loadType === t
                      ? 'bg-[#C8DE72] text-[#1E1C19]'
                      : 'bg-[#242522] text-[#C9BDAA] hover:text-[#FAF5EB]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Oscilloscope Waveform Display */}
      <div className="rounded-2xl border border-[#655F55] bg-[#1E1C19] overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-[#242522] border-b border-[#655F55] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#C8DE72]">
            <Activity className="w-3.5 h-3.5" />
            <span>CONTINUOUS PWM WAVEFORM (V_PEAK = +{supplyVoltage.toFixed(1)}V)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold">
              V_AVG = +{vAvg.toFixed(2)}V ({dutyCycle.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="p-4 relative">
          <canvas ref={canvasRef} width={800} height={180} className="w-full h-44 block" />
          <div className="flex justify-between items-center text-[10px] font-mono text-[#C9BDAA] pt-2 border-t border-[#655F55]/60">
            <span>VOLTAGE SCALE: 0V TO +{supplyVoltage.toFixed(1)}V</span>
            <span className="text-emerald-400 font-semibold">GREEN DASH = AVERAGE EFFECTIVE DC VOLTAGE</span>
            <span>DUTY = {dutyCycle.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Physical Actuator Simulation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Actuator 1: LED Brightness Simulation */}
        {(loadType === 'LED' || loadType === 'BOTH') && (
          <div className="p-5 rounded-2xl border border-[#655F55] bg-[#242522]/70 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C8DE72] font-bold">
                  <Sun className="w-4 h-4" />
                  LED Dimming & Persistence of Vision
                </div>
                <Badge variant={isFlickering ? 'amber' : 'cyan'}>
                  {isFlickering ? 'VISIBLE FLICKER (<35Hz)' : 'SMOOTH FUSION (>60Hz)'}
                </Badge>
              </div>
              <p className="text-xs text-[#C9BDAA] leading-relaxed">
                The LED is not emitting half-power photons; it switches completely ON and OFF. At frequencies
                above 60 Hz, the human eye integrates the optical pulses into perceived average brightness.
              </p>
            </div>

            {/* Visual Simulated LED Bulb */}
            <div className="flex items-center justify-center p-6 bg-[#1E1C19] rounded-xl border border-[#655F55]">
              <div
                className="w-16 h-16 rounded-full transition-all duration-75 flex items-center justify-center text-xs font-mono font-bold"
                style={{
                  backgroundColor: `rgba(200, 222, 114, ${Math.max(0.08, ledIntensity)})`,
                  boxShadow: `0 0 ${ledIntensity * 40}px rgba(200, 222, 114, ${ledIntensity * 0.9})`,
                  color: ledIntensity > 0.4 ? '#1E1C19' : '#C9BDAA',
                }}
              >
                {Math.round(dutyCycle)}%
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#C9BDAA] flex justify-between">
              <span>Perceived Lumens: {(ledIntensity * 100).toFixed(0)}%</span>
              <span className="text-[#C8DE72]">V_avg: +{vAvg.toFixed(2)}V</span>
            </div>
          </div>
        )}

        {/* Actuator 2: DC Motor Rotation Simulation */}
        {(loadType === 'MOTOR' || loadType === 'BOTH') && (
          <div className="p-5 rounded-2xl border border-[#655F55] bg-[#242522]/70 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#87945B] font-bold">
                  <RotateCw className="w-4 h-4" />
                  DC Motor Inductive Velocity Modulation
                </div>
                <Badge variant="emerald">{estimatedRpm} RPM</Badge>
              </div>
              <p className="text-xs text-[#C9BDAA] leading-relaxed">
                Motor winding inductance ($L$) filters high-frequency PWM square waves into smooth continuous
                DC torque. Back-EMF increases linearly with angular velocity.
              </p>
            </div>

            {/* Visual Simulated Spinning Rotor */}
            <div className="flex items-center justify-center p-6 bg-[#1E1C19] rounded-xl border border-[#655F55] relative">
              <div
                className="w-20 h-20 rounded-full border-4 border-[#87945B] flex items-center justify-center relative shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                style={{
                  transform: `rotate(${motorAngleRef.current}rad)`,
                }}
              >
                {/* Rotor cross-hairs */}
                <div className="w-full h-1 bg-[#87945B]" />
                <div className="h-full w-1 bg-[#87945B] absolute" />
                <div className="w-4 h-4 rounded-full bg-[#FAF5EB] absolute shadow" />
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#C9BDAA] flex justify-between">
              <span>Estimated Velocity: {estimatedRpm} RPM</span>
              <span className="text-[#87945B]">Torque: ~{(dutyCycle * 0.015).toFixed(2)} N·m</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

