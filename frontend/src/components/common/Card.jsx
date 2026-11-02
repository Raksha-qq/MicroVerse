import React from 'react';

export function Card({
  children,
  className = '',
  glowOnHover = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl bg-[#111E30]/80 border border-[#192B40] backdrop-blur-md p-5 transition-all duration-300 ${
        glowOnHover ? 'hover:border-[#55C7FF]/50 hover:shadow-[0_0_25px_rgba(85,199,255,0.15)]' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

