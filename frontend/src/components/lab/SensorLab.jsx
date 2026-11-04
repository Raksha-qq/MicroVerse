import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Thermometer,
  Waves,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export function SensorLab({ onSaveConfig, initialConfig }) {
  // Environmental & Sensor Parameters
  const [targetDistanceCm, setTargetDistanceCm] = useState(initialConfig?.targetDistanceCm ?? 50.0);
  const [ambientTempC, setAmbientTempC] = useState(initialConfig?.ambientTempC ?? 20.0);
  const [surfaceMaterial, setSurfaceMaterial] = useState(initialConfig?.surfaceMaterial ?? 'HARD'); // 'HARD' | 'SOFT'
  const [enableNoise, setEnableNoise] = useState(initialConfig?.enableNoise ?? true);
  const [filterWindowSize, setFilterWindowSize] = useState(initialConfig?.filterWindowSize ?? 5);
  const [isRunning, setIsRunning] = useState(true);

  // Filter history
  const [rawReadings, setRawReadings] = useState([]);
  const [filteredDistanceCm, setFilteredDistanceCm] = useState(targetDistanceCm);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const bufferRef = useRef([]);

  // Physics calculation
  // Speed of sound in air: v = 331.3 + 0.606 * Tc (m/s)
  const speedOfSoundMps = 331.3 + 0.606 * ambientTempC;
  const speedOfSoundCmPerUs = (speedOfSoundMps * 100) / 1000000; // cm / microsecond

  // Ideal echo time: t = (2 * distance) / speed
  const idealEchoTimeUs = (2 * targetDistanceCm) / speedOfSoundCmPerUs;

  // Reset
  const handleReset = () => {
    setTargetDistanceCm(50.0);
    setAmbientTempC(20.0);
    setSurfaceMaterial('HARD');
    setEnableNoise(true);
    setFilterWindowSize(5);
    setRawReadings([]);
    bufferRef.current = [];
    setIsRunning(true);
  };

  // Sampling Interval Loop (Simulates MCU timer sampling at 20Hz / 50ms)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Generate noise
      let measuredEchoUs = idealEchoTimeUs;
      if (enableNoise) {
        // Gaussian-like noise (Box-Muller transform)
        const u1 = Math.random() || 0.001;
        const u2 = Math.random() || 0.001;
        const randStd = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        // Soft materials absorb sound, causing occasional acoustic dropouts / higher jitter
        const jitterScale = surfaceMaterial === 'SOFT' ? 4.5 : 1.5;
        const noiseUs = randStd * jitterScale * 25; // in microseconds
        measuredEchoUs = Math.max(116, idealEchoTimeUs + noiseUs); // min 2cm ~ 116us
      }

      // Calculate measured distance
      const rawDist = (measuredEchoUs * speedOfSoundCmPerUs) / 2;

      // Update moving average filter buffer
      bufferRef.current.push(rawDist);
      if (bufferRef.current.length > filterWindowSize) {
        bufferRef.current.shift();
      }

      const avg =
        bufferRef.current.reduce((acc, v) => acc + v, 0) / bufferRef.current.length;

      setFilteredDistanceCm(avg);
      setRawReadings((prev) => [...prev.slice(-30), rawDist]);
    }, 50);

    return () => clearInterval(interval);
  }, [
    isRunning,
    idealEchoTimeUs,
    speedOfSoundCmPerUs,
    enableNoise,
    surfaceMaterial,
    filterWindowSize,
  ]);

  // Canvas Oscilloscope for Trigger (10us) and Echo Pulse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawPulses = () => {
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

      // Channel 1: TRIGGER Pulse (10 µs)
      const trigY_high = 30;
      const trigY_low = 65;

      ctx.fillStyle = '#C8DE72';
      ctx.font = '10px monospace';
      ctx.fillText('CH1: TRIGGER (10µs PULSE FROM MCU TIMER)', 15, 20);

      ctx.strokeStyle = '#C8DE72';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(15, trigY_low);
      ctx.lineTo(40, trigY_low);
      ctx.lineTo(40, trigY_high); // Rising
      ctx.lineTo(55, trigY_high); // 10µs duration
      ctx.lineTo(55, trigY_low);  // Falling
      ctx.lineTo(w - 15, trigY_low);
      ctx.stroke();

      // Channel 2: ECHO Return Pulse
      const echoY_high = 100;
      const echoY_low = 135;

      ctx.fillStyle = '#87945B';
      ctx.fillText(
        `CH2: ECHO PULSE (DURATION = ${idealEchoTimeUs.toFixed(0)}µs ~ ${(idealEchoTimeUs / 1000).toFixed(2)}ms)`,
        15,
        90
      );

      ctx.strokeStyle = '#87945B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(15, echoY_low);
      ctx.lineTo(80, echoY_low); // Propagation delay offset
      ctx.lineTo(80, echoY_high); // Echo rising edge

      // Map echo duration onto canvas width proportionally
      const maxPulsePx = w - 160;
      const echoWidthPx = Math.min(maxPulsePx, (idealEchoTimeUs / 23200) * maxPulsePx); // 400cm max ~ 23200us

      ctx.lineTo(80 + echoWidthPx, echoY_high);
      ctx.lineTo(80 + echoWidthPx, echoY_low); // Echo falling edge
      ctx.lineTo(w - 15, echoY_low);
      ctx.stroke();

      // Measurement marker
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(80, echoY_high - 10);
      ctx.lineTo(80, echoY_low + 10);
      ctx.moveTo(80 + echoWidthPx, echoY_high - 10);
      ctx.lineTo(80 + echoWidthPx, echoY_low + 10);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    drawPulses();
  }, [idealEchoTimeUs]);

  return (
    <div className="space-y-6">
      {/* Simulation Controls & Parameters Bar */}
      <div className="rounded-2xl border border-[#655F55] bg-[#242522]/70 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#655F55] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C8DE72] uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5" />
              Acoustic Transduction & Time-of-Flight Lab
            </div>
            <h3 className="font-heading text-xl font-bold text-[#FAF5EB]">
              Ultrasonic Distance & Environmental Jitter Lab
            </h3>
            <p className="text-xs text-[#C9BDAA] mt-0.5">
              Simulate HC-SR04 sonar pulses, temperature-dependent speed of sound, surface absorption, and MCU input capture filtering.
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
              {isRunning ? 'Freeze Sonar' : 'Resume Sonar'}
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
                    experimentType: 'SENSOR',
                    title: `Sensor Lab: Sonar ${targetDistanceCm}cm @ ${ambientTempC}°C`,
                    configState: {
                      targetDistanceCm,
                      ambientTempC,
                      surfaceMaterial,
                      enableNoise,
                      filterWindowSize,
                    },
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
          {/* Target Distance Slider */}
          <div className="space-y-1.5 bg-[#1E1C19] p-3 rounded-xl border border-[#655F55]">
            <div className="flex justify-between">
              <span className="text-[#C9BDAA]">TARGET DISTANCE:</span>
              <span className="text-[#C8DE72] font-bold">{targetDistanceCm.toFixed(1)} cm</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="400.0"
              step="1.0"
              value={targetDistanceCm}
              onChange={(e) => setTargetDistanceCm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#655F55] rounded-lg appearance-none cursor-pointer accent-[#C8DE72]"
            />
            <div className="text-[10px] text-[#C9BDAA]">
              Echo Time: {idealEchoTimeUs.toFixed(0)} µs
            </div>
          </div>

          {/* Ambient Temperature Slider */}
          <div className="space-y-1.5 bg-[#1E1C19] p-3 rounded-xl border border-[#655F55]">
            <div className="flex justify-between">
              <span className="text-[#C9BDAA]">AMBIENT TEMP:</span>
              <span className="text-[#C8DE72] font-bold">{ambientTempC.toFixed(1)} °C</span>
            </div>
            <input
              type="range"
              min="-20.0"
              max="60.0"
              step="1.0"
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#655F55] rounded-lg appearance-none cursor-pointer accent-[#C8DE72]"
            />
            <div className="text-[10px] text-[#C9BDAA]">
              v_sound: {speedOfSoundMps.toFixed(1)} m/s
            </div>
          </div>

          {/* Surface Material Selection */}
          <div className="space-y-1.5 bg-[#1E1C19] p-3 rounded-xl border border-[#655F55]">
            <span className="text-[#C9BDAA]">SURFACE REFLECTIVITY:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setSurfaceMaterial('HARD')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  surfaceMaterial === 'HARD'
                    ? 'bg-[#C8DE72] text-[#1E1C19]'
                    : 'bg-[#242522] text-[#C9BDAA] hover:text-[#FAF5EB]'
                }`}
              >
                Hard / Metal
              </button>
              <button
                onClick={() => setSurfaceMaterial('SOFT')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  surfaceMaterial === 'SOFT'
                    ? 'bg-[#C8DE72] text-[#1E1C19]'
                    : 'bg-[#242522] text-[#C9BDAA] hover:text-[#FAF5EB]'
                }`}
              >
                Soft / Foam
              </button>
            </div>
          </div>

          {/* Sensor Noise & Filter Window */}
          <div className="space-y-1.5 bg-[#1E1C19] p-3 rounded-xl border border-[#655F55]">
            <div className="flex justify-between items-center">
              <span className="text-[#C9BDAA]">SENSOR JITTER:</span>
              <button
                onClick={() => setEnableNoise(!enableNoise)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                  enableNoise ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {enableNoise ? 'NOISE ON' : 'IDEAL'}
              </button>
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-[#C9BDAA]">MA Filter Window:</span>
              <span className="text-[#87945B] font-bold">{filterWindowSize} Samples</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={filterWindowSize}
              onChange={(e) => setFilterWindowSize(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#655F55] rounded-lg appearance-none cursor-pointer accent-[#87945B]"
            />
          </div>
        </div>
      </div>

      {/* Logic Analyzer: Trigger & Echo Pulses */}
      <div className="rounded-2xl border border-[#655F55] bg-[#1E1C19] overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-[#242522] border-b border-[#655F55] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#C8DE72]">
            <Activity className="w-3.5 h-3.5" />
            <span>HC-SR04 SONAR TIMING PROTOCOL (INPUT CAPTURE TIMER CHANNELS)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#C9BDAA]">
              AIR TEMP: <span className="text-[#C8DE72]">{ambientTempC}°C</span>
            </span>
          </div>
        </div>

        <div className="p-4 relative">
          <canvas ref={canvasRef} width={800} height={150} className="w-full h-36 block" />
          <div className="flex justify-between items-center text-[10px] font-mono text-[#C9BDAA] pt-2 border-t border-[#655F55]/60">
            <span>TRIGGER: 10 µs HIGH PULSE</span>
            <span>ECHO WIDTH: PROPORTIONAL TO 2x FLIGHT TIME</span>
            <span className="text-[#87945B] font-bold">
              t_echo = {(idealEchoTimeUs / 1000).toFixed(2)} ms
            </span>
          </div>
        </div>
      </div>

      {/* Raw Reading vs Filtered Reading Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-[#655F55] bg-[#242522]/70 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-[10px] font-mono text-[#C9BDAA] uppercase tracking-wider">
              GROUND TRUTH PHYSICAL DISTANCE
            </div>
            <div className="font-heading text-2xl font-bold text-[#FAF5EB] mt-1">
              {targetDistanceCm.toFixed(1)} cm
            </div>
            <p className="text-xs text-[#C9BDAA] mt-1">
              Actual geometric clearance between transceiver horn and obstacle.
            </p>
          </div>
          <div className="text-xs font-mono text-[#C8DE72]">
            Speed of Sound: {speedOfSoundMps.toFixed(2)} m/s
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
              RAW SENSOR READING (WITH JITTER)
            </div>
            <div className="font-heading text-2xl font-bold text-amber-300 mt-1">
              {(rawReadings[rawReadings.length - 1] ?? targetDistanceCm).toFixed(2)} cm
            </div>
            <p className="text-xs text-[#C9BDAA] mt-1">
              Direct arithmetic conversion from unbuffered timer input capture register.
            </p>
          </div>
          <div className="text-xs font-mono text-amber-400">
            Error: {Math.abs((rawReadings[rawReadings.length - 1] ?? targetDistanceCm) - targetDistanceCm).toFixed(2)} cm
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between space-y-3">
          <div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
              FILTERED DISTANCE (MOVING AVERAGE)
            </div>
            <div className="font-heading text-2xl font-bold text-emerald-300 mt-1">
              {filteredDistanceCm.toFixed(2)} cm
            </div>
            <p className="text-xs text-[#C9BDAA] mt-1">
              Smoothed output from {filterWindowSize}-sample circular memory buffer.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400">
            Jitter Reduced by ~{(100 * (1 - 1 / Math.sqrt(filterWindowSize))).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}

