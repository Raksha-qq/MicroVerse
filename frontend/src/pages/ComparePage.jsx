import React, { useState, useEffect, useMemo } from 'react';
import {
  Sliders,
  Check,
  X,
  Cpu,
  Clock,
  Zap,
  Radio,
  Layers,
  Plus,
  Trash2,
  Info,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Bot,
  Flame,
  Award,
  AlertCircle
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { controllerService } from '../services/controllerService';

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected slugs / ids state
  const initialIds = useMemo(() => {
    const fromParam = searchParams.get('ids');
    if (fromParam) {
      return fromParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    // Default representative comparison: STM32 vs ESP32 vs RP2040
    return ['stm32f401ret6', 'esp32-s3', 'rp2040'];
  }, [searchParams]);

  const [selectedIds, setSelectedIds] = useState(initialIds);
  const [controllers, setControllers] = useState([]);
  const [allAvailableControllers, setAllAvailableControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState('');

  // Fetch all controllers for the selector
  useEffect(() => {
    controllerService
      .getControllers({ limit: 50 })
      .then((res) => {
        setAllAvailableControllers(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch controller catalog:', err);
      });
  }, []);

  // Fetch compared controllers from backend whenever selectedIds change
  useEffect(() => {
    if (selectedIds.length === 0) {
      setControllers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    controllerService
      .compareControllers(selectedIds)
      .then((res) => {
        setControllers(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch compared controllers:', err);
        setError('Failed to fetch comparison records. Verify backend connection.');
      })
      .finally(() => {
        setLoading(false);
      });

    // Sync URL search params
    setSearchParams({ ids: selectedIds.join(',') }, { replace: true });
  }, [selectedIds, setSearchParams]);

  // Handler to remove a controller
  const handleRemove = (slugOrId) => {
    if (selectedIds.length <= 2) {
      alert('A minimum of 2 microcontrollers is required for comparative analysis.');
      return;
    }
    setSelectedIds(selectedIds.filter((id) => id !== slugOrId && id !== slugOrId.toLowerCase()));
  };

  // Handler to add a controller
  const handleAdd = (slug) => {
    if (selectedIds.includes(slug)) return;
    if (selectedIds.length >= 4) {
      alert('You can compare a maximum of 4 microcontrollers simultaneously.');
      return;
    }
    setSelectedIds([...selectedIds, slug]);
    setSelectorOpen(false);
    setSelectorSearch('');
  };

  // Helper to determine feature support status
  const getSupportBadge = (val, customLabel = null) => {
    if (val === true || (typeof val === 'number' && val > 0) || (typeof val === 'string' && val.length > 0 && !val.toLowerCase().startsWith('none'))) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#87945B] bg-[#87945B]/15 px-2 py-0.5 rounded border border-[#87945B]/40 font-bold">
          <Check className="w-3 h-3" />
          {customLabel || 'Supported'}
        </span>
      );
    }
    if (typeof val === 'string' && (val.toLowerCase().includes('external') || val.toLowerCase().includes('pico w') || val.toLowerCase().includes('optional') || val.toLowerCase().includes('carrier'))) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#D87535] bg-[#D87535]/15 px-2 py-0.5 rounded border border-[#D87535]/40 font-semibold">
          <span>~</span>
          {customLabel || 'Variant / Ext Dependent'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8C8275] bg-[#EDE1CE] px-2 py-0.5 rounded border border-[#C9BDAA]">
        <X className="w-3 h-3 text-[#8C8275]" />
        {customLabel || 'Unsupported'}
      </span>
    );
  };

  // Compute best spec values across compared controllers for highlight badges
  const maxClock = useMemo(() => Math.max(...controllers.map((c) => c.maxClockSpeedMHz || 0)), [controllers]);
  const maxFlash = useMemo(() => Math.max(...controllers.map((c) => c.flashKb || 0)), [controllers]);
  const maxSram = useMemo(() => Math.max(...controllers.map((c) => c.sramKb || 0)), [controllers]);
  const maxGpio = useMemo(() => Math.max(...controllers.map((c) => c.gpioCount || 0)), [controllers]);
  const minSleep = useMemo(() => {
    const valid = controllers.map((c) => c.deepSleepCurrentUa).filter((v) => typeof v === 'number' && v > 0);
    return valid.length > 0 ? Math.min(...valid) : 0;
  }, [controllers]);

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider mb-1">
          <Sliders className="w-3.5 h-3.5" />
          <span>Hardware Evaluation Bench & Benchmark Matrix // REF: MV-COMP-LAB</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D] tracking-tight">
          Microcontroller Comparison Lab
        </h1>
        <p className="text-sm text-[#655F55] mt-1 max-w-3xl leading-relaxed font-sans">
          Side-by-side engineering evaluation bench comparing silicon architectures, register pipelines,
          bus bandwidth, peripheral matrices, and robotics control trade-offs.
        </p>
      </div>

      {/* Target Selector Bar */}
      <div className="rounded-2xl border border-[#C9BDAA] bg-[#FAF5EB] p-4 sm:p-5 space-y-4 shadow-xs bg-drafting-grid-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-[#D87535] uppercase tracking-wider font-bold">
              Active Evaluation Targets ({controllers.length}/4)
            </span>
            <p className="text-xs text-[#655F55] font-sans">
              Compare between 2 and 4 microcontrollers simultaneously.
            </p>
          </div>

          {selectedIds.length < 4 && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectorOpen(!selectorOpen)}
                className="flex items-center gap-1.5 cursor-pointer font-mono text-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#D87535]" />
                Add Microcontroller to Bench
              </Button>

              {/* Dropdown Selector Popover */}
              {selectorOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-[#C9BDAA] bg-[#FAF5EB] shadow-xl p-3 z-50 space-y-2">
                  <input
                    type="text"
                    placeholder="Search chip name or family..."
                    value={selectorSearch}
                    onChange={(e) => setSelectorSearch(e.target.value)}
                    className="w-full bg-[#F5EBDD] border border-[#C9BDAA] focus:border-[#D87535] rounded-lg px-3 py-1.5 text-xs text-[#22201D] placeholder-[#8C8275] outline-none font-mono"
                    autoFocus
                  />
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {allAvailableControllers
                      .filter(
                        (c) =>
                          !selectedIds.includes(c.slug) &&
                          !selectedIds.includes(c.id) &&
                          (c.name.toLowerCase().includes(selectorSearch.toLowerCase()) ||
                            c.family.toLowerCase().includes(selectorSearch.toLowerCase()) ||
                            c.manufacturer.toLowerCase().includes(selectorSearch.toLowerCase()))
                      )
                      .map((chip) => (
                        <div
                          key={chip.id}
                          onClick={() => handleAdd(chip.slug)}
                          className="p-2 rounded-lg hover:bg-[#EDE1CE] transition-colors cursor-pointer flex items-center justify-between text-xs font-mono"
                        >
                          <div>
                            <div className="font-bold text-[#22201D]">{chip.name}</div>
                            <div className="text-[10px] text-[#655F55]">
                              {chip.family} • {chip.core}
                            </div>
                          </div>
                          <Badge variant="cyan">{chip.bitWidth}-BIT</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Chip Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#C9BDAA]/70">
          {controllers.map((ctrl) => (
            <div
              key={ctrl.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EDE1CE] border border-[#C9BDAA] text-xs font-mono text-[#22201D] shadow-xs"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D87535]" />
                <span className="font-bold">{ctrl.name}</span>
                <span className="text-[#655F55]">({ctrl.family})</span>
              </div>
              {selectedIds.length > 2 && (
                <button
                  onClick={() => handleRemove(ctrl.slug || ctrl.id)}
                  title="Remove from comparison bench"
                  className="text-[#8C8275] hover:text-[#B95D32] ml-1 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Loading / Error / Table View */}
      {loading ? (
        <div className="py-24 text-center text-xs font-mono text-[#655F55]">
          <Cpu className="w-8 h-8 mx-auto text-[#D87535] animate-spin mb-3" />
          SYNCHRONIZING HARDWARE SPECIFICATION VECTORS...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-xs font-mono text-[#B95D32] bg-[#B95D32]/10 rounded-xl border border-[#B95D32]/30">
          {error}
        </div>
      ) : controllers.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-[#655F55] bg-[#FAF5EB] rounded-xl border border-[#C9BDAA]">
          Select at least 2 microcontrollers to populate the comparison matrix.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Side-by-Side Comparison Matrix */}
          <div className="overflow-x-auto rounded-2xl border border-[#C9BDAA] bg-[#FAF5EB] shadow-xs">
            <table className="w-full border-collapse text-left text-xs font-mono">
              {/* Header Columns */}
              <thead>
                <tr className="border-b border-[#C9BDAA] bg-[#EDE1CE]">
                  <th className="p-4 text-[#655F55] uppercase tracking-wider w-56 min-w-[200px] font-bold">
                    Architectural Metric
                  </th>
                  {controllers.map((ctrl) => (
                    <th
                      key={ctrl.id}
                      className="p-4 text-[#22201D] font-serif font-bold text-base min-w-[240px] max-w-[300px] border-l border-[#C9BDAA]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[10px] font-mono text-[#D87535] font-normal uppercase tracking-wider">
                          {ctrl.manufacturer}
                        </div>
                        <Badge variant={ctrl.bitWidth === 32 ? 'cyan' : ctrl.bitWidth === 16 ? 'emerald' : 'amber'}>
                          {ctrl.bitWidth}-BIT
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-[#22201D]">{ctrl.name}</div>
                      <div className="text-xs font-mono text-[#655F55] font-normal">{ctrl.family} Family</div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Group 1: Processing Power & CPU */}
              <tbody className="divide-y divide-[#C9BDAA]/70">
                <tr className="bg-[#EDE1CE]/70">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#D87535] uppercase tracking-wider">
                    1. Processing Unit & Instruction Pipeline
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Processor Architecture (ISA)
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 text-[#22201D] border-l border-[#C9BDAA]/60">
                      <div className="font-bold">{c.architecture}</div>
                      <div className="text-[10px] text-[#655F55] mt-0.5">{c.core}</div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Execution Core Count
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 text-[#22201D] border-l border-[#C9BDAA]/60">
                      {c.coreCount > 1 ? (
                        <span className="text-[#D87535] font-bold">Dual-Core ({c.coreCount})</span>
                      ) : (
                        <span>Single-Core (1)</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Max Clock Frequency
                  </td>
                  {controllers.map((c) => {
                    const isMax = c.maxClockSpeedMHz === maxClock && maxClock > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isMax ? 'text-[#D87535]' : 'text-[#22201D]'}`}>
                            {c.maxClockSpeedMHz} MHz
                          </span>
                          {isMax && (
                            <span className="text-[10px] bg-[#D87535]/15 text-[#D87535] px-1.5 py-0.5 rounded font-bold border border-[#D87535]/40">
                              PEAK
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Hardware FPU (Floating Point)
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                      {getSupportBadge(c.fpu, c.fpu ? 'Single Precision FP32' : 'Software Emulated')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    DSP Extensions
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                      {getSupportBadge(c.dsp, c.dsp ? 'SIMD / DSP Instructions' : 'Standard ALU')}
                    </td>
                  ))}
                </tr>

                {/* Group 2: Memory Capacity */}
                <tr className="bg-[#EDE1CE]/70">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#B95D32] uppercase tracking-wider">
                    2. Memory Hierarchy (Flash, SRAM & Non-Volatile)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Flash Program Memory
                  </td>
                  {controllers.map((c) => {
                    const isMax = c.flashKb === maxFlash && maxFlash > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#B95D32]">
                            {c.flashKb >= 1024 ? `${(c.flashKb / 1024).toFixed(1)} MB` : `${c.flashKb} KB`}
                          </span>
                          {isMax && (
                            <span className="text-[10px] bg-[#B95D32]/15 text-[#B95D32] px-1.5 py-0.5 rounded font-bold border border-[#B95D32]/40">
                              MAX
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    SRAM Data Memory
                  </td>
                  {controllers.map((c) => {
                    const isMax = c.sramKb === maxSram && maxSram > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#87945B]">
                            {c.sramKb >= 1024 ? `${(c.sramKb / 1024).toFixed(1)} MB` : `${c.sramKb} KB`}
                          </span>
                          {isMax && (
                            <span className="text-[10px] bg-[#87945B]/15 text-[#87945B] px-1.5 py-0.5 rounded font-bold border border-[#87945B]/40">
                              MAX
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Internal EEPROM
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-[#22201D]">
                      {c.eepromKb ? `${c.eepromKb} KB Dedicated EEPROM` : 'Emulated in Flash / None'}
                    </td>
                  ))}
                </tr>

                {/* Group 3: I/O & Electrical */}
                <tr className="bg-[#EDE1CE]/70">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#71818B] uppercase tracking-wider">
                    3. I/O, Voltage & Electrical Characteristics
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Digital GPIO Lines
                  </td>
                  {controllers.map((c) => {
                    const isMax = c.gpioCount === maxGpio && maxGpio > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#22201D]">{c.gpioCount} Pins</span>
                          {isMax && (
                            <span className="text-[10px] bg-[#D87535]/15 text-[#D87535] px-1.5 py-0.5 rounded font-bold border border-[#D87535]/40">
                              MOST
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Logic Level & Voltage Range
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-[#22201D]">
                      <div className="font-bold text-[#D87535]">{c.logicLevel}</div>
                      <div className="text-[10px] text-[#655F55]">
                        {c.operatingVoltageMin}V – {c.operatingVoltageMax}V Range
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Group 4: Analog Capabilities */}
                <tr className="bg-[#EDE1CE]/70">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#D87535] uppercase tracking-wider">
                    4. Analog Acquisition (ADC / DAC)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    ADC Channels & Resolution
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-[#22201D]">
                      {c.adcChannels > 0 ? (
                        <div>
                          <span className="font-bold text-[#D87535]">{c.adcChannels} Channels</span>
                          <span className="text-xs text-[#655F55]"> ({c.adcResolutionBits}-bit SAR)</span>
                        </div>
                      ) : (
                        getSupportBadge(false, 'No Hardware ADC')
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Hardware DAC Channels
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                      {c.dacChannels > 0 ? (
                        <span className="text-[#87945B] font-bold">{c.dacChannels}x Channels (True Analog Out)</span>
                      ) : (
                        getSupportBadge(false, 'None (Requires PWM Filtering)')
                      )}
                    </td>
                  ))}
                </tr>

                {/* Group 5: Timers & Actuation */}
                <tr className="bg-[#EDE1CE]/70">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#71818B] uppercase tracking-wider">
                    5. Timers, Counters & Motor Control PWM
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Hardware Timers
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-[#22201D]">
                      <span className="font-bold">{c.timers} Hardware Timers</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Dedicated PWM Channels
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-[#22201D]">
                      {c.pwmChannels > 0 ? (
                        <span className="text-[#D87535] font-bold">{c.pwmChannels} PWM Channels</span>
                      ) : (
                        getSupportBadge(false, 'Software Bit-bang')
                      )}
                    </td>
                  ))}
                </tr>

                {/* Group 6: Communication Protocols */}
                <tr className="bg-[#EDE1CE]/70">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#87945B] uppercase tracking-wider">
                    6. Serial Protocols & Field Buses
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    UART / USART
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-[#22201D]">
                      {c.uartCount}x Port{c.uartCount === 1 ? '' : 's'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    SPI / I2C Interfaces
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-[#22201D]">
                      {c.spiCount}x SPI, {c.i2cCount}x I2C
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Automotive CAN Bus
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                      {c.canCount > 0 ? (
                        <span className="text-[#87945B] font-bold">{c.canCount}x CAN 2.0 / FD</span>
                      ) : (
                        getSupportBadge(false, 'No Integrated CAN')
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Native USB Support
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                      {getSupportBadge(c.usbSupport, c.usbSupport ? 'Native USB Device/Host' : 'External Bridge Required')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    DMA Controller
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-[#22201D]">
                      {c.dmaChannels > 0 ? (
                        <span className="text-[#D87535] font-bold">{c.dmaChannels} DMA Channels</span>
                      ) : (
                        <span className="text-[#655F55]">CPU Polled I/O</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Group 7: Wireless & RF */}
                <tr className="bg-[#EDE1CE]/70">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#D87535] uppercase tracking-wider">
                    7. Integrated RF & Wireless Connectivity
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Wireless Protocols
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-xs">
                      {getSupportBadge(c.wireless, c.wireless)}
                    </td>
                  ))}
                </tr>

                {/* Group 8: Power Characteristics */}
                <tr className="bg-[#EDE1CE]/70">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#B95D32] uppercase tracking-wider">
                    8. Low Power Profiles & Battery Longevity
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Deep Sleep Current
                  </td>
                  {controllers.map((c) => {
                    const isMin = c.deepSleepCurrentUa === minSleep && minSleep > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60">
                        {c.deepSleepCurrentUa !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[#87945B] font-bold">
                              {c.deepSleepCurrentUa} µA
                            </span>
                            {isMin && (
                              <span className="text-[10px] bg-[#87945B]/15 text-[#87945B] px-1.5 py-0.5 rounded font-bold border border-[#87945B]/40">
                                LOWEST
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#655F55]">N/A / High</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Group 9: Robotics & Application Suitability */}
                <tr className="bg-[#EDE1CE]/70">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#87945B] uppercase tracking-wider">
                    9. Robotics & Kinematic Control Suitability
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Ideal Robotics Domains
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-xs text-[#22201D] leading-relaxed font-sans">
                      {c.roboticsApplications || 'General purpose microcontroller prototyping.'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#655F55] font-semibold bg-[#EDE1CE]/30">
                    Ecosystem & Toolchains
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#C9BDAA]/60 text-xs text-[#655F55]">
                      {c.developmentTools || 'GCC and standard vendor IDEs.'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Part D: Engineering Explanations & Analytical Commentary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider font-bold">
              <Info className="w-4 h-4" />
              Engineering Trade-Off Analysis & Architectural Commentary
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Commentary 1 */}
              <div className="p-5 rounded-2xl border border-[#C9BDAA] bg-[#FAF5EB] space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  Clock Frequency vs Instructions Per Second (CPI)
                </div>
                <p className="text-xs text-[#655F55] leading-relaxed font-sans">
                  Raw clock frequency does not correlate directly to throughput across disparate instruction
                  set architectures. Classic 8051 implementations divide the oscillator frequency by 12,
                  meaning a 33MHz crystal yields ~2.75 MIPS. Conversely, AVR executes 1 single-cycle
                  instruction per clock tick (16 MIPS at 16MHz), while pipelined ARM Cortex-M4 cores achieve
                  1.25 DMIPS/MHz (yielding 105 DMIPS at 84MHz) with hardware single-cycle DSP multiply-accumulate.
                </p>
              </div>

              {/* Commentary 2 */}
              <div className="p-5 rounded-2xl border border-[#C9BDAA] bg-[#FAF5EB] space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono text-[#B95D32] font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  Internal Flash vs Execute-in-Place (XIP) Caching
                </div>
                <p className="text-xs text-[#655F55] leading-relaxed font-sans">
                  Monolithic microcontrollers (STM32, AVR, PIC) integrate on-die NOR Flash memory tightly
                  coupled to the instruction bus with hardware branch cache accelerators (e.g., ST ART Accelerator).
                  In contrast, platforms like the RP2040 and ESP32 rely on external Quad-SPI / Octal-SPI Flash
                  chips. Cache hits execute rapidly, but cache misses stall the CPU by dozens of wait states,
                  which requires careful linker script pinning of motor interrupt routines into zero-wait-state SRAM.
                </p>
              </div>

              {/* Commentary 3 */}
              <div className="p-5 rounded-2xl border border-[#C9BDAA] bg-[#FAF5EB] space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono text-[#87945B] font-bold">
                  <Bot className="w-3.5 h-3.5" />
                  Real-Time Determinism vs Wireless Protocol Stacks
                </div>
                <p className="text-xs text-[#655F55] leading-relaxed font-sans">
                  Running a full 802.11 Wi-Fi or Bluetooth LE protocol stack introduces non-deterministic
                  interrupt latency of tens of milliseconds. The dual-core architecture of the ESP32
                  circumvents this by pinning the proprietary wireless stack to PRO_CPU (Core 0), freeing
                  APP_CPU (Core 1) to execute deterministic FreeRTOS motion planning, encoder sampling, and PID loops.
                </p>
              </div>

              {/* Commentary 4 */}
              <div className="p-5 rounded-2xl border border-[#C9BDAA] bg-[#FAF5EB] space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-mono text-[#71818B] font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  5V Robustness vs High-Resolution Fast ADC Sampling
                </div>
                <p className="text-xs text-[#655F55] leading-relaxed font-sans">
                  Legacy 8-bit controllers (ATmega328P, PIC16, 8051) operate natively at 5V logic with large
                  noise immunity margins, making them resilient in high-EMI industrial relay and solenoid
                  environments. Modern 32-bit MCUs operate at 3.3V or 1.8V, offering dramatically higher ADC
                  sampling rates (2.4 MSPS on STM32 vs 15 kSPS on AVR) and 12-bit/16-bit resolution essential
                  for field-oriented motor control (FOC).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
