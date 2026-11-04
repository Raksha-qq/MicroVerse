import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LiveLabPreview() {
  const canvasRef = useRef(null);
  const [freq, setFreq] = useState(1.0);
  const [duty, setDuty] = useState(50);
  const [voltage, setVoltage] = useState(3.3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle green oscilloscope grid lines
      ctx.strokeStyle = 'rgba(200, 222, 114, 0.15)';
      ctx.lineWidth = 1;

      // Vertical grid
      const colStep = canvas.width / 6;
      for (let x = colStep; x < canvas.width; x += colStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal grid
      const rowStep = canvas.height / 4;
      for (let y = rowStep; y < canvas.height; y += rowStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Center Reference Zero Axis
      ctx.strokeStyle = 'rgba(200, 222, 114, 0.25)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Phosphor Green Animated Signal Waveform
      ctx.strokeStyle = '#C8DE72';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#C8DE72';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      const midY = canvas.height / 2;
      const amp = canvas.height * 0.35;

      for (let x = 0; x < canvas.width; x++) {
        // Synthesize mixed PWM + harmonic carrier
        const t = (x / canvas.width) * 4 * Math.PI + phase;
        const wave = Math.sin(t) * 0.7 + (Math.sin(t * 3) > 0 ? 0.3 : -0.3);
        const y = midY - wave * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      phase += 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative rounded-lg bg-[#242522] border border-[#3A3A34] text-[#FAF5EB] p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
      {/* Corner Mounting Screws/Rivets */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-[#4A4B44] bg-[#2E302B] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#1A1B18]" />
      </div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-[#4A4B44] bg-[#2E302B] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#1A1B18]" />
      </div>
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-[#4A4B44] bg-[#2E302B] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#1A1B18]" />
      </div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-[#4A4B44] bg-[#2E302B] flex items-center justify-center">
        <div className="w-1 h-0.5 bg-[#1A1B18]" />
      </div>

      <div className="space-y-3">
        {/* Header Tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#C8DE72]">
            <span>// LIVE LAB</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8DE72] animate-pulse" />
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A4B44]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A4B44]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A4B44]" />
          </div>
        </div>

        {/* Title & Copy */}
        <div className="space-y-1">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF5EB]">
            Explore. Simulate. Innovate.
          </h3>
          <p className="text-xs text-[#A8A49A] font-sans leading-relaxed">
            Dive into our interactive lab to test concepts in real-time.
          </p>
        </div>

        {/* Oscilloscope Waveform Screen */}
        <div className="relative rounded border border-[#3A3A34] bg-[#1E1F1C] p-2 mt-2">
          <canvas
            ref={canvasRef}
            width={240}
            height={90}
            className="w-full h-24 block rounded-xs"
          />

          {/* Oscilloscope Reticle Overlay Tag */}
          <div className="absolute bottom-1 right-2 text-[8px] font-mono text-[#C8DE72]/70">
            CH1: 500mV/DIV
          </div>
        </div>

        {/* Telemetry Readout Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#3A3A34] font-mono text-center">
          <div>
            <div className="text-[9px] text-[#8C8275] uppercase">Freq</div>
            <div className="text-xs font-bold text-[#C8DE72]">1kHz</div>
          </div>
          <div>
            <div className="text-[9px] text-[#8C8275] uppercase">Duty</div>
            <div className="text-xs font-bold text-[#C8DE72]">50%</div>
          </div>
          <div>
            <div className="text-[9px] text-[#8C8275] uppercase">Voltage</div>
            <div className="text-xs font-bold text-[#C8DE72]">3.3V</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 mt-auto">
        <Link
          to="/lab"
          className="w-full py-2 px-4 rounded text-xs font-mono font-bold text-[#C8DE72] border border-[#C8DE72]/40 hover:bg-[#C8DE72]/15 hover:border-[#C8DE72] transition-colors flex items-center justify-center gap-2 group"
        >
          <span>Open Lab</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

