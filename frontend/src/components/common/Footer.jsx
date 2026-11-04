import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#C9BDAA] bg-[#FAF5EB] mt-auto py-8 text-xs font-mono text-[#655F55]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Footer Strip: Editorial Motto & Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#C9BDAA]/50 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded border border-[#C9BDAA] bg-[#FAF5EB] flex items-center justify-center font-serif text-sm font-bold text-[#D87535]">
              M
            </div>
            <span className="font-heading font-bold text-sm tracking-wider text-[#22201D]">
              MICROVERSE
            </span>
            <span className="text-[#C9BDAA]">—</span>
            <span className="text-[11px] text-[#655F55]">
              Explore • Learn • Innovate
            </span>
          </div>

          {/* Social Icons & Community */}
          <div className="flex items-center gap-4 text-[#655F55]">
            <a
              href="https://github.com/Raksha-qq/microverse"
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded hover:text-[#D87535] hover:bg-[#EDE1CE] transition-colors"
              title="GitHub Repository"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <span className="text-[#C9BDAA]">|</span>
            <span className="font-cursive text-base text-[#D87535] tracking-wide">
              Built for curious minds.
            </span>
          </div>
        </div>

        {/* Bottom Technical Specifications & Metadata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C8275]">
          <div className="flex items-center gap-2">
            <span>// DOC.REF: MV-ENGINEERING-SERIES</span>
            <span className="text-[#C9BDAA]">•</span>
            <span>SPEC. VERIFIED 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/discover" className="hover:text-[#D87535] transition-colors">
              Curriculum
            </Link>
            <Link to="/archive" className="hover:text-[#D87535] transition-colors">
              Silicon Archive
            </Link>
            <Link to="/lab" className="hover:text-[#D87535] transition-colors">
              Virtual Lab
            </Link>
            <Link to="/admin" className="hover:text-[#D87535] transition-colors">
              Governance
            </Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} MICROVERSE Laboratories.
          </div>
        </div>
      </div>
    </footer>
  );
}
