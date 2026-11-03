import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export function SignalLab({ onSaveConfig, initialConfig }) {
  // Signal State
  const [logicStandard, setLogicStandard] = useState(initialConfig?.logicStandard || '3.3V_LVCMOS');
  const [frequencyHz, setFrequencyHz] = useState(initialConfig?.frequencyHz || 10);
  const [bitSequence, setBitSequence] = useState(initialConfig?.bitSequence || '10110100');
  const [isManualHigh, setIsManualHigh] = useState(false);
  const [mode, setMode] = useState(initialConfig?.mode || 'SEQUENCE'); // 'SEQUENCE' | 'MANUAL'
  const [isRunning, setIsRunning] = useState(true);

  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const animFrameRef = useRef(null);
  const lastTickRef = useRef(Date.now());
  const bitIndexRef = useRef(0);

  // Logic standard parameters
  const standardSpecs = {
    '3.3V_LVCMOS': {
      vcc: 3.3,
      voh: 2.8,
      vih: 2.0,
      vil: 0.8,
      vol: 0.4,
      name: '3.3V Low-Voltage CMOS (LVCMOS)',
      description: 'Standard for modern 32-bit microcontrollers (STM32, ESP32, RP2040, Cortex-M).',
    },
    '5.0V_TTL': {
      vcc: 5.0,
      voh: 2.7,
      vih: 2.0,
      vil: 0.8,
      vol: 0.5,
      name: '5.0V Transistor-Transistor Logic (TTL)',
      description: 'Classic 8-bit standard (ATmega328P, PIC16, 8051). High noise immunity.',
    },
    '5.0V_CMOS': {
      vcc: 5.0,
      voh: 4.4,
      vih: 3.5,
      vil: 1.5,
      vol: 0.1,
      name: '5.0V High-Noise CMOS',
      description: 'Used in harsh industrial electrical environments and automotive relays.',
    },
  };

  const currentSpec = standardSpecs[logicStandard];

  // Reset function
  const handleReset = () => {
    setFrequencyHz(10);
    setBitSequence('10110100');
    setIsManualHigh(false);
    setMode('SEQUENCE');
    setIsRunning(true);
    historyRef.current = [];
    bitIndexRef.current = 0;
  };

  // Clock generation & canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateAndDraw = () => {
      const now = Date.now();
      const dt = (now - lastTickRef.current) / 1000;

      if (isRunning) {
        // Calculate bit duration based on frequency
        const bitDuration = 1 / frequencyHz;
        if (dt >= bitDuration) {
          lastTickRef.current = now;
          if (mode === 'SEQUENCE') {
            const cleanSeq = bitSequence.replace(/[^01]/g, '') || '0';
            const currentBit = cleanSeq[bitIndexRef.current % cleanSeq.length] === '1';
            bitIndexRef.current = (bitIndexRef.current + 1) % cleanSeq.length;
            historyRef.current.push({
              level: currentBit ? currentSpec.vcc : 0,
              isHigh: currentBit,
              time: now,
            });
          } else {
            historyRef.current.push({
              level: isManualHigh ? currentSpec.vcc : 0,
              isHigh: isManualHigh,
              time: now,
            });
          }

          // Keep fixed history length
          if (historyRef.current.length > 200) {
            historyRef.current.shift();
          }
        }
      }

      // Draw timing diagram
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background grid
      ctx.strokeStyle = 'rgba(25, 43, 64, 0.4)';
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

      // Logic Rails
      const highY = 40;
      const lowY = h - 40;
      const vihY = lowY - ((currentSpec.vih / currentSpec.vcc) * (lowY - highY));
      const vilY = lowY - ((currentSpec.vil / currentSpec.vcc) * (lowY - highY));

      // Draw VCC line
      ctx.strokeStyle = 'rgba(85, 199, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, highY);
      ctx.lineTo(w, highY);
      ctx.stroke();

      // Draw GND line
      ctx.strokeStyle = 'rgba(143, 166, 188, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, lowY);
      ctx.lineTo(w, lowY);
      ctx.stroke();

      // Draw Undefined Logic Band (between VIL and VIH)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
      ctx.fillRect(0, vihY, w, vilY - vihY);
      ctx.setLineDash([]);

      // Draw Logic Waveform
      const history = historyRef.current;
      if (history.length > 1) {
        ctx.strokeStyle = '#55C7FF';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(85, 199, 255, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const stepX = w / 50;
        const startIndex = Math.max(0, history.length - 50);

        for (let i = startIndex; i < history.length; i++) {
          const pt = history[i];
          const x = (i - startIndex) * stepX;
          const y = pt.isHigh ? highY : lowY;

          if (i === startIndex) {
            ctx.moveTo(x, y);
          } else {
            const prev = history[i - 1];
            const prevX = (i - 1 - startIndex) * stepX;
            const prevY = prev.isHigh ? highY : lowY;

            // Draw square transition
            if (prevY !== y) {
              ctx.lineTo(x, prevY);
            }
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(updateAndDraw);
    };

    animFrameRef.current = requestAnimationFrame(updateAndDraw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isRunning, frequencyHz, mode, bitSequence, isManualHigh, currentSpec]);

  // Current state readout
  const lastState = historyRef.current[historyRef.current.length - 1];
  const isCurrentlyHigh = lastState ? lastState.isHigh : isManualHigh;

  return (
    <div className="space-y-6">
      {/* Simulation Controls & Parameters Bar */}
      <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#192B40] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              Digital Logic & Timing Engine
            </div>
            <h3 className="font-heading text-xl font-bold text-[#EAF5FF]">
              Signal Generator & Logic Level Lab
            </h3>
            <p className="text-xs text-[#8FA6BC] mt-0.5">
              Generate binary bit sequences, evaluate clock edges, and analyze noise margins.
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
              {isRunning ? 'Freeze Time' : 'Run Clock'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} title="Reset simulation">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            {onSaveConfig && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onSaveConfig({
                    experimentType: 'SIGNAL',
                    title: `Signal Lab: ${bitSequence} @ ${frequencyHz}Hz (${logicStandard})`,
                    configState: { logicStandard, frequencyHz, bitSequence, mode },
                  })
                }
              >
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Logic Standard Selector */}
          <div className="space-y-1.5 bg-[#0B1220] p-3 rounded-xl border border-[#192B40]">
            <span className="text-[#8FA6BC]">LOGIC STANDARD:</span>
            <select
              value={logicStandard}
              onChange={(e) => setLogicStandard(e.target.value)}
              className="w-full bg-[#111E30] border border-[#192B40] focus:border-[#55C7FF] rounded-lg p-2 text-xs text-[#EAF5FF] outline-none font-mono"
            >
              <option value="3.3V_LVCMOS">3.3V LVCMOS (ARM / ESP32 / RP2040)</option>
              <option value="5.0V_TTL">5.0V TTL (AVR / PIC / 8051)</option>
              <option value="5.0V_CMOS">5.0V CMOS (High-Noise Industrial)</option>
            </select>
          </div>

          {/* Clock Frequency Slider */}
          <div className="space-y-1.5 bg-[#0B1220] p-3 rounded-xl border border-[#192B40]">
            <div className="flex justify-between">
              <span className="text-[#8FA6BC]">CLOCK FREQ:</span>
              <span className="text-[#55C7FF] font-bold">{frequencyHz} Hz</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={frequencyHz}
              onChange={(e) => setFrequencyHz(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#192B40] rounded-lg appearance-none cursor-pointer accent-[#55C7FF]"
            />
            <div className="text-[10px] text-[#8FA6BC]">Period T: {(1000 / frequencyHz).toFixed(1)} ms</div>
          </div>

          {/* Mode Switcher */}
          <div className="space-y-1.5 bg-[#0B1220] p-3 rounded-xl border border-[#192B40]">
            <span className="text-[#8FA6BC]">SIGNAL MODE:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setMode('SEQUENCE')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  mode === 'SEQUENCE'
                    ? 'bg-[#55C7FF] text-[#0B1220]'
                    : 'bg-[#111E30] text-[#8FA6BC] hover:text-[#EAF5FF]'
                }`}
              >
                Bit Sequence
              </button>
              <button
                onClick={() => setMode('MANUAL')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  mode === 'MANUAL'
                    ? 'bg-[#55C7FF] text-[#0B1220]'
                    : 'bg-[#111E30] text-[#8FA6BC] hover:text-[#EAF5FF]'
                }`}
              >
                Manual Toggle
              </button>
            </div>
          </div>

          {/* Bit Pattern or Manual Toggle Button */}
          <div className="space-y-1.5 bg-[#0B1220] p-3 rounded-xl border border-[#192B40]">
            {mode === 'SEQUENCE' ? (
              <>
                <span className="text-[#8FA6BC]">BINARY SEQUENCE:</span>
                <input
                  type="text"
                  maxLength={16}
                  value={bitSequence}
                  onChange={(e) => setBitSequence(e.target.value.replace(/[^01]/g, ''))}
                  className="w-full bg-[#111E30] border border-[#192B40] focus:border-[#55C7FF] rounded-lg px-2.5 py-1.5 text-xs text-[#55C7FF] font-bold tracking-widest outline-none"
                  placeholder="10110010"
                />
              </>
            ) : (
              <>
                <span className="text-[#8FA6BC]">MANUAL PIN STATE:</span>
                <button
                  onClick={() => setIsManualHigh(!isManualHigh)}
                  className={`w-full py-2 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                    isManualHigh
                      ? 'bg-emerald-500 text-[#0B1220] shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'bg-[#111E30] text-[#8FA6BC] hover:text-[#EAF5FF] border border-[#192B40]'
                  }`}
                >
                  {isManualHigh ? 'FORCED LOGIC HIGH (1)' : 'FORCED LOGIC LOW (0)'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Virtual Timing Diagram Oscilloscope Display */}
      <div className="rounded-2xl border border-[#192B40] bg-[#0B1220] overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-[#111E30] border-b border-[#192B40] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#55C7FF]">
            <Activity className="w-3.5 h-3.5" />
            <span>REAL-TIME DIGITAL LOGIC TIMING DIAGRAM (CH1)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#8FA6BC]">
              CURRENT STATE:{' '}
              <span className={`font-bold ${isCurrentlyHigh ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isCurrentlyHigh ? `HIGH (+${currentSpec.vcc}V)` : 'LOW (0.0V)'}
              </span>
            </span>
          </div>
        </div>

        <div className="p-4 relative">
          <canvas ref={canvasRef} width={800} height={200} className="w-full h-48 block" />
          <div className="flex justify-between items-center text-[10px] font-mono text-[#8FA6BC] pt-2 border-t border-[#192B40]/60">
            <span>VOLTAGE SCALE: 0V TO +{currentSpec.vcc}V</span>
            <span className="text-[#F87171]/80">RED BAND = UNDEFINED / METASTABLE REGION</span>
            <span>TIMEBASE: {(1000 / frequencyHz).toFixed(0)} ms / BIT</span>
          </div>
        </div>
      </div>

      {/* Logic Levels & Noise Margins Explanatory Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-[#192B40] bg-[#111E30]/60 space-y-2">
          <div className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
            {currentSpec.name}
          </div>
          <p className="text-xs text-[#8FA6BC] leading-relaxed">
            {currentSpec.description}
          </p>
          <div className="pt-2 text-xs font-mono text-[#EAF5FF] space-y-1">
            <div>Supply Rail: <span className="text-[#55C7FF] font-bold">+{currentSpec.vcc}V</span></div>
            <div>Guaranteed Output HIGH (V_OH): <span className="text-emerald-400 font-bold">≥ {currentSpec.voh}V</span></div>
            <div>Guaranteed Output LOW (V_OL): <span className="text-slate-400 font-bold">≤ {currentSpec.vol}V</span></div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#192B40] bg-[#111E30]/60 space-y-2">
          <div className="text-xs font-mono text-[#A5E3FF] uppercase tracking-wider font-semibold">
            Input Detection Thresholds
          </div>
          <p className="text-xs text-[#8FA6BC] leading-relaxed">
            A receiver pin requires voltages strictly outside the red band to deterministically resolve 0 or 1.
          </p>
          <div className="pt-2 text-xs font-mono text-[#EAF5FF] space-y-1">
            <div>Recognized Input HIGH (V_IH): <span className="text-[#55C7FF] font-bold">≥ {currentSpec.vih}V</span></div>
            <div>Recognized Input LOW (V_IL): <span className="text-slate-400 font-bold">≤ {currentSpec.vil}V</span></div>
            <div>Forbidden / Undefined Band: <span className="text-rose-400 font-bold">{currentSpec.vil}V – {currentSpec.vih}V</span></div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#192B40] bg-[#111E30]/60 space-y-2">
          <div className="text-xs font-mono text-[#10B981] uppercase tracking-wider font-semibold">
            Calculated Noise Margins
          </div>
          <p className="text-xs text-[#8FA6BC] leading-relaxed">
            Noise Margin is the maximum spurious noise voltage the signal line can sustain without triggering false bit flips.
          </p>
          <div className="pt-2 text-xs font-mono text-[#EAF5FF] space-y-1">
            <div>High Noise Margin (NMH = V_OH - V_IH): <span className="text-emerald-400 font-bold">+{(currentSpec.voh - currentSpec.vih).toFixed(2)}V</span></div>
            <div>Low Noise Margin (NML = V_IL - V_OL): <span className="text-emerald-400 font-bold">+{(currentSpec.vil - currentSpec.vol).toFixed(2)}V</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

