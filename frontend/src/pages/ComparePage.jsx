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
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          <Check className="w-3 h-3" />
          {customLabel || 'Supported'}
        </span>
      );
    }
    if (typeof val === 'string' && (val.toLowerCase().includes('external') || val.toLowerCase().includes('pico w') || val.toLowerCase().includes('optional') || val.toLowerCase().includes('carrier'))) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
          <span>~</span>
          {customLabel || 'Variant / Ext Dependent'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8FA6BC] bg-[#111E30] px-2 py-0.5 rounded border border-[#192B40]">
        <X className="w-3 h-3 text-[#8FA6BC]/60" />
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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <Sliders className="w-3.5 h-3.5" />
          Hardware Evaluation Bench & Benchmark Matrix
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
          Microcontroller Comparison Lab
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1 max-w-3xl leading-relaxed">
          Side-by-side engineering evaluation bench comparing silicon architectures, register pipelines,
          bus bandwidth, peripheral matrices, and robotics control trade-offs.
        </p>
      </div>

      {/* Target Selector Bar */}
      <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/80 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
              Active Evaluation Targets ({controllers.length}/4)
            </span>
            <p className="text-xs text-[#8FA6BC]">
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
                <Plus className="w-3.5 h-3.5 text-[#55C7FF]" />
                Add Microcontroller to Bench
              </Button>

              {/* Dropdown Selector Popover */}
              {selectorOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-[#55C7FF]/40 bg-[#0B1220] shadow-2xl p-3 z-50 space-y-2">
                  <input
                    type="text"
                    placeholder="Search chip name or family..."
                    value={selectorSearch}
                    onChange={(e) => setSelectorSearch(e.target.value)}
                    className="w-full bg-[#111E30] border border-[#192B40] focus:border-[#55C7FF] rounded-lg px-3 py-1.5 text-xs text-[#EAF5FF] placeholder-[#8FA6BC] outline-none font-mono"
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
                          className="p-2 rounded-lg hover:bg-[#192B40] transition-colors cursor-pointer flex items-center justify-between text-xs font-mono"
                        >
                          <div>
                            <div className="font-bold text-[#EAF5FF]">{chip.name}</div>
                            <div className="text-[10px] text-[#8FA6BC]">
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
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#192B40]/60">
          {controllers.map((ctrl) => (
            <div
              key={ctrl.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#55C7FF]/40 text-xs font-mono text-[#EAF5FF] shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#55C7FF]" />
                <span className="font-bold">{ctrl.name}</span>
                <span className="text-[#8FA6BC]">({ctrl.family})</span>
              </div>
              {selectedIds.length > 2 && (
                <button
                  onClick={() => handleRemove(ctrl.slug || ctrl.id)}
                  title="Remove from comparison bench"
                  className="text-[#8FA6BC] hover:text-rose-400 ml-1 transition-colors"
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
        <div className="py-24 text-center text-xs font-mono text-[#8FA6BC]">
          <Cpu className="w-8 h-8 mx-auto text-[#55C7FF] animate-spin mb-3" />
          SYNCHRONIZING HARDWARE SPECIFICATION VECTORS...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-xs font-mono text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/30">
          {error}
        </div>
      ) : controllers.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-[#8FA6BC] bg-[#111E30] rounded-xl border border-[#192B40]">
          Select at least 2 microcontrollers to populate the comparison matrix.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Side-by-Side Comparison Matrix */}
          <div className="overflow-x-auto rounded-2xl border border-[#192B40] bg-[#111E30]/70 shadow-2xl">
            <table className="w-full border-collapse text-left text-xs font-mono">
              {/* Header Columns */}
              <thead>
                <tr className="border-b border-[#192B40] bg-[#0B1220]">
                  <th className="p-4 text-[#8FA6BC] uppercase tracking-wider w-56 min-w-[200px]">
                    Architectural Metric
                  </th>
                  {controllers.map((ctrl) => (
                    <th
                      key={ctrl.id}
                      className="p-4 text-[#EAF5FF] font-heading font-bold text-base min-w-[240px] max-w-[300px] border-l border-[#192B40]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[10px] font-mono text-[#55C7FF] font-normal uppercase tracking-wider">
                          {ctrl.manufacturer}
                        </div>
                        <Badge variant={ctrl.bitWidth === 32 ? 'cyan' : ctrl.bitWidth === 16 ? 'emerald' : 'amber'}>
                          {ctrl.bitWidth}-BIT
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-[#EAF5FF]">{ctrl.name}</div>
                      <div className="text-xs font-mono text-[#8FA6BC] font-normal">{ctrl.family} Family</div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Group 1: Processing Power & CPU */}
              <tbody className="divide-y divide-[#192B40]/70">
                <tr className="bg-[#0B1220]/80">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#55C7FF] uppercase tracking-wider">
                    1. Processing Unit & Instruction Pipeline
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Processor Architecture (ISA)
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 text-[#EAF5FF] border-l border-[#192B40]/60">
                      <div className="font-bold">{c.architecture}</div>
                      <div className="text-[10px] text-[#8FA6BC] mt-0.5">{c.core}</div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Execution Core Count
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 text-[#EAF5FF] border-l border-[#192B40]/60">
                      {c.coreCount > 1 ? (
                        <span className="text-[#55C7FF] font-bold">Dual-Core ({c.coreCount})</span>
                      ) : (
                        <span>Single-Core (1)</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Max Clock Frequency
                  </td>
                  {controllers.map((c) => {
                    const isMax = c.maxClockSpeedMHz === maxClock && maxClock > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${isMax ? 'text-[#55C7FF]' : 'text-[#EAF5FF]'}`}>
                            {c.maxClockSpeedMHz} MHz
                          </span>
                          {isMax && (
                            <span className="text-[10px] bg-[#55C7FF]/20 text-[#55C7FF] px-1.5 py-0.5 rounded font-bold border border-[#55C7FF]/40">
                              PEAK
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Hardware FPU (Floating Point)
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                      {getSupportBadge(c.fpu, c.fpu ? 'Single Precision FP32' : 'Software Emulated')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    DSP Extensions
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                      {getSupportBadge(c.dsp, c.dsp ? 'SIMD / DSP Instructions' : 'Standard ALU')}
                    </td>
                  ))}
                </tr>

                {/* Group 2: Memory Capacity */}
                <tr className="bg-[#0B1220]/80">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#A5E3FF] uppercase tracking-wider">
                    2. Memory Hierarchy (Flash, SRAM & Non-Volatile)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Flash Program Memory
                  </td>
                  {controllers.map((c) => {
                    const isMax = c.flashKb === maxFlash && maxFlash > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#A5E3FF]">
                            {c.flashKb >= 1024 ? `${(c.flashKb / 1024).toFixed(1)} MB` : `${c.flashKb} KB`}
                          </span>
                          {isMax && (
                            <span className="text-[10px] bg-[#A5E3FF]/20 text-[#A5E3FF] px-1.5 py-0.5 rounded font-bold border border-[#A5E3FF]/40">
                              MAX
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    SRAM Data Memory
                  </td>
                  {controllers.map((c) => {
                    const isMax = c.sramKb === maxSram && maxSram > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#10B981]">
                            {c.sramKb >= 1024 ? `${(c.sramKb / 1024).toFixed(1)} MB` : `${c.sramKb} KB`}
                          </span>
                          {isMax && (
                            <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.5 rounded font-bold border border-[#10B981]/40">
                              MAX
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Internal EEPROM
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-[#EAF5FF]">
                      {c.eepromKb ? `${c.eepromKb} KB Dedicated EEPROM` : 'Emulated in Flash / None'}
                    </td>
                  ))}
                </tr>

                {/* Group 3: I/O & Electrical */}
                <tr className="bg-[#0B1220]/80">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#55C7FF] uppercase tracking-wider">
                    3. I/O, Voltage & Electrical Characteristics
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Digital GPIO Lines
                  </td>
                  {controllers.map((c) => {
                    const isMax = c.gpioCount === maxGpio && maxGpio > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#EAF5FF]">{c.gpioCount} Pins</span>
                          {isMax && (
                            <span className="text-[10px] bg-[#55C7FF]/20 text-[#55C7FF] px-1.5 py-0.5 rounded font-bold border border-[#55C7FF]/40">
                              MOST
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Logic Level & Voltage Range
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-[#EAF5FF]">
                      <div className="font-bold text-[#55C7FF]">{c.logicLevel}</div>
                      <div className="text-[10px] text-[#8FA6BC]">
                        {c.operatingVoltageMin}V – {c.operatingVoltageMax}V Range
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Group 4: Analog Capabilities */}
                <tr className="bg-[#0B1220]/80">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#FBBF24] uppercase tracking-wider">
                    4. Analog Acquisition (ADC / DAC)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    ADC Channels & Resolution
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-[#EAF5FF]">
                      {c.adcChannels > 0 ? (
                        <div>
                          <span className="font-bold text-[#FBBF24]">{c.adcChannels} Channels</span>
                          <span className="text-xs text-[#8FA6BC]"> ({c.adcResolutionBits}-bit SAR)</span>
                        </div>
                      ) : (
                        getSupportBadge(false, 'No Hardware ADC')
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Hardware DAC Channels
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                      {c.dacChannels > 0 ? (
                        <span className="text-emerald-400 font-bold">{c.dacChannels}x Channels (True Analog Out)</span>
                      ) : (
                        getSupportBadge(false, 'None (Requires PWM Filtering)')
                      )}
                    </td>
                  ))}
                </tr>

                {/* Group 5: Timers & Actuation */}
                <tr className="bg-[#0B1220]/80">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#55C7FF] uppercase tracking-wider">
                    5. Timers, Counters & Motor Control PWM
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Hardware Timers
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-[#EAF5FF]">
                      <span className="font-bold">{c.timers} Hardware Timers</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Dedicated PWM Channels
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-[#EAF5FF]">
                      {c.pwmChannels > 0 ? (
                        <span className="text-[#55C7FF] font-bold">{c.pwmChannels} PWM Channels</span>
                      ) : (
                        getSupportBadge(false, 'Software Bit-bang')
                      )}
                    </td>
                  ))}
                </tr>

                {/* Group 6: Communication Protocols */}
                <tr className="bg-[#0B1220]/80">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
                    6. Serial Protocols & Field Buses
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    UART / USART
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-[#EAF5FF]">
                      {c.uartCount}x Port{c.uartCount === 1 ? '' : 's'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    SPI / I2C Interfaces
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-[#EAF5FF]">
                      {c.spiCount}x SPI, {c.i2cCount}x I2C
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Automotive CAN Bus
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                      {c.canCount > 0 ? (
                        <span className="text-emerald-400 font-bold">{c.canCount}x CAN 2.0 / FD</span>
                      ) : (
                        getSupportBadge(false, 'No Integrated CAN')
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Native USB Support
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                      {getSupportBadge(c.usbSupport, c.usbSupport ? 'Native USB Device/Host' : 'External Bridge Required')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    DMA Controller
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-[#EAF5FF]">
                      {c.dmaChannels > 0 ? (
                        <span className="text-[#55C7FF] font-bold">{c.dmaChannels} DMA Channels</span>
                      ) : (
                        <span className="text-[#8FA6BC]">CPU Polled I/O</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Group 7: Wireless & RF */}
                <tr className="bg-[#0B1220]/80">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#A5E3FF] uppercase tracking-wider">
                    7. Integrated RF & Wireless Connectivity
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Wireless Protocols
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-xs">
                      {getSupportBadge(c.wireless, c.wireless)}
                    </td>
                  ))}
                </tr>

                {/* Group 8: Power Characteristics */}
                <tr className="bg-[#0B1220]/80">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#EC4899] uppercase tracking-wider">
                    8. Low Power Profiles & Battery Longevity
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Deep Sleep Current
                  </td>
                  {controllers.map((c) => {
                    const isMin = c.deepSleepCurrentUa === minSleep && minSleep > 0;
                    return (
                      <td key={c.id} className="p-4 border-l border-[#192B40]/60">
                        {c.deepSleepCurrentUa !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">
                              {c.deepSleepCurrentUa} µA
                            </span>
                            {isMin && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-500/40">
                                LOWEST
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#8FA6BC]">N/A / High</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Group 9: Robotics & Application Suitability */}
                <tr className="bg-[#0B1220]/80">
                  <td colSpan={controllers.length + 1} className="px-4 py-2 text-[11px] font-bold text-[#55C7FF] uppercase tracking-wider">
                    9. Robotics & Kinematic Control Suitability
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Ideal Robotics Domains
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-xs text-[#EAF5FF] leading-relaxed">
                      {c.roboticsApplications || 'General purpose microcontroller prototyping.'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">
                    Ecosystem & Toolchains
                  </td>
                  {controllers.map((c) => (
                    <td key={c.id} className="p-4 border-l border-[#192B40]/60 text-xs text-[#8FA6BC]">
                      {c.developmentTools || 'GCC and standard vendor IDEs.'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Part D: Engineering Explanations & Analytical Commentary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider">
              <Info className="w-4 h-4" />
              Engineering Trade-Off Analysis & Architectural Commentary
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Commentary 1 */}
              <div className="p-5 rounded-2xl border border-[#192B40] bg-[#111E30]/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  Clock Frequency vs Instructions Per Second (CPI)
                </div>
                <p className="text-xs text-[#8FA6BC] leading-relaxed">
                  Raw clock frequency does not correlate directly to throughput across disparate instruction
                  set architectures. Classic 8051 implementations divide the oscillator frequency by 12,
                  meaning a 33MHz crystal yields ~2.75 MIPS. Conversely, AVR executes 1 single-cycle
                  instruction per clock tick (16 MIPS at 16MHz), while pipelined ARM Cortex-M4 cores achieve
                  1.25 DMIPS/MHz (yielding 105 DMIPS at 84MHz) with hardware single-cycle DSP multiply-accumulate.
                </p>
              </div>

              {/* Commentary 2 */}
              <div className="p-5 rounded-2xl border border-[#192B40] bg-[#111E30]/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#A5E3FF] font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  Internal Flash vs Execute-in-Place (XIP) Caching
                </div>
                <p className="text-xs text-[#8FA6BC] leading-relaxed">
                  Monolithic microcontrollers (STM32, AVR, PIC) integrate on-die NOR Flash memory tightly
                  coupled to the instruction bus with hardware branch cache accelerators (e.g., ST ART Accelerator).
                  In contrast, platforms like the RP2040 and ESP32 rely on external Quad-SPI / Octal-SPI Flash
                  chips. Cache hits execute rapidly, but cache misses stall the CPU by dozens of wait states,
                  which requires careful linker script pinning of motor interrupt routines into zero-wait-state SRAM.
                </p>
              </div>

              {/* Commentary 3 */}
              <div className="p-5 rounded-2xl border border-[#192B40] bg-[#111E30]/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] font-bold">
                  <Bot className="w-3.5 h-3.5" />
                  Real-Time Determinism vs Wireless Protocol Stacks
                </div>
                <p className="text-xs text-[#8FA6BC] leading-relaxed">
                  Running a full 802.11 Wi-Fi or Bluetooth LE protocol stack introduces non-deterministic
                  interrupt latency of tens of milliseconds. The dual-core architecture of the ESP32
                  circumvents this by pinning the proprietary wireless stack to PRO_CPU (Core 0), freeing
                  APP_CPU (Core 1) to execute deterministic FreeRTOS motion planning, encoder sampling, and PID loops.
                </p>
              </div>

              {/* Commentary 4 */}
              <div className="p-5 rounded-2xl border border-[#192B40] bg-[#111E30]/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FBBF24] font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  5V Robustness vs High-Resolution Fast ADC Sampling
                </div>
                <p className="text-xs text-[#8FA6BC] leading-relaxed">
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
