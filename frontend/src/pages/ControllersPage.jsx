import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Search,
  Cpu,
  Zap,
  Radio,
  Clock,
  Sliders,
  Filter,
  Check,
  Plus,
  X,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { controllerService } from '../services/controllerService';
import { CONTROLLER_FAMILIES } from '../data/navigation';
import { TaxonomyClarifier } from '../components/archive/TaxonomyClarifier';
import { ControllerDetailModal } from '../components/archive/ControllerDetailModal';

export function ControllersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedFamily, setSelectedFamily] = useState(searchParams.get('family') || 'ALL');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [manufacturerFilter, setManufacturerFilter] = useState('ALL');
  const [architectureFilter, setArchitectureFilter] = useState('ALL');
  const [connectivityFilter, setConnectivityFilter] = useState('all');
  const [sortOption, setSortOption] = useState('featured');

  // Modals & Comparison State
  const [activeModalController, setActiveModalController] = useState(null);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  // Fetch controllers from backend API
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {};
    if (selectedFamily !== 'ALL') params.family = selectedFamily;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (manufacturerFilter !== 'ALL') params.manufacturer = manufacturerFilter;
    if (architectureFilter !== 'ALL') params.architecture = architectureFilter;
    if (connectivityFilter !== 'all') params.connectivity = connectivityFilter;
    if (sortOption !== 'featured') params.sort = sortOption;

    controllerService
      .getControllers(params)
      .then((res) => {
        const list = res.data || [];
        setControllers(list);

        // Check if query param specifies an MCU to inspect
        const targetSlug = searchParams.get('mcu');
        if (targetSlug && !activeModalController) {
          const found = list.find((c) => c.slug === targetSlug || c.id === targetSlug);
          if (found) setActiveModalController(found);
        }
      })
      .catch((err) => {
        console.error('Error fetching controllers from backend:', err);
        setError('Failed to query silicon registry. Ensure backend server is running.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    selectedFamily,
    searchQuery,
    manufacturerFilter,
    architectureFilter,
    connectivityFilter,
    sortOption,
    searchParams,
  ]);

  // Comparison toggle
  const toggleCompare = (slugOrId) => {
    if (selectedForCompare.includes(slugOrId)) {
      setSelectedForCompare(selectedForCompare.filter((id) => id !== slugOrId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare a maximum of 4 microcontrollers simultaneously.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, slugOrId]);
    }
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 microcontrollers to compare.');
      return;
    }
    navigate(`/compare?ids=${selectedForCompare.join(',')}`);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          Silicon Registry & Architecture Reference
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#EAF5FF]">
          Microcontroller Silicon Archive
        </h1>
        <p className="text-sm text-[#8FA6BC] mt-1 max-w-3xl leading-relaxed">
          Searchable reference database of verified microcontrollers, silicon dies, register
          architectures, peripheral matrices, pinouts, and physical AI / robotics capabilities.
        </p>
      </div>

      {/* Part A: Taxonomy Clarifier Section */}
      <TaxonomyClarifier />

      {/* Filter and Search Bar */}
      <div className="space-y-4 rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-4 sm:p-5">
        {/* Top Controls: Search + Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA6BC]" />
            <input
              type="text"
              placeholder="Search chip name, core, architecture, or ecosystem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#EAF5FF] placeholder-[#8FA6BC] outline-none transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA6BC] hover:text-[#EAF5FF]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Connectivity Filter */}
          <div>
            <select
              value={connectivityFilter}
              onChange={(e) => setConnectivityFilter(e.target.value)}
              className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-xl px-3 py-2.5 text-xs text-[#EAF5FF] outline-none font-mono cursor-pointer"
            >
              <option value="all">Connectivity: All Protocols</option>
              <option value="wireless">Wireless (Wi-Fi / BLE / Thread)</option>
              <option value="usb">Native USB Support</option>
              <option value="can">Automotive CAN Bus</option>
            </select>
          </div>

          {/* Sort Option */}
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-xl px-3 py-2.5 text-xs text-[#EAF5FF] outline-none font-mono cursor-pointer"
            >
              <option value="featured">Sort: Featured & Representative</option>
              <option value="clock_desc">Max Clock Speed (High → Low)</option>
              <option value="flash_desc">Flash Program Memory (High → Low)</option>
              <option value="sram_desc">SRAM Data Memory (High → Low)</option>
              <option value="name_asc">Chip Name (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Family Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#192B40]/60 pb-1">
          <span className="text-[11px] font-mono text-[#8FA6BC] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Family:
          </span>
          {CONTROLLER_FAMILIES.map((fam) => (
            <button
              key={fam.id}
              onClick={() => setSelectedFamily(fam.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${selectedFamily === fam.id
                  ? 'bg-[#55C7FF] text-[#0B1220] font-bold shadow-[0_0_12px_rgba(85,199,255,0.35)]'
                  : 'bg-[#0B1220] text-[#8FA6BC] hover:text-[#EAF5FF] border border-[#192B40]'
                }`}
            >
              {fam.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs font-mono text-[#8FA6BC] px-1">
        <div>
          Showing <span className="text-[#55C7FF] font-bold">{controllers.length}</span> verified
          silicon target{controllers.length === 1 ? '' : 's'}
        </div>
        {selectedForCompare.length > 0 && (
          <div className="flex items-center gap-2 text-[#55C7FF]">
            <Sliders className="w-3.5 h-3.5" />
            <span>{selectedForCompare.length} of 4 selected for comparison</span>
          </div>
        )}
      </div>

      {/* Controllers Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs font-mono text-[#8FA6BC]">
          <Cpu className="w-8 h-8 mx-auto text-[#55C7FF] animate-spin mb-3" />
          INTERROGATING SILICON REGISTRY DATABASE...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-xs font-mono text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/30">
          {error}
        </div>
      ) : controllers.length === 0 ? (
        <div className="py-20 text-center text-xs font-mono text-[#8FA6BC] bg-[#111E30]/40 rounded-2xl border border-[#192B40] space-y-3">
          <Cpu className="w-10 h-10 mx-auto text-[#8FA6BC]/40" />
          <p className="text-sm text-[#EAF5FF]">No matching microcontroller records found.</p>
          <p className="text-xs text-[#8FA6BC]">Try clearing search parameters or selecting "All Silicon".</p>
          <button
            onClick={() => {
              setSelectedFamily('ALL');
              setSearchQuery('');
              setConnectivityFilter('all');
              setSortOption('featured');
            }}
            className="px-4 py-2 rounded-lg bg-[#192B40] text-[#55C7FF] hover:bg-[#55C7FF] hover:text-[#0B1220] transition-colors font-mono text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {controllers.map((ctrl) => {
            const isSelected = selectedForCompare.includes(ctrl.slug || ctrl.id);
            return (
              <Card
                key={ctrl.id}
                className={`flex flex-col justify-between space-y-4 transition-all duration-300 relative ${isSelected ? 'border-[#55C7FF] shadow-[0_0_20px_rgba(85,199,255,0.15)] ring-1 ring-[#55C7FF]' : ''
                  }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Manufacturer + Bit Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono text-[#8FA6BC] uppercase tracking-wider">
                        {ctrl.manufacturer}
                      </div>
                      <h3
                        onClick={() => setActiveModalController(ctrl)}
                        className="font-heading text-lg font-bold text-[#EAF5FF] hover:text-[#55C7FF] transition-colors cursor-pointer"
                      >
                        {ctrl.name}
                      </h3>
                      <div className="text-xs font-mono text-[#55C7FF]">{ctrl.commonName}</div>
                    </div>
                    <Badge variant={ctrl.bitWidth === 32 ? 'cyan' : ctrl.bitWidth === 16 ? 'emerald' : 'amber'}>
                      {ctrl.bitWidth}-BIT
                    </Badge>
                  </div>

                  {/* Architecture & Core Banner */}
                  <div className="p-2.5 rounded-lg bg-[#0B1220] border border-[#192B40] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#8FA6BC]">{ctrl.family}</span>
                    <span className="text-[#A5E3FF] font-semibold">{ctrl.core}</span>
                  </div>

                  {/* Summary Description */}
                  <p className="text-xs text-[#8FA6BC] line-clamp-2 leading-relaxed">
                    {ctrl.description}
                  </p>

                  {/* Hardware Spec Quick Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#192B40] text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-[#8FA6BC]">
                      <Clock className="w-3.5 h-3.5 text-[#55C7FF]" />
                      <span>{ctrl.maxClockSpeedMHz} MHz</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#8FA6BC]">
                      <Zap className="w-3.5 h-3.5 text-[#A5E3FF]" />
                      <span>
                        {ctrl.flashKb >= 1024 ? `${(ctrl.flashKb / 1024).toFixed(0)} MB` : `${ctrl.flashKb} KB`} Flash
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#8FA6BC]">
                      <Cpu className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>
                        {ctrl.sramKb >= 1024 ? `${(ctrl.sramKb / 1024).toFixed(0)} MB` : `${ctrl.sramKb} KB`} SRAM
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#8FA6BC]">
                      <Radio className="w-3.5 h-3.5 text-[#FBBF24]" />
                      <span>{ctrl.gpioCount} GPIO</span>
                    </div>
                  </div>

                  {/* Robotics Highlight Pill */}
                  {ctrl.roboticsApplications && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8FA6BC] bg-[#0B1220]/60 p-2 rounded-lg border border-[#192B40]/70">
                      <Bot className="w-3 h-3 text-[#55C7FF] shrink-0" />
                      <span className="line-clamp-1">{ctrl.roboticsApplications}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-[#192B40] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalController(ctrl)}
                    className="text-xs font-mono text-[#55C7FF] hover:text-[#A5E3FF] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Inspect Specs
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => toggleCompare(ctrl.slug || ctrl.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                        ? 'bg-[#55C7FF] text-[#0B1220] font-bold shadow-[0_0_10px_rgba(85,199,255,0.4)]'
                        : 'bg-[#192B40]/70 text-[#8FA6BC] hover:text-[#EAF5FF] hover:bg-[#192B40]'
                      }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Compare
                      </>
                    )}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Floating Comparison Dock (Active when >= 1 chip selected) */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 z-40 max-w-xl mx-auto sm:mx-0 p-4 rounded-2xl bg-[#0B1220]/95 border-2 border-[#55C7FF] shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-bounce-short">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#55C7FF]" />
                <span className="text-xs font-mono font-bold text-[#EAF5FF]">
                  Comparison Lab Active ({selectedForCompare.length}/4)
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedForCompare.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#111E30] text-[#55C7FF] px-2 py-0.5 rounded border border-[#192B40]"
                  >
                    {id}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-rose-400"
                      onClick={() => toggleCompare(id)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedForCompare([])}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#8FA6BC] hover:text-[#EAF5FF] bg-[#111E30] border border-[#192B40] cursor-pointer"
              >
                Clear
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleLaunchCompare}
                disabled={selectedForCompare.length < 2}
                className="flex items-center gap-1.5 font-bold"
              >
                Compare Now ({selectedForCompare.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Controller Detail Modal */}
      {activeModalController && (
        <ControllerDetailModal
          controller={activeModalController}
          onClose={() => setActiveModalController(null)}
          onAddToCompare={(id) => {
            if (!selectedForCompare.includes(id)) {
              if (selectedForCompare.length < 4) {
                setSelectedForCompare([...selectedForCompare, id]);
              }
            }
          }}
        />
      )}
    </div>
  );
}
