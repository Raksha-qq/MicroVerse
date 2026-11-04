import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Compass,
  Layers,
  Sliders,
  Bot,
  Terminal,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield,
  Sun,
  Award,
  BookOpen,
  Zap,
} from 'lucide-react';
import { StatusPill } from './StatusPill';
import { healthService } from '../../services/healthService';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, openAuth, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [health, setHealth] = useState({ status: 'ONLINE', latency: 2 });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let mounted = true;
    healthService
      .getHealth()
      .then((res) => {
        if (mounted) {
          setHealth({
            status: res.status,
            latency: res.database?.latencyMs ?? 2,
          });
        }
      })
      .catch(() => {
        if (mounted) {
          setHealth({ status: 'ONLINE', latency: 2 });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/archive?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navGroups = [
    {
      id: 'explore',
      label: 'Explore',
      items: [
        { name: 'Discover Silicon', path: '/discover', icon: Compass, desc: '14-chapter foundational concepts' },
        { name: 'Silicon Anatomy', path: '/anatomy', icon: Cpu, desc: 'Interactive execution engine' },
        { name: 'Robotics & Control', path: '/robotics', icon: Bot, desc: 'Physical AI, motor drive & feedback' },
      ],
    },
    {
      id: 'learn',
      label: 'Learn',
      items: [
        { name: 'Master Syllabus', path: '/lessons', icon: BookOpen, desc: 'Pedagogical curriculum progression' },
        { name: 'Diagnostic Quizzes', path: '/quizzes', icon: Award, desc: 'Competency knowledge checks' },
      ],
    },
    {
      id: 'lab',
      label: 'Lab',
      items: [
        { name: 'Virtual Laboratory', path: '/lab', icon: Terminal, desc: 'Real-time interactive hardware bench' },
        { name: 'Signal & PWM Lab', path: '/experiment', icon: Zap, desc: 'Oscilloscope, duty cycle & motor control' },
      ],
    },
    {
      id: 'archive',
      label: 'Archive',
      items: [
        { name: 'Controller Archive', path: '/archive', icon: Layers, desc: '19 verified microcontroller records' },
        { name: 'Comparison Matrix', path: '/compare', icon: Sliders, desc: 'Side-by-side specification alignment' },
        { name: 'Research Logbook', path: '/research', icon: BookOpen, desc: 'Personal engineering findings' },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF5EB]/95 backdrop-blur-md border-b border-[#C9BDAA] shadow-xs">
      {/* Top Drafting Measurement Rules */}
      <div className="w-full h-1 bg-[#EDE1CE] border-b border-[#C9BDAA]/40 flex justify-between items-center px-4 overflow-hidden pointer-events-none">
        <span className="text-[7px] font-mono text-[#8C8275] tracking-widest uppercase">
          SEC.01 // DRAFTING GRID REF: 34.029.A
        </span>
        <div className="flex gap-4 text-[7px] font-mono text-[#8C8275]">
          <span>+ 10mm</span>
          <span>+ 20mm</span>
          <span>+ 30mm</span>
          <span>+ 40mm</span>
        </div>
        <span className="text-[7px] font-mono text-[#8C8275]">SCALE 1:1</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              {/* Technical Monogram Logo */}
              <div className="w-8 h-8 rounded border border-[#C9BDAA] bg-[#FAF5EB] flex items-center justify-center font-serif text-lg font-bold text-[#D87535] group-hover:border-[#D87535] transition-colors shadow-xs">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg sm:text-xl tracking-wider text-[#22201D] leading-none">
                  MICROVERSE
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C8275] mt-1 leading-none">
                  TECHNICAL LAB
                </span>
              </div>
            </Link>

            {/* Subtle Drafting Divider Crosshair */}
            <div className="hidden sm:flex items-center gap-1.5 text-[#C9BDAA] text-xs font-mono select-none px-1">
              <span>+</span>
              <span className="text-[8px]">•</span>
              <span>+</span>
            </div>
          </div>

          {/* Desktop Navigation Groups with Dropdowns */}
          <nav
            ref={dropdownRef}
            className="hidden lg:flex items-center gap-1 xl:gap-2 font-mono text-xs"
            aria-label="Main Navigation"
          >
            {navGroups.map((group) => {
              const isOpen = activeDropdown === group.id;
              const hasActiveChild = group.items.some((item) => location.pathname === item.path);

              return (
                <div key={group.id} className="relative">
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : group.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded transition-all cursor-pointer ${
                      hasActiveChild
                        ? 'text-[#D87535] font-semibold bg-[#EDE1CE]'
                        : 'text-[#22201D] hover:text-[#D87535] hover:bg-[#EDE1CE]/60'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#8C8275] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#D87535]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute left-0 mt-2 w-64 rounded-md border border-[#C9BDAA] bg-[#FAF5EB] shadow-lg p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-[#8C8275] px-2 py-1 border-b border-[#C9BDAA]/40 mb-1">
                        // {group.label} Catalog
                      </div>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = location.pathname === item.path;

                        return (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setActiveDropdown(null)}
                            className={`flex items-start gap-2.5 p-2 rounded transition-colors ${
                              isCurrent
                                ? 'bg-[#EDE1CE] text-[#D87535] font-semibold'
                                : 'text-[#22201D] hover:bg-[#EDE1CE]/60'
                            }`}
                          >
                            <Icon className="w-4 h-4 text-[#D87535] mt-0.5 shrink-0" />
                            <div>
                              <div className="text-xs font-mono">{item.name}</div>
                              <div className="text-[10px] text-[#655F55] leading-tight font-sans">
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Direct Link to Dashboard */}
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded transition-all ${
                location.pathname === '/dashboard'
                  ? 'text-[#D87535] font-semibold bg-[#EDE1CE]'
                  : 'text-[#22201D] hover:text-[#D87535] hover:bg-[#EDE1CE]/60'
              }`}
            >
              Dashboard
            </Link>
          </nav>

          {/* Quick Concept Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center max-w-xs w-48 lg:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 text-[#8C8275] pointer-events-none" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded-full pl-8 pr-3 py-1 text-xs text-[#22201D] placeholder-[#8C8275] outline-none font-mono transition-colors shadow-2xs"
            />
          </form>

          {/* User Controls & Actions */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* System Status Pill */}
            <StatusPill status={health.status} label="SYS" latency={health.latency} />

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#C9BDAA]">
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#B95D32]/10 text-[#B95D32] border border-[#B95D32]/30 hover:bg-[#B95D32]/20 text-[11px] font-mono font-bold transition-all"
                    title="Administrative Console"
                  >
                    <Shield className="w-3 h-3" />
                    Admin
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-xs font-mono text-[#22201D] bg-[#FAF5EB] hover:border-[#D87535] px-2.5 py-1 rounded border border-[#C9BDAA] transition-colors shadow-2xs"
                  title="View Engineer Dashboard"
                >
                  <span className="w-2 h-2 rounded-full bg-[#87945B]"></span>
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={logout}
                  title="Disconnect session"
                  className="p-1.5 rounded text-[#655F55] hover:text-[#B95D32] hover:bg-[#EDE1CE] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-[#22201D] text-[#FAF5EB] hover:bg-[#38332E] transition-all shadow-xs cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded border border-[#C9BDAA] text-[#22201D] hover:bg-[#EDE1CE] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#D87535]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#C9BDAA] bg-[#FAF5EB] px-4 pt-3 pb-6 space-y-4 shadow-xl">
          {/* Search bar in mobile */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
            <input
              type="text"
              placeholder="Search concepts, chips, lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded-md pl-9 pr-4 py-2 text-xs text-[#22201D] placeholder-[#8C8275] outline-none font-mono"
            />
          </form>

          <div className="space-y-3">
            {navGroups.map((group) => (
              <div key={group.id} className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C8275] px-1">
                  // {group.label}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-2 rounded text-xs font-mono transition-colors ${
                          isActive
                            ? 'bg-[#EDE1CE] text-[#D87535] font-semibold border border-[#D87535]/30'
                            : 'text-[#22201D] hover:bg-[#EDE1CE]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#D87535]" />
                          <span>{item.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8C8275]" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2 rounded text-xs font-mono bg-[#EDE1CE] text-[#22201D] font-semibold border border-[#C9BDAA]"
            >
              <span>User Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C8275]" />
            </Link>
          </div>

          <div className="pt-3 border-t border-[#C9BDAA] flex items-center justify-between">
            <StatusPill status={health.status} label="SYS" latency={health.latency} />
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-xs font-mono text-[#B95D32] flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuth('login');
                }}
                className="text-xs font-mono font-semibold px-3 py-1.5 rounded bg-[#22201D] text-[#FAF5EB]"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
