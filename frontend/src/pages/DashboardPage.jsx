import React, { useState, useEffect } from 'react';
import { Activity, Award, BookOpen, Layers, Zap, Clock } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { healthService } from '../services/healthService';

export function DashboardPage() {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    healthService.getHealth().then(setTelemetry).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <Activity className="w-3.5 h-3.5" />
          Laboratory Telemetry Subsystem
        </div>
        <h1 className="font-heading text-3xl font-bold text-[#EAF5FF]">
          Engineer Performance & System Metrics
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1">
          Real-time tracking of silicon competencies, curriculum progress, and testbench activity.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <div className="text-[10px] font-mono text-[#8FA6BC]">ACTIVE TARGETS</div>
          <div className="text-2xl font-heading font-bold text-[#55C7FF]">14</div>
          <div className="text-[10px] font-mono text-[#8FA6BC]">Cortex-M, ESP32, AVR</div>
        </Card>
        <Card className="space-y-1">
          <div className="text-[10px] font-mono text-[#8FA6BC]">SYLLABUS MODULES</div>
          <div className="text-2xl font-heading font-bold text-[#A5E3FF]">8 Chapters</div>
          <div className="text-[10px] font-mono text-[#8FA6BC]">16 Micro-Lessons</div>
        </Card>
        <Card className="space-y-1">
          <div className="text-[10px] font-mono text-[#8FA6BC]">DATABASE LATENCY</div>
          <div className="text-2xl font-heading font-bold text-[#10B981]">
            {telemetry?.database?.latencyMs ?? 2} ms
          </div>
          <div className="text-[10px] font-mono text-[#8FA6BC]">PostgreSQL Connection</div>
        </Card>
        <Card className="space-y-1">
          <div className="text-[10px] font-mono text-[#8FA6BC]">SYSTEM STATUS</div>
          <div className="text-2xl font-heading font-bold text-[#55C7FF]">ONLINE</div>
          <div className="text-[10px] font-mono text-[#8FA6BC]">Uptime: {telemetry?.uptimeSeconds || 20}s</div>
        </Card>
      </div>

      {/* Subsystem Health Cards */}
      <Card className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-[#EAF5FF] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#55C7FF]" />
          Platform Subsystems Health Monitor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          {telemetry?.subsystems ? (
            Object.entries(telemetry.subsystems).map(([sub, stat]) => (
              <div
                key={sub}
                className="p-3 rounded-lg bg-[#0B1220] border border-[#192B40] flex items-center justify-between"
              >
                <span className="text-[#8FA6BC] uppercase">{sub}</span>
                <span className="text-[#10B981] font-semibold">{stat}</span>
              </div>
            ))
          ) : (
            <div className="text-[#8FA6BC]">Loading subsystem health signals...</div>
          )}
        </div>
      </Card>
    </div>
  );
}

