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
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none rounded-md cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#55C7FF] text-[#0B1220] font-semibold hover:bg-[#A5E3FF] shadow-[0_0_15px_rgba(85,199,255,0.3)] hover:shadow-[0_0_20px_rgba(85,199,255,0.5)] border border-[#55C7FF]',
    secondary:
      'bg-[#192B40] text-[#EAF5FF] hover:bg-[#111E30] hover:text-[#55C7FF] border border-[#192B40] hover:border-[#55C7FF]/40',
    outline:
      'bg-transparent text-[#55C7FF] border border-[#55C7FF]/40 hover:bg-[#55C7FF]/10 hover:border-[#55C7FF]',
    ghost:
      'bg-transparent text-[#8FA6BC] hover:text-[#EAF5FF] hover:bg-[#192B40]/40',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}

