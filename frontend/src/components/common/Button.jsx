import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-mono font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none rounded-md cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#22201D] text-[#FAF5EB] font-semibold hover:bg-[#38332E] shadow-sm border border-[#22201D]',
    secondary:
      'bg-[#FAF5EB] text-[#22201D] hover:bg-[#EDE1CE] border border-[#C9BDAA] shadow-sm',
    accent:
      'bg-[#D87535] text-[#FAF5EB] font-semibold hover:bg-[#B95D32] border border-[#D87535] shadow-sm',
    outline:
      'bg-transparent text-[#22201D] border border-[#C9BDAA] hover:bg-[#EDE1CE]/60 hover:border-[#D87535] hover:text-[#D87535]',
    ghost:
      'bg-transparent text-[#655F55] hover:text-[#22201D] hover:bg-[#EDE1CE]/50',
    instrument:
      'bg-[#242522] text-[#C8DE72] border border-[#C8DE72]/40 hover:bg-[#2A2B27] hover:border-[#C8DE72]',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
