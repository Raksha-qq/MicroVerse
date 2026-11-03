import React, { useState } from 'react';
import {
  Terminal,
  Activity,
  Zap,
  Radio,
  Bot,
  Cpu,
  HardDrive,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { SignalLab } from '../components/lab/SignalLab';
import { PwmLab } from '../components/lab/PwmLab';
import { SensorLab } from '../components/lab/SensorLab';
import { RobotLab } from '../components/lab/RobotLab';
import { ControllerSelectionLab } from '../components/lab/ControllerSelectionLab';
import { SavedExperimentsModal } from '../components/lab/SavedExperimentsModal';

export function LabPage() {
  const [activeTab, setActiveTab] = useState('signal');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentConfigToSave, setCurrentConfigToSave] = useState(null);
  const [loadedConfigs, setLoadedConfigs] = useState({});

  const tabs = [
    { id: 'signal', label: '1. Signal Lab', icon: Zap, desc: 'Digital logic levels & timing diagrams' },
    { id: 'pwm', label: '2. PWM Lab', icon: Activity, desc: 'Duty cycle, V_avg, LED & motor simulation' },
    { id: 'sensor', label: '3. Sensor Lab', icon: Radio, desc: 'Ultrasonic sonar, temperature & noise filtering' },
    { id: 'robot', label: '4. Robot Lab', icon: Bot, desc: '2D autonomous obstacle-avoiding kinematics' },
    { id: 'selection', label: '5. Controller Selection', icon: Cpu, desc: 'Robotics mission hardware trade-off bench' },
  ];

  // Callback to prepare configuration to save
  const handleSaveTrigger = (configObj) => {
    setCurrentConfigToSave(configObj);
    setModalOpen(true);
  };

  // Callback when user loads a saved experiment
  const handleLoadExperiment = (savedExp) => {
    const type = savedExp.experimentType.toLowerCase();
    let targetTab = 'signal';
    if (type === 'pwm') targetTab = 'pwm';
    else if (type === 'sensor') targetTab = 'sensor';
    else if (type === 'robot') targetTab = 'robot';
    else if (type === 'controller_selection') targetTab = 'selection';

    setActiveTab(targetTab);
    setLoadedConfigs((prev) => ({
      ...prev,
      [targetTab]: savedExp.configState,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
            <Terminal className="w-3.5 h-3.5" />
            Virtual Silicon & Robotics Laboratory
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
            Interactive Hardware Simulation Bench
          </h1>
          <p className="text-sm text-[#8FA6BC] mt-1 max-w-2xl leading-relaxed">
            Execute real-time browser simulations of digital logic timing, pulse-width modulation,
            acoustic sensor physics, obstacle-avoiding kinematics, and controller hardware selection.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setCurrentConfigToSave(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs"
        >
          <HardDrive className="w-4 h-4 text-[#55C7FF]" />
          Saved Experiments
        </Button>
      </div>

      {/* 5 Tab Navigation Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-[#192B40] border-[#55C7FF] shadow-[0_0_15px_rgba(85,199,255,0.2)] ring-1 ring-[#55C7FF]'
                  : 'bg-[#111E30]/70 border-[#192B40] hover:border-[#8FA6BC]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#55C7FF]' : 'text-[#8FA6BC]'}`} />
                  <span className="text-[10px] font-mono text-[#8FA6BC]">BENCH</span>
                </div>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#EAF5FF] line-clamp-1">
                  {tab.label}
                </div>
              </div>
              <div className="text-[10px] text-[#8FA6BC] mt-2 line-clamp-1">
                {tab.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Simulation Lab Body */}
      <div className="animate-fadeIn">
        {activeTab === 'signal' && (
          <SignalLab
            onSaveConfig={handleSaveTrigger}
            initialConfig={loadedConfigs.signal}
          />
        )}
        {activeTab === 'pwm' && (
          <PwmLab
            onSaveConfig={handleSaveTrigger}
            initialConfig={loadedConfigs.pwm}
          />
        )}
        {activeTab === 'sensor' && (
          <SensorLab
            onSaveConfig={handleSaveTrigger}
            initialConfig={loadedConfigs.sensor}
          />
        )}
        {activeTab === 'robot' && (
          <RobotLab
            onSaveConfig={handleSaveTrigger}
            initialConfig={loadedConfigs.robot}
          />
        )}
        {activeTab === 'selection' && (
          <ControllerSelectionLab
            onSaveConfig={handleSaveTrigger}
            initialConfig={loadedConfigs.selection}
          />
        )}
      </div>

      {/* Saved Experiments Cloud Modal */}
      <SavedExperimentsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentExperimentToSave={currentConfigToSave}
        onLoadExperiment={handleLoadExperiment}
      />
    </div>
  );
}
