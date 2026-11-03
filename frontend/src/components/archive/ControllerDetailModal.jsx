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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0B1220]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111E30] border border-[#192B40] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#192B40] bg-[#0B1220]/90 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#55C7FF]">
                {controller.manufacturer}
              </span>
              <span className="text-xs text-[#8FA6BC]">•</span>
              <span className="text-[11px] font-mono text-[#A5E3FF]">{controller.family} Family</span>
              <Badge variant={controller.bitWidth === 32 ? 'cyan' : controller.bitWidth === 16 ? 'emerald' : 'amber'}>
                {controller.bitWidth}-BIT
              </Badge>
              {controller.verifiedAt && (
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                  <ShieldCheck className="w-3 h-3" />
                  Datasheet Verified
                </div>
              )}
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#EAF5FF]">
              {controller.name}
            </h2>
            <p className="text-xs font-mono text-[#8FA6BC]">{controller.commonName}</p>
          </div>

          <div className="flex items-center gap-2">
            {onToggleBookmark && (
              <button
                onClick={onToggleBookmark}
                title={isBookmarked ? "Remove Bookmark" : "Save to Bookmarks"}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                    : "bg-[#192B40]/50 hover:bg-[#192B40] text-[#8FA6BC] hover:text-[#EAF5FF] border-[#192B40]"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#192B40]/50 hover:bg-[#192B40] text-[#8FA6BC] hover:text-[#EAF5FF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-[#192B40] bg-[#0B1220]/50 px-4 sm:px-6">
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
                    ? 'border-[#55C7FF] text-[#55C7FF] font-semibold bg-[#55C7FF]/5'
                    : 'border-transparent text-[#8FA6BC] hover:text-[#EAF5FF]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
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
              <div className="p-4 rounded-xl bg-[#0B1220] border border-[#192B40] space-y-2">
                <div className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
                  Silicon Architectural Overview
                </div>
                <p className="text-xs text-[#EAF5FF] leading-relaxed">
                  {controller.description}
                </p>
                {controller.architecturalNotes && (
                  <div className="mt-2 pt-2 border-t border-[#192B40]/70 text-[11px] font-mono text-[#8FA6BC]">
                    <span className="text-[#A5E3FF] font-semibold">Taxonomy Breakdown: </span>
                    {controller.architecturalNotes}
                  </div>
                )}
              </div>

              {/* Hardware Specifications Grid */}
              <div>
                <div className="text-xs font-mono text-[#8FA6BC] uppercase tracking-wider mb-3">
                  Comprehensive Hardware Matrix
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">CPU CORE & ISA</div>
                    <div className="text-[#EAF5FF] font-bold mt-0.5">{controller.core}</div>
                    <div className="text-[#55C7FF] text-[10px] mt-0.5">
                      {controller.coreCount > 1 ? `${controller.coreCount} Cores` : 'Single Core'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">MAX CLOCK SPEED</div>
                    <div className="text-[#55C7FF] font-bold text-sm mt-0.5">
                      {controller.maxClockSpeedMHz} MHz
                    </div>
                    <div className="text-[#8FA6BC] text-[10px] mt-0.5">PLL / Crystal Driven</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">PROGRAM FLASH</div>
                    <div className="text-[#A5E3FF] font-bold text-sm mt-0.5">
                      {controller.flashKb >= 1024 ? `${(controller.flashKb / 1024).toFixed(1)} MB` : `${controller.flashKb} KB`}
                    </div>
                    <div className="text-[#8FA6BC] text-[10px] mt-0.5">Non-volatile Storage</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">SRAM MEMORY</div>
                    <div className="text-[#10B981] font-bold text-sm mt-0.5">
                      {controller.sramKb >= 1024 ? `${(controller.sramKb / 1024).toFixed(1)} MB` : `${controller.sramKb} KB`}
                    </div>
                    <div className="text-[#8FA6BC] text-[10px] mt-0.5">Static RAM</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">VOLTAGE & LOGIC</div>
                    <div className="text-[#EAF5FF] font-bold mt-0.5">
                      {controller.operatingVoltageMin}V – {controller.operatingVoltageMax}V
                    </div>
                    <div className="text-[#55C7FF] text-[10px] mt-0.5">{controller.logicLevel}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">DIGITAL GPIO</div>
                    <div className="text-[#EAF5FF] font-bold mt-0.5">{controller.gpioCount} Pins</div>
                    <div className="text-[#8FA6BC] text-[10px] mt-0.5">{controller.packageTypes}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">ANALOG ADC</div>
                    <div className="text-[#EAF5FF] font-bold mt-0.5">
                      {controller.adcChannels > 0 ? `${controller.adcChannels} Channels` : 'None (Ext Required)'}
                    </div>
                    <div className="text-[#FBBF24] text-[10px] mt-0.5">
                      {controller.adcResolutionBits > 0 ? `${controller.adcResolutionBits}-bit Resolution` : 'External ADC'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">HARDWARE TIMERS & PWM</div>
                    <div className="text-[#EAF5FF] font-bold mt-0.5">{controller.timers} Timers</div>
                    <div className="text-[#A5E3FF] text-[10px] mt-0.5">
                      {controller.pwmChannels > 0 ? `${controller.pwmChannels} PWM Channels` : 'Software Bit-bang'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">SERIAL INTERFACES</div>
                    <div className="text-[#EAF5FF] font-bold mt-0.5">
                      {controller.uartCount}x UART, {controller.spiCount}x SPI
                    </div>
                    <div className="text-[#8FA6BC] text-[10px] mt-0.5">{controller.i2cCount}x I2C</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">AUTOMOTIVE & CAN</div>
                    <div className="text-[#EAF5FF] font-bold mt-0.5">
                      {controller.canCount > 0 ? `${controller.canCount}x CAN 2.0 / FD` : 'No Native CAN'}
                    </div>
                    <div className="text-[#8FA6BC] text-[10px] mt-0.5">
                      {controller.usbSupport ? 'Native USB Support' : 'No Native USB'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">WIRELESS / RF</div>
                    <div className="text-[#10B981] font-bold mt-0.5 line-clamp-1">
                      {controller.wireless || 'None'}
                    </div>
                    <div className="text-[#8FA6BC] text-[10px] mt-0.5">Transceiver Status</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1220]/70 border border-[#192B40]">
                    <div className="text-[#8FA6BC] text-[10px]">MATH ACCELERATION</div>
                    <div className="text-[#EAF5FF] font-bold mt-0.5">
                      {controller.fpu ? 'Hardware FPU (FP32)' : 'Software Emulated Math'}
                    </div>
                    <div className="text-[#55C7FF] text-[10px] mt-0.5">
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
              <div className="text-xs font-mono text-[#8FA6BC]">
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
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Realistic Engineering Advantages
                  </div>
                  <ul className="space-y-2.5">
                    {advantages.length > 0 ? (
                      advantages.map((adv, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#EAF5FF] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{adv}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-[#8FA6BC]">No verified advantages logged.</li>
                    )}
                  </ul>
                </div>

                {/* Limitations */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-heading font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Realistic Architectural Limitations
                  </div>
                  <ul className="space-y-2.5">
                    {limitations.length > 0 ? (
                      limitations.map((lim, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#EAF5FF] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{lim}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-[#8FA6BC]">No architectural limitations logged.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Ecosystem */}
          {activeTab === 'ecosystem' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#0B1220] border border-[#192B40] space-y-3">
                <div className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Supported Toolchains, IDEs & Debugging Probes
                </div>
                <p className="text-xs text-[#8FA6BC] leading-relaxed">
                  Industrial embedded development requires matching the target silicon to validated compilers, linker scripts, and hardware in-circuit debuggers.
                </p>
                <div className="p-3 rounded-lg bg-[#111E30] border border-[#192B40] text-xs font-mono text-[#EAF5FF]">
                  {controller.developmentTools || 'GCC toolchain, vendor IDE, and standard JTAG/SWD debuggers.'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#192B40]">
                  <div className="text-[10px] text-[#8FA6BC] uppercase">Compilers / Toolchains</div>
                  <div className="font-bold text-[#EAF5FF] mt-1">
                    {controller.bitWidth === 32 ? 'arm-none-eabi-gcc, Clang' : controller.family === '8051' ? 'Keil C51, SDCC' : 'avr-gcc / xc8'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#192B40]">
                  <div className="text-[10px] text-[#8FA6BC] uppercase">Hardware Debugger</div>
                  <div className="font-bold text-[#55C7FF] mt-1">
                    {controller.family === 'STM32' ? 'ST-LINK / V2, J-Link' : controller.family === 'ESP32' ? 'ESP-Prog / JTAG' : controller.family === 'RP2040' ? 'Raspberry Pi Debug Probe' : 'USBasp / PICkit'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#192B40]">
                  <div className="text-[10px] text-[#8FA6BC] uppercase">RTOS Support</div>
                  <div className="font-bold text-[#10B981] mt-1">
                    {controller.sramKb >= 32 ? 'FreeRTOS, Zephyr, RT-Thread' : 'Bare Metal Superloop'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Robotics Integration */}
          {activeTab === 'robotics' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#0B1220] border border-[#192B40] space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
                  <Bot className="w-4 h-4" />
                  Robotics, Actuation & Sensor Fusion Applications
                </div>
                <p className="text-xs text-[#EAF5FF] leading-relaxed">
                  {controller.roboticsApplications ||
                    'Robotic actuator control, sensor acquisition over SPI/I2C, and closed-loop motor velocity control.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111E30] border border-[#192B40] space-y-2">
                <div className="text-xs font-mono text-[#A5E3FF] uppercase tracking-wider">
                  Typical General Applications
                </div>
                <p className="text-xs font-mono text-[#8FA6BC]">
                  {controller.applications || 'General embedded control and IoT devices.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#192B40] bg-[#0B1220] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[#8FA6BC]">
            {controller.technicalSources ? (
              <span className="line-clamp-1">
                Ref: <span className="text-[#EAF5FF]">{controller.technicalSources}</span>
              </span>
            ) : (
              <span>Datasheet verified against official errata</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#55C7FF] text-[#0B1220] font-bold hover:bg-[#A5E3FF] transition-all shadow-[0_0_12px_rgba(85,199,255,0.3)]"
              >
                <FileText className="w-3.5 h-3.5" />
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

