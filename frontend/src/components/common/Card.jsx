import React from 'react';

export function Card({
  children,
  className = '',
  variant = 'paper', // 'paper' | 'secondary' | 'instrument'
  glowOnHover = true,
  onClick,
  ...props
}) {
  const variantStyles = {
    paper: 'bg-[#FAF5EB] border-[#C9BDAA] text-[#22201D]',
    secondary: 'bg-[#EDE1CE] border-[#C9BDAA] text-[#22201D]',
    instrument: 'bg-[#242522] border-[#3A3A34] text-[#FAF5EB]',
  };

  const hoverStyles = glowOnHover
    ? variant === 'instrument'
      ? 'hover:border-[#C8DE72]/50 hover:shadow-lg'
      : 'hover:border-[#D87535] hover:shadow-sm'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-lg border p-5 transition-all duration-200 ${
        variantStyles[variant] || variantStyles.paper
      } ${hoverStyles} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
