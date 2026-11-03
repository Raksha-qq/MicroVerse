import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Bot,
  Zap,
  Radio,
  Clock,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { controllerService } from '../../services/controllerService';
import { useNavigate } from 'react-router-dom';

export function ControllerSelectionLab({ onSaveConfig, initialConfig }) {
  const navigate = useNavigate();
  const [selectedProfileId, setSelectedProfileId] = useState(
    initialConfig?.selectedProfileId || 'hexapod'
  );
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  // Robotics Application Profiles
  const profiles = [
    {
      id: 'hexapod',
      name: 'Hexapod 18-DOF Walking Robot',
      tag: 'Multi-Servo Kinematics',
      icon: Bot,
      requirements: {
        minPwm: 18,
        fpuRequired: true,
        minClockMHz: 72,
        minRamKb: 32,
        canRequired: false,
        lowPowerCritical: false,
      },
      description:
        'A 6-legged walking robot with 3 servos per leg (18 total). Requires simultaneous jitter-free PWM channels, hardware floating-point math (FPU) for trigonometric inverse kinematics, and an SPI bus for 6-DOF IMU attitude balance.',
      criticalTradeoff:
        'Standard 8-bit MCUs lack sufficient hardware PWM channels (mandating external PCA9685 I2C servo expansion boards) and lack an FPU, making trigonometric kinematic matrices sluggish.',
    },
    {
      id: 'warehouse_agv',
      name: 'Warehouse AGV / Industrial Rover',
      tag: 'Heavy-Duty Motor Drive & CAN',
      icon: Layers,
      requirements: {
        minPwm: 4,
        fpuRequired: false,
        minClockMHz: 16,
        minRamKb: 8,
        canRequired: true,
        lowPowerCritical: false,
      },
      description:
        'An Automated Guided Vehicle (AGV) in high-EMI industrial warehouse environments. Requires hardware CAN bus 2.0B / FD to interface with industrial brushless motor controllers and safety LIDARs, plus hardware quadrature encoder decoding.',
      criticalTradeoff:
        'Consumer IoT chips (ESP32) lack 5V electrical noise margins and have limited CAN transceivers; automotive-grade STM32 or Microchip PIC with CAN and 5V tolerance are vastly superior for safety.',
    },
    {
      id: 'drone_flight_controller',
      name: 'Quadcopter Flight Controller (PX4 / Betaflight)',
      tag: 'Ultra-High Frequency 8kHz Loop',
      icon: Zap,
      requirements: {
        minPwm: 4,
        fpuRequired: true,
        minClockMHz: 168,
        minRamKb: 64,
        canRequired: false,
        lowPowerCritical: false,
      },
      description:
        'High-speed aerial drone running attitude estimation and PID loop rates at 1 kHz to 8 kHz. Requires low-latency DMA-backed SPI to read IMU gyros, single-precision FPU for quaternion rotation matrices, and DShot timer motor signaling.',
      criticalTradeoff:
        'Microcontrollers below 100MHz or lacking an FPU cannot compute quaternion matrix transformations in under 125 microseconds, causing uncontrollable flight instability.',
    },
    {
      id: 'solar_sensor_rover',
      name: 'Autonomous Environmental Field Rover',
      tag: 'Ultra-Low Power & Long Range RF',
      icon: Radio,
      requirements: {
        minPwm: 2,
        fpuRequired: false,
        minClockMHz: 16,
        minRamKb: 4,
        canRequired: false,
        lowPowerCritical: true,
      },
      description:
        'Remote solar-charged environmental sampling rover operating off-grid for months. Requires deep sleep current below 5µA, integrated long-range RF (BLE/LoRa/Thread), and wide operating voltage range.',
      criticalTradeoff:
        'High-performance 480MHz MCUs consume 100mA+ in active mode and drain batteries rapidly. Cortex-M0+ or specialized wireless SoCs (nRF52840, ESP32-C3) achieve multi-year lifespans.',
    },
    {
      id: 'vision_robotic_arm',
      name: 'Vision-Guided Robotic Manipulator',
      tag: 'Host SBC + micro-ROS Client',
      icon: Activity,
      requirements: {
        minPwm: 6,
        fpuRequired: true,
        minClockMHz: 84,
        minRamKb: 64,
        canRequired: true,
        lowPowerCritical: false,
      },
      description:
        '6-axis articulated robotic arm receiving high-level trajectory waypoints from a vision-processing host SBC (ROS 2 / MoveIt) and executing micro-ROS joint control with current-shunt torque feedback.',
      criticalTradeoff:
        'Requires substantial SRAM (≥64KB) to maintain micro-ROS XRCE-DDS message buffers, Fast SPI/CAN for joint feedback, and hardware current-monitoring ADCs.',
    },
  ];

  const currentProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  // Fetch all controllers from database
  useEffect(() => {
    setLoading(true);
    controllerService
      .getControllers({ limit: 50 })
      .then((res) => {
        setControllers(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to query controllers for selection lab:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute suitability score for each candidate controller (0 to 100)
  const scoredCandidates = controllers.map((ctrl) => {
    const req = currentProfile.requirements;
    let score = 50; // baseline
    const pros = [];
    const cons = [];

    // 1. Clock Speed
    if (ctrl.maxClockSpeedMHz >= req.minClockMHz) {
      score += 15;
      pros.push(`Clock speed (${ctrl.maxClockSpeedMHz} MHz) exceeds required ${req.minClockMHz} MHz.`);
    } else {
      score -= 25;
      cons.push(`Clock speed (${ctrl.maxClockSpeedMHz} MHz) is below recommended ${req.minClockMHz} MHz.`);
    }

    // 2. FPU
    if (req.fpuRequired) {
      if (ctrl.fpu) {
        score += 15;
        pros.push('Integrated hardware Floating Point Unit (FPU) accelerates kinematics.');
      } else {
        score -= 30;
        cons.push('No hardware FPU; trigonometric math will require slow software emulation.');
      }
    }

    // 3. RAM
    if (ctrl.sramKb >= req.minRamKb) {
      score += 10;
      pros.push(`SRAM capacity (${ctrl.sramKb} KB) accommodates kinematics buffers and RTOS.`);
    } else {
      score -= 20;
      cons.push(`SRAM capacity (${ctrl.sramKb} KB) is dangerously tight for RTOS task stacks.`);
    }

    // 4. PWM Channels
    if (ctrl.pwmChannels >= req.minPwm) {
      score += 15;
      pros.push(`Native PWM count (${ctrl.pwmChannels} channels) satisfies joint actuation.`);
    } else {
      score -= 15;
      cons.push(`Only ${ctrl.pwmChannels} native PWM channels (requires external I2C expansion).`);
    }

    // 5. CAN Bus
    if (req.canRequired) {
      if (ctrl.canCount > 0) {
        score += 15;
        pros.push(`Native CAN controller (${ctrl.canCount}x CAN 2.0/FD) supports industrial bus.`);
      } else {
        score -= 25;
        cons.push('No native CAN controller on chip; external SPI-to-CAN transceiver needed.');
      }
    }

    // 6. Low Power
    if (req.lowPowerCritical) {
      if (ctrl.deepSleepCurrentUa && ctrl.deepSleepCurrentUa <= 10) {
        score += 20;
        pros.push(`Ultra-low deep sleep current (${ctrl.deepSleepCurrentUa} µA) extends battery life.`);
      } else {
        score -= 20;
        cons.push('High idle/active power draw makes long-term battery operation difficult.');
      }
    }

    score = Math.max(10, Math.min(98, score));

    return {
      controller: ctrl,
      score,
      pros,
      cons,
    };
  }).sort((a, b) => b.score - a.score);

  const activeCandidate =
    scoredCandidates.find((c) => c.controller.id === selectedCandidateId) ||
    scoredCandidates[0];

  return (
    <div className="space-y-6">
      {/* Simulation Controls & Parameters Bar */}
      <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#192B40] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5" />
              Hardware Decision & Trade-Off Matrix
            </div>
            <h3 className="font-heading text-xl font-bold text-[#EAF5FF]">
              Controller Selection Lab for Robotics
            </h3>
            <p className="text-xs text-[#8FA6BC] mt-0.5">
              Select a proposed robotics project profile to evaluate candidate silicon suitability against architectural trade-offs.
            </p>
          </div>

          {onSaveConfig && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onSaveConfig({
                  experimentType: 'CONTROLLER_SELECTION',
                  title: `Controller Selection: ${currentProfile.name}`,
                  configState: { selectedProfileId, candidateId: activeCandidate?.controller.id },
                })
              }
            >
              Save Configuration
            </Button>
          )}
        </div>

        {/* Profile Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {profiles.map((prof) => {
            const isSelected = selectedProfileId === prof.id;
            const ProfileIcon = prof.icon;
            return (
              <button
                key={prof.id}
                onClick={() => {
                  setSelectedProfileId(prof.id);
                  setSelectedCandidateId(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#192B40] border-[#55C7FF] shadow-[0_0_15px_rgba(85,199,255,0.25)] ring-1 ring-[#55C7FF]'
                    : 'bg-[#0B1220] border-[#192B40] hover:border-[#8FA6BC]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <ProfileIcon className={`w-4 h-4 ${isSelected ? 'text-[#55C7FF]' : 'text-[#8FA6BC]'}`} />
                    <span className="text-[9px] font-mono text-[#8FA6BC]">PROFILE</span>
                  </div>
                  <div className="font-heading text-xs font-bold text-[#EAF5FF] line-clamp-1">
                    {prof.name}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-[#55C7FF] mt-2 line-clamp-1">
                  {prof.tag}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Profile Description & Critical Constraints */}
        <div className="p-4 rounded-xl bg-[#0B1220] border border-[#192B40] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#55C7FF] uppercase tracking-wider font-semibold">
              Mission Specifications: {currentProfile.name}
            </span>
            <Badge variant="cyan">{currentProfile.tag}</Badge>
          </div>
          <p className="text-xs text-[#EAF5FF] leading-relaxed">
            {currentProfile.description}
          </p>
          <div className="pt-2 border-t border-[#192B40]/70 text-[11px] font-mono text-[#8FA6BC]">
            <span className="text-amber-400 font-semibold">Critical Architectural Bottleneck: </span>
            {currentProfile.criticalTradeoff}
          </div>
        </div>
      </div>

      {/* Scored Candidate Recommendations Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-[#8FA6BC]">
          EVALUATING 19 SILICON CANDIDATES ACROSS ARCHITECTURAL VECTORS...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidates Ranked List */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#8FA6BC] uppercase tracking-wider">
              Ranked Silicon Candidates ({scoredCandidates.length})
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {scoredCandidates.map((cand, idx) => {
                const isSelected = activeCandidate?.controller.id === cand.controller.id;
                const scoreColor =
                  cand.score >= 80
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : cand.score >= 60
                    ? 'text-[#55C7FF] bg-[#55C7FF]/10 border-[#55C7FF]/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

                return (
                  <div
                    key={cand.controller.id}
                    onClick={() => setSelectedCandidateId(cand.controller.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#192B40] border-[#55C7FF] shadow-[0_0_12px_rgba(85,199,255,0.2)]'
                        : 'bg-[#111E30]/70 border-[#192B40] hover:border-[#8FA6BC]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#8FA6BC]">#{idx + 1}</span>
                        <span className="font-bold text-xs text-[#EAF5FF]">{cand.controller.name}</span>
                        <span className="text-[10px] font-mono text-[#8FA6BC]">({cand.controller.family})</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#55C7FF] mt-0.5">
                        {cand.controller.core} • {cand.controller.maxClockSpeedMHz} MHz
                      </div>
                    </div>

                    <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${scoreColor}`}>
                      {cand.score}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Candidate Deep Engineering Justification */}
          {activeCandidate && (
            <div className="lg:col-span-2 rounded-2xl border border-[#192B40] bg-[#111E30]/80 p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#192B40]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
                    Architectural Evaluation Scorecard
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#EAF5FF]">
                    {activeCandidate.controller.name}
                  </h3>
                  <div className="text-xs font-mono text-[#8FA6BC]">
                    {activeCandidate.controller.manufacturer} • {activeCandidate.controller.architecture}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-[#8FA6BC]">SUITABILITY</div>
                    <div className="font-heading text-2xl font-bold text-[#55C7FF]">
                      {activeCandidate.score}%
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/archive?mcu=${activeCandidate.controller.slug || activeCandidate.controller.id}`)}
                  >
                    Full Spec
                  </Button>
                </div>
              </div>

              {/* Hardware Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#192B40]">
                  <div className="text-[10px] text-[#8FA6BC]">CPU CLOCK</div>
                  <div className="font-bold text-[#55C7FF] mt-0.5">{activeCandidate.controller.maxClockSpeedMHz} MHz</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#192B40]">
                  <div className="text-[10px] text-[#8FA6BC]">SRAM / FLASH</div>
                  <div className="font-bold text-[#10B981] mt-0.5">
                    {activeCandidate.controller.sramKb}KB / {activeCandidate.controller.flashKb}KB
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#192B40]">
                  <div className="text-[10px] text-[#8FA6BC]">PWM CHANNELS</div>
                  <div className="font-bold text-[#A5E3FF] mt-0.5">{activeCandidate.controller.pwmChannels} PWMs</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#192B40]">
                  <div className="text-[10px] text-[#8FA6BC]">CAN / FPU</div>
                  <div className="font-bold text-[#EAF5FF] mt-0.5">
                    {activeCandidate.controller.canCount > 0 ? 'CAN Bus' : 'No CAN'} • {activeCandidate.controller.fpu ? 'FPU Yes' : 'No FPU'}
                  </div>
                </div>
              </div>

              {/* Pros & Cons for this Mission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mission Strengths
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#EAF5FF]">
                    {activeCandidate.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Architectural Compromises
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#EAF5FF]">
                    {activeCandidate.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Universal Best Controller Myth Disclaimer */}
              <div className="p-3.5 rounded-xl bg-[#0B1220] border border-[#192B40] text-xs font-mono text-[#8FA6BC] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#55C7FF] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#55C7FF] font-semibold">Engineering Principle: </span>
                  There is no universal "best" microcontroller. An expensive 480MHz dual-core STM32H7 is optimal for flight controllers but counterproductive for battery-powered solar sensors, where a 16MHz AVR or ultra-low-power Cortex-M0+ provides superior battery longevity and electrical noise immunity at one-tenth the cost.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

