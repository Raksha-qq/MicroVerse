import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="py-24 text-center space-y-8">
      {/* Technical error code annotation */}
      <div className="text-[10px] font-mono text-[#8C8275] uppercase tracking-widest">
        // SIGNAL / 404 // ADDRESS FAULT
      </div>

      {/* Error icon in paper/engineering style */}
      <div className="w-16 h-16 rounded border-2 border-[#B95D32]/40 bg-[#FAF5EB] flex items-center justify-center mx-auto text-[#B95D32] shadow-sm relative">
        <ShieldAlert className="w-8 h-8" />
        {/* Corner drafting marks */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#B95D32]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#B95D32]" />
      </div>

      <div className="space-y-3">
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#22201D] tracking-tight">
          404
        </h1>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#22201D]">
          Silicon Address{' '}
          <span className="italic font-normal text-[#B95D32]">Fault</span>
        </h2>
        <p className="text-sm font-mono text-[#655F55] max-w-md mx-auto leading-relaxed">
          The requested memory-mapped laboratory resource does not exist or has been relocated to another address space.
        </p>
      </div>

      {/* Technical annotation */}
      <div className="inline-block bg-[#FAF5EB] border border-[#C9BDAA] rounded px-4 py-2 text-[11px] font-mono text-[#8C8275]">
        REF: MV-404-FAULT // ROUTE NOT FOUND // SYSTEM NOMINAL
      </div>

      <div className="flex items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return to Laboratory Hub
          </Button>
        </Link>
        <Link to="/discover">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Start Discovering
          </Button>
        </Link>
      </div>
    </div>
  );
}
