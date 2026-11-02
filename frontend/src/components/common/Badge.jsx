import React from 'react';

export function Badge({
  children,
  variant = 'cyan',
  size = 'sm',
  className = '',
  icon: Icon,
}) {
  const baseClasses = 'inline-flex items-center font-mono font-medium rounded tracking-wide uppercase select-none';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantClasses = {
    cyan: 'bg-[#55C7FF]/10 text-[#55C7FF] border border-[#55C7FF]/30',
    ice: 'bg-[#A5E3FF]/10 text-[#A5E3FF] border border-[#A5E3FF]/30',
    amber: 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30',
    emerald: 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30',
    muted: 'bg-[#192B40]/40 text-[#8FA6BC] border border-[#192B40]',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size] || sizeClasses.sm} ${variantClasses[variant] || variantClasses.cyan} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}

