import React from 'react';

/**
 * ExplodedMicrocontrollerSketch
 * High-density isometric technical blueprint illustration of an exploded microcontroller assembly.
 * Modeled directly after the reference Engineering Journal hero graphic.
 */
export function ExplodedMicrocontrollerSketch({ className = '' }) {
  return (
    <div className={`relative w-full max-w-xl mx-auto select-none ${className}`}>
      {/* Drafting Coordinate & Dimension Marks */}
      <div className="absolute -top-3 left-0 text-[9px] font-mono text-[#8C8275] tracking-widest uppercase flex items-center gap-2">
        <span className="text-[#D87535]">+</span>
        <span>FIG. 00-A // ISOMETRIC EXPLODED DIE MATRIX</span>
      </div>

      <svg
        viewBox="0 0 680 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
      >
        <defs>
          {/* Subtle PCB pattern */}
          <pattern id="pcb-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#C9BDAA" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>
          <linearGradient id="ic-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EDE1CE" />
            <stop offset="100%" stopColor="#D5C8B5" />
          </linearGradient>
        </defs>

        {/* ========================================================
            BACKGROUND CONSTRUCTION LINES & MEASUREMENTS
            ======================================================== */}
        <g stroke="#C9BDAA" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.65">
          {/* Alignment guide rays */}
          <line x1="120" y1="20" x2="620" y2="440" />
          <line x1="560" y1="30" x2="80" y2="430" />
          {/* Vertical exploded projection guides */}
          <line x1="420" y1="80" x2="420" y2="280" stroke="#D87535" strokeDasharray="2 2" strokeWidth="0.8" />
          <line x1="280" y1="160" x2="280" y2="360" stroke="#D87535" strokeDasharray="2 2" strokeWidth="0.8" />
          <line x1="560" y1="160" x2="560" y2="360" stroke="#D87535" strokeDasharray="2 2" strokeWidth="0.8" />
        </g>

        {/* Coordinate Origin Axis (X, Y, Z) */}
        <g transform="translate(300, 390)">
          <path d="M 0 0 L 0 -35" stroke="#22201D" strokeWidth="1.2" />
          <path d="M 0 0 L 30 18" stroke="#22201D" strokeWidth="1.2" />
          <path d="M 0 0 L -30 18" stroke="#22201D" strokeWidth="1.2" />
          {/* Axis labels */}
          <text x="3" y="-38" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#22201D" fontWeight="bold">Z</text>
          <text x="35" y="22" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#22201D" fontWeight="bold">X</text>
          <text x="-40" y="22" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#22201D" fontWeight="bold">Y</text>
        </g>

        {/* ========================================================
            LAYER 1 (BASE): FIBERGLASS FR-4 PCB SUBSTRATE
            ======================================================== */}
        {/* Isometric PCB polygon: Center (420, 310) */}
        <g transform="translate(30, 60)">
          {/* PCB Bottom Edge (Thickness) */}
          <path
            d="M 120 280 L 390 420 L 610 290 L 610 300 L 390 430 L 120 290 Z"
            fill="#B8AA94"
            stroke="#22201D"
            strokeWidth="1.2"
          />
          {/* Main PCB Plane Surface */}
          <polygon
            points="390,170 610,290 390,420 170,290"
            fill="#E5D9C5"
            stroke="#22201D"
            strokeWidth="1.4"
          />

          {/* Copper trace patterns and bus lines on PCB */}
          <g stroke="#71818B" strokeWidth="0.9" fill="none">
            {/* Bus Tracks */}
            <path d="M 230 280 L 320 330 L 370 330 L 370 360" />
            <path d="M 240 275 L 325 322 L 380 322 L 380 365" />
            <path d="M 250 270 L 330 315 L 390 315 L 390 370" />
            
            <path d="M 430 365 L 430 320 L 480 290 L 530 315" />
            <path d="M 440 370 L 440 325 L 485 295 L 535 320" />
            
            <path d="M 480 240 L 520 265 L 520 285" />
            <path d="M 470 235 L 510 260 L 510 280" />

            {/* Via holes */}
            <circle cx="370" cy="360" r="1.5" fill="#22201D" stroke="#D87535" strokeWidth="0.8" />
            <circle cx="380" cy="365" r="1.5" fill="#22201D" stroke="#D87535" strokeWidth="0.8" />
            <circle cx="390" cy="370" r="1.5" fill="#22201D" stroke="#D87535" strokeWidth="0.8" />
            <circle cx="430" cy="365" r="1.5" fill="#22201D" stroke="#D87535" strokeWidth="0.8" />
            <circle cx="440" cy="370" r="1.5" fill="#22201D" stroke="#D87535" strokeWidth="0.8" />
            <circle cx="530" cy="315" r="1.5" fill="#22201D" stroke="#D87535" strokeWidth="0.8" />
            <circle cx="520" cy="285" r="1.5" fill="#22201D" stroke="#D87535" strokeWidth="0.8" />
          </g>

          {/* Secondary SMD ICs on PCB */}
          {/* SOIC-8 Flash Memory */}
          <g transform="translate(260, 240)">
            <polygon points="40,20 65,33 45,43 20,30" fill="#38332E" stroke="#22201D" strokeWidth="1" />
            {/* Gull-wing pin leads */}
            <line x1="22" y1="28" x2="16" y2="25" stroke="#8C8275" strokeWidth="1.2" />
            <line x1="28" y1="31" x2="22" y2="28" stroke="#8C8275" strokeWidth="1.2" />
            <line x1="34" y1="34" x2="28" y2="31" stroke="#8C8275" strokeWidth="1.2" />
            <line x1="40" y1="37" x2="34" y2="34" stroke="#8C8275" strokeWidth="1.2" />
            <text x="30" y="32" fontFamily="IBM Plex Mono, monospace" fontSize="5" fill="#FAF5EB">SPI FLASH</text>
          </g>

          {/* Quartz Crystal Oscillator Resonator (16.000 MHz) */}
          <g transform="translate(470, 290)">
            <polygon points="25,12 45,22 30,30 10,20" fill="#D5C8B5" stroke="#22201D" strokeWidth="1" />
            <text x="14" y="22" fontFamily="IBM Plex Mono, monospace" fontSize="5" fill="#22201D" fontWeight="bold">16.0M</text>
          </g>

          {/* SMT Passive Components (0805 Capacitors & Resistors) */}
          <polygon points="340,380 350,385 344,388 334,383" fill="#D87535" stroke="#22201D" strokeWidth="0.8" />
          <polygon points="355,372 365,377 359,380 349,375" fill="#71818B" stroke="#22201D" strokeWidth="0.8" />
          <polygon points="420,380 430,385 424,388 414,383" fill="#71818B" stroke="#22201D" strokeWidth="0.8" />
          <polygon points="435,372 445,377 439,380 429,375" fill="#D87535" stroke="#22201D" strokeWidth="0.8" />

          {/* BGA / QFP Socket Landing Pads Grid on PCB */}
          <g transform="translate(390, 280)">
            <polygon points="0,-45 75,-2 0,42 -75,-2" fill="#D5C8B5" stroke="#22201D" strokeWidth="1" strokeDasharray="2 1" />
            {/* Center thermal ground pad */}
            <polygon points="0,-18 30,0 0,18 -30,0" fill="#B95D32" stroke="#22201D" strokeWidth="0.8" opacity="0.85" />
            {/* Perimeter contact pads */}
            <g stroke="#D87535" strokeWidth="1.2">
              <line x1="-50" y1="-15" x2="-40" y2="-9" />
              <line x1="-40" y1="-21" x2="-30" y2="-15" />
              <line x1="-30" y1="-27" x2="-20" y2="-21" />
              <line x1="-20" y1="-33" x2="-10" y2="-27" />
              
              <line x1="50" y1="-15" x2="40" y2="-9" />
              <line x1="40" y1="-21" x2="30" y2="-15" />
              <line x1="30" y1="-27" x2="20" y2="-21" />
              <line x1="20" y1="-33" x2="10" y2="-27" />

              <line x1="-50" y1="12" x2="-40" y2="6" />
              <line x1="-40" y1="18" x2="-30" y2="12" />
              <line x1="-30" y1="24" x2="-20" y2="18" />

              <line x1="50" y1="12" x2="40" y2="6" />
              <line x1="40" y1="18" x2="30" y2="12" />
              <line x1="30" y1="24" x2="20" y2="18" />
            </g>
          </g>
        </g>

        {/* ========================================================
            LAYER 2: SEPARATED EXPLODED PIN HEADER MATRIX
            ======================================================== */}
        <g transform="translate(420, 220)">
          {/* Exploded Pin Leads Flying in Space */}
          {[-45, -30, -15, 0, 15, 30, 45].map((xOffset, i) => (
            <g key={i} stroke="#22201D" strokeWidth="1">
              <line x1={xOffset * 1.3} y1={-15 + Math.abs(xOffset) * 0.3} x2={xOffset * 1.3} y2={10 + Math.abs(xOffset) * 0.3} stroke="#8C8275" strokeWidth="1" />
              <circle cx={xOffset * 1.3} cy={10 + Math.abs(xOffset) * 0.3} r="1.5" fill="#D87535" />
            </g>
          ))}
        </g>

        {/* ========================================================
            LAYER 3 (TOP): FLOATING MICROCONTROLLER DIE (IC)
            ======================================================== */}
        {/* Hovering IC package centered at (420, 100) */}
        <g transform="translate(420, 105)">
          {/* IC Side Shadow/Bevel (Thickness) */}
          <polygon
            points="-85,0 0,50 85,0 85,14 0,64 -85,14"
            fill="#2A2622"
            stroke="#22201D"
            strokeWidth="1.2"
          />
          {/* IC Top Face */}
          <polygon
            points="0,-50 85,0 0,50 -85,0"
            fill="#38332E"
            stroke="#22201D"
            strokeWidth="1.5"
          />

          {/* IC Inner Die Chamfer / Mold Line */}
          <polygon
            points="0,-40 68,0 0,40 -68,0"
            fill="#22201D"
            stroke="#655F55"
            strokeWidth="0.8"
          />

          {/* Pin 1 Index Dot */}
          <circle cx="-55" cy="0" r="3" fill="#D87535" stroke="#FAF5EB" strokeWidth="0.8" />

          {/* Etched MICROVERSE Monogram 'M' on Silicon Die */}
          <g transform="translate(0, 0)">
            {/* Technical angled 'M' logo */}
            <path
              d="M -22 10 L -12 -18 L 0 -2 L 12 -18 L 22 10"
              fill="none"
              stroke="#FAF5EB"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Silicon Model Stamp Text */}
            <text
              x="0"
              y="18"
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="6.5"
              fill="#C9BDAA"
              letterSpacing="1.5"
            >
              MV-CORTEX-M4 // 168MHz
            </text>
          </g>

          {/* Radiating Pins on Top Chip Edges */}
          <g stroke="#C9BDAA" strokeWidth="1.4">
            {/* Left-top pins */}
            {[-60, -45, -30, -15].map((val, idx) => (
              <line key={`lt-${idx}`} x1={val} y1={val * 0.58} x2={val - 8} y2={(val - 8) * 0.58} stroke="#8C8275" />
            ))}
            {/* Right-top pins */}
            {[15, 30, 45, 60].map((val, idx) => (
              <line key={`rt-${idx}`} x1={val} y1={-val * 0.58} x2={val + 8} y2={-(val + 8) * 0.58} stroke="#8C8275" />
            ))}
            {/* Left-bottom pins */}
            {[-60, -45, -30, -15].map((val, idx) => (
              <line key={`lb-${idx}`} x1={val} y1={-val * 0.58} x2={val - 8} y2={-(val - 8) * 0.58} stroke="#8C8275" />
            ))}
            {/* Right-bottom pins */}
            {[15, 30, 45, 60].map((val, idx) => (
              <line key={`rb-${idx}`} x1={val} y1={val * 0.58} x2={val + 8} y2={(val + 8) * 0.58} stroke="#8C8275" />
            ))}
          </g>
        </g>

        {/* ========================================================
            TECHNICAL CALLOUTS, DIAGRAM BOX & HANDWRITTEN NOTES
            ======================================================== */}
        {/* 1. Microcontroller Definition Note (Top Left of Sketch) */}
        <g transform="translate(20, 30)">
          <text fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#22201D" fontWeight="bold" letterSpacing="0.5">
            MICROCONTROLLER
          </text>
          <text fontFamily="Inter, sans-serif" fontSize="9" fill="#655F55" y="14">
            The brain of embedded systems.
          </text>
          <text fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#D87535" y="30">
            • Process
          </text>
          <text fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#D87535" y="42">
            • Control
          </text>
          <text fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#D87535" y="54">
            • Execute
          </text>
        </g>

        {/* 2. System Architecture Box (Top Right of Sketch) */}
        <g transform="translate(480, 25)">
          <rect x="0" y="0" width="180" height="65" fill="#FAF5EB" stroke="#C9BDAA" strokeWidth="1" />
          <text x="12" y="14" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#22201D" fontWeight="bold">
            SYSTEM ARCHITECTURE
          </text>
          
          {/* Signal Flow Block Diagram */}
          <g transform="translate(10, 24)">
            {/* Sensors Block */}
            <rect x="0" y="0" width="44" height="22" fill="#EDE1CE" stroke="#C9BDAA" strokeWidth="0.8" />
            <text x="22" y="14" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#22201D">
              Sensors
            </text>

            <line x1="44" y1="11" x2="55" y2="11" stroke="#D87535" strokeWidth="1" markerEnd="url(#arrow)" />
            <polygon points="56,11 52,9 52,13" fill="#D87535" />

            {/* MCU Block */}
            <rect x="58" y="0" width="38" height="22" fill="#22201D" stroke="#22201D" strokeWidth="0.8" />
            <text x="77" y="14" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#FAF5EB" fontWeight="bold">
              MCU
            </text>

            <line x1="96" y1="11" x2="107" y2="11" stroke="#D87535" strokeWidth="1" />
            <polygon points="108,11 104,9 104,13" fill="#D87535" />

            {/* Actuators Block */}
            <rect x="110" y="0" width="48" height="22" fill="#EDE1CE" stroke="#C9BDAA" strokeWidth="0.8" />
            <text x="134" y="14" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#22201D">
              Actuators
            </text>
          </g>
        </g>

        {/* 3. Handwritten Cursive Note */}
        <g transform="translate(520, 130) rotate(-6)">
          <text fontFamily="Caveat, cursive" fontSize="18" fill="#B95D32" fontWeight="600">
            Small chip.
          </text>
          <text fontFamily="Caveat, cursive" fontSize="20" fill="#D87535" fontWeight="700" y="20">
            Big possibilities.
          </text>
          <path d="M 0 45 L 85 45" stroke="#D87535" strokeWidth="1.2" strokeDasharray="3 2" />
        </g>

        {/* 4. Technical Blueprint Stamp in Corner */}
        <g transform="translate(560, 440)">
          <text fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#8C8275">
            // v1.1.0
          </text>
          <text fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#8C8275" y="12">
            MICROVERSE // DWG.802
          </text>
        </g>
      </svg>
    </div>
  );
}

