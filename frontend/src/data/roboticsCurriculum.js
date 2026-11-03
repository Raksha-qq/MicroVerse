export const ROBOTICS_MODULES = [
  {
    id: "embedded-systems-fundamentals",
    moduleNumber: 1,
    title: "What is an Embedded System?",
    category: "Foundations",
    summary: "Dedicated computational hardware engineered to execute specific real-time control functions within physical machines.",
    technicalDefinition: "A microprocessor- or microcontroller-based system of hardware and software designed to perform dedicated functions within a larger mechanical or electrical system, often constrained by real-time computing constraints, power consumption, memory, and physical dimensions.",
    coreConcepts: [
      "Dedicated Purpose vs General-Purpose Computing",
      "Deterministic Execution & Real-Time Deadlines",
      "Resource Constraints (Flash, SRAM, Clock)",
      "Continuous Superloop vs Event-Driven RTOS Architecture"
    ],
    explanation: `Unlike personal computers designed to run arbitrary software applications, embedded systems are engineered for dedicated, uninterrupted operation. In robotics, an embedded system interfaces directly with electrical and mechanical domains, reading transducers, executing mathematical state estimators, and modulating motor drives.

An embedded system consists of three interlocked layers:
1. Silicon Hardware: The microcontroller (ALU, registers, memory, timers, ADC, serial peripherals).
2. Firmware: Bare-metal C/C++ or an RTOS kernel running directly on the hardware with no intermediate operating system layer.
3. Electrical Interface: Transceiver ICs, gate drivers, voltage level shifters, and analog signal conditioning circuits connecting silicon logic to physical actuators.`,
    roboticsContext: "Every robotic joint, gripper, and sensor head contains an embedded controller responsible for microsecond-level current regulation and encoder tracking.",
    keyTakeaway: "Embedded systems prioritize deterministic reliability and predictable timing over raw peak computational throughput."
  },
  {
    id: "microcontrollers-in-robotics",
    moduleNumber: 2,
    title: "Role of Microcontrollers in Robotics",
    category: "Foundations",
    summary: "The deterministic nervous system orchestrating low-level sensor sampling, commutation, and actuator safety.",
    technicalDefinition: "Microcontrollers serve as the physical interface layer in robotic systems, converting digital setpoints into analog or modulated electrical signals while sampling kinematic feedback with microsecond determinism.",
    coreConcepts: [
      "Deterministic Signal Timing (Zero OS Jitter)",
      "Direct Register-Level Peripheral Access",
      "Hardware Interrupt Latency (sub-microsecond response)",
      "Safety Critical Watchdogs & Fail-Safe Interlocks"
    ],
    explanation: `In modern robotics architectures, computing is partitioned into a multi-tier hierarchy:
- High-Level Perception & Planning: Executed on Single-Board Computers (SBCs) or Edge GPUs (e.g. NVIDIA Jetson, Raspberry Pi 5) running Linux and ROS 2.
- Low-Level Control: Executed on microcontrollers (e.g. STM32, ESP32, RP2040) running bare metal or an RTOS.

Microcontrollers excel at tasks where a missed millisecond deadline results in physical instability or mechanical destruction:
- Pulse-Width Modulation (PWM) generation for BLDC motor inverters.
- Hardware quadrature encoder decoding without CPU polling overhead.
- Direct analog current shunt sampling via high-speed SAR ADCs.
- Emergency hardware shutoff triggers via hardware break inputs on advanced timers.`,
    roboticsContext: "When an industrial robotic arm detects an unexpected joint torque spike, the microcontroller can halt the motor inverter in under 1 microsecond, long before the high-level Linux host processes the frame.",
    keyTakeaway: "Microcontrollers handle the millisecond and microsecond deadlines that ensure physical stability, leaving perception and path planning to host processors."
  },
  {
    id: "sensors-and-sensor-data",
    moduleNumber: 3,
    title: "Sensors and Sensor Data",
    category: "Perception & Sensing",
    summary: "Transducing physical phenomena into discrete electrical signals and digital frames.",
    technicalDefinition: "Sensors convert physical parameters (temperature, pressure, magnetic flux, optical reflection, acceleration) into electrical quantities (voltage, current, resistance, frequency) which are subsequently digitized and sampled by the microcontroller.",
    coreConcepts: [
      "Analog vs Digital Sensors",
      "ADC Quantization, Resolution & Sampling Rate",
      "Sensor Noise, Thermal Drift & Calibration Offsets",
      "Bus Communication: I2C, SPI, and Analog Voltage Dividers"
    ],
    explanation: `Robots must perceive both their internal state (proprioception) and the external environment (exteroception):
- Proprioceptive Sensors: Joint encoders, IMUs (accelerometers and gyroscopes), current-sensing shunts, and motor thermistors.
- Exteroceptive Sensors: Ultrasonic transceivers, infrared time-of-flight (ToF) sensors, tactile force pads, and optical flow sensors.

When reading an analog sensor, the microcontroller's internal Analog-to-Digital Converter (ADC) samples the continuous voltage and maps it to a discrete digital integer:
$$\\text{Digital Value} = \\text{floor}\\left(\\frac{V_{\\text{in}}}{V_{\\text{ref}}} \\times (2^N - 1)\\right)$$
where $N$ is the ADC bit resolution (e.g., 10-bit on AVR, 12-bit on STM32).`,
    roboticsContext: "An inertial measurement unit (IMU) like the MPU6050 transmits 6-axis acceleration and angular rate vectors over an I2C bus at 400kHz, providing the raw telemetry needed for flight stabilizers and bipedal walkers.",
    keyTakeaway: "Sensor data is inherently noisy and requires calibration, filtering, and electrical decoupling before it can guide robotic action."
  },
  {
    id: "actuators-in-robotics",
    moduleNumber: 4,
    title: "Actuators: Converting Electricity to Motion",
    category: "Actuation & Mechanics",
    summary: "The muscles of robots: DC motors, stepper motors, brushless motors, and RC servos.",
    technicalDefinition: "An actuator is a mechanical or electromechanical transducer that converts electrical energy into controlled linear or rotary mechanical force and motion.",
    coreConcepts: [
      "Brushed DC (BDC) Motors",
      "Brushless DC (BLDC) & Permanent Magnet Synchronous Motors (PMSM)",
      "Stepper Motors & Microstepping",
      "RC Servomotors with Integrated Gearboxes and Potentiometers"
    ],
    explanation: `Different robotic kinematics require different actuator topologies:
1. Brushed DC Motors: Simple two-wire operation; speed is proportional to voltage, torque is proportional to current. Reversing polarity reverses direction.
2. Stepper Motors: Multi-phase motors that advance in discrete angular increments (e.g. 1.8° per full step). Ideal for precise open-loop position control in 3D printers and CNCs.
3. Brushless DC (BLDC) Motors: High efficiency, power density, and longevity. Requires external electronic commutation using hall-effect sensors or back-EMF zero-crossing detection.
4. RC Servos: Integrated package combining a DC motor, reduction gear train, position-sensing potentiometer, and closed-loop control board, commanded by a 50Hz PWM signal.`,
    roboticsContext: "Quadrupeds and robotic arms utilize high-torque, low-gear-ratio BLDC motors driven by Field-Oriented Control (FOC) to achieve transparent backdrivability and compliant ground interaction.",
    keyTakeaway: "Choosing an actuator dictates the required driving electronics, power supply topology, and microcontroller timing precision."
  },
  {
    id: "motor-drivers-and-h-bridges",
    moduleNumber: 5,
    title: "Motor Drivers & H-Bridges",
    category: "Actuation & Mechanics",
    summary: "Power electronics stages that bridge low-power logic signals to high-current inductive loads.",
    technicalDefinition: "A motor driver is an electrical power stage comprised of semiconductor switches (MOSFETs or BJTs) and gate drive circuitry that modulates high-voltage, high-current power delivered to an inductive motor based on low-voltage microcontroller logic commands.",
    coreConcepts: [
      "The H-Bridge Circuit Topology",
      "Shoot-Through Prevention & Dead-Time Insertion",
      "Flyback Diodes & Inductive Kickback Snubbing",
      "Thermal Dissipation & On-State Resistance (Rds(on))"
    ],
    explanation: `A microcontroller pin can typically source or sink only 10mA to 25mA at 3.3V or 5V—far too feeble to spin an electric motor demanding several amperes at 12V or 24V.

An H-Bridge utilizes four switches (MOSFETs Q1, Q2, Q3, Q4) arranged in an 'H' configuration:
- Forward Drive: Close Q1 (high-side left) and Q4 (low-side right). Current flows left-to-right through the motor rotor.
- Reverse Drive: Close Q2 (high-side right) and Q3 (low-side left). Current flows right-to-left through the motor rotor.
- Shoot-Through Danger: If Q1 and Q3 (or Q2 and Q4) are closed simultaneously, a direct short circuit occurs across the power supply rails, instantly destroying the MOSFETs. Hardware motor drivers incorporate automatic dead-time delays to ensure one switch turns completely OFF before the other turns ON.`,
    roboticsContext: "Dual H-bridge ICs like the TB6612FNG or L298N allow small differential-drive rovers to control two DC motors independently with separate speed (PWM) and direction (IN1/IN2) pins.",
    keyTakeaway: "Motor drivers protect sensitive microcontroller silicon while handling the amperes, heat, and inductive spikes generated by electric motors."
  },
  {
    id: "pwm-motor-control",
    moduleNumber: 6,
    title: "PWM-Based Motor Control",
    category: "Actuation & Mechanics",
    summary: "Modulating effective average voltage to regulate motor velocity without wasting energy as heat.",
    technicalDefinition: "Pulse-Width Modulation (PWM) is a technique for delivering variable average electrical power to an inductive load by switching a full-voltage supply rapidly between ON and OFF states at a fixed carrier frequency.",
    coreConcepts: [
      "Duty Cycle: Percentage of ON Time",
      "Average Voltage: V_avg = Duty * V_cc",
      "PWM Frequency Selection (Audible Whine vs MOSFET Switching Losses)",
      "Motor Inductance as a Natural Low-Pass Current Filter"
    ],
    explanation: `Instead of using a wasteful variable resistor (linear regulation) that converts excess voltage into blistering heat, PWM switches the full supply rail ON and OFF at frequencies between 1 kHz and 50 kHz.

Because electric motors have significant internal winding inductance ($L$), the motor resists sudden changes in current ($V = L \\frac{di}{dt}$). The motor's inductance acts as a natural low-pass filter, smoothing the chopped voltage pulses into a continuous, ripples-reduced DC current:
$$I_{\\text{average}} \\approx \\frac{V_{\\text{average}} - V_{\\text{back-EMF}}}{R_{\\text{winding}}}$$

Carrier Frequency Trade-Off:
- Too Low (< 20 kHz): The rapid pulsing generates an audible acoustic whine annoying to humans.
- Too High (> 50 kHz): Gate charging and discharging consumes excessive switching energy, producing severe heat in the driver MOSFETs.`,
    roboticsContext: "Robotic drive trains typically run PWM at 20 kHz to 25 kHz: safely above the human hearing limit (20 kHz) while minimizing capacitive switching losses in the motor inverter.",
    keyTakeaway: "PWM provides high-efficiency velocity control by exploiting motor inductance to smooth high-speed square waves into steady torque."
  },
  {
    id: "servo-control-mechanics",
    moduleNumber: 7,
    title: "RC Servo Control",
    category: "Actuation & Mechanics",
    summary: "Precise angular positioning commanded via standard 50Hz pulse-duration protocols.",
    technicalDefinition: "RC servomotors use a specialized pulse-duration modulation protocol (typically 50Hz / 20ms period) where the high-pulse duration between 1.0ms and 2.0ms maps directly to an absolute mechanical output angle between 0° and 180°.",
    coreConcepts: [
      "50Hz Carrier Rate (20ms Frame Period)",
      "1.0ms to 2.0ms Active Pulse Width Mapping",
      "Internal Analog Error Amplifiers & Potentiometers",
      "Deadband Width & Holding Torque"
    ],
    explanation: `Unlike continuous DC motor PWM where duty cycle varies from 0% to 100%, an RC hobby servo relies on the absolute duration of the high pulse:
- 1.0 ms pulse width $\\rightarrow$ Absolute Minimum Position (0°)
- 1.5 ms pulse width $\\rightarrow$ Neutral Center Position (90°)
- 2.0 ms pulse width $\\rightarrow$ Absolute Maximum Position (180°)

Inside the servo casing, an internal potentiometer is geared to the output horn. An internal comparator chip compares the commanded pulse duration with the potentiometer's voltage. If an external force moves the horn away from the target angle, the servo applies corrective motor torque to restore the position.`,
    roboticsContext: "Robotic grippers, pan-tilt camera gimbals, and hexapod legs rely on hardware timer PWM channels configured to generate jitter-free 1.0ms–2.0ms pulses.",
    keyTakeaway: "RC servos trade continuous rotation for closed-loop absolute angular positioning commanded by microsecond-accurate pulse widths."
  },
  {
    id: "encoders-and-odometry",
    moduleNumber: 8,
    title: "Encoders & Quadrature Decoding",
    category: "Perception & Sensing",
    summary: "Measuring rotary velocity, direction, and position with sub-millimeter precision.",
    technicalDefinition: "A rotary encoder converts mechanical angular displacement into a series of digital pulses. Quadrature encoders emit two signals (Channel A and Channel B) shifted 90 electrical degrees out of phase to reveal both speed and rotational direction.",
    coreConcepts: [
      "Optical vs Magnetic Hall-Effect Encoders",
      "Quadrature Phase Shift (90° Offset)",
      "1X, 2X, and 4X Decoding Resolution",
      "Hardware Encoder Interface (Timer Encoder Mode)"
    ],
    explanation: `When a motor rotates, the quadrature encoder generates two square waves:
- Rotating Clockwise (CW): Channel A leads Channel B by 90°.
- Rotating Counter-Clockwise (CCW): Channel B leads Channel A by 90°.

Decoding Resolution:
- 1X Decoding: Counts only rising edges on Channel A.
- 4X Decoding: Counts all rising and falling edges on both Channel A and Channel B, effectively quadrupling the pulses-per-revolution (PPR) measurement resolution without changing hardware.

Handling Encoders in Firmware:
Using software GPIO pin-change interrupts for fast motor encoders is dangerous: a 1000-PPR encoder at 3000 RPM produces 200,000 edge interrupts per second, starving the CPU. Modern microcontrollers (e.g. STM32, RP2040) include dedicated hardware timer encoder modes that increment/decrement an internal 16- or 32-bit register automatically with zero CPU overhead.`,
    roboticsContext: "Mobile robots integrate wheel encoder counts over time to calculate dead-reckoning odometry: estimating robot position $(x, y, \\theta)$ on the factory floor.",
    keyTakeaway: "Hardware quadrature timer channels enable microcontrollers to monitor multi-thousand-RPM motors without burning CPU instruction cycles."
  },
  {
    id: "feedback-loops-and-pid",
    moduleNumber: 9,
    title: "Feedback Loops & PID Control",
    category: "Control Systems",
    summary: "Closed-loop corrective algorithms that eliminate error and stabilize dynamic mechanics.",
    technicalDefinition: "A feedback control loop continuously calculates an error value $e(t)$ as the difference between a desired setpoint and a measured process variable, applying a correction based on Proportional, Integral, and Derivative (PID) terms.",
    coreConcepts: [
      "Open-Loop vs Closed-Loop Control",
      "Error Calculation: e(t) = Setpoint - Feedback",
      "Proportional (Kp): Reacts to immediate magnitude of error",
      "Integral (Ki): Eliminates accumulated steady-state offset",
      "Derivative (Kd): Dampens overshoot and anticipates future trajectory"
    ],
    explanation: `In an open-loop system, you command 50% PWM and hope the motor spins at the target speed. If the robot hits an incline or carpet, it slows down because there is no feedback.

In closed-loop PID control, the microcontroller samples encoder feedback at fixed time intervals (e.g. every 1ms):
$$u(t) = K_p e(t) + K_i \\int_0^t e(\\tau) d\\tau + K_d \\frac{de(t)}{dt}$$

Discrete Firmware Implementation:
In embedded C, derivatives become backward differences and integrals become running sums:
\`\`\`c
float error = setpoint - current_reading;
integral += error * dt;
float derivative = (error - previous_error) / dt;
float output = (Kp * error) + (Ki * integral) + (Kd * derivative);
previous_error = error;
\`\`\`

Tuning Dynamics:
- Excessive $K_p$: Rapid response but violent mechanical oscillation.
- Excessive $K_i$: Eliminates steady-state droop but introduces windup overshoot.
- Excessive $K_d$: Dampens motion but magnifies high-frequency sensor noise.`,
    roboticsContext: "In self-balancing two-wheeled robots, a high-speed PID loop calculates tilt angle error 500 times per second to drive motors forward before the robot falls over.",
    keyTakeaway: "PID control transforms noisy physical sensor readings into stable, deterministic mechanical trajectories."
  },
  {
    id: "real-time-processing-and-determinism",
    moduleNumber: 10,
    title: "Real-Time Processing & Determinism",
    category: "Control Systems",
    summary: "Why exact, bounded execution timing matters far more than raw clock frequency.",
    technicalDefinition: "Real-time computing describes systems where computational correctness depends not only on the logical correctness of the mathematical result, but also on the strict wall-clock time at which the result is delivered.",
    coreConcepts: [
      "Hard vs Soft Real-Time Constraints",
      "Jitter: Variation in Execution Latency",
      "Interrupt Service Routines (ISRs) & Latency",
      "Memory Allocation: Avoid malloc() in Real-Time Loops"
    ],
    explanation: `A 3.0 GHz desktop computer running a general-purpose OS (Windows/Linux) can complete complex mathematical operations faster than a 100 MHz microcontroller. However, desktop operating systems suffer from unpredictable latency spikes (jitter) caused by virtual memory paging, background task scheduling, and kernel locks. A control loop might take 50 microseconds on one cycle and 15 milliseconds on the next.

In robotics, a 15-millisecond delay while balancing an inverted pendulum or flying a quadcopter guarantees an unrecoverable physical crash.

Microcontrollers guarantee hard real-time determinism:
- Fixed clock cycles per instruction (predictable execution time).
- Sub-microsecond interrupt latency (ARM NVIC executes interrupt entry in 12 clock cycles).
- No dynamic memory fragmentation: memory is statically allocated at compile time.`,
    roboticsContext: "Flight controllers running Betaflight or PX4 execute sensor reading and ESC motor updates at strict 8 kHz intervals with less than 2 microseconds of jitter.",
    keyTakeaway: "A hard real-time system that delivers the right answer too late is fundamentally broken."
  },
  {
    id: "mcu-vs-sbc-in-robotics",
    moduleNumber: 11,
    title: "Microcontrollers vs Single-Board Computers",
    category: "System Architecture",
    summary: "Architectural synergy: pairing deterministic microcontrollers with high-throughput Linux hosts.",
    technicalDefinition: "A comparative evaluation of low-latency deterministic microcontrollers (bare-metal/RTOS) versus high-throughput microprocessor-based Single-Board Computers (SBCs running multitasking Linux kernels).",
    coreConcepts: [
      "Microcontroller: Deterministic Low-Level Hardware Interface",
      "Single-Board Computer (SBC): High-Level Compute & Networking",
      "Inter-Processor Buses: UART, SPI, USB, CAN, Ethernet",
      "Hybrid Architectures (e.g. Jetson + STM32)"
    ],
    explanation: `Modern robots do not choose between an MCU or an SBC—they integrate both in a hierarchical master-slave architecture:

| Feature | Microcontroller (MCU) | Single-Board Computer (SBC) |
| :--- | :--- | :--- |
| **Typical Silicon** | STM32, ESP32, RP2040, AVR | Raspberry Pi 5, NVIDIA Jetson, Intel NUC |
| **Clock Speed** | 16 MHz – 480 MHz | 1.5 GHz – 2.5 GHz multi-core |
| **RAM** | 2 KB – 1 MB SRAM | 2 GB – 16 GB LPDDR4/5 |
| **Operating System**| Bare Metal / FreeRTOS | Full Linux (Ubuntu, ROS 2) |
| **Interrupt Latency**| Deterministic (< 1 microsecond) | Non-deterministic (100µs – 20ms jitter) |
| **Primary Domain** | Motor control, encoders, IMU, CAN | Computer vision, SLAM, path planning |
| **Power Draw** | 10 mW – 500 mW | 5 W – 30 W |`,
    roboticsContext: "In an autonomous delivery robot, the Jetson Orin runs neural networks to detect pedestrians, while an STM32 microcontroller samples wheel encoders and modulates the H-bridge motor drivers.",
    keyTakeaway: "The SBC is the brain that sees and plans; the MCU is the cerebellum and spine that balances and moves."
  },
  {
    id: "rtos-fundamentals",
    moduleNumber: 12,
    title: "Real-Time Operating Systems (RTOS)",
    category: "Software & Firmware",
    summary: "Managing concurrent tasks, priorities, and shared resources on constrained silicon.",
    technicalDefinition: "An RTOS is a deterministic operating system kernel that provides preemptive multitasking, priority-based scheduling, inter-task communication, and resource synchronization with predictable time bounds for embedded microcontrollers.",
    coreConcepts: [
      "Preemptive Priority-Based Scheduler",
      "Context Switching & Task Control Blocks (TCB)",
      "Synchronization: Mutexes, Semaphores, and Queues",
      "Priority Inversion & Priority Inheritance"
    ],
    explanation: `When firmware outgrows a simple superloop (\`while(1)\`), tasks begin blocking one another. If an ultrasonic sensor takes 30ms waiting for an echo, the motor control loop is starved.

An RTOS (such as FreeRTOS or Zephyr) divides firmware into independent concurrent tasks:
- Task 1: High Priority (Motor Commutation & Safety, runs every 1ms).
- Task 2: Medium Priority (Encoder Odometry & PID, runs every 10ms).
- Task 3: Low Priority (Telemetry JSON Packet over Wi-Fi, runs every 100ms).

Preemption:
If the Low-Priority Wi-Fi task is transmitting data and the 1ms timer triggers the High-Priority Motor task, the scheduler instantly pauses the Wi-Fi task, saves its registers, executes the motor routine, and resumes Wi-Fi.

Synchronization:
Shared variables (e.g. current robot position) must be guarded using Mutexes (Mutual Exclusion) or Task Queues to prevent race conditions and memory corruption.`,
    roboticsContext: "FreeRTOS on an ESP32 allows Core 0 to handle Wi-Fi connection retries while Core 1 executes deterministic inverse kinematics for a robotic arm.",
    keyTakeaway: "An RTOS brings structured multitasking to microcontrollers while strictly upholding deterministic real-time deadlines."
  },
  {
    id: "ros2-and-micro-ros",
    moduleNumber: 13,
    title: "ROS 2 and micro-ROS",
    category: "Software & Firmware",
    summary: "Extending the Robot Operating System standard down into resource-constrained microcontrollers.",
    technicalDefinition: "micro-ROS bridges the gap between resource-constrained microcontrollers and standard ROS 2 robotics ecosystems by implementing the Micro XRCE-DDS middleware client directly on bare-metal and RTOS platforms.",
    coreConcepts: [
      "ROS 2 Publish-Subscribe Computational Graph",
      "Micro XRCE-DDS Middleware Client-Agent Pattern",
      "Hardware Transports: UART, CAN, USB CDC, Wi-Fi",
      "End-to-End Type Safety with Standard ROS Messages"
    ],
    explanation: `The Robot Operating System (ROS 2) is the de facto global standard for advanced robotics software. However, ROS 2 requires gigabytes of memory and a full Linux network stack.

Enter micro-ROS:
Instead of running a full DDS stack, the microcontroller runs a lightweight micro-ROS client (consuming as little as 10KB of RAM). The MCU communicates over serial UART, USB, or CAN with a micro-ROS Agent running on the host SBC.

Key Advantages:
- The microcontroller becomes a native first-class node in the ROS 2 graph.
- It can publish topics directly (e.g. \`/wheel_encoders\` as \`sensor_msgs/JointState\`).
- It can subscribe directly to velocity commands (e.g. \`/cmd_vel\` as \`geometry_msgs/Twist\`).
- Eliminates custom, fragile serial packet parsers and byte-stuffing protocols.`,
    roboticsContext: "An autonomous mobile robot running ROS 2 on a Raspberry Pi sends \`/cmd_vel\` messages over UART to an STM32 micro-ROS node, which converts linear and angular velocities directly into wheel PWM.",
    keyTakeaway: "micro-ROS eliminates ad-hoc serial communication protocols, making microcontrollers native nodes in modern robotics software stacks."
  },
  {
    id: "edge-ai-and-tinyml",
    moduleNumber: 14,
    title: "Edge AI and TinyML",
    category: "Physical AI",
    summary: "Running quantized, shallow neural networks directly on milliwatt microcontroller hardware.",
    technicalDefinition: "TinyML encompasses machine learning architectures, algorithms, and optimization frameworks engineered to execute neural network inference on ultra-low-power, resource-constrained microcontrollers typically with under 256KB of RAM and milliwatt power budgets.",
    coreConcepts: [
      "Quantization: FP32 to Int8 Arithmetic",
      "Memory Optimization: TFLite Micro Tensor Arena",
      "CMSIS-NN Hardware Acceleration (ARM SIMD Instructions)",
      "Strict Scope: Anomaly Detection, Audio Keywords, IMU Gesture Recognition"
    ],
    explanation: `Can a microcontroller run AI?
Yes, but with strict architectural boundaries.

What Microcontrollers CAN Run:
- Shallow 1D Convolutional Neural Networks (CNNs).
- Compact Multilayer Perceptrons (MLPs).
- Quantized Decision Trees and Isolation Forests.
- Audio Keyword Spotting ("Wake Word" models in under 50KB RAM).
- Vibration Anomaly Detection on bearings and industrial gearboxes.
- 6-DOF IMU gesture classification (gestures, gait phases).

What Microcontrollers CANNOT Run:
- Large Language Models (LLMs like GPT or Claude require tens of gigabytes of VRAM).
- High-Resolution Multi-Object Vision Detectors (YOLO requires megabytes of memory and gigaflops of compute).
- Real-Time Generative Diffusion Models.

Optimization Pipeline:
1. Train model in TensorFlow or PyTorch on host GPU.
2. Quantize weights from 32-bit floating point to 8-bit integers (Int8), reducing memory by 75% and enabling integer SIMD arithmetic.
3. Export to TensorFlow Lite for Microcontrollers (TFLite Micro) or compile with CMSIS-NN kernels.`,
    roboticsContext: "A TinyML model running on an nRF52840 Cortex-M4 microcontroller samples accelerometer data at 100Hz to detect mechanical bearing wear before catastrophic joint failure.",
    keyTakeaway: "TinyML on microcontrollers is designed for low-power sensory reflex triggers, not heavy vision or language generation."
  },
  {
    id: "physical-ai-systems",
    moduleNumber: 15,
    title: "Microcontrollers in Physical AI Systems",
    category: "Physical AI",
    summary: "The critical interface where digital neural policy models meet physical mechanical realities.",
    technicalDefinition: "Physical AI systems combine generative artificial intelligence, reinforcement learning control policies, and embodied mechatronics. The microcontroller functions as the neuromuscular junction, executing real-time reflex loops and translating policy actions into motor drive signals.",
    coreConcepts: [
      "The 3-Tier Physical AI Control Hierarchy",
      "High-Level Policy Inference vs Low-Level Reflex Loops",
      "Proprioceptive State Feedback & Safety Filtering",
      "Actuator Compliance & Joint Torque Control"
    ],
    explanation: `Physical AI represents the culmination of robotics and modern artificial intelligence: moving from disembodied software into robots that physically manipulate the unstructured real world.

The 3-Tier Physical AI Hierarchy:
1. High-Level Perception & World Modeling (Cloud / Host GPU / Edge SBC):
   - Multimodal foundation models, scene semantics, 3D LiDAR point clouds, and object affordance understanding.
2. Mid-Level Policy & Trajectory Generation (SBC / Real-Time Linux):
   - Reinforcement learning policy networks executing at 50 Hz – 100 Hz, outputting target joint positions, velocities, and feedforward torques.
3. Low-Level Neuromuscular Execution (Microcontrollers):
   - Field-Oriented Control (FOC) current loops executing at 20 kHz – 50 kHz.
   - Microsecond safety filtering: if the high-level policy commands an impossible joint trajectory that would collide with the robot's own chassis or exceed torque limits, the microcontroller clamps the signal instantly.

How Policies Interface with Hardware:
Reinforcement learning policies do not directly toggle motor driver pins. Instead, the policy outputs vector actions $\\mathbf{a}_t$ that are communicated via micro-ROS or CAN-FD to the microcontroller. The microcontroller's deterministic PID and current controllers track those setpoints while monitoring encoder feedback.`,
    roboticsContext: "In humanoid and quadruped robots, the high-level neural policy running on an edge computer outputs target joint angles at 50Hz, while distributed joint microcontrollers execute 25kHz current loops to provide compliant, spring-like foot contact with uneven terrain.",
    keyTakeaway: "In Physical AI, microcontrollers are the infallible biological reflex arc that ensures artificial intelligence does not break mechanical hardware."
  }
];

