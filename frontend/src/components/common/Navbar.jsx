import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Cpu,
  Layers,
  BookOpen,
  Terminal,
  CheckSquare,
  FileText,
  Activity,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { NAV_LINKS } from '../../data/navigation';
import { StatusPill } from './StatusPill';
import { healthService } from '../../services/healthService';
import { useAuth } from '../../hooks/useAuth';

const ICON_MAP = {
  Cpu,
  Layers,
  BookOpen,
  Terminal,
  CheckSquare,
  FileText,
  Activity,
};

export function Navbar() {
  const location = useLocation();
  const { user, openAuth, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [health, setHealth] = useState({ status: 'ONLINE', latency: 2 });

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
          setHealth({ status: 'DEGRADED', latency: null });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#192B40] bg-[#0B1220]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#111E30] border border-[#55C7FF]/40 flex items-center justify-center text-[#55C7FF] shadow-[0_0_15px_rgba(85,199,255,0.25)] group-hover:border-[#55C7FF] group-hover:shadow-[0_0_20px_rgba(85,199,255,0.4)] transition-all">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="font-heading font-bold text-lg tracking-wider text-[#EAF5FF] flex items-center gap-1.5">
                MICRO<span className="text-[#55C7FF]">VERSE</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#8FA6BC]">
                Embedded Laboratory
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const IconComponent = ICON_MAP[link.icon] || Cpu;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-[#192B40] text-[#55C7FF] shadow-[inset_0_0_10px_rgba(85,199,255,0.15)] border border-[#55C7FF]/40'
                      : 'text-[#8FA6BC] hover:text-[#EAF5FF] hover:bg-[#111E30]'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Status Beacon & Engineer Profile */}
          <div className="hidden sm:flex items-center gap-4">
            <StatusPill
              status={health.status}
              label="SYS"
              latency={health.latency}
            />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#EAF5FF]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  {user.name.split(' ')[0]}
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-[#8FA6BC] hover:text-[#EF4444] transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-[#192B40] text-[#55C7FF] border border-[#55C7FF]/30 hover:border-[#55C7FF] hover:bg-[#55C7FF]/10 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#55C7FF]" />
                Authenticate
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#8FA6BC] hover:text-[#EAF5FF] hover:bg-[#111E30]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#192B40] bg-[#0B1220] px-4 pt-3 pb-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const IconComponent = ICON_MAP[link.icon] || Cpu;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono ${
                  isActive
                    ? 'bg-[#192B40] text-[#55C7FF]'
                    : 'text-[#8FA6BC] hover:text-[#EAF5FF] hover:bg-[#111E30]'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

