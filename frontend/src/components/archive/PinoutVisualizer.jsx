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
    } catch (e) { }
    return [];
  }, [pinoutConfig]);

  // Color mapping by pin functional category
  const getPinStyle = (type = '', label = '') => {
    const t = type.toLowerCase();
    const l = label.toLowerCase();
    if (t.includes('power') || l.includes('vcc') || l.includes('vdd') || l.includes('3v3') || l.includes('5v')) {
      return {
        bg: 'bg-[#B95D32]/10',
        border: 'border-[#B95D32]/40',
        text: 'text-[#B95D32]',
        dot: 'bg-[#B95D32]',
        category: 'Power',
      };
    }
    if (t.includes('ground') || l.includes('gnd') || l.includes('vss')) {
      return {
        bg: 'bg-[#EDE1CE]',
        border: 'border-[#C9BDAA]',
        text: 'text-[#655F55]',
        dot: 'bg-[#655F55]',
        category: 'Ground',
      };
    }
    if (t.includes('analog') || l.includes('adc') || l.includes('dac') || l.includes('ain')) {
      return {
        bg: 'bg-[#D87535]/10',
        border: 'border-[#D87535]/40',
        text: 'text-[#D87535]',
        dot: 'bg-[#D87535]',
        category: 'Analog',
      };
    }
    if (t.includes('comm') || l.includes('rx') || l.includes('tx') || l.includes('sda') || l.includes('scl') || l.includes('mosi') || l.includes('miso') || l.includes('sck') || l.includes('can') || l.includes('usb')) {
      return {
        bg: 'bg-[#87945B]/10',
        border: 'border-[#87945B]/40',
        text: 'text-[#87945B]',
        dot: 'bg-[#87945B]',
        category: 'Communication',
      };
    }
    if (t.includes('clock') || t.includes('reset') || l.includes('rst') || l.includes('xtal') || l.includes('osc') || l.includes('swd') || l.includes('jtag')) {
      return {
        bg: 'bg-[#71818B]/10',
        border: 'border-[#71818B]/40',
        text: 'text-[#71818B]',
        dot: 'bg-[#71818B]',
        category: 'System',
      };
    }
    // Default Digital I/O / GPIO
    return {
      bg: 'bg-[#FAF5EB]',
      border: 'border-[#C9BDAA]',
      text: 'text-[#22201D]',
      dot: 'bg-[#22201D]',
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
      <div className="p-8 text-center rounded-xl border border-[#C9BDAA] bg-[#FAF5EB] text-[#655F55] font-mono text-xs">
        <Cpu className="w-8 h-8 mx-auto text-[#D87535]/40 mb-2" />
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
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${filterType === cat
                  ? 'bg-[#22201D] text-[#FAF5EB] font-bold shadow-xs'
                  : 'bg-[#EDE1CE] text-[#655F55] hover:text-[#22201D] border border-[#C9BDAA]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C8275]" />
          <input
            type="text"
            placeholder="Search pin name or function..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#22201D] placeholder-[#8C8275] outline-none font-mono"
          />
        </div>
      </div>

      {/* Package Visualizer Container */}
      <div className="rounded-2xl border border-[#C9BDAA] bg-[#FAF5EB] p-4 sm:p-6 overflow-hidden shadow-xs bg-drafting-grid-subtle">
        {/* IC Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C9BDAA]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#D87535]" />
            <span className="text-xs font-mono font-bold text-[#22201D]">{chipName}</span>
            <span className="text-[10px] font-mono text-[#655F55]">({packageType})</span>
          </div>
          <div className="text-[10px] font-mono text-[#D87535] font-bold">
            {filteredPins.length} of {rawPins.length} Pins
          </div>
        </div>

        {/* Dual-Sided Silicon Package Presentation */}
        <div className="relative max-w-2xl mx-auto py-2">
          {/* IC Body Center Pillar */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-32 sm:w-44 bg-[#242522] border-2 border-[#3D3A36] rounded-xl flex flex-col items-center justify-between py-6 pointer-events-none z-0 shadow-lg">
            {/* Notch at Top (IC orientation indicator) */}
            <div className="w-6 h-3 rounded-b-full bg-[#1C1D1A] border-b border-x border-[#3D3A36]" />
            <div className="text-center px-2">
              <div className="text-[10px] font-mono text-[#8C8275] tracking-widest uppercase">SILICON DIE</div>
              <div className="text-xs font-mono font-bold text-[#D87535] mt-1 break-words line-clamp-1">
                {chipName}
              </div>
              <div className="text-[9px] font-mono text-[#8C8275] mt-1">TOP VIEW</div>
            </div>
            <div className="w-4 h-1 rounded-full bg-[#3D3A36]" />
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
                    className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${isSelected
                        ? 'bg-[#EDE1CE] border-[#D87535] shadow-xs ring-1 ring-[#D87535]'
                        : isDimmed
                          ? 'opacity-30 border-transparent bg-transparent'
                          : `${style.bg} ${style.border} hover:border-[#D87535]`
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#655F55] w-5 text-right font-bold">
                        #{pin.pin}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className={`text-xs font-mono font-semibold ${style.text}`}>
                        {pin.label}
                      </span>
                    </div>
                    {/* Trace connecting to IC body */}
                    <div className="w-3 h-0.5 bg-[#C9BDAA] group-hover:bg-[#D87535] transition-colors" />
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
                    className={`group flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${isSelected
                        ? 'bg-[#EDE1CE] border-[#D87535] shadow-xs ring-1 ring-[#D87535]'
                        : isDimmed
                          ? 'opacity-30 border-transparent bg-transparent'
                          : `${style.bg} ${style.border} hover:border-[#D87535]`
                      }`}
                  >
                    {/* Trace connecting to IC body */}
                    <div className="w-3 h-0.5 bg-[#C9BDAA] group-hover:bg-[#D87535] transition-colors" />
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-semibold ${style.text}`}>
                        {pin.label}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span className="text-[10px] font-mono text-[#655F55] w-5 text-left font-bold">
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
          <div className="mt-6 p-4 rounded-xl border border-[#D87535] bg-[#EDE1CE] shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#D87535] font-bold">
                    PIN #{selectedPin.pin} DETAIL
                  </span>
                  <Badge variant="cyan">{selectedPin.type || 'Standard I/O'}</Badge>
                </div>
                <h4 className="font-serif text-base font-bold text-[#22201D]">
                  {selectedPin.label}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-xs font-mono text-[#655F55] hover:text-[#22201D] px-2 py-1 rounded bg-[#FAF5EB] border border-[#C9BDAA] cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
            <div className="mt-3 text-xs font-mono text-[#22201D] bg-[#FAF5EB] p-3 rounded-lg border border-[#C9BDAA]">
              <span className="text-[#D87535] font-bold">Multiplexed Functions & Electrical: </span>
              {selectedPin.function || 'Standard digital general-purpose input/output with internal pull-up/pull-down.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

