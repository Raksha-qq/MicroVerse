import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#111E30] border border-[#EF4444]/40 text-[#EF4444] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="font-heading text-4xl font-bold text-[#EAF5FF]">
          404: Silicon Address Fault
        </h1>
        <p className="text-sm font-mono text-[#8FA6BC] max-w-md mx-auto">
          The requested memory-mapped laboratory resource does not exist or has been relocated to another address space.
        </p>
      </div>

      <div>
        <Link to="/">
          <Button icon={ArrowLeft}>
            Return to Laboratory Hub
          </Button>
        </Link>
      </div>
    </div>
  );
}

