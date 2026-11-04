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
  Bot,
  Bookmark
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { controllerService } from '../services/controllerService';
import { bookmarkService } from '../services/bookmarkService';
import { CONTROLLER_FAMILIES } from '../data/navigation';
import { TaxonomyClarifier } from '../components/archive/TaxonomyClarifier';
import { ControllerDetailModal } from '../components/archive/ControllerDetailModal';

export function ControllersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuth } = useAuth();

  // State
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

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

  // Fetch bookmarks if user is authenticated
  useEffect(() => {
    if (user) {
      bookmarkService
        .getBookmarks()
        .then((res) => {
          const bookmarks = res.data || res || [];
          const ids = new Set(
            bookmarks
              .filter((b) => b.itemType === 'CONTROLLER')
              .map((b) => b.itemId)
          );
          setBookmarkedIds(ids);
        })
        .catch((err) => {
          console.warn('Could not load user bookmarks:', err);
        });
    } else {
      setBookmarkedIds(new Set());
    }
  }, [user]);

  const handleToggleBookmark = async (ctrlId, e) => {
    e?.stopPropagation?.();
    if (!isAuthenticated) {
      openAuth('login');
      return;
    }
    try {
      const res = await bookmarkService.toggleBookmark('CONTROLLER', ctrlId);
      const isNowBookmarked = res.data?.bookmarked ?? res.bookmarked;
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (isNowBookmarked) {
          next.add(ctrlId);
        } else {
          next.delete(ctrlId);
        }
        return next;
      });
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

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
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#D87535] uppercase tracking-wider mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>Silicon Registry & Architecture Reference // REF: MV-CATALOG</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#22201D] tracking-tight">
          Microcontroller Silicon Archive
        </h1>
        <p className="text-sm text-[#655F55] mt-1 max-w-3xl leading-relaxed font-sans">
          Searchable reference database of verified microcontrollers, silicon dies, register
          architectures, peripheral matrices, pinouts, and physical AI / robotics capabilities.
        </p>
      </div>

      {/* Part A: Taxonomy Clarifier Section */}
      <TaxonomyClarifier />

      {/* Filter and Search Bar */}
      <div className="space-y-4 rounded-2xl border border-[#C9BDAA] bg-[#FAF5EB] p-4 sm:p-5 shadow-xs bg-drafting-grid-subtle">
        {/* Top Controls: Search + Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
            <input
              type="text"
              placeholder="Search chip name, core, architecture, or ecosystem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5EBDD] border border-[#C9BDAA] focus:border-[#D87535] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#22201D] placeholder-[#8C8275] outline-none transition-colors font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8275] hover:text-[#22201D]"
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
              className="w-full bg-[#F5EBDD] border border-[#C9BDAA] focus:border-[#D87535] rounded-xl px-3 py-2.5 text-xs text-[#22201D] outline-none font-mono cursor-pointer"
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
              className="w-full bg-[#F5EBDD] border border-[#C9BDAA] focus:border-[#D87535] rounded-xl px-3 py-2.5 text-xs text-[#22201D] outline-none font-mono cursor-pointer"
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
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#C9BDAA]/70 pb-1">
          <span className="text-[11px] font-mono text-[#8C8275] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#D87535]" /> Family:
          </span>
          {CONTROLLER_FAMILIES.map((fam) => (
            <button
              key={fam.id}
              onClick={() => setSelectedFamily(fam.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${selectedFamily === fam.id
                  ? 'bg-[#22201D] text-[#FAF5EB] font-bold shadow-xs'
                  : 'bg-[#EDE1CE] text-[#655F55] hover:text-[#22201D] border border-[#C9BDAA]'
                }`}
            >
              {fam.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs font-mono text-[#655F55] px-1">
        <div>
          Showing <span className="text-[#D87535] font-bold">{controllers.length}</span> verified
          silicon target{controllers.length === 1 ? '' : 's'}
        </div>
        {selectedForCompare.length > 0 && (
          <div className="flex items-center gap-2 text-[#D87535]">
            <Sliders className="w-3.5 h-3.5" />
            <span className="font-semibold">{selectedForCompare.length} of 4 selected for comparison</span>
          </div>
        )}
      </div>

      {/* Controllers Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs font-mono text-[#655F55]">
          <Cpu className="w-8 h-8 mx-auto text-[#D87535] animate-spin mb-3" />
          INTERROGATING SILICON REGISTRY DATABASE...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-xs font-mono text-[#B95D32] bg-[#B95D32]/10 rounded-xl border border-[#B95D32]/30">
          {error}
        </div>
      ) : controllers.length === 0 ? (
        <div className="py-20 text-center text-xs font-mono text-[#655F55] bg-[#FAF5EB] rounded-2xl border border-[#C9BDAA] space-y-3">
          <Cpu className="w-10 h-10 mx-auto text-[#8C8275]" />
          <p className="text-sm text-[#22201D] font-serif font-bold">No matching microcontroller records found.</p>
          <p className="text-xs text-[#655F55]">Try clearing search parameters or selecting "All Silicon".</p>
          <button
            onClick={() => {
              setSelectedFamily('ALL');
              setSearchQuery('');
              setConnectivityFilter('all');
              setSortOption('featured');
            }}
            className="px-4 py-2 rounded-lg bg-[#22201D] text-[#FAF5EB] hover:bg-[#3D3A36] transition-colors font-mono text-xs cursor-pointer shadow-xs"
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
                variant="paper"
                className={`flex flex-col justify-between space-y-4 transition-all duration-300 relative ${isSelected ? 'border-[#D87535] shadow-xs ring-1 ring-[#D87535]' : ''
                  }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Manufacturer + Bit Badge + Bookmark */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono text-[#8C8275] uppercase tracking-wider">
                        {ctrl.manufacturer}
                      </div>
                      <h3
                        onClick={() => setActiveModalController(ctrl)}
                        className="font-serif text-lg font-bold text-[#22201D] hover:text-[#D87535] transition-colors cursor-pointer"
                      >
                        {ctrl.name}
                      </h3>
                      <div className="text-xs font-mono text-[#D87535]">{ctrl.commonName}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => handleToggleBookmark(ctrl.id, e)}
                        title={bookmarkedIds.has(ctrl.id) ? "Remove Bookmark" : "Bookmark Controller"}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${bookmarkedIds.has(ctrl.id)
                            ? "bg-[#D87535]/15 text-[#D87535] border-[#D87535]/40"
                            : "text-[#8C8275] hover:text-[#22201D] border-[#C9BDAA]"
                          }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.has(ctrl.id) ? "fill-current" : ""}`} />
                      </button>
                      <Badge variant={ctrl.bitWidth === 32 ? 'cyan' : ctrl.bitWidth === 16 ? 'emerald' : 'amber'}>
                        {ctrl.bitWidth}-BIT
                      </Badge>
                    </div>
                  </div>

                  {/* Architecture & Core Banner */}
                  <div className="p-2.5 rounded-lg bg-[#EDE1CE] border border-[#C9BDAA] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#655F55]">{ctrl.family}</span>
                    <span className="text-[#22201D] font-bold">{ctrl.core}</span>
                  </div>

                  {/* Summary Description */}
                  <p className="text-xs text-[#655F55] line-clamp-2 leading-relaxed font-sans">
                    {ctrl.description}
                  </p>

                  {/* Hardware Spec Quick Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C9BDAA] text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-[#655F55]">
                      <Clock className="w-3.5 h-3.5 text-[#D87535]" />
                      <span className="text-[#22201D] font-medium">{ctrl.maxClockSpeedMHz} MHz</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#655F55]">
                      <Zap className="w-3.5 h-3.5 text-[#B95D32]" />
                      <span className="text-[#22201D] font-medium">
                        {ctrl.flashKb >= 1024 ? `${(ctrl.flashKb / 1024).toFixed(0)} MB` : `${ctrl.flashKb} KB`} Flash
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#655F55]">
                      <Cpu className="w-3.5 h-3.5 text-[#87945B]" />
                      <span className="text-[#22201D] font-medium">
                        {ctrl.sramKb >= 1024 ? `${(ctrl.sramKb / 1024).toFixed(0)} MB` : `${ctrl.sramKb} KB`} SRAM
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#655F55]">
                      <Radio className="w-3.5 h-3.5 text-[#71818B]" />
                      <span className="text-[#22201D] font-medium">{ctrl.gpioCount} GPIO</span>
                    </div>
                  </div>

                  {/* Robotics Highlight Pill */}
                  {ctrl.roboticsApplications && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#655F55] bg-[#EDE1CE]/70 p-2 rounded-lg border border-[#C9BDAA]">
                      <Bot className="w-3 h-3 text-[#D87535] shrink-0" />
                      <span className="line-clamp-1">{ctrl.roboticsApplications}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-[#C9BDAA] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveModalController(ctrl)}
                    className="text-xs font-mono text-[#22201D] hover:text-[#D87535] flex items-center gap-1 cursor-pointer transition-colors font-bold"
                  >
                    Inspect Specs
                    <ArrowRight className="w-3 h-3 text-[#D87535]" />
                  </button>

                  <button
                    onClick={() => toggleCompare(ctrl.slug || ctrl.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                        ? 'bg-[#22201D] text-[#FAF5EB] font-bold shadow-xs'
                        : 'bg-[#EDE1CE] text-[#655F55] hover:text-[#22201D] hover:bg-[#FAF5EB] border border-[#C9BDAA]'
                      }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3 text-[#87945B]" />
                        Selected
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 text-[#D87535]" />
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
        <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-8 z-40 max-w-xl mx-auto sm:mx-0 p-4 rounded-2xl bg-[#FAF5EB] border-2 border-[#D87535] shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D87535]" />
                <span className="text-xs font-mono font-bold text-[#22201D]">
                  Comparison Lab Active ({selectedForCompare.length}/4)
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedForCompare.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#EDE1CE] text-[#D87535] px-2 py-0.5 rounded border border-[#C9BDAA]"
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
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-[#655F55] hover:text-[#22201D] bg-[#EDE1CE] border border-[#C9BDAA] cursor-pointer"
              >
                Clear
              </button>
              <Button
                variant="accent"
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
          isBookmarked={bookmarkedIds.has(activeModalController.id)}
          onToggleBookmark={() => handleToggleBookmark(activeModalController.id)}
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
