import React, { useState } from 'react';
import { Sliders, Check, X, Cpu, Clock, Zap, Radio, Layers } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export function ComparePage() {
  const comparisonCatalog = [
    {
      id: 'stm32f401',
      name: 'STM32F401RE (Nucleo)',
      family: 'STM32',
      bitWidth: 32,
      core: 'ARM Cortex-M4 with FPU',
      clock: '84 MHz',
      flash: '512 KB',
      sram: '96 KB',
      voltage: '1.7V – 3.6V (3.3V Logic)',
      gpio: 50,
      adc: '16 ch (12-bit)',
      timers: 11,
      connectivity: '3x UART, 4x SPI, 3x I2C, USB OTG',
      wireless: 'None (Requires Transceiver)',
      dma: '16 Streams',
      idealFor: 'Precision Motor Control, Robotics, Real-Time Audio DSP',
    },
    {
      id: 'esp32',
      name: 'ESP32 (NodeMCU)',
      family: 'ESP32',
      bitWidth: 32,
      core: 'Dual-Core Xtensa LX6',
      clock: '240 MHz',
      flash: '4096 KB (4MB)',
      sram: '520 KB',
      voltage: '3.0V – 3.6V (3.3V Logic)',
      gpio: 36,
      adc: '18 ch (12-bit)',
      timers: 4,
      connectivity: '3x UART, 3x SPI, 2x I2C, CAN 2.0',
      wireless: 'Wi-Fi 802.11 b/g/n + BLE 4.2',
      dma: 'Built-in Peripheral DMA',
      idealFor: 'Connected IoT, Sensor Gateways, Edge Mesh Networks',
    },
    {
      id: 'rp2040',
      name: 'RP2040 (Raspberry Pi Pico)',
      family: 'RP2040',
      bitWidth: 32,
      core: 'Dual-Core ARM Cortex-M0+',
      clock: '133 MHz',
      flash: '2048 KB (External QSPI)',
      sram: '264 KB (6 Banks)',
      voltage: '1.8V – 3.3V (3.3V Logic)',
      gpio: 30,
      adc: '4 ch (12-bit)',
      timers: 2,
      connectivity: '2x UART, 2x SPI, 2x I2C, USB 1.1',
      wireless: 'None (Pico W has CYW43439)',
      dma: '12 Channels',
      idealFor: 'Custom Protocols (PIO), Low-Cost Maker Projects, Emulator Logic',
    },
    {
      id: 'atmega328p',
      name: 'ATmega328P (Arduino Uno)',
      family: 'AVR',
      bitWidth: 8,
      core: 'AVR 8-bit RISC',
      clock: '16 MHz',
      flash: '32 KB',
      sram: '2 KB',
      voltage: '1.8V – 5.5V (5V Logic)',
      gpio: 23,
      adc: '6 ch (10-bit)',
      timers: 3,
      connectivity: '1x UART, 1x SPI, 1x I2C',
      wireless: 'None',
      dma: 'None (Direct CPU polling)',
      idealFor: 'Foundational Education, Simple Digital Control, Hobbyist Prototyping',
    },
  ];

  const [selectedIds, setSelectedIds] = useState(['stm32f401', 'esp32', 'rp2040']);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const activeControllers = comparisonCatalog.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <Sliders className="w-3.5 h-3.5" />
          Hardware Evaluation Bench
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
          Microcontroller Comparison Matrix
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1 max-w-2xl">
          Evaluate side-by-side architectural trade-offs between 8-bit and 32-bit computing platforms.
        </p>
      </div>

      {/* Target Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#111E30] border border-[#192B40]">
        <span className="text-xs font-mono text-[#8FA6BC] mr-2">Select Targets to Compare (2-4):</span>
        {comparisonCatalog.map((c) => {
          const isSelected = selectedIds.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleSelect(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#55C7FF] text-[#0B1220] font-semibold shadow-[0_0_12px_rgba(85,199,255,0.35)]'
                  : 'bg-[#0B1220] text-[#8FA6BC] hover:text-[#EAF5FF] border border-[#192B40]'
              }`}
            >
              {c.name.split(' (')[0]}
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#192B40] bg-[#111E30]/70 shadow-2xl">
        <table className="w-full border-collapse text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#192B40] bg-[#0B1220]/90">
              <th className="p-4 text-[#8FA6BC] uppercase tracking-wider w-48">Parameter</th>
              {activeControllers.map((ctrl) => (
                <th key={ctrl.id} className="p-4 text-[#EAF5FF] font-heading font-bold text-base min-w-[220px]">
                  <div className="text-xs font-mono text-[#55C7FF] font-normal uppercase tracking-wider">
                    {ctrl.family}
                  </div>
                  <div>{ctrl.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#192B40]/70">
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Architecture & Core</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#EAF5FF]">{c.core}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Bit Width</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4">
                  <Badge variant={c.bitWidth === 32 ? 'cyan' : 'amber'}>{c.bitWidth}-BIT</Badge>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Max Clock Speed</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#55C7FF] font-bold">{c.clock}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Flash Memory</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#EAF5FF]">{c.flash}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">SRAM Memory</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#EAF5FF]">{c.sram}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Voltage & Logic</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#A5E3FF]">{c.voltage}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">GPIO Count</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#EAF5FF]">{c.gpio} Lines</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Analog ADC Channels</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#EAF5FF]">{c.adc}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Hardware Timers</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#EAF5FF]">{c.timers} Timers</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Serial Protocols</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#8FA6BC]">{c.connectivity}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Wireless Connectivity</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#10B981] font-semibold">{c.wireless}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-[#8FA6BC] font-semibold bg-[#0B1220]/40">Primary Use Case</td>
              {activeControllers.map((c) => (
                <td key={c.id} className="p-4 text-[#8FA6BC] leading-relaxed">{c.idealFor}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

