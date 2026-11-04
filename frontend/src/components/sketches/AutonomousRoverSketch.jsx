import React from 'react';

export function AutonomousRoverSketch({ className = '' }) {
  return (
    <div className={`relative w-full h-44 flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-40"
      >
        {/* Ground level and perspective guides */}
        <g stroke="#C9BDAA" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6">
          <line x1="20" y1="165" x2="260" y2="165" />
          <line x1="60" y1="180" x2="220" y2="150" />
        </g>

        {/* Autonomous Mobile Rover Geometry */}
        <g transform="translate(10, -5)">
          {/* Rear Wheels */}
          {/* Left Rear Wheel */}
          <g transform="translate(65, 145)">
            <ellipse cx="0" cy="0" rx="14" ry="22" fill="#22201D" stroke="#22201D" strokeWidth="1.2" />
            <ellipse cx="0" cy="0" rx="9" ry="15" fill="#D5C8B5" stroke="#C9BDAA" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3" fill="#D87535" />
            {/* Treads */}
            <line x1="-12" y1="-8" x2="-8" y2="-12" stroke="#FAF5EB" strokeWidth="0.8" />
            <line x1="-12" y1="8" x2="-8" y2="12" stroke="#FAF5EB" strokeWidth="0.8" />
          </g>

          {/* Right Rear Wheel (perspective offset) */}
          <g transform="translate(115, 130)">
            <ellipse cx="0" cy="0" rx="11" ry="18" fill="#38332E" stroke="#22201D" strokeWidth="1" />
            <ellipse cx="0" cy="0" rx="6" ry="11" fill="#EDE1CE" stroke="#C9BDAA" strokeWidth="0.6" />
          </g>

          {/* Chassis Suspension Bogie Struts */}
          <path d="M 65 145 L 90 120 L 140 120" stroke="#22201D" strokeWidth="2" fill="none" />
          <path d="M 140 120 L 175 145" stroke="#22201D" strokeWidth="2" fill="none" />
          <path d="M 140 120 L 210 135" stroke="#22201D" strokeWidth="1.6" fill="none" />

          {/* Main Chassis Deck Body (slanted isometric box) */}
          <polygon
            points="85,110 185,100 205,125 105,135"
            fill="#EDE1CE"
            stroke="#22201D"
            strokeWidth="1.2"
          />
          {/* Deck Depth/Thickness */}
          <polygon
            points="85,110 105,135 105,145 85,120"
            fill="#B8AA94"
            stroke="#22201D"
            strokeWidth="1.2"
          />
          <polygon
            points="105,135 205,125 205,135 105,145"
            fill="#D5C8B5"
            stroke="#22201D"
            strokeWidth="1.2"
          />

          {/* Mounted Silicon Controller Board on Deck */}
          <g transform="translate(115, 110)">
            <polygon points="10,0 55,-5 65,12 20,17" fill="#87945B" stroke="#22201D" strokeWidth="0.9" />
            {/* MCU Chip on Board */}
            <polygon points="25,2 45,-1 50,7 30,10" fill="#22201D" stroke="#FAF5EB" strokeWidth="0.6" />
            {/* Status LED blinker */}
            <circle cx="20" cy="5" r="1.5" fill="#D87535" />
          </g>

          {/* Front Wheels */}
          {/* Left Front Wheel */}
          <g transform="translate(175, 148)">
            <ellipse cx="0" cy="0" rx="14" ry="22" fill="#22201D" stroke="#22201D" strokeWidth="1.2" />
            <ellipse cx="0" cy="0" rx="9" ry="15" fill="#D5C8B5" stroke="#C9BDAA" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3" fill="#D87535" />
          </g>

          {/* Right Front Wheel */}
          <g transform="translate(215, 136)">
            <ellipse cx="0" cy="0" rx="11" ry="18" fill="#38332E" stroke="#22201D" strokeWidth="1" />
            <ellipse cx="0" cy="0" rx="6" ry="11" fill="#EDE1CE" stroke="#C9BDAA" strokeWidth="0.6" />
          </g>

          {/* Sensor Mast / Ultrasonic Sonar Head Tower */}
          <g transform="translate(170, 100)">
            {/* Mast Pole */}
            <line x1="0" y1="0" x2="0" y2="-32" stroke="#22201D" strokeWidth="2" />
            {/* Crossbar */}
            <line x1="-12" y1="-32" x2="12" y2="-32" stroke="#22201D" strokeWidth="1.5" />
            {/* Sonar Sensor Eyes (HC-SR04 Transducers) */}
            <rect x="-14" y="-42" width="28" height="15" rx="2" fill="#38332E" stroke="#22201D" strokeWidth="1.1" />
            {/* Left Eye Transmitter */}
            <circle cx="-6" cy="-35" r="4.5" fill="#D5C8B5" stroke="#22201D" strokeWidth="0.8" />
            <circle cx="-6" cy="-35" r="2" fill="#22201D" />
            {/* Right Eye Receiver */}
            <circle cx="6" cy="-35" r="4.5" fill="#D5C8B5" stroke="#22201D" strokeWidth="0.8" />
            <circle cx="6" cy="-35" r="2" fill="#22201D" />
            {/* Sonar wave radiation cones */}
            <path d="M 14 -40 A 12 12 0 0 1 14 -30" stroke="#D87535" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
            <path d="M 20 -44 A 18 18 0 0 1 20 -26" stroke="#D87535" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          </g>

          {/* Helical Radio Antenna */}
          <path d="M 95 110 L 95 80 L 97 78 L 93 75 L 97 72 L 95 70" stroke="#71818B" strokeWidth="1.2" fill="none" />
        </g>

        {/* Technical Callout Annotations */}
        <g fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#8C8275">
          <text x="35" y="65">HC-SR04 // SONAR</text>
          <text x="175" y="185">4-WHEEL DRIVE KINEMATICS</text>
        </g>
      </svg>
    </div>
  );
}

