import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AuthModal } from '../components/common/AuthModal';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-drafting-grid text-[#22201D] relative selection:bg-[#D87535]/20 selection:text-[#22201D]">
      {/* Subtle architectural framing markings */}
      <div className="fixed top-2 left-2 text-[9px] font-mono text-[#8C8275] pointer-events-none select-none z-0">
        + 00.00° / LAT.SYS
      </div>
      <div className="fixed top-2 right-2 text-[9px] font-mono text-[#8C8275] pointer-events-none select-none z-0">
        REF: MV-LAB-2026 +
      </div>
      <div className="fixed bottom-2 left-2 text-[9px] font-mono text-[#8C8275] pointer-events-none select-none z-0">
        SCALE 1:1 • DRAFT
      </div>

      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Arena */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Authentication Security Modal */}
      <AuthModal />
    </div>
  );
}
