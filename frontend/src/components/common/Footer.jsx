import React from 'react';
import { Terminal, Shield, GitBranch, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#192B40] bg-[#0B1220]/80 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8FA6BC]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#55C7FF]" />
            <span>MICROVERSE ARCHITECTURE v1.0.0</span>
            <span className="text-[#192B40]">|</span>
            <span>EDUCATIONAL SILICON RUNTIME</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-[#55C7FF] transition-colors">
              <Terminal className="w-3.5 h-3.5 text-[#55C7FF]" />
              POSTGRESQL + PRISMA
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#55C7FF] transition-colors">
              <GitBranch className="w-3.5 h-3.5 text-[#55C7FF]" />
              EXPRESS + REACT
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#55C7FF] transition-colors">
              <Shield className="w-3.5 h-3.5 text-[#10B981]" />
              JWT SECURED
            </span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} MICROVERSE Laboratories.
          </div>
        </div>
      </div>
    </footer>
  );
}

