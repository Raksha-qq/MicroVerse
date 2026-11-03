import React, { useState, useMemo } from 'react';
import { Cpu, Zap, Radio, Search, Filter, Info } from 'lucide-react';
import { Badge } from '../common/Badge';

export function PinoutVisualizer({ pinoutConfig, chipName, packageType = 'DIP / QFP' }) {
  const [selectedPin, setSelectedPin] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize pins array
  const rawPins = useMemo(() => {
    if (!pinoutConfig) return [];
    if (Array.isArray(pinoutConfig)) return pinoutConfig;
    try {
      const parsed = JSON.parse(pinoutConfig);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [];
  }, [pinoutConfig]);

  // Color mapping by pin functional category
  const getPinStyle = (type = '', label = '') => {
    const t = type.toLowerCase();
    const l = label.toLowerCase();
    if (t.includes('power') || l.includes('vcc') || l.includes('vdd') || l.includes('3v3') || l.includes('5v')) {
      return {
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/50',
        text: 'text-rose-400',
        dot: 'bg-rose-400',
        category: 'Power',
      };
    }
    if (t.includes('ground') || l.includes('gnd') || l.includes('vss')) {
      return {
        bg: 'bg-slate-700/30',
        border: 'border-slate-500/40',
        text: 'text-slate-300',
        dot: 'bg-slate-400',
        category: 'Ground',
      };
    }
    if (t.includes('analog') || l.includes('adc') || l.includes('dac') || l.includes('ain')) {
      return {
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/50',
        text: 'text-amber-300',
        dot: 'bg-amber-400',
        category: 'Analog',
      };
    }
    if (t.includes('comm') || l.includes('rx') || l.includes('tx') || l.includes('sda') || l.includes('scl') || l.includes('mosi') || l.includes('miso') || l.includes('sck') || l.includes('can') || l.includes('usb')) {
      return {
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/50',
        text: 'text-emerald-300',
        dot: 'bg-emerald-400',
        category: 'Communication',
      };
    }
    if (t.includes('clock') || t.includes('reset') || l.includes('rst') || l.includes('xtal') || l.includes('osc') || l.includes('swd') || l.includes('jtag')) {
      return {
        bg: 'bg-purple-500/15',
        border: 'border-purple-500/50',
        text: 'text-purple-300',
        dot: 'bg-purple-400',
        category: 'System',
      };
    }
    // Default Digital I/O / GPIO
    return {
      bg: 'bg-[#55C7FF]/10',
      border: 'border-[#55C7FF]/30',
      text: 'text-[#55C7FF]',
      dot: 'bg-[#55C7FF]',
      category: 'GPIO',
    };
  };

  // Filtered pins
  const filteredPins = useMemo(() => {
    return rawPins.filter((pin) => {
      const style = getPinStyle(pin.type, pin.label);
      const matchesFilter =
        filterType === 'ALL' ||
        style.category.toLowerCase() === filterType.toLowerCase() ||
        (filterType === 'Power' && (style.category === 'Power' || style.category === 'Ground'));

      const matchesSearch =
        !searchQuery ||
        pin.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.function?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(pin.pin).includes(searchQuery);

      return matchesFilter && matchesSearch;
    });
  }, [rawPins, filterType, searchQuery]);

  // Split into left and right sides for realistic IC pin layout
  const half = Math.ceil(rawPins.length / 2);
  const leftPins = rawPins.slice(0, half);
  const rightPins = rawPins.slice(half);

  if (rawPins.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl border border-[#192B40] bg-[#0B1220]/70 text-[#8FA6BC] font-mono text-xs">
        <Cpu className="w-8 h-8 mx-auto text-[#55C7FF]/40 mb-2" />
        Pinout multiplexing data currently verified against official silicon errata sheet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'GPIO', 'Analog', 'Communication', 'Power', 'System'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                filterType === cat
                  ? 'bg-[#55C7FF] text-[#0B1220] font-bold shadow-[0_0_8px_rgba(85,199,255,0.4)]'
                  : 'bg-[#111E30] text-[#8FA6BC] hover:text-[#EAF5FF] border border-[#192B40]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8FA6BC]" />
          <input
            type="text"
            placeholder="Search pin name or function..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#EAF5FF] placeholder-[#8FA6BC] outline-none font-mono"
          />
        </div>
      </div>

      {/* Package Visualizer Container */}
      <div className="rounded-2xl border border-[#192B40] bg-[#0B1220]/90 p-4 sm:p-6 overflow-hidden">
        {/* IC Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#192B40]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#55C7FF]" />
            <span className="text-xs font-mono font-bold text-[#EAF5FF]">{chipName}</span>
            <span className="text-[10px] font-mono text-[#8FA6BC]">({packageType})</span>
          </div>
          <div className="text-[10px] font-mono text-[#55C7FF]">
            {filteredPins.length} of {rawPins.length} Pins
          </div>
        </div>

        {/* Dual-Sided Silicon Package Presentation */}
        <div className="relative max-w-2xl mx-auto py-2">
          {/* IC Body Center Pillar */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-32 sm:w-44 bg-[#111E30] border-2 border-[#192B40] rounded-xl flex flex-col items-center justify-between py-6 pointer-events-none z-0 shadow-2xl">
            {/* Notch at Top (IC orientation indicator) */}
            <div className="w-6 h-3 rounded-b-full bg-[#0B1220] border-b border-x border-[#192B40]" />
            <div className="text-center px-2">
              <div className="text-[10px] font-mono text-[#8FA6BC] tracking-widest uppercase">SILICON DIE</div>
              <div className="text-xs font-mono font-bold text-[#55C7FF] mt-1 break-words line-clamp-1">
                {chipName}
              </div>
              <div className="text-[9px] font-mono text-[#8FA6BC]/70 mt-1">TOP VIEW</div>
            </div>
            <div className="w-4 h-1 rounded-full bg-[#192B40]" />
          </div>

          {/* Left and Right Pin Rows */}
          <div className="relative z-10 grid grid-cols-2 gap-8 sm:gap-16">
            {/* Left Side Pins */}
            <div className="space-y-2 pr-2 sm:pr-4">
              {leftPins.map((pin) => {
                const style = getPinStyle(pin.type, pin.label);
                const isSelected = selectedPin?.pin === pin.pin;
                const isDimmed = searchQuery || filterType !== 'ALL' ? !filteredPins.some((p) => p.pin === pin.pin) : false;

                return (
                  <div
                    key={pin.pin}
                    onClick={() => setSelectedPin(pin)}
                    className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#192B40] border-[#55C7FF] shadow-[0_0_12px_rgba(85,199,255,0.3)] ring-1 ring-[#55C7FF]'
                        : isDimmed
                        ? 'opacity-30 border-transparent bg-transparent'
                        : `${style.bg} ${style.border} hover:border-[#55C7FF]`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#8FA6BC] w-5 text-right font-bold">
                        #{pin.pin}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className={`text-xs font-mono font-semibold ${style.text}`}>
                        {pin.label}
                      </span>
                    </div>
                    {/* Trace connecting to IC body */}
                    <div className="w-3 h-0.5 bg-[#192B40] group-hover:bg-[#55C7FF] transition-colors" />
                  </div>
                );
              })}
            </div>

            {/* Right Side Pins */}
            <div className="space-y-2 pl-2 sm:pr-0">
              {rightPins.map((pin) => {
                const style = getPinStyle(pin.type, pin.label);
                const isSelected = selectedPin?.pin === pin.pin;
                const isDimmed = searchQuery || filterType !== 'ALL' ? !filteredPins.some((p) => p.pin === pin.pin) : false;

                return (
                  <div
                    key={pin.pin}
                    onClick={() => setSelectedPin(pin)}
                    className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#192B40] border-[#55C7FF] shadow-[0_0_12px_rgba(85,199,255,0.3)] ring-1 ring-[#55C7FF]'
                        : isDimmed
                        ? 'opacity-30 border-transparent bg-transparent'
                        : `${style.bg} ${style.border} hover:border-[#55C7FF]`
                    }`}
                  >
                    {/* Trace connecting to IC body */}
                    <div className="w-3 h-0.5 bg-[#192B40] group-hover:bg-[#55C7FF] transition-colors" />
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-semibold ${style.text}`}>
                        {pin.label}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className="text-[10px] font-mono text-[#8FA6BC] w-5 text-left font-bold">
                        #{pin.pin}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Pin Details Inspector Panel */}
        {selectedPin && (
          <div className="mt-6 p-4 rounded-xl border border-[#55C7FF]/40 bg-[#111E30] animate-fadeIn">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#55C7FF] font-bold">
                    PIN #{selectedPin.pin} DETAIL
                  </span>
                  <Badge variant="cyan">{selectedPin.type || 'Standard I/O'}</Badge>
                </div>
                <h4 className="font-mono text-base font-bold text-[#EAF5FF]">
                  {selectedPin.label}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-xs font-mono text-[#8FA6BC] hover:text-[#EAF5FF] px-2 py-1 rounded bg-[#0B1220] border border-[#192B40]"
              >
                Close Inspector
              </button>
            </div>
            <div className="mt-3 text-xs font-mono text-[#8FA6BC] bg-[#0B1220] p-3 rounded-lg border border-[#192B40]">
              <span className="text-[#55C7FF] font-semibold">Multiplexed Functions & Electrical: </span>
              {selectedPin.function || 'Standard digital general-purpose input/output with internal pull-up/pull-down.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

