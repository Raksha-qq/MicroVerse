import React from 'react';

export function Badge({
  children,
  variant = 'cyan', // 'cyan' (orange), 'ice' (bluegrey), 'amber' (terracotta), 'emerald' (olive), 'muted', 'dark'
  size = 'sm',
  className = '',
  icon: Icon,
}) {
  const baseClasses =
    'inline-flex items-center font-mono font-medium rounded-sm tracking-wider uppercase select-none';

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantClasses = {
    cyan: 'bg-[#D87535]/10 text-[#D87535] border border-[#D87535]/30',
    orange: 'bg-[#D87535]/10 text-[#D87535] border border-[#D87535]/30',
    ice: 'bg-[#71818B]/10 text-[#71818B] border border-[#71818B]/30',
    bluegrey: 'bg-[#71818B]/10 text-[#71818B] border border-[#71818B]/30',
    amber: 'bg-[#B95D32]/10 text-[#B95D32] border border-[#B95D32]/30',
    terracotta: 'bg-[#B95D32]/10 text-[#B95D32] border border-[#B95D32]/30',
    emerald: 'bg-[#87945B]/10 text-[#87945B] border border-[#87945B]/30',
    olive: 'bg-[#87945B]/10 text-[#87945B] border border-[#87945B]/30',
    muted: 'bg-[#EDE1CE] text-[#655F55] border border-[#C9BDAA]',
    dark: 'bg-[#242522] text-[#C8DE72] border border-[#C8DE72]/30',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.sm} ${variantClasses[variant] || variantClasses.cyan
        } ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
