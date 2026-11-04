import React from 'react';

export function SatelliteSketch({ className = '' }) {
  return (
    <div className={`relative w-full h-44 flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-40"
      >
        {/* Orbital Trajectory Arc & Coordinate Marks */}
        <g stroke="#C9BDAA" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6">
          <path d="M 20 160 Q 140 30 260 80" />
          <circle cx="140" cy="100" r="85" />
        </g>

        {/* Satellite Engineering Geometry (slanted in orbit) */}
        <g transform="translate(140, 100) rotate(15)">
          {/* Central Cube Satellite Bus Body */}
          {/* Left Face */}
          <polygon
            points="-22,-20 0,-32 0,20 -22,32"
            fill="#B8AA94"
            stroke="#22201D"
            strokeWidth="1.2"
          />
          {/* Right Face */}
          <polygon
            points="0,-32 25,-18 25,34 0,20"
            fill="#D5C8B5"
            stroke="#22201D"
            strokeWidth="1.2"
          />
          {/* Top Face */}
          <polygon
            points="0,-32 25,-18 3,-6 -22,-20"
            fill="#EDE1CE"
            stroke="#22201D"
            strokeWidth="1.2"
          />

          {/* Thermal Insulation Blanket Foil Crosshatch */}
          <g stroke="#C9BDAA" strokeWidth="0.6" strokeDasharray="1 1">
            <line x1="-18" y1="-10" x2="-2" y2="15" />
            <line x1="-12" y1="-15" x2="2" y2="10" />
            <line x1="5" y1="-20" x2="20" y2="5" />
            <line x1="8" y1="-10" x2="23" y2="15" />
          </g>

          {/* Optical Star Tracker Lenses on Bus */}
          <circle cx="-10" cy="5" r="3.5" fill="#22201D" stroke="#D87535" strokeWidth="0.8" />
          <circle cx="12" cy="8" r="3.5" fill="#22201D" stroke="#D87535" strokeWidth="0.8" />

          {/* Left Solar Array Wing */}
          <g transform="translate(-22, 5)">
            {/* Mounting Truss Boom Arm */}
            <line x1="0" y1="0" x2="-22" y2="-6" stroke="#22201D" strokeWidth="2" />
            {/* Panel 1 */}
            <polygon
              points="-22,-24 -55,-32 -55,16 -22,24"
              fill="#242522"
              stroke="#22201D"
              strokeWidth="1.1"
            />
            {/* Photovoltaic Solar Grid Cells */}
            <g stroke="#C8DE72" strokeWidth="0.6" strokeOpacity="0.8">
              <line x1="-38" y1="-28" x2="-38" y2="20" />
              <line x1="-22" y1="-8" x2="-55" y2="-16" />
              <line x1="-22" y1="8" x2="-55" y2="0" />
            </g>
            {/* Panel 2 (Outer fold) */}
            <polygon
              points="-55,-32 -86,-40 -86,8 -55,16"
              fill="#242522"
              stroke="#22201D"
              strokeWidth="1.1"
            />
            <g stroke="#C8DE72" strokeWidth="0.6" strokeOpacity="0.8">
              <line x1="-70" y1="-36" x2="-70" y2="12" />
              <line x1="-55" y1="-16" x2="-86" y2="-24" />
              <line x1="-55" y1="0" x2="-86" y2="-8" />
            </g>
          </g>

          {/* Right Solar Array Wing */}
          <g transform="translate(25, 6)">
            {/* Mounting Truss Boom Arm */}
            <line x1="0" y1="0" x2="22" y2="6" stroke="#22201D" strokeWidth="2" />
            {/* Panel 1 */}
            <polygon
              points="22,-16 55,-8 55,40 22,32"
              fill="#242522"
              stroke="#22201D"
              strokeWidth="1.1"
            />
            <g stroke="#C8DE72" strokeWidth="0.6" strokeOpacity="0.8">
              <line x1="38" y1="-12" x2="38" y2="36" />
              <line x1="22" y1="0" x2="55" y2="8" />
              <line x1="22" y1="16" x2="55" y2="24" />
            </g>
            {/* Panel 2 */}
            <polygon
              points="55,-8 86,0 86,48 55,40"
              fill="#242522"
              stroke="#22201D"
              strokeWidth="1.1"
            />
            <g stroke="#C8DE72" strokeWidth="0.6" strokeOpacity="0.8">
              <line x1="70" y1="-4" x2="70" y2="44" />
              <line x1="55" y1="8" x2="86" y2="16" />
              <line x1="55" y1="24" x2="86" y2="32" />
            </g>
          </g>

          {/* Parabolic High-Gain Dish Antenna */}
          <g transform="translate(2, -32)">
            {/* Gimbal Mount Post */}
            <line x1="0" y1="0" x2="-8" y2="-18" stroke="#22201D" strokeWidth="1.5" />
            {/* Elliptical Dish Surface */}
            <ellipse cx="-16" cy="-30" rx="18" ry="9" transform="rotate(-30, -16, -30)" fill="#FAF5EB" stroke="#22201D" strokeWidth="1.2" />
            {/* Feed Horn Strut */}
            <line x1="-16" y1="-30" x2="-26" y2="-46" stroke="#D87535" strokeWidth="1.2" />
            <circle cx="-26" cy="-46" r="2" fill="#D87535" />
          </g>

          {/* Downlink Microwave Signal Waves */}
          <g stroke="#D87535" strokeWidth="0.8" strokeDasharray="1.5 1.5">
            <path d="M -30 -52 A 15 15 0 0 0 -42 -40" />
            <path d="M -34 -58 A 22 22 0 0 0 -48 -44" />
          </g>
        </g>

        {/* Telemetry Labels */}
        <g fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#8C8275">
          <text x="35" y="45">TX/RX // S-BAND TELEMETRY</text>
          <text x="175" y="180">ORBITAL ATTITUDE CONTROL</text>
        </g>
      </svg>
    </div>
  );
}

