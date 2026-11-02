import React, { useState, useEffect } from 'react';
import { Layers, Search, Cpu, Zap, Radio, Clock } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { controllerService } from '../services/controllerService';
import { CONTROLLER_FAMILIES } from '../data/navigation';

export function ControllersPage() {
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFamily, setSelectedFamily] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedFamily !== 'ALL') params.family = selectedFamily;
    if (searchQuery) params.search = searchQuery;

    controllerService
      .getControllers(params)
      .then((res) => {
        setControllers(res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching controllers:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedFamily, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          Silicon Registry Subsystem
        </div>
        <h1 className="font-heading text-3xl font-bold text-[#EAF5FF]">
          Microcontrollers & Embedded Architectures
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1">
          Explore specifications, register architectures, peripheral matrices, and logic pinouts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {CONTROLLER_FAMILIES.map((fam) => (
            <button
              key={fam.id}
              onClick={() => setSelectedFamily(fam.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                selectedFamily === fam.id
                  ? 'bg-[#55C7FF] text-[#0B1220] font-semibold shadow-[0_0_12px_rgba(85,199,255,0.4)]'
                  : 'bg-[#111E30] text-[#8FA6BC] hover:text-[#EAF5FF] border border-[#192B40]'
              }`}
            >
              {fam.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA6BC]" />
          <input
            type="text"
            placeholder="Search core, architecture, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111E30] border border-[#192B40] focus:border-[#55C7FF] rounded-lg pl-9 pr-4 py-2 text-xs text-[#EAF5FF] placeholder-[#8FA6BC] outline-none transition-colors"
          />
        </div>
      </div>

      {/* Controllers Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#8FA6BC]">
          <Cpu className="w-8 h-8 mx-auto text-[#55C7FF] animate-spin mb-3" />
          QUERYING SILICON REGISTRY...
        </div>
      ) : controllers.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-[#8FA6BC] bg-[#111E30]/40 rounded-xl border border-[#192B40]">
          NO MATCHING SILICON ARCHITECTURES FOUND.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {controllers.map((ctrl) => (
            <Card key={ctrl.id} className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono text-[#8FA6BC] uppercase tracking-wider">
                    {ctrl.manufacturer}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-[#EAF5FF] hover:text-[#55C7FF] transition-colors">
                    {ctrl.commonName}
                  </h3>
                  <div className="text-xs font-mono text-[#55C7FF]">{ctrl.name}</div>
                </div>
                <Badge variant="cyan">{ctrl.bitWidth}-BIT</Badge>
              </div>

              <p className="text-xs text-[#8FA6BC] line-clamp-2 leading-relaxed">
                {ctrl.description}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#192B40] text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-[#8FA6BC]">
                  <Clock className="w-3.5 h-3.5 text-[#55C7FF]" />
                  <span>{ctrl.maxClockSpeedMHz} MHz</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#8FA6BC]">
                  <Zap className="w-3.5 h-3.5 text-[#A5E3FF]" />
                  <span>{ctrl.flashKb} KB Flash</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#8FA6BC]">
                  <Cpu className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{ctrl.sramKb} KB SRAM</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#8FA6BC]">
                  <Radio className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>{ctrl.gpioCount} GPIO</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] font-mono text-[#8FA6BC] flex items-center justify-between border-t border-[#192B40]/60">
                <span>{ctrl.core}</span>
                <span className="text-[#55C7FF]">{ctrl.logicLevel}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

