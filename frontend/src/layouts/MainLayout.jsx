import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1220] text-[#EAF5FF] bg-circuit-grid relative">
      {/* Ambient background glow points */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#55C7FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#192B40]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Global Navigation */}
      <Navbar />

      {/* Main Content Arena */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

