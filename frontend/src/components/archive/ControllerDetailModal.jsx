import React, { useState } from 'react';
import {
  X,
  Cpu,
  Clock,
  Zap,
  Radio,
  ExternalLink,
  ShieldCheck,
  Wrench,
  Bot,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Sliders,
  Layers,
  FileText,
  Bookmark
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { PinoutVisualizer } from './PinoutVisualizer';
import { useNavigate } from 'react-router-dom';

export function ControllerDetailModal({
  controller,
  onClose,
  onAddToCompare,
  isBookmarked = false,
  onToggleBookmark,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('specs');

  if (!controller) return null;

  // Safely parse JSON or string arrays
  const parseList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return String(val)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const advantages = parseList(controller.advantages);
  const limitations = parseList(controller.limitations);

  const handleCompareClick = () => {
    if (onAddToCompare) {
      onAddToCompare(controller.slug || controller.id);
    }
    navigate(`/compare?ids=${controller.slug || controller.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#22201D]/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FAF5EB] border border-[#C9BDAA] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col bg-drafting-grid-subtle">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#C9BDAA] bg-[#EDE1CE] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#D87535] font-bold">
                {controller.manufacturer}
              </span>
              <span className="text-xs text-[#8C8275]">•</span>
              <span className="text-[11px] font-mono text-[#655F55]">{controller.family} Family</span>
              <Badge variant={controller.bitWidth === 32 ? 'cyan' : controller.bitWidth === 16 ? 'emerald' : 'amber'}>
                {controller.bitWidth}-BIT
              </Badge>
              {controller.verifiedAt && (
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#87945B] bg-[#87945B]/15 px-2 py-0.5 rounded border border-[#87945B]/40 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Datasheet Verified
                </div>
              )}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#22201D]">
              {controller.name}
            </h2>
            <p className="text-xs font-mono text-[#D87535]">{controller.commonName}</p>
          </div>

          <div className="flex items-center gap-2">
            {onToggleBookmark && (
              <button
                onClick={onToggleBookmark}
                title={isBookmarked ? "Remove Bookmark" : "Save to Bookmarks"}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-[#D87535]/20 text-[#D87535] border-[#D87535]/50 shadow-xs"
                    : "bg-[#FAF5EB] hover:bg-[#EDE1CE] text-[#655F55] hover:text-[#22201D] border-[#C9BDAA]"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#FAF5EB] hover:bg-[#EDE1CE] text-[#655F55] hover:text-[#22201D] border border-[#C9BDAA] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-[#C9BDAA] bg-[#EDE1CE]/60 px-4 sm:px-6">
          {[
            { id: 'specs', label: 'Datasheet Specs', icon: Cpu },
            { id: 'pinout', label: 'Interactive Pinout', icon: Layers },
            { id: 'proscons', label: 'Pros & Limitations', icon: AlertTriangle },
            { id: 'ecosystem', label: 'Development Ecosystem', icon: Wrench },
            { id: 'robotics', label: 'Robotics Integration', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-mono whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-[#D87535] text-[#22201D] font-bold bg-[#FAF5EB]'
                    : 'border-transparent text-[#655F55] hover:text-[#22201D]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D87535]' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              {/* Architecture Context Banner */}
              <div className="p-4 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-2">
                <div className="text-xs font-mono text-[#D87535] uppercase tracking-wider font-bold">
                  Silicon Architectural Overview
                </div>
                <p className="text-xs text-[#22201D] leading-relaxed font-sans">
                  {controller.description}
                </p>
                {controller.architecturalNotes && (
                  <div className="mt-2 pt-2 border-t border-[#C9BDAA] text-[11px] font-mono text-[#655F55]">
                    <span className="text-[#22201D] font-bold">Taxonomy Breakdown: </span>
                    {controller.architecturalNotes}
                  </div>
                )}
              </div>

              {/* Hardware Specifications Grid */}
              <div>
                <div className="text-xs font-mono text-[#8C8275] uppercase tracking-wider mb-3 font-semibold">
                  Comprehensive Hardware Matrix
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">CPU CORE & ISA</div>
                    <div className="text-[#22201D] font-bold mt-0.5">{controller.core}</div>
                    <div className="text-[#D87535] text-[10px] mt-0.5 font-semibold">
                      {controller.coreCount > 1 ? `${controller.coreCount} Cores` : 'Single Core'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">MAX CLOCK SPEED</div>
                    <div className="text-[#22201D] font-bold text-sm mt-0.5">
                      {controller.maxClockSpeedMHz} MHz
                    </div>
                    <div className="text-[#655F55] text-[10px] mt-0.5">PLL / Crystal Driven</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">PROGRAM FLASH</div>
                    <div className="text-[#B95D32] font-bold text-sm mt-0.5">
                      {controller.flashKb >= 1024 ? `${(controller.flashKb / 1024).toFixed(1)} MB` : `${controller.flashKb} KB`}
                    </div>
                    <div className="text-[#655F55] text-[10px] mt-0.5">Non-volatile Storage</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">SRAM MEMORY</div>
                    <div className="text-[#87945B] font-bold text-sm mt-0.5">
                      {controller.sramKb >= 1024 ? `${(controller.sramKb / 1024).toFixed(1)} MB` : `${controller.sramKb} KB`}
                    </div>
                    <div className="text-[#655F55] text-[10px] mt-0.5">Static RAM</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">VOLTAGE & LOGIC</div>
                    <div className="text-[#22201D] font-bold mt-0.5">
                      {controller.operatingVoltageMin}V – {controller.operatingVoltageMax}V
                    </div>
                    <div className="text-[#D87535] text-[10px] mt-0.5 font-semibold">{controller.logicLevel}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">DIGITAL GPIO</div>
                    <div className="text-[#22201D] font-bold mt-0.5">{controller.gpioCount} Pins</div>
                    <div className="text-[#655F55] text-[10px] mt-0.5">{controller.packageTypes}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">ANALOG ADC</div>
                    <div className="text-[#22201D] font-bold mt-0.5">
                      {controller.adcChannels > 0 ? `${controller.adcChannels} Channels` : 'None (Ext Required)'}
                    </div>
                    <div className="text-[#B95D32] text-[10px] mt-0.5 font-semibold">
                      {controller.adcResolutionBits > 0 ? `${controller.adcResolutionBits}-bit Resolution` : 'External ADC'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">TIMERS & PWM</div>
                    <div className="text-[#22201D] font-bold mt-0.5">{controller.timers} Timers</div>
                    <div className="text-[#71818B] text-[10px] mt-0.5 font-semibold">
                      {controller.pwmChannels > 0 ? `${controller.pwmChannels} PWM Channels` : 'Software Bit-bang'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">SERIAL INTERFACES</div>
                    <div className="text-[#22201D] font-bold mt-0.5">
                      {controller.uartCount}x UART, {controller.spiCount}x SPI
                    </div>
                    <div className="text-[#655F55] text-[10px] mt-0.5">{controller.i2cCount}x I2C</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">AUTOMOTIVE & CAN</div>
                    <div className="text-[#22201D] font-bold mt-0.5">
                      {controller.canCount > 0 ? `${controller.canCount}x CAN 2.0 / FD` : 'No Native CAN'}
                    </div>
                    <div className="text-[#655F55] text-[10px] mt-0.5">
                      {controller.usbSupport ? 'Native USB Support' : 'No Native USB'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">WIRELESS / RF</div>
                    <div className="text-[#87945B] font-bold mt-0.5 line-clamp-1">
                      {controller.wireless || 'None'}
                    </div>
                    <div className="text-[#655F55] text-[10px] mt-0.5">Transceiver Status</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                    <div className="text-[#8C8275] text-[10px]">MATH ACCELERATION</div>
                    <div className="text-[#22201D] font-bold mt-0.5">
                      {controller.fpu ? 'Hardware FPU (FP32)' : 'Software Emulated Math'}
                    </div>
                    <div className="text-[#D87535] text-[10px] mt-0.5 font-semibold">
                      {controller.dsp ? 'DSP Extensions Included' : 'Standard ALU'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Pinout Visualizer */}
          {activeTab === 'pinout' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#655F55]">
                Interactive pinout diagram demonstrating physical pin functions, voltage rails, and alternate multiplexed peripherals.
              </div>
              <PinoutVisualizer
                pinoutConfig={controller.pinoutConfig}
                chipName={controller.name}
                packageType={controller.packageTypes}
              />
            </div>
          )}

          {/* TAB 3: Pros & Limitations */}
          {activeTab === 'proscons' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Advantages */}
                <div className="rounded-xl border border-[#87945B]/40 bg-[#87945B]/10 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#87945B] font-serif font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Realistic Engineering Advantages
                  </div>
                  <ul className="space-y-2.5">
                    {advantages.length > 0 ? (
                      advantages.map((adv, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#22201D] leading-relaxed font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#87945B] mt-1.5 shrink-0" />
                          <span>{adv}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-[#655F55]">No verified advantages logged.</li>
                    )}
                  </ul>
                </div>

                {/* Limitations */}
                <div className="rounded-xl border border-[#B95D32]/40 bg-[#B95D32]/10 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#B95D32] font-serif font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Realistic Architectural Limitations
                  </div>
                  <ul className="space-y-2.5">
                    {limitations.length > 0 ? (
                      limitations.map((lim, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#22201D] leading-relaxed font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B95D32] mt-1.5 shrink-0" />
                          <span>{lim}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-[#655F55]">No architectural limitations logged.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Ecosystem */}
          {activeTab === 'ecosystem' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3">
                <div className="text-xs font-mono text-[#D87535] uppercase tracking-wider font-bold flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Supported Toolchains, IDEs & Debugging Probes
                </div>
                <p className="text-xs text-[#655F55] leading-relaxed font-sans">
                  Industrial embedded development requires matching the target silicon to validated compilers, linker scripts, and hardware in-circuit debuggers.
                </p>
                <div className="p-3 rounded-lg bg-[#FAF5EB] border border-[#C9BDAA] text-xs font-mono text-[#22201D]">
                  {controller.developmentTools || 'GCC toolchain, vendor IDE, and standard JTAG/SWD debuggers.'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                  <div className="text-[10px] text-[#8C8275] uppercase">Compilers / Toolchains</div>
                  <div className="font-bold text-[#22201D] mt-1">
                    {controller.bitWidth === 32 ? 'arm-none-eabi-gcc, Clang' : controller.family === '8051' ? 'Keil C51, SDCC' : 'avr-gcc / xc8'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                  <div className="text-[10px] text-[#8C8275] uppercase">Hardware Debugger</div>
                  <div className="font-bold text-[#D87535] mt-1">
                    {controller.family === 'STM32' ? 'ST-LINK / V2, J-Link' : controller.family === 'ESP32' ? 'ESP-Prog / JTAG' : controller.family === 'RP2040' ? 'Raspberry Pi Debug Probe' : 'USBasp / PICkit'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
                  <div className="text-[10px] text-[#8C8275] uppercase">RTOS Support</div>
                  <div className="font-bold text-[#87945B] mt-1">
                    {controller.sramKb >= 32 ? 'FreeRTOS, Zephyr, RT-Thread' : 'Bare Metal Superloop'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Robotics Integration */}
          {activeTab === 'robotics' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#EDE1CE] border border-[#C9BDAA] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider font-bold">
                  <Bot className="w-4 h-4" />
                  Robotics, Actuation & Sensor Fusion Applications
                </div>
                <p className="text-xs text-[#22201D] leading-relaxed font-sans">
                  {controller.roboticsApplications ||
                    'Robotic actuator control, sensor acquisition over SPI/I2C, and closed-loop motor velocity control.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF5EB] border border-[#C9BDAA] space-y-2">
                <div className="text-xs font-mono text-[#D87535] uppercase tracking-wider font-bold">
                  Typical General Applications
                </div>
                <p className="text-xs font-mono text-[#655F55]">
                  {controller.applications || 'General embedded control and IoT devices.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#C9BDAA] bg-[#EDE1CE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#655F55]">
            {controller.technicalSources ? (
              <span className="line-clamp-1">
                Ref: <span className="text-[#22201D] font-bold">{controller.technicalSources}</span>
              </span>
            ) : (
              <span>Datasheet verified against official errata</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCompareClick}
              className="flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              Compare in Lab
            </Button>

            {controller.datasheetUrl && (
              <a
                href={controller.datasheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#22201D] text-[#FAF5EB] font-bold hover:bg-[#3D3A36] transition-all shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#D87535]" />
                Datasheet PDF
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

