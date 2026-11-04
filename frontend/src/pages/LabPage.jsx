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
    { id: 'signal', label: 'Signal Lab', num: '01', icon: Zap, desc: 'Digital logic levels & timing diagrams' },
    { id: 'pwm', label: 'PWM Lab', num: '02', icon: Activity, desc: 'Duty cycle, V_avg, LED & motor simulation' },
    { id: 'sensor', label: 'Sensor Lab', num: '03', icon: Radio, desc: 'Ultrasonic sonar, temperature & noise filtering' },
    { id: 'robot', label: 'Robot Lab', num: '04', icon: Bot, desc: '2D autonomous obstacle-avoiding kinematics' },
    { id: 'selection', label: 'Controller Selection', num: '05', icon: Cpu, desc: 'Robotics mission hardware trade-off bench' },
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
    <div className="space-y-8 pb-16">
      {/* Page Header — warm paper engineering-journal style */}
      <div className="border-b border-[#C9BDAA] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            {/* Technical breadcrumb annotation */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#D87535] uppercase tracking-widest mb-2 font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>MODULE / 03 // VIRTUAL SILICON & ROBOTICS LABORATORY</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D] tracking-tight">
              Interactive Hardware
              <br />
              <span className="italic font-normal text-[#D87535]">Simulation Bench</span>
            </h1>
            <p className="text-sm text-[#655F55] mt-2 max-w-2xl leading-relaxed font-sans">
              Execute real-time browser simulations of digital logic timing, pulse-width modulation,
              acoustic sensor physics, obstacle-avoiding kinematics, and controller hardware selection.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Info annotation */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#8C8275] bg-[#EDE1CE] border border-[#C9BDAA] px-2.5 py-1.5 rounded">
              <Info className="w-3 h-3" />
              <span>5 BENCH STATIONS</span>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentConfigToSave(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 font-mono text-xs"
            >
              <HardDrive className="w-4 h-4 text-[#D87535]" />
              Saved Experiments
            </Button>
          </div>
        </div>
      </div>

      {/* 5 Tab Navigation — engineering instrument panel style */}
      <div>
        <div className="text-[9px] font-mono text-[#8C8275] uppercase tracking-widest mb-2">
          // SELECT BENCH STATION
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isActive
                    ? 'bg-[#22201D] border-[#22201D] text-[#FAF5EB] shadow-md'
                    : 'bg-[#FAF5EB] border-[#C9BDAA] hover:border-[#D87535] hover:bg-[#EDE1CE]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C8DE72]' : 'text-[#D87535]'}`} />
                    <span className={`text-[9px] font-mono tracking-widest ${isActive ? 'text-[#C8DE72]/70' : 'text-[#8C8275]'}`}>
                      {tab.num}
                    </span>
                  </div>
                  <div className={`font-mono text-[11px] sm:text-xs font-bold line-clamp-1 ${isActive ? 'text-[#FAF5EB]' : 'text-[#22201D] group-hover:text-[#D87535]'}`}>
                    {tab.label}
                  </div>
                </div>
                <div className={`text-[9px] font-sans mt-2 line-clamp-2 leading-tight ${isActive ? 'text-[#C9BDAA]' : 'text-[#8C8275]'}`}>
                  {tab.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Bench — dark instrument panel wrapper as per brief */}
      <div>
        {/* Instrument panel framing label */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[9px] font-mono text-[#8C8275] uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8DE72] animate-pulse" />
            {tabs.find(t => t.id === activeTab)?.num} // {tabs.find(t => t.id === activeTab)?.label?.toUpperCase()} — BENCH ACTIVE
          </div>
          <span className="text-[9px] font-mono text-[#C9BDAA] hidden sm:inline">
            REF: MV-LAB-{tabs.find(t => t.id === activeTab)?.num}
          </span>
        </div>

        <div>
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
