import React from 'react';
import { Terminal, Cpu, Play, Sliders, Activity, ShieldAlert } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export function LabPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <Terminal className="w-3.5 h-3.5" />
          Hardware Simulation Bench
        </div>
        <h1 className="font-heading text-3xl font-bold text-[#EAF5FF]">
          Interactive Silicon Laboratory
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1">
          Oscilloscope waveform analysis, bare-metal register manipulation, and circuit simulation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Virtual Oscilloscope Screen */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden border-[#55C7FF]/40">
            <div className="px-4 py-2.5 bg-[#0B1220] border-b border-[#192B40] flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-2 text-[#55C7FF]">
                <Activity className="w-3.5 h-3.5" />
                VIRTUAL OSCILLOSCOPE CH1 / CH2
              </span>
              <span className="text-[#8FA6BC]">100 MSa/s • 3.3V COUPLING</span>
            </div>
            
            <div className="h-64 oscilloscope-screen flex items-center justify-center relative p-4">
              <svg className="w-full h-full opacity-80" viewBox="0 0 500 200">
                {/* Horizontal & Vertical grid lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#192B40" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#192B40" strokeWidth="1.5" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#192B40" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="125" y1="0" x2="125" y2="200" stroke="#192B40" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="250" y1="0" x2="250" y2="200" stroke="#192B40" strokeWidth="1.5" />
                <line x1="375" y1="0" x2="375" y2="200" stroke="#192B40" strokeWidth="1" strokeDasharray="3 3" />

                {/* Simulated PWM waveform in Cyan */}
                <path
                  d="M 10 160 L 50 160 L 50 40 L 100 40 L 100 160 L 150 160 L 150 40 L 200 40 L 200 160 L 250 160 L 250 40 L 300 40 L 300 160 L 350 160 L 350 40 L 400 40 L 400 160 L 450 160 L 450 40 L 490 40"
                  fill="none"
                  stroke="#55C7FF"
                  strokeWidth="2"
                  className="filter drop-shadow-[0_0_8px_rgba(85,199,255,0.8)]"
                />
              </svg>
              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#55C7FF] bg-[#0B1220]/80 px-2 py-0.5 rounded border border-[#55C7FF]/30">
                FREQ: 20.00 kHz • DUTY: 50.0% • Vpp: 3.30V
              </div>
            </div>
          </Card>

          {/* Testbench controls */}
          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button size="sm" icon={Play}>Run Simulation</Button>
              <Button size="sm" variant="secondary" icon={Sliders}>Calibrate Timebase</Button>
            </div>
            <Badge variant="cyan">READY FOR EXPERIMENT LOGGING</Badge>
          </Card>
        </div>

        {/* Register Map & Peripherals Inspector */}
        <div className="space-y-4">
          <Card className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-[#EAF5FF] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#55C7FF]" />
              Target Microcontroller
            </h3>
            <div className="p-3 rounded-lg bg-[#0B1220] border border-[#192B40] text-xs font-mono space-y-1">
              <div className="text-[#55C7FF] font-semibold">STM32F401RE (Nucleo-64)</div>
              <div className="text-[#8FA6BC]">Core: ARM Cortex-M4 @ 84MHz</div>
              <div className="text-[#8FA6BC]">Selected Register: GPIOA_MODER</div>
            </div>

            <div className="text-xs font-mono space-y-2">
              <div className="text-[#8FA6BC]">MEMORY-MAPPED REGISTER STATE:</div>
              <div className="p-2.5 rounded bg-[#0B1220] border border-[#192B40] font-mono text-xs text-[#EAF5FF]">
                <code>0x40020000: 0x28000000</code>
              </div>
            </div>

            <div className="pt-2 border-t border-[#192B40] text-xs text-[#8FA6BC]">
              Interactive breadboarding and firmware execution engine active in subsequent development milestones.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

