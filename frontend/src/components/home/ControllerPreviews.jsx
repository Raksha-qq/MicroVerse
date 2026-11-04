import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Cpu,
  Clock,
  Zap,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { controllerService } from '../../services/controllerService';
import { CONTROLLER_FAMILIES } from '../../data/navigation';

export function ControllerPreviews() {
  const [controllers, setControllers] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Fallback curated preview data if API is starting or network is offline
  const fallbackControllers = [
    {
      id: 'stm32f401',
      name: 'STM32F401RET6',
      commonName: 'STM32F401RE (Nucleo-64)',
      family: 'STM32',
      architecture: 'ARMv7E-M (32-bit RISC)',
      core: 'ARM Cortex-M4 with FPU',
      manufacturer: 'STMicroelectronics',
      bitWidth: 32,
      maxClockSpeedMHz: 84.0,
      flashKb: 512.0,
      sramKb: 96.0,
      logicLevel: '3.3V (5V tolerant)',
      gpioCount: 50,
      adcChannels: 16,
      adcResolutionBits: 12,
      timers: 11,
      description:
        'High-performance foundational ARM Cortex-M4 microcontroller featuring hardware single-precision FPU, adaptive real-time ART accelerator, and multi-layer AHB bus matrix.',
      isFeatured: true,
    },
    {
      id: 'esp32',
      name: 'ESP32-D0WDQ6',
      commonName: 'ESP32 (Dual-Core NodeMCU)',
      family: 'ESP32',
      architecture: 'Xtensa Dual-Core 32-bit LX6',
      core: 'Xtensa LX6',
      manufacturer: 'Espressif Systems',
      bitWidth: 32,
      maxClockSpeedMHz: 240.0,
      flashKb: 4096.0,
      sramKb: 520.0,
      logicLevel: '3.3V',
      gpioCount: 36,
      adcChannels: 18,
      adcResolutionBits: 12,
      timers: 4,
      wireless: 'Wi-Fi 802.11 b/g/n & Bluetooth v4.2 BR/EDR and BLE',
      description:
        'Ubiquitous wireless powerhouse integrating Wi-Fi and Bluetooth coexistence, dual symmetric CPU cores, and ultra-low-power (ULP) co-processor.',
      isFeatured: true,
    },
    {
      id: 'rp2040',
      name: 'RP2040',
      commonName: 'Raspberry Pi RP2040 (Pico)',
      family: 'RP2040',
      architecture: 'ARMv6-M (32-bit Dual-Core)',
      core: 'Dual ARM Cortex-M0+',
      manufacturer: 'Raspberry Pi',
      bitWidth: 32,
      maxClockSpeedMHz: 133.0,
      flashKb: 2048.0,
      sramKb: 264.0,
      logicLevel: '3.3V',
      gpioCount: 30,
      adcChannels: 4,
      adcResolutionBits: 12,
      timers: 2,
      description:
        'Modern dual-core Cortex-M0+ silicon with unique Programmable I/O (PIO) state machines for bare-metal custom protocol generation without CPU load.',
      isFeatured: true,
    },
    {
      id: 'atmega328p',
      name: 'ATmega328P-PU',
      commonName: 'ATmega328P (Arduino Uno Core)',
      family: 'AVR',
      architecture: 'AVR 8-bit Enhanced RISC',
      core: 'AVR 8-bit RISC',
      manufacturer: 'Microchip Technology',
      bitWidth: 8,
      maxClockSpeedMHz: 16.0,
      flashKb: 32.0,
      sramKb: 2.0,
      logicLevel: '5V',
      gpioCount: 23,
      adcChannels: 6,
      adcResolutionBits: 10,
      timers: 3,
      description:
        'Classic 8-bit microcontroller that trained a generation of makers and engineers. Single-cycle execution of 131 instructions with deterministic timing.',
      isFeatured: true,
    },
    {
      id: 'pic16f877a',
      name: 'PIC16F877A',
      commonName: 'Microchip PIC16F877A',
      family: 'PIC',
      architecture: 'PIC Mid-Range 8-bit RISC',
      core: 'PIC 8-bit Core',
      manufacturer: 'Microchip Technology',
      bitWidth: 8,
      maxClockSpeedMHz: 20.0,
      flashKb: 14.3,
      sramKb: 0.368,
      logicLevel: '5V',
      gpioCount: 33,
      adcChannels: 8,
      adcResolutionBits: 10,
      timers: 3,
      description:
        'Industrial workhorse featuring 35 single-word instructions, hardware capture/compare/PWM peripherals, and high-current sink/source capabilities.',
      isFeatured: false,
    },
    {
      id: 'at89c51',
      name: 'AT89C51-24PC',
      commonName: 'Intel 8051 Architecture',
      family: '8051',
      architecture: 'MCS-51 CISC Architecture',
      core: '8051 CISC Core',
      manufacturer: 'Microchip (Atmel)',
      bitWidth: 8,
      maxClockSpeedMHz: 24.0,
      flashKb: 4.0,
      sramKb: 0.128,
      logicLevel: '5V',
      gpioCount: 32,
      adcChannels: 0,
      adcResolutionBits: 0,
      timers: 2,
      description:
        'The foundational microcontroller architecture introduced in 1980. Distinct memory spaces for code and data with direct bit-addressable RAM.',
      isFeatured: false,
    },
  ];

  useEffect(() => {
    setLoading(true);
    controllerService
      .getControllers()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setControllers(res.data);
        } else {
          setControllers(fallbackControllers);
        }
      })
      .catch(() => {
        setControllers(fallbackControllers);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredControllers =
    selectedFamily === 'ALL'
      ? controllers
      : controllers.filter(
          (c) =>
            c.family?.toUpperCase() === selectedFamily.toUpperCase() ||
            c.family?.includes(selectedFamily)
        );

  return (
    <section className="space-y-6" id="archive">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C9BDAA]/50 pb-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D87535]">
            <Layers className="w-3.5 h-3.5" />
            <span>// THE SILICON BENCHMARK</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D] tracking-tight">
            Selected Controller Families
          </h2>
          <p className="text-sm text-[#655F55] max-w-2xl font-sans">
            Inspect the hardware footprints, clock topologies, and memory allocations powering the world's embedded devices.
          </p>
        </div>

        <Link to="/archive">
          <Button variant="secondary" size="sm" className="gap-2 font-mono">
            <span>Explore Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D87535]" />
          </Button>
        </Link>
      </div>

      {/* Family Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-1 overflow-x-auto">
        {CONTROLLER_FAMILIES.map((fam) => (
          <button
            key={fam.id}
            onClick={() => setSelectedFamily(fam.id)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all duration-200 cursor-pointer ${
              selectedFamily === fam.id
                ? 'bg-[#D87535] text-[#FAF5EB] font-bold shadow-xs'
                : 'bg-[#FAF5EB] text-[#655F55] hover:text-[#22201D] border border-[#C9BDAA]'
            }`}
          >
            {fam.label}
          </button>
        ))}
      </div>

      {/* Controllers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredControllers.slice(0, 6).map((ctrl) => (
          <Card
            key={ctrl.id || ctrl.name}
            className="flex flex-col justify-between space-y-4 group hover:border-[#D87535] transition-all duration-200"
          >
            <div className="space-y-3">
              {/* Header with Manufacturer & Bit-width */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#8C8275]">
                    {ctrl.manufacturer}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#22201D] group-hover:text-[#D87535] transition-colors leading-snug">
                    {ctrl.commonName}
                  </h3>
                  <div className="text-xs font-mono text-[#D87535] font-semibold">{ctrl.name}</div>
                </div>
                <Badge variant={ctrl.bitWidth === 32 ? 'cyan' : 'amber'}>
                  {ctrl.bitWidth}-BIT
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-[#655F55] leading-relaxed line-clamp-3 font-sans">
                {ctrl.description}
              </p>

              {/* Hardware Spec Badges Strip */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C9BDAA]/40 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-[#655F55]">
                  <Clock className="w-3.5 h-3.5 text-[#D87535]" />
                  <span>{ctrl.maxClockSpeedMHz} MHz Clock</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#655F55]">
                  <Zap className="w-3.5 h-3.5 text-[#71818B]" />
                  <span>{ctrl.flashKb} KB Flash</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#655F55]">
                  <Cpu className="w-3.5 h-3.5 text-[#87945B]" />
                  <span>{ctrl.sramKb} KB SRAM</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#655F55]">
                  <Radio className="w-3.5 h-3.5 text-[#B95D32]" />
                  <span>{ctrl.gpioCount} GPIO Lines</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions & Link */}
            <div className="pt-3 border-t border-[#C9BDAA]/40 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-[#8C8275] truncate max-w-[150px]">
                {ctrl.core}
              </span>
              <Link
                to={`/archive?mcu=${encodeURIComponent(ctrl.slug || ctrl.id)}`}
                className="inline-flex items-center gap-1 text-[#D87535] hover:text-[#B95D32] transition-colors font-medium group-hover:translate-x-0.5 transition-transform"
              >
                <span>Inspect Specs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
