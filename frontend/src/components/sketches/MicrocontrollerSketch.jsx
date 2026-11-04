import React from 'react';

export function MicrocontrollerSketch({ className = '' }) {
  return (
    <div className={`relative w-full h-44 flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-40"
      >
        {/* Subtle grid and crosshairs */}
        <g stroke="#C9BDAA" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6">
          <line x1="20" y1="100" x2="260" y2="100" />
          <line x1="140" y1="20" x2="140" y2="180" />
          <circle cx="140" cy="100" r="75" />
        </g>

        {/* Isometric Microcontroller IC with QFP Pins */}
        <g transform="translate(140, 100)">
          {/* Chip Base Shadow */}
          <polygon
            points="-60,0 0,35 60,0 0,-35"
            fill="#EDE1CE"
            stroke="#C9BDAA"
            strokeWidth="0.8"
          />

          {/* Solder Contact Pads & Traces radiating out */}
          <g stroke="#71818B" strokeWidth="0.9">
            <line x1="-70" y1="-5" x2="-95" y2="-15" />
            <line x1="-55" y1="-14" x2="-80" y2="-24" />
            <line x1="-40" y1="-23" x2="-65" y2="-33" />
            <line x1="-25" y1="-32" x2="-50" y2="-42" />

            <line x1="70" y1="-5" x2="95" y2="-15" />
            <line x1="55" y1="-14" x2="80" y2="-24" />
            <line x1="40" y1="-23" x2="65" y2="-33" />
            <line x1="25" y1="-32" x2="50" y2="-42" />

            <line x1="-70" y1="5" x2="-95" y2="15" />
            <line x1="-55" y1="14" x2="-80" y2="24" />
            <line x1="-40" y1="23" x2="-65" y2="33" />
            <line x1="-25" y1="32" x2="-50" y2="42" />

            <line x1="70" y1="5" x2="95" y2="15" />
            <line x1="55" y1="14" x2="80" y2="24" />
            <line x1="40" y1="23" x2="65" y2="33" />
            <line x1="25" y1="32" x2="50" y2="42" />
          </g>

          {/* Copper Vias */}
          <circle cx="-95" cy="-15" r="1.5" fill="#D87535" />
          <circle cx="-80" cy="-24" r="1.5" fill="#D87535" />
          <circle cx="95" cy="15" r="1.5" fill="#D87535" />
          <circle cx="80" cy="24" r="1.5" fill="#D87535" />

          {/* Main Silicon Package Block */}
          {/* Thickness */}
          <polygon
            points="-50,0 0,30 50,0 50,8 0,38 -50,8"
            fill="#22201D"
            stroke="#22201D"
            strokeWidth="1.2"
          />
          {/* Top Die Surface */}
          <polygon
            points="0,-30 50,0 0,30 -50,0"
            fill="#38332E"
            stroke="#22201D"
            strokeWidth="1.4"
          />

          {/* Inner Die Recess */}
          <polygon
            points="0,-22 38,0 0,22 -38,0"
            fill="#2A2622"
            stroke="#8C8275"
            strokeWidth="0.8"
          />

          {/* Pin 1 Notch */}
          <circle cx="-32" cy="0" r="2" fill="#D87535" />

          {/* Laser-etched Microchip Label */}
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontFamily="IBM Plex Mono, monospace"
            fontSize="7"
            fill="#FAF5EB"
            fontWeight="bold"
            letterSpacing="0.8"
          >
            MCU 32-BIT
          </text>
          <text
            x="0"
            y="12"
            textAnchor="middle"
            fontFamily="IBM Plex Mono, monospace"
            fontSize="5"
            fill="#C9BDAA"
          >
            ARM CORTEX
          </text>
        </g>

        {/* Dimension Lines and Annotation */}
        <g stroke="#8C8275" strokeWidth="0.6">
          <line x1="35" y1="170" x2="245" y2="170" />
          <line x1="35" y1="166" x2="35" y2="174" />
          <line x1="245" y1="166" x2="245" y2="174" />
          <text x="140" y="182" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#8C8275">
            48-LQFP // 7x7 mm
          </text>
        </g>
      </svg>
    </div>
  );
}

