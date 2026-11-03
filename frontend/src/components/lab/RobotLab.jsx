import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  ShieldAlert,
  Activity,
  Plus,
  Trash2,
  Info,
  CheckCircle2,
  Zap,
  Navigation
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export function RobotLab({ onSaveConfig, initialConfig }) {
  // Arena & Robot Parameters
  const [speed, setSpeed] = useState(initialConfig?.speed ?? 45); // px per second
  const [detectionThreshold, setDetectionThreshold] = useState(initialConfig?.detectionThreshold ?? 65); // px
  const [policy, setPolicy] = useState(initialConfig?.policy ?? 'AVOID_AND_TURN'); // 'STOP' | 'AVOID_AND_TURN' | 'WALL_FOLLOWER'
  const [isRunning, setIsRunning] = useState(false);

  // Live Telemetry
  const [robotState, setRobotState] = useState('STOPPED');
  const [sensorDistances, setSensorDistances] = useState({ left: 150, front: 150, right: 150 });
  const [motorCommands, setMotorCommands] = useState({
    dirL: 'FWD',
    pwmL: 0,
    dirR: 'FWD',
    pwmR: 0,
  });

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Robot Pose Ref
  const robotRef = useRef({
    x: 100,
    y: 150,
    angle: 0, // radians
    radius: 18,
    state: 'STOPPED',
    turnTimer: 0,
    turnDirection: 1, // 1 for right, -1 for left
  });

  // Obstacles list [{ x, y, radius }]
  const obstaclesRef = useRef([
    { x: 280, y: 150, radius: 30 },
    { x: 420, y: 100, radius: 25 },
    { x: 400, y: 240, radius: 35 },
    { x: 180, y: 260, radius: 25 },
  ]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    robotRef.current = {
      x: 100,
      y: 150,
      angle: 0,
      radius: 18,
      state: 'STOPPED',
      turnTimer: 0,
      turnDirection: 1,
    };
    setRobotState('STOPPED');
    setSensorDistances({ left: 150, front: 150, right: 150 });
    setMotorCommands({ dirL: 'FWD', pwmL: 0, dirR: 'FWD', pwmR: 0 });
  };

  // Add obstacle on click
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked near an existing obstacle to delete it
    const existingIndex = obstaclesRef.current.findIndex(
      (ob) => Math.hypot(ob.x - x, ob.y - y) < ob.radius + 10
    );

    if (existingIndex >= 0) {
      obstaclesRef.current.splice(existingIndex, 1);
    } else {
      // Add new obstacle
      obstaclesRef.current.push({
        x,
        y,
        radius: Math.floor(Math.random() * 15) + 20,
      });
    }
  };

  // Clear obstacles
  const handleClearObstacles = () => {
    obstaclesRef.current = [];
  };

  // Raycast distance calculation helper
  const castRay = (originX, originY, angleRad, maxRange, obstacles, bounds) => {
    const step = 2;
    for (let r = 0; r < maxRange; r += step) {
      const cx = originX + r * Math.cos(angleRad);
      const cy = originY + r * Math.sin(angleRad);

      // Check arena walls
      if (cx <= 0 || cx >= bounds.w || cy <= 0 || cy >= bounds.h) {
        return r;
      }

      // Check circular obstacles
      for (const ob of obstacles) {
        if (Math.hypot(ob.x - cx, ob.y - cy) <= ob.radius) {
          return r;
        }
      }
    }
    return maxRange;
  };

  // Simulation physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      const r = robotRef.current;
      const obstacles = obstaclesRef.current;
      const maxSensorRange = 160;

      // 1. Raycast 3 Sensors (Front, Left -35 deg, Right +35 deg)
      const rayFront = castRay(r.x, r.y, r.angle, maxSensorRange, obstacles, { w, h });
      const rayLeft = castRay(r.x, r.y, r.angle - 0.6, maxSensorRange, obstacles, { w, h });
      const rayRight = castRay(r.x, r.y, r.angle + 0.6, maxSensorRange, obstacles, { w, h });

      // 2. Behavioral Policy Execution
      let linearVel = 0;
      let angularVel = 0;
      let stateName = 'FORWARD';
      let cmdDirL = 'FWD';
      let cmdPwmL = 0;
      let cmdDirR = 'FWD';
      let cmdPwmR = 0;

      if (isRunning) {
        if (policy === 'STOP') {
          // Policy 1: Reactive Stop
          if (rayFront < detectionThreshold) {
            stateName = 'STOPPED (OBSTACLE DETECTED)';
            linearVel = 0;
            angularVel = 0;
            cmdPwmL = 0;
            cmdPwmR = 0;
          } else {
            stateName = 'FORWARD CRUISE';
            linearVel = speed;
            angularVel = 0;
            cmdPwmL = Math.round((speed / 80) * 255);
            cmdPwmR = Math.round((speed / 80) * 255);
          }
        } else if (policy === 'AVOID_AND_TURN') {
          // Policy 2: Reactive Obstacle Avoidance & Turning
          if (r.turnTimer > 0) {
            // In active evasion maneuver
            r.turnTimer -= dt;
            stateName = r.turnDirection > 0 ? 'TURNING RIGHT' : 'TURNING LEFT';
            linearVel = speed * 0.2;
            angularVel = r.turnDirection * 2.2;

            if (r.turnDirection > 0) {
              cmdDirL = 'FWD';
              cmdPwmL = 200;
              cmdDirR = 'REV';
              cmdPwmR = 200;
            } else {
              cmdDirL = 'REV';
              cmdPwmL = 200;
              cmdDirR = 'FWD';
              cmdPwmR = 200;
            }
          } else if (rayFront < detectionThreshold || rayLeft < detectionThreshold * 0.7 || rayRight < detectionThreshold * 0.7) {
            // Trigger new evasion turn towards the open direction
            r.turnTimer = 0.65; // turn duration in seconds
            r.turnDirection = rayLeft > rayRight ? -1 : 1;
            stateName = 'OBSTACLE DETECTED -> EVADING';
            linearVel = 0;
            angularVel = r.turnDirection * 2.2;
          } else {
            stateName = 'AUTONOMOUS FORWARD';
            linearVel = speed;
            angularVel = 0;
            cmdPwmL = Math.round((speed / 80) * 255);
            cmdPwmR = Math.round((speed / 80) * 255);
          }
        } else if (policy === 'WALL_FOLLOWER') {
          // Policy 3: Wall Following / Boundary Exploration
          const targetStandoff = detectionThreshold;
          if (rayFront < targetStandoff * 0.8) {
            // Impending head-on collision, turn hard
            stateName = 'CORNER DETECTED (PIVOT)';
            linearVel = speed * 0.2;
            angularVel = 2.0;
            cmdDirL = 'FWD';
            cmdPwmL = 180;
            cmdDirR = 'REV';
            cmdPwmR = 180;
          } else {
            // Modulate right vs left wheels based on right ray clearance
            const error = rayRight - targetStandoff;
            angularVel = Math.max(-1.5, Math.min(1.5, error * 0.05));
            linearVel = speed * 0.75;
            stateName = 'WALL FOLLOWING';
            cmdPwmL = Math.round(Math.max(0, Math.min(255, 160 + angularVel * 50)));
            cmdPwmR = Math.round(Math.max(0, Math.min(255, 160 - angularVel * 50)));
          }
        }

        // Integrate pose
        r.angle += angularVel * dt;
        r.x += linearVel * Math.cos(r.angle) * dt;
        r.y += linearVel * Math.sin(r.angle) * dt;

        // Arena boundary collision clamp
        r.x = Math.max(r.radius + 2, Math.min(w - r.radius - 2, r.x));
        r.y = Math.max(r.radius + 2, Math.min(h - r.radius - 2, r.y));
      }

      // Sync state to UI (throttled)
      r.state = stateName;
      setRobotState(stateName);
      setSensorDistances({
        left: Math.round(rayLeft),
        front: Math.round(rayFront),
        right: Math.round(rayRight),
      });
      setMotorCommands({
        dirL: cmdDirL,
        pwmL: cmdPwmL,
        dirR: cmdDirR,
        pwmR: cmdPwmR,
      });

      // 3. Render Canvas Frame
      ctx.clearRect(0, 0, w, h);

      // Arena Grid
      ctx.strokeStyle = 'rgba(25, 43, 64, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Obstacles
      for (const ob of obstacles) {
        ctx.fillStyle = '#192B40';
        ctx.strokeStyle = '#55C7FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ob.x, ob.y, ob.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Inner hatch
        ctx.fillStyle = 'rgba(85, 199, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(ob.x, ob.y, ob.radius * 0.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw Sensor Rangefinder Rays
      const drawRay = (angOffset, dist, color) => {
        const actualAng = r.angle + angOffset;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + dist * Math.cos(actualAng), r.y + dist * Math.sin(actualAng));
        ctx.stroke();

        // Target impact dot
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(
          r.x + dist * Math.cos(actualAng),
          r.y + dist * Math.sin(actualAng),
          3,
          0,
          2 * Math.PI
        );
        ctx.fill();
      };

      const frontColor = rayFront < detectionThreshold ? '#F87171' : 'rgba(85, 199, 255, 0.6)';
      const leftColor = rayLeft < detectionThreshold ? '#F87171' : 'rgba(165, 227, 255, 0.5)';
      const rightColor = rayRight < detectionThreshold ? '#F87171' : 'rgba(16, 185, 129, 0.5)';

      drawRay(0, rayFront, frontColor);
      drawRay(-0.6, rayLeft, leftColor);
      drawRay(+0.6, rayRight, rightColor);

      // Draw Detection Threshold Arc
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(r.x, r.y, detectionThreshold, r.angle - 0.7, r.angle + 0.7);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Robot Chassis
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(r.angle);

      // Wheels
      ctx.fillStyle = '#8FA6BC';
      ctx.fillRect(-12, -r.radius - 4, 24, 6); // Left wheel
      ctx.fillRect(-12, r.radius - 2, 24, 6);  // Right wheel

      // Body circle
      ctx.fillStyle = '#0B1220';
      ctx.strokeStyle = isRunning ? '#55C7FF' : '#8FA6BC';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Heading direction arrow
      ctx.strokeStyle = '#55C7FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r.radius + 6, 0);
      ctx.stroke();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isRunning, speed, detectionThreshold, policy]);

  return (
    <div className="space-y-6">
      {/* Simulation Controls & Parameters Bar */}
      <div className="rounded-2xl border border-[#192B40] bg-[#111E30]/70 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#192B40] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF] uppercase tracking-wider mb-1">
              <Bot className="w-3.5 h-3.5" />
              Autonomous Kinematics & Decision Engine
            </div>
            <h3 className="font-heading text-xl font-bold text-[#EAF5FF]">
              2D Obstacle-Avoiding Mobile Robot Simulation
            </h3>
            <p className="text-xs text-[#8FA6BC] mt-0.5">
              Observe how algorithmic decision rules translate into low-level H-bridge motor commands. Click canvas to add/remove obstacles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isRunning ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-1.5"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? 'Pause Robot' : 'Start Autonomous Run'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} title="Reset robot position">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearObstacles} title="Clear all obstacles">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
            {onSaveConfig && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onSaveConfig({
                    experimentType: 'ROBOT',
                    title: `Robot Lab: ${policy} @ ${speed}px/s`,
                    configState: { speed, detectionThreshold, policy },
                  })
                }
              >
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          {/* Policy Selector */}
          <div className="space-y-1.5 bg-[#0B1220] p-3 rounded-xl border border-[#192B40]">
            <span className="text-[#8FA6BC]">PROGRAMMED BEHAVIOR (POLICY):</span>
            <select
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              className="w-full bg-[#111E30] border border-[#192B40] focus:border-[#55C7FF] rounded-lg p-2 text-xs text-[#EAF5FF] outline-none font-mono"
            >
              <option value="STOP">Policy 1: Basic Reactive Stop</option>
              <option value="AVOID_AND_TURN">Policy 2: Reactive Obstacle Avoidance & Turn</option>
              <option value="WALL_FOLLOWER">Policy 3: Wall Following & Boundary Explorer</option>
            </select>
          </div>

          {/* Speed Slider */}
          <div className="space-y-1.5 bg-[#0B1220] p-3 rounded-xl border border-[#192B40]">
            <div className="flex justify-between">
              <span className="text-[#8FA6BC]">ROBOT SPEED:</span>
              <span className="text-[#55C7FF] font-bold">{speed} px/s</span>
            </div>
            <input
              type="range"
              min="15"
              max="80"
              step="5"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#192B40] rounded-lg appearance-none cursor-pointer accent-[#55C7FF]"
            />
            <div className="text-[10px] text-[#8FA6BC]">Linear Velocity PWM Multiplier</div>
          </div>

          {/* Detection Threshold Slider */}
          <div className="space-y-1.5 bg-[#0B1220] p-3 rounded-xl border border-[#192B40]">
            <div className="flex justify-between">
              <span className="text-[#8FA6BC]">DETECTION DISTANCE:</span>
              <span className="text-[#A5E3FF] font-bold">{detectionThreshold} px</span>
            </div>
            <input
              type="range"
              min="30"
              max="120"
              step="5"
              value={detectionThreshold}
              onChange={(e) => setDetectionThreshold(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#192B40] rounded-lg appearance-none cursor-pointer accent-[#A5E3FF]"
            />
            <div className="text-[10px] text-[#8FA6BC]">Sonar Trigger Radius Horizon</div>
          </div>
        </div>
      </div>

      {/* 2D Arena Canvas Display */}
      <div className="rounded-2xl border border-[#192B40] bg-[#0B1220] overflow-hidden shadow-2xl relative">
        <div className="px-4 py-2.5 bg-[#111E30] border-b border-[#192B40] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#55C7FF]">
            <Navigation className="w-3.5 h-3.5" />
            <span>2D MECHATRONIC TEST ARENA (CLICK TO ADD / REMOVE OBSTACLES)</span>
          </div>
          <Badge variant={robotState.includes('AVOID') || robotState.includes('TURN') ? 'amber' : isRunning ? 'emerald' : 'cyan'}>
            STATE: {robotState}
          </Badge>
        </div>

        <div className="p-2 relative flex justify-center">
          <canvas
            ref={canvasRef}
            width={760}
            height={360}
            onClick={handleCanvasClick}
            className="w-full max-w-full h-72 sm:h-80 block cursor-crosshair rounded-lg"
          />
        </div>
      </div>

      {/* Live Telemetry & Low-Level Driver Signal Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        {/* Telemetry 1: Sonar Rangefinders */}
        <div className="p-4 rounded-xl border border-[#192B40] bg-[#111E30]/70 space-y-2">
          <div className="text-[10px] text-[#8FA6BC] uppercase tracking-wider font-semibold">
            SONAR RANGEFINDERS (PX)
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[#8FA6BC]">Left (-35°):</span>
              <span className="text-[#A5E3FF] font-bold">{sensorDistances.left} px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8FA6BC]">Front (0°):</span>
              <span className={`font-bold ${sensorDistances.front < detectionThreshold ? 'text-rose-400' : 'text-[#55C7FF]'}`}>
                {sensorDistances.front} px
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8FA6BC]">Right (+35°):</span>
              <span className="text-[#10B981] font-bold">{sensorDistances.right} px</span>
            </div>
          </div>
        </div>

        {/* Telemetry 2: Controller State */}
        <div className="p-4 rounded-xl border border-[#192B40] bg-[#111E30]/70 space-y-2">
          <div className="text-[10px] text-[#8FA6BC] uppercase tracking-wider font-semibold">
            CONTROLLER DECISION STATE
          </div>
          <div className="font-heading text-sm font-bold text-[#55C7FF] pt-1">
            {robotState}
          </div>
          <div className="text-[10px] text-[#8FA6BC]">
            Loop Rate: 60 Hz • Zero Polling Jitter
          </div>
        </div>

        {/* Telemetry 3: Left Motor Driver Pin Output */}
        <div className="p-4 rounded-xl border border-[#192B40] bg-[#111E30]/70 space-y-2">
          <div className="text-[10px] text-[#8FA6BC] uppercase tracking-wider font-semibold">
            LEFT MOTOR DRIVER (CH-A)
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#8FA6BC]">DIR_A Pin:</span>
            <span className="text-[#EAF5FF] font-bold">{motorCommands.dirL}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8FA6BC]">PWM_A (0-255):</span>
            <span className="text-[#55C7FF] font-bold">{motorCommands.pwmL}</span>
          </div>
        </div>

        {/* Telemetry 4: Right Motor Driver Pin Output */}
        <div className="p-4 rounded-xl border border-[#192B40] bg-[#111E30]/70 space-y-2">
          <div className="text-[10px] text-[#8FA6BC] uppercase tracking-wider font-semibold">
            RIGHT MOTOR DRIVER (CH-B)
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#8FA6BC]">DIR_B Pin:</span>
            <span className="text-[#EAF5FF] font-bold">{motorCommands.dirR}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8FA6BC]">PWM_B (0-255):</span>
            <span className="text-[#10B981] font-bold">{motorCommands.pwmR}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

