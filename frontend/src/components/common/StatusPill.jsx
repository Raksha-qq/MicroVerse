import React from 'react';

export function StatusPill({
  status = 'ONLINE',
  label = 'ENGINE',
  latency = null,
  className = '',
}) {
  const isOnline = status === 'ONLINE' || status === 'CONNECTED';

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-[#111E30] border border-[#192B40] ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {isOnline && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#55C7FF] opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOnline ? 'bg-[#55C7FF]' : 'bg-[#EF4444]'
          }`}
        ></span>
      </span>
      <span className="text-[#8FA6BC] font-medium">{label}:</span>
      <span className={`font-semibold ${isOnline ? 'text-[#55C7FF]' : 'text-[#EF4444]'}`}>
        {status}
      </span>
      {latency !== null && (
        <span className="text-[#8FA6BC]/70 text-[10px] pl-1 border-l border-[#192B40]">
          {latency}ms
        </span>
      )}
    </div>
  );
}

