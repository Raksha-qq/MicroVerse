import React from 'react';

export function RoboticArmSketch({ className = '' }) {
  return (
    <div className={`relative w-full h-44 flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-40"
      >
        {/* Subtle construction and measurement marks */}
        <g stroke="#C9BDAA" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6">
          <line x1="30" y1="180" x2="250" y2="180" />
          <line x1="110" y1="20" x2="110" y2="180" />
          {/* Kinematic degree arc */}
          <path d="M 85 90 A 35 35 0 0 1 140 70" />
        </g>

        {/* Robotic Arm Mechanical Geometry */}
        <g transform="translate(10, 0)">
          {/* Base Platform / Turntable Mount */}
          <g transform="translate(100, 160)">
            {/* Ground Plate */}
            <ellipse cx="0" cy="15" rx="38" ry="10" fill="#EDE1CE" stroke="#22201D" strokeWidth="1.2" />
            {/* Turntable Cylinder */}
            <path d="M -30 15 L -30 0 C -30 -6 30 -6 30 0 L 30 15 Z" fill="#D5C8B5" stroke="#22201D" strokeWidth="1.2" />
            <ellipse cx="0" cy="0" rx="30" ry="7" fill="#FAF5EB" stroke="#22201D" strokeWidth="1" />
            {/* Mounting Bolt Ticks */}
            <circle cx="-18" cy="1" r="1.5" fill="#22201D" />
            <circle cx="18" cy="1" r="1.5" fill="#22201D" />
            <circle cx="0" cy="4" r="1.5" fill="#22201D" />
          </g>

          {/* Shoulder Joint Pivot (J1) */}
          <g transform="translate(100, 135)">
            {/* Pivot bracket */}
            <rect x="-14" y="-14" width="28" height="28" rx="3" fill="#38332E" stroke="#22201D" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="8" fill="#FAF5EB" stroke="#22201D" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="3" fill="#D87535" />
          </g>

          {/* Lower Arm Bicep Link (slanted up-right to elbow) */}
          <g>
            <path
              d="M 94 130 L 122 75 L 138 82 L 108 136 Z"
              fill="#EDE1CE"
              stroke="#22201D"
              strokeWidth="1.2"
            />
            {/* Weight-reduction truss cutout slots */}
            <polygon points="102,126 120,86 126,89 108,129" fill="#FAF5EB" stroke="#C9BDAA" strokeWidth="0.8" />
            {/* Servo Cable Conduit */}
            <path d="M 98 140 Q 120 115 132 80" stroke="#71818B" strokeWidth="1" strokeDasharray="3 1" fill="none" />
          </g>

          {/* Elbow Actuator Joint (J2) */}
          <g transform="translate(130, 78)">
            <circle cx="0" cy="0" r="13" fill="#22201D" stroke="#22201D" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="8" fill="#D5C8B5" stroke="#C9BDAA" strokeWidth="1" />
            {/* Gear teeth hints */}
            <circle cx="0" cy="0" r="3" fill="#D87535" />
            <text x="16" y="4" fontFamily="IBM Plex Mono, monospace" fontSize="6.5" fill="#8C8275">J2: 120°</text>
          </g>

          {/* Forearm Link (pointing forward/down towards wrist) */}
          <g>
            <path
              d="M 134 72 L 185 88 L 180 102 L 128 85 Z"
              fill="#EDE1CE"
              stroke="#22201D"
              strokeWidth="1.2"
            />
            <polygon points="140,78 174,89 171,96 137,85" fill="#FAF5EB" stroke="#C9BDAA" strokeWidth="0.8" />
          </g>

          {/* Wrist Joint (J3) */}
          <g transform="translate(182, 95)">
            <rect x="-6" y="-8" width="12" height="16" rx="2" fill="#38332E" stroke="#22201D" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="3" fill="#D87535" />
          </g>

          {/* Parallel Gripper End-Effector */}
          <g transform="translate(188, 95)">
            {/* Gripper Base Plate */}
            <path d="M 0 -7 L 12 -12 L 12 12 L 0 7 Z" fill="#D5C8B5" stroke="#22201D" strokeWidth="1.1" />
            {/* Top Finger Claw */}
            <path d="M 12 -10 L 25 -14 L 30 -8 L 22 -6 L 12 -6 Z" fill="#22201D" stroke="#22201D" strokeWidth="1" />
            {/* Bottom Finger Claw */}
            <path d="M 12 10 L 25 14 L 30 8 L 22 6 L 12 6 Z" fill="#22201D" stroke="#22201D" strokeWidth="1" />
            {/* Grip payload target line */}
            <line x1="28" y1="-5" x2="28" y2="5" stroke="#D87535" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          </g>
        </g>

        {/* Annotation & Degree Labels */}
        <g fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#8C8275">
          <text x="35" y="145">BASE // ROT.360°</text>
          <text x="180" y="55">END-EFFECTOR</text>
        </g>
      </svg>
    </div>
  );
}

