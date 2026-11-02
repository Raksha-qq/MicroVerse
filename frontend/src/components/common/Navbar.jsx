import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Compass,
  Layers,
  Sliders,
  Bot,
  Terminal,
  Zap,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { NAV_LINKS } from '../../data/navigation';
import { StatusPill } from './StatusPill';
import { healthService } from '../../services/healthService';
import { useAuth } from '../../hooks/useAuth';

const ICON_MAP = {
  Compass,
  Cpu,
  Layers,
  Sliders,
  Bot,
  Terminal,
};

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, openAuth, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [health, setHealth] = useState({ status: 'ONLINE', latency: 2 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleNavClick = (link, e) => {
    setMobileMenuOpen(false);
    if (link.path.startsWith('/#')) {
      const anchorId = link.path.replace('/#', '');
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(link.path);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B1220]/95 backdrop-blur-md border-b border-[#192B40] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-[#0B1220]/80 backdrop-blur-sm border-b border-[#192B40]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#111E30] border border-[#55C7FF]/40 flex items-center justify-center text-[#55C7FF] shadow-[0_0_15px_rgba(85,199,255,0.25)] group-hover:border-[#55C7FF] group-hover:shadow-[0_0_20px_rgba(85,199,255,0.4)] transition-all">
              <Cpu className="w-5 h-5 group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="font-heading font-bold text-lg tracking-wider text-[#EAF5FF] flex items-center gap-1 leading-none">
                MICRO<span className="text-[#55C7FF]">VERSE</span>
              </div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#8FA6BC] mt-1 leading-none">
                Embedded Intelligence Lab
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const IconComponent = ICON_MAP[link.icon] || Cpu;
              const isActive =
                location.pathname === link.path ||
                (link.path.startsWith('/#') && location.hash === `#${link.anchor}`);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavClick(link, e)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#192B40] text-[#55C7FF] border border-[#55C7FF]/40 shadow-[inset_0_0_10px_rgba(85,199,255,0.15)]'
                      : 'text-[#8FA6BC] hover:text-[#EAF5FF] hover:bg-[#111E30]/80'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area: Status & Auth */}
          <div className="hidden sm:flex items-center gap-3.5 shrink-0">
            <StatusPill
              status={health.status}
              label="SYS"
              latency={health.latency}
            />

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#192B40]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#EAF5FF] bg-[#111E30] px-2.5 py-1 rounded-md border border-[#192B40]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  title="Disconnect session"
                  className="p-1.5 rounded-md text-[#8FA6BC] hover:text-[#EF4444] hover:bg-[#111E30] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-[#192B40] text-[#55C7FF] border border-[#55C7FF]/40 hover:border-[#55C7FF] hover:bg-[#55C7FF]/15 transition-all shadow-[0_0_12px_rgba(85,199,255,0.15)] cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#55C7FF]" />
                Authenticate
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#8FA6BC] hover:text-[#EAF5FF] hover:bg-[#111E30] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#55C7FF]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#192B40] bg-[#0B1220]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8FA6BC] px-2 pb-1">
            Laboratory Navigation
          </div>
          {NAV_LINKS.map((link) => {
            const IconComponent = ICON_MAP[link.icon] || Cpu;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNavClick(link, e)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-mono transition-all ${
                  isActive
                    ? 'bg-[#192B40] text-[#55C7FF] border border-[#55C7FF]/30 font-semibold'
                    : 'text-[#8FA6BC] hover:text-[#EAF5FF] hover:bg-[#111E30]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4 text-[#55C7FF]" />
                  <span>{link.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8FA6BC]/50" />
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#192B40] flex items-center justify-between px-2">
            <StatusPill status={health.status} label="SYS" latency={health.latency} />
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="text-xs font-mono text-[#EF4444] flex items-center gap-1.5"
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
                className="text-xs font-mono text-[#55C7FF] flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#192B40] border border-[#55C7FF]/30"
              >
                <Zap className="w-3.5 h-3.5" />
                Authenticate
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
