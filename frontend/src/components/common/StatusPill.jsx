import React from 'react';

export function StatusPill({
  status = 'ONLINE',
  label = 'SYSTEM',
  latency = null,
  className = '',
}) {
  const isOnline = status === 'ONLINE' || status === 'CONNECTED';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono bg-[#FAF5EB] border border-[#C9BDAA] text-[#22201D] shadow-xs select-none ${className}`}
    >
      <span className="text-[#8C8275] font-light">[ //</span>
      <span className="font-semibold text-[#22201D] tracking-wider">{label}</span>
      <span
        className={`font-semibold ${
          isOnline ? 'text-[#87945B]' : 'text-[#B95D32]'
        }`}
      >
        {status}
      </span>
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          isOnline ? 'bg-[#87945B] animate-pulse' : 'bg-[#B95D32]'
        }`}
      />
      {latency !== null && (
        <span className="text-[#8C8275] text-[10px] pl-1 border-l border-[#C9BDAA]">
          {latency}ms
        </span>
      )}
      <span className="text-[#8C8275] font-light">]</span>
    </div>
  );
}