export const ROBOTICS_PILLARS = [
  {
    tier: "Tier 1: High-Level Perception",
    device: "Edge GPUs & High-Performance SBCs (NVIDIA Jetson, Intel NUC, RPi 5)",
    role: "Computer vision, 3D LiDAR SLAM, semantic scene understanding, and multimodal AI foundation models.",
    rate: "10 Hz – 30 Hz",
    protocol: "ROS 2 DDS over Gigabit Ethernet / PCIe",
    color: "#55C7FF"
  },
  {
    tier: "Tier 2: Planning & Decision-Making",
    device: "Real-Time Linux Host / Embedded Multiprocessor",
    role: "Trajectory generation, inverse kinematics, obstacle avoidance costmaps, behavior trees, and RL policies.",
    rate: "50 Hz – 200 Hz",
    protocol: "micro-ROS / CAN-FD / High-Speed UART",
    color: "#A5E3FF"
  },
  {
    tier: "Tier 3: Low-Level Hardware Control",
    device: "Deterministic Microcontrollers (STM32, ESP32, RP2040, PIC32)",
    role: "Closed-loop motor commutation (FOC), PWM generation, quadrature encoder decoding, and hardware safety e-stops.",
    rate: "1,000 Hz – 50,000 Hz (1 kHz – 50 kHz)",
    protocol: "Direct Hardware Registers, Timers, ADC, and Gate Drivers",
    color: "#10B981"
  }
];

