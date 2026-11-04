import React, { useState, useMemo } from 'react';
import {
  Bot,
  Activity,
  Sliders,
  Cpu,
  Zap,
  ArrowRight,
  Play,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Radio,
  Layers,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ROBOTICS_MODULES, ROBOTICS_PILLARS } from '../data/roboticsCurriculum';
import { FollowTheSignal } from '../components/robotics/FollowTheSignal';

export function RoboticsPage() {
  // PID Simulator State
  const [kp, setKp] = useState(2.4);
  const [ki, setKi] = useState(0.4);
  const [kd, setKd] = useState(0.9);

  // Curriculum Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedModuleId, setExpandedModuleId] = useState('embedded-systems-fundamentals');

  // Categories
  const categories = useMemo(() => {
    const set = new Set(ROBOTICS_MODULES.map((m) => m.category));
    return ['ALL', ...Array.from(set)];
  }, []);

  // Filtered curriculum modules
  const filteredModules = useMemo(() => {
    return ROBOTICS_MODULES.filter((m) => {
      const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.coreConcepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider mb-1">
          <Bot className="w-3.5 h-3.5" />
          Physical Artificial Intelligence &amp; Mechatronics
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#22201D]">
          Robotics &amp; Embodied Intelligence Laboratory
        </h1>
        <p className="text-sm text-[#655F55] mt-1 max-w-3xl leading-relaxed">
          Where deterministic firmware controls physical mechanics. Explore closed-loop motor commutation,
          sensor fusion, real-time kinematics, and the critical interface between high-level AI policies
          and low-level microcontroller actuators.
        </p>
      </div>

      {/* Part A: 3-Tier Physical AI Architectural Hierarchy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#D87535] uppercase tracking-wider font-semibold">
              The 3-Tier Embodied Control Hierarchy
            </div>
            <p className="text-xs text-[#655F55]">
              Separating perception, planning, and deterministic hardware execution in physical machines.
            </p>
          </div>
          <Badge variant="cyan">ARCHITECTURAL BOUNDARY</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ROBOTICS_PILLARS.map((pillar, idx) => (
            <Card key={idx} className="flex flex-col justify-between space-y-4 border-[#C9BDAA]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold" style={{ color: pillar.color }}>
                    {pillar.tier.split(':')[0]}
                  </span>
                  <Badge variant={idx === 0 ? 'cyan' : idx === 1 ? 'ice' : 'emerald'}>
                    {pillar.rate}
                  </Badge>
                </div>
                <h3 className="font-heading text-lg font-bold text-[#22201D]">
                  {pillar.tier.split(': ')[1]}
                </h3>
                <div className="text-xs font-mono text-[#655F55]">{pillar.device}</div>
                <p className="text-xs text-[#22201D] leading-relaxed pt-1">
                  {pillar.role}
                </p>
              </div>

              <div className="pt-3 border-t border-[#C9BDAA] text-[11px] font-mono text-[#655F55]">
                <span className="text-[#D87535] font-semibold">Transport: </span>
                {pillar.protocol}
              </div>
            </Card>
          ))}
        </div>

        {/* AI Reality Check Banner */}
        <div className="p-4 rounded-xl border border-[#B95D32]/30 bg-[#B95D32]/5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#B95D32] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-mono text-[#B95D32] font-bold uppercase tracking-wider">
              Engineering Boundary: Microcontrollers vs Large AI Models
            </span>
            <p className="text-[#22201D] leading-relaxed">
              Microcontrollers do <span className="font-bold text-[#B95D32]">not</span> independently execute
              large multimodal vision or language models. In modern Physical AI, high-level neural policies
              run on host edge GPUs (e.g., NVIDIA Jetson, Raspberry Pi 5) and stream velocity setpoints via
              micro-ROS or CAN-FD to microcontrollers (STM32, ESP32), which execute the hard real-time PID current
              loops and hardware emergency interlocks. TinyML on microcontrollers is strictly reserved for shallow,
              quantized models ($&lt; 50\,\text{KB}$ RAM) such as vibration anomaly detection or audio wake words.
            </p>
          </div>
        </div>
      </div>

      {/* Part B: Follow the Signal Interactive Pipeline */}
      <FollowTheSignal />

      {/* Part A: 15 Comprehensive Robotics Educational Modules */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              Comprehensive Curriculum
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#22201D]">
              Robotics &amp; Embedded Systems Curriculum (15 Modules)
            </h2>
            <p className="text-xs text-[#655F55] mt-0.5">
              From semiconductor foundations to feedback loops, micro-ROS, and embodied physical AI.
            </p>
          </div>

          <div className="text-xs font-mono text-[#D87535]">
            {filteredModules.length} of {ROBOTICS_MODULES.length} Modules Available
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 rounded-xl bg-[#F5EBDD] border border-[#C9BDAA]">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D87535] text-[#FAF5EB] font-bold shadow-[0_0_10px_rgba(216,117,53,0.35)]'
                    : 'bg-[#FAF5EB] text-[#655F55] hover:text-[#22201D] border border-[#C9BDAA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#655F55]" />
            <input
              type="text"
              placeholder="Search concepts, motors, PID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#22201D] placeholder-[#655F55] outline-none font-mono"
            />
          </div>
        </div>

        {/* Modules Accordion Grid */}
        <div className="space-y-3">
          {filteredModules.map((mod) => {
            const isExpanded = expandedModuleId === mod.id;
            return (
              <div
                key={mod.id}
                className="rounded-xl border border-[#C9BDAA] bg-[#EDE1CE]/60 overflow-hidden transition-all duration-200"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-[#C9BDAA]/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#D87535]/10 border border-[#D87535]/30 flex items-center justify-center text-xs font-mono font-bold text-[#D87535]">
                      {String(mod.moduleNumber).padStart(2, '0')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#655F55] uppercase tracking-wider">
                          {mod.category}
                        </span>
                      </div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-[#22201D] hover:text-[#D87535] transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-[#655F55] line-clamp-1 mt-0.5">
                        {mod.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#655F55] hidden sm:inline">
                      {isExpanded ? 'Collapse' : 'Deep Dive'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#D87535]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#655F55]" />
                    )}
                  </div>
                </div>

                {/* Expanded Deep Dive Panel */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-[#C9BDAA] bg-[#EDE1CE] space-y-5 animate-fadeIn">
                    {/* Technical Definition */}
                    <div className="p-4 rounded-xl bg-[#EDE1CE]/70 border border-[#C9BDAA] space-y-1">
                      <div className="text-[11px] font-mono text-[#D87535] uppercase tracking-wider font-semibold">
                        Formal Technical Definition
                      </div>
                      <p className="text-xs font-mono text-[#22201D] leading-relaxed">
                        {mod.technicalDefinition}
                      </p>
                    </div>

                    {/* Core Architectural Concepts */}
                    <div>
                      <div className="text-xs font-mono text-[#655F55] uppercase tracking-wider mb-2">
                        Core Concepts &amp; Engineering Pillars
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        {mod.coreConcepts.map((concept, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-2.5 rounded-lg bg-[#EDE1CE] border border-[#C9BDAA] text-[#22201D]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D87535]" />
                            <span>{concept}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deep Explanation */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono text-[#71818B] uppercase tracking-wider">
                        Engineering Deep Dive
                      </div>
                      <div className="text-xs text-[#22201D] leading-relaxed whitespace-pre-line space-y-2">
                        {mod.explanation}
                      </div>
                    </div>

                    {/* Robotics Context & Takeaway */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#C9BDAA]">
                      <div className="p-3.5 rounded-xl bg-[#D87535]/8 border border-[#D87535]/30 space-y-1">
                        <div className="text-[11px] font-mono text-[#87945B] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" />
                          Robotics Application Context
                        </div>
                        <p className="text-xs text-[#22201D]">{mod.roboticsContext}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#D87535]/8 border border-[#D87535]/30 space-y-1">
                        <div className="text-[11px] font-mono text-[#D87535] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Key Architectural Takeaway
                        </div>
                        <p className="text-xs text-[#22201D]">{mod.keyTakeaway}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive PID Simulator Card */}
      <Card className="p-6 sm:p-8 space-y-6 border-[#D87535]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9BDAA] pb-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#22201D] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D87535]" />
              Interactive Joint PID Step Response Tuning
            </h2>
            <p className="text-xs text-[#655F55] mt-0.5">
              Adjust gains to observe robotic joint settling time, damping ratio, and stability margins.
            </p>
          </div>
          <Badge variant="cyan">REAL-TIME SIMULATION</Badge>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
          <div className="space-y-2 bg-[#F5EBDD] p-4 rounded-xl border border-[#C9BDAA]">
            <div className="flex justify-between">
              <span className="text-[#655F55]">Kp (PROPORTIONAL):</span>
              <span className="text-[#D87535] font-bold">{kp.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={kp}
              onChange={(e) => setKp(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#C9BDAA] rounded-lg appearance-none cursor-pointer accent-[#D87535]"
            />
            <div className="text-[10px] text-[#655F55]/70">Controls direct reaction to error magnitude</div>
          </div>

          <div className="space-y-2 bg-[#F5EBDD] p-4 rounded-xl border border-[#C9BDAA]">
            <div className="flex justify-between">
              <span className="text-[#655F55]">Ki (INTEGRAL):</span>
              <span className="text-[#71818B] font-bold">{ki.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={ki}
              onChange={(e) => setKi(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#C9BDAA] rounded-lg appearance-none cursor-pointer accent-[#71818B]"
            />
            <div className="text-[10px] text-[#655F55]/70">Eliminates persistent steady-state offset</div>
          </div>

          <div className="space-y-2 bg-[#F5EBDD] p-4 rounded-xl border border-[#C9BDAA]">
            <div className="flex justify-between">
              <span className="text-[#655F55]">Kd (DERIVATIVE):</span>
              <span className="text-[#87945B] font-bold">{kd.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.1"
              value={kd}
              onChange={(e) => setKd(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#C9BDAA] rounded-lg appearance-none cursor-pointer accent-[#87945B]"
            />
            <div className="text-[10px] text-[#655F55]/70">Dampens oscillation &amp; anticipates motion</div>
          </div>
        </div>

        {/* Step Response Simulated Curve */}
        <div className="h-44 rounded-xl oscilloscope-screen p-4 flex flex-col justify-between relative">
          <div className="flex justify-between text-[10px] font-mono text-[#8C8275] z-10">
            <span>SETPOINT: 90.0° TARGET</span>
            <span>SETTLING TIME: ~120 ms</span>
          </div>

          <svg className="w-full h-28 opacity-90 z-10" viewBox="0 0 500 100">
            {/* Target line */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#C9BDAA" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Dynamic Step Response Curve */}
            <path
              d={`M 0 90 Q 60 ${20 - (kp - 2.5) * 15} 120 ${30 + (ki - 0.5) * 10} T 240 ${
                30 - (kd - 1) * 8
              } T 360 30 L 500 30`}
              fill="none"
              stroke="#D87535"
              strokeWidth="2.5"
              className="filter drop-shadow-[0_0_8px_rgba(216,117,53,0.7)]"
            />
          </svg>

          <div className="flex justify-between text-[10px] font-mono text-[#D87535] z-10">
            <span>0 ms</span>
            <span>CRITICALLY DAMPED NOMINAL CONVERGENCE</span>
            <span>300 ms</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
