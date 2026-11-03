const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const chaptersData = [
  {
    chapterNumber: 1,
    title: "What is a Microcontroller?",
    slug: "what-is-a-microcontroller",
    level: "BEGINNER",
    estimatedMinutes: 20,
    summary:
      "An introduction to monolithic embedded silicon: discovering how a single chip integrates a CPU, volatile RAM, non-volatile Flash, and physical input/output peripherals.",
    keyTakeaways: JSON.stringify([
      "A microcontroller (MCU) integrates CPU, SRAM, Flash, clock generator, and I/O peripherals onto a single monolithic die.",
      "Unlike desktop computers with modular components, MCUs are optimized for dedicated, real-time control with minimal power and cost.",
      "Every embedded system interacts with the physical world through sensors (inputs) and actuators (outputs).",
      "Arduino is a prototyping ecosystem and development board, not the silicon microcontroller itself."
    ]),
    content: `# What is a Microcontroller?

## Beginner-Friendly Overview
Think of a standard desktop computer: it has a CPU in a socket, RAM sticks in memory slots, an SSD mounted on the motherboard, a graphics card, and various USB controllers connected via lengthy circuit traces. A **microcontroller** (MCU), by contrast, is an entire computer shrunken down onto a single speck of silicon smaller than your fingernail. 

On this tiny die, engineers have etched the brain (the Central Processing Unit), short-term working memory (SRAM), long-term non-volatile storage for your code (Flash memory), and physical pins that can directly sense electric voltages or switch circuits on and off. You will find microcontrollers inside microwave ovens, washing machines, car brake systems, quadcopter drones, and medical pacemakers—silently running dedicated software loops for decades without crashing.

## Formal Technical Definition
A **microcontroller unit (MCU)** is a highly integrated semiconductor integrated circuit (IC) fabricated on a monolithic substrate that incorporates a central processing unit (CPU) core, volatile static random-access memory (SRAM), non-volatile program memory (typically NOR Flash), clock generation circuitry (oscillators and PLLs), and memory-mapped peripheral interfaces (GPIO, Timers, ADC, UART, SPI, I2C) interconnected via an internal multi-layer bus matrix. It operates under deterministic execution constraints and is engineered for embedded control rather than general-purpose multi-user computation.

## Technical Architecture & Diagram
\`\`\`
+-------------------------------------------------------------+
|                MONOLITHIC MICROCONTROLLER DIE               |
|                                                             |
|  +-------------------+  +---------------+  +-------------+  |
|  |     CPU CORE      |  |   NOR FLASH   |  |    SRAM     |  |
|  | (ALU, Regs, NVIC) |  | (Program/Vec) |  | (Data/Stack)|  |
|  +---------+---------+  +-------+-------+  +------+------+  |
|            |                    |                 |         |
|  ==========+====================+=================+=======  |
|                      INTERNAL BUS MATRIX                    |
|  ==========+====================+=================+=======  |
|            |                    |                 |         |
|  +---------+---------+  +-------+-------+  +------+------+  |
|  |   GPIO CONTROLLER |  | TIMER MODULES |  |  ADC / DAC  |  |
|  +---------+---------+  +-------+-------+  +------+------+  |
|            |                    |                 |         |
+------------|--------------------|-----------------|---------+
             |                    |                 |
             v                    v                 v
       Physical Pins         PWM Outputs       Sensor Inputs
\`\`\`

## Real-World Engineering Example
**Cardiac Pacemaker Pulse Generator:** A sub-milliampere 8-bit or 32-bit ultra-low-power microcontroller continuously monitors cardiac electrograms via an on-chip analog comparator and ADC. When intrinsic cardiac polarization fails to occur within a programmed interval (e.g. 800 ms), hardware timer logic triggers an analog high-voltage pulse generator to pace the myocardium, drawing under 5 microamperes of quiescent current to preserve a 10-year battery lifespan.

## Practical Application & Firmware
\`\`\`c
// Direct Bare-Metal Register Initialization in C
#include <stdint.h>

#define RCC_AHB1ENR   (*(volatile uint32_t*)(0x40023830)) // Clock Enable Register
#define GPIOA_MODER   (*(volatile uint32_t*)(0x40020000)) // Mode Register
#define GPIOA_ODR     (*(volatile uint32_t*)(0x40020014)) // Output Data Register

void system_init(void) {
    // 1. Enable peripheral clock for Port A
    RCC_AHB1ENR |= (1UL << 0);
    // 2. Configure PA5 as digital output (bits [11:10] = 01b)
    GPIOA_MODER &= ~(3UL << 10);
    GPIOA_MODER |=  (1UL << 10);
}

void led_on(void) {
    GPIOA_ODR |= (1UL << 5); // Drive PA5 HIGH (3.3V)
}
\`\`\`

## Important Terminology
- **Monolithic Die:** A single continuous piece of semiconductor silicon containing all functional blocks.
- **Embedded System:** A dedicated computer hardware and software system engineered to perform specific dedicated functions within a larger mechanical or electrical ecosystem.
- **Deterministic Execution:** The guarantee that a given routine will complete in an exact, predictable number of clock cycles every time it runs.
- **Quiescent Current:** The baseline electric current consumed by the MCU silicon die when in standby or sleep mode.

## Engineering Deep Dive
Unlike general-purpose computing platforms that rely on dynamic RAM (DRAM) with capacitive refresh cycles and multi-level operating system abstraction layers, microcontrollers employ **Static RAM (SRAM)** built from cross-coupled 6-transistor (6T) CMOS bistable latches. This eliminates refresh overhead and guarantees single-cycle read and write access times matching the CPU core clock frequency. The elimination of external address and data buses dramatically minimizes electromagnetic interference (EMI), prevents bus capacitance propagation delays, and slashes total bill of materials (BOM) cost.

## Related Topics
- Microcontroller vs Microprocessor vs SoC
- How a Microcontroller Works
- Memory Organization & Bus Matrix Topologies
`,
    quiz: {
      title: "What is a Microcontroller? Assessment",
      description: "Evaluate your foundational understanding of monolithic MCU architecture and embedded systems.",
      passingScore: 70,
      questions: [
        {
          question: "What is the primary physical distinction between a Microcontroller (MCU) and a traditional Microprocessor (MPU)?",
          codeSnippet: null,
          options: JSON.stringify([
            "An MCU integrates CPU, RAM, Flash, and I/O peripherals onto a single monolithic silicon die.",
            "An MCU operates exclusively on 64-bit instruction words.",
            "An MCU cannot execute C or assembly code.",
            "An MCU requires an external Northbridge chipset to access memory."
          ]),
          correctOptionIndex: 0,
          explanation: "Microcontrollers integrate the core processor, memory, and peripheral controllers on a single monolithic silicon substrate.",
          points: 10,
        },
        {
          question: "Why does embedded firmware emphasize deterministic execution?",
          codeSnippet: null,
          options: JSON.stringify([
            "To allow the CPU to run at variable gigahertz frequencies.",
            "To guarantee that safety-critical physical events are responded to within strict, predictable time bounds.",
            "To maximize the amount of RAM consumed by thread stacks.",
            "To eliminate the need for pull-up resistors."
          ]),
          correctOptionIndex: 1,
          explanation: "Deterministic execution guarantees that time-critical control loops (such as airbag deployment or motor commutation) execute reliably without unpredictable jitter.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "MCU vs MPU Fundamentals & Silicon Topology",
        slug: "mcu-vs-mpu-fundamentals",
        difficulty: "BEGINNER",
        estimatedMinutes: 12,
        order: 1,
        summary: "Inspect the topological layout of a monolithic MCU versus discrete microprocessor architectures.",
        content: `### Silicon Integration
A microcontroller consolidates all primary computing sub-units onto a single semiconductor die. In contrast, an MPU relies on high-speed printed circuit board traces communicating with external DDR DRAM and Flash ICs.`,
      },
    ],
  },

  {
    chapterNumber: 2,
    title: "Microcontroller vs Microprocessor vs SoC",
    slug: "microcontroller-vs-microprocessor-vs-soc",
    level: "BEGINNER",
    estimatedMinutes: 25,
    summary:
      "Explore the architectural trade-offs between self-contained MCUs, high-performance general-purpose MPUs, and advanced Systems-on-Chip (SoCs).",
    keyTakeaways: JSON.stringify([
      "MCUs contain on-die SRAM and Flash, operating in milliwatts for real-time sensing and control.",
      "MPUs provide gigahertz computing with out-of-order execution pipelines and virtual memory MMUs, but require external RAM and power PMICs.",
      "SoCs bridge both worlds: integrating high-performance application cores (Cortex-A), GPUs, NPUs, and wireless radios.",
      "Harvard architecture separates instruction and data buses, whereas Von Neumann shares a unified bus."
    ]),
    content: `# Microcontroller vs Microprocessor vs SoC

## Beginner-Friendly Overview
When building smart machines, engineers must choose between three fundamentally different types of silicon:
- **Microcontroller (MCU):** The compact reflex engine. Instant boot-up (milliseconds), minimal power consumption (milliwatts), and direct control over electrical pins.
- **Microprocessor (MPU):** The heavy computation muscle. Found in laptops and servers, running complex operating systems like Linux or Windows at gigahertz speeds, but demanding large amounts of electricity and external memory.
- **System-on-Chip (SoC):** The integrated super-chip. Found inside smartphones, combining high-speed MPU cores, graphics accelerators, video decoders, cellular/Wi-Fi modems, and sometimes an on-die MCU into a single multi-billion-transistor package.

## Formal Technical Definition
- **MCU:** A monolithic integrated circuit containing an execution core (typically RISC), tightly coupled on-die non-volatile storage, static volatile scratchpad memory, and fixed-function peripheral controllers, devoid of an OS-level virtual memory Management Unit (MMU).
- **MPU:** A discrete computation engine optimized for throughput and instructions-per-clock (IPC), featuring multi-level caching (L1/L2/L3), dynamic branch prediction, and an MMU supporting page-based virtual memory architectures, but requiring external DRAM and power management ICs.
- **SoC:** A high-complexity silicon device that integrates one or more high-performance CPU cores (e.g. ARM Cortex-A), specialized hardware co-processors (GPU, VPU, NPU), baseband modems, and high-speed bus fabrics (AXI/NoC) onto a single silicon substrate.

## Technical Architecture & Diagram
\`\`\`
+---------------------+    +---------------------+    +-------------------------+
| MICROCONTROLLER     |    | MICROPROCESSOR      |    | SYSTEM-ON-CHIP (SoC)    |
| (STM32, ATmega)     |    | (Core i7, Ryzen)    |    | (Apple M3, Snapdragon)  |
|                     |    |                     |    |                         |
| [CPU] [RAM] [Flash] |    | [CPU Core + L1/L2]  |    | [CPU Cores] [GPU] [NPU] |
| [Timers] [GPIO]     |    |          |          |    | [DRAM Controller] [ISP] |
|        |            |    |       PCIe/DDR      |    | [Modem] [Security Core] |
|        v            |    |          v          |    |            |            |
| Real-World Pins     |    | Ext DDR5 + SSD      |    | High-Density Multi-Bus  |
+---------------------+    +---------------------+    +-------------------------+
\`\`\`

## Real-World Engineering Example
**Tesla Autopilot Electronic Control Unit (ECU):** The vehicle uses a hybrid computing topology: an **SoC** (Dual Tesla FSD chips with custom Neural Network Accelerators) runs Linux and processes multi-camera 36-FPS computer vision neural nets; meanwhile, dedicated automotive-grade **microcontrollers** (such as Infineon AURIX TriCore) interface directly with CAN bus actuators, steering racks, and mechanical braking pumps to provide functional safety (ISO 26262 ASIL-D) that cannot crash even if the OS kernel panics.

## Practical Application & Firmware
\`\`\`c
// Memory Management Unit (MMU) Check
// MCUs run in a single flat address space; pointers refer directly to physical hardware
uint32_t *led_reg = (uint32_t*)0x40020014;
*led_reg |= (1 << 5); // Direct physical write: zero OS translation overhead!
\`\`\`

## Important Terminology
- **Memory Management Unit (MMU):** Hardware block that translates virtual addresses into physical addresses, isolating application memory spaces.
- **Bill of Materials (BOM):** The complete list of physical components and ICs required to manufacture a printed circuit board.
- **ASIL-D:** Automotive Safety Integrity Level D, the highest classification of initial hazard operational safety defined under ISO 26262.
- **Out-of-Order Execution:** Processing paradigm where instructions are dynamically scheduled based on operand availability rather than strictly sequential code order.

## Engineering Deep Dive
A major differentiator between MCUs and MPUs is the **Memory Protection Unit (MPU)** versus the **Memory Management Unit (MMU)**. MCUs utilize MPUs: these do *not* translate addresses (virtual memory is absent; addresses 1:1 map to physical silicon SRAM/Flash), but instead enforce hardware permissions (privileged vs unprivileged, execute-never / XN bit). This preserves single-cycle deterministic execution latencies, avoiding the 10-to-100 clock cycle translation lookaside buffer (TLB) miss penalties inherent in desktop MPUs.

## Related Topics
- What is a Microcontroller?
- Memory Organization & Bus Matrix Topologies
- Real-Time Operating Systems (FreeRTOS)
`,
    quiz: {
      title: "MCU vs MPU vs SoC Assessment",
      description: "Test your ability to specify the correct silicon architecture for diverse engineering requirements.",
      passingScore: 70,
      questions: [
        {
          question: "Why do low-latency real-time control systems prefer MCUs over MPUs running standard Linux?",
          codeSnippet: null,
          options: JSON.stringify([
            "MCUs have higher gigahertz clock speeds than MPUs.",
            "MCUs execute without non-deterministic operating system scheduling delays, page faults, or virtual memory translation overhead.",
            "MCUs cannot overheat under any circumstances.",
            "MPUs cannot interface with digital sensors."
          ]),
          correctOptionIndex: 1,
          explanation: "Standard OS page translation, scheduling jitter, and TLB misses introduce variable latencies unacceptable in hard real-time physical control.",
          points: 10,
        },
        {
          question: "Which silicon device integrates CPU cores, GPU, hardware neural accelerators, and memory controllers into a single chip?",
          codeSnippet: null,
          options: JSON.stringify([
            "A Relay Matrix",
            "A Microcontroller Unit (MCU)",
            "A System-on-Chip (SoC)",
            "A Linear Voltage Regulator"
          ]),
          correctOptionIndex: 2,
          explanation: "Systems-on-Chip (SoCs) consolidate multi-domain heterogeneous compute cores (CPU, GPU, NPU) into a single semiconductor package.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "Structural Differences: Memory, Power & Operating Systems",
        slug: "mcu-mpu-soc-comparison",
        difficulty: "BEGINNER",
        estimatedMinutes: 12,
        order: 1,
        summary: "Understand power envelopes, memory hierarchies, and software execution stacks across compute classes.",
        content: `### Compute Taxonomy
Engineers match workload requirements to silicon categories: sub-watt real-time reflexive control demands MCUs; high-bandwidth computational analytics require MPUs and SoCs.`,
      },
      {
        lessonNumber: 2,
        title: "Harvard vs Von Neumann Architectures",
        slug: "harvard-vs-von-neumann",
        difficulty: "BEGINNER",
        estimatedMinutes: 15,
        order: 2,
        summary: "Analyze the architectural differences between unified and segregated bus memory models.",
        content: `### Bus Separation
Harvard architectures decouple instruction fetch from data read/write, avoiding the classic Von Neumann bottleneck.`,
      },
    ],
  },

  {
    chapterNumber: 3,
    title: "How a Microcontroller Works: The Instruction Cycle",
    slug: "how-a-microcontroller-works",
    level: "BEGINNER",
    estimatedMinutes: 25,
    summary:
      "Trace the heartbeat of silicon execution: from oscillator clock generation to the classical Fetch, Decode, and Execute instruction pipeline.",
    keyTakeaways: JSON.stringify([
      "The instruction cycle consists of three fundamental phases: Fetch, Decode, and Execute.",
      "The Program Counter points to the current instruction address in Flash memory.",
      "Pipelining allows the CPU to fetch instruction N+2 while decoding N+1 and executing N simultaneously.",
      "Quartz crystal oscillators stabilized by Phase-Locked Loops (PLL) provide the master clock heartbeat."
    ]),
    content: `# How a Microcontroller Works: The Instruction Cycle

## Beginner-Friendly Overview
At its core, a microcontroller is a rhythmic synchronous machine. Every second, a quartz crystal vibrates millions of times, generating an electrical pulse called the **Clock**. On every tick of this clock, the microcontroller performs a continuous, tireless three-step cycle:
1. **Fetch:** Reach into Flash memory at the address specified by the Program Counter and grab the next instruction byte.
2. **Decode:** Pass the binary pattern into the Instruction Decoder, which deciphers what the 1s and 0s mean (e.g., "Add Register 1 to Register 2").
3. **Execute:** Energize internal logic circuits inside the Arithmetic Logic Unit, update CPU registers, or toggle a physical pin on the chip.

## Formal Technical Definition
The **instruction cycle** is the deterministic sequence of operations executed by the central processing unit to process each machine instruction in software. In modern pipelined RISC architectures (such as ARM Cortex-M), this pipeline is broken into overlapping execution stages: **Instruction Fetch (IF)**, **Instruction Decode (ID)**, **Execute (EX)**, and optional Memory Access/Writeback stages. Through pipelining, the CPU achieves an effective throughput approaching one instruction per clock cycle (1 CPI).

## Technical Architecture & Diagram
\`\`\`
       +-------------------------------------------------------+
       |             THE 3-STAGE PIPELINE (ARM Cortex-M0/M3)   |
       +-------------------------------------------------------+

Clock Cycle 1: | [FETCH Inst 1]  |                |               |
Clock Cycle 2: | [FETCH Inst 2]  | [DECODE Inst 1]|               |
Clock Cycle 3: | [FETCH Inst 3]  | [DECODE Inst 2]| [EXEC Inst 1] |
Clock Cycle 4: | [FETCH Inst 4]  | [DECODE Inst 3]| [EXEC Inst 2] |
               +-----------------+----------------+---------------+
                       |                 |                |
                       v                 v                v
                 Read from Flash    Control Matrix    ALU / Pin Op
\`\`\`

## Real-World Engineering Example
**Brushless Motor Electronic Speed Controller (ESC):** In a drone ESC running at 48 MHz, the CPU executes the commutation loop every 50 microseconds. In each cycle, the instruction pipeline fetches Hall sensor inputs, decodes PWM timer compare values, calculates error in the ALU, and executes register updates to drive high-power gate MOSFETs, ensuring perfect motor phase rotation without jitter.

## Practical Application & Firmware
\`\`\`c
// Assembly Instruction Sequence (Disassembly of C loop)
// 1. Fetch: Loads 16-bit Thumb opcode from Flash
// 2. Decode: Identifies ADDS operation on R0
// 3. Execute: ALU increments R0 by 1 and updates Zero flag (Z)
__asm volatile (
    "movs r0, #0        \n\t" // R0 = 0
    "loop_start:        \n\t"
    "adds r0, r0, #1    \n\t" // R0 = R0 + 1 (Execute stage)
    "cmp  r0, #10       \n\t" // Compare R0 against 10
    "bne  loop_start    \n\t" // Branch if not equal
);
\`\`\`

## Important Terminology
- **Clock Tree:** The distribution network of phase-locked loops, prescalers, and multiplexers routing clock signals across the die.
- **Instruction Pipeline:** Parallel hardware stages enabling multiple consecutive instructions to be processed in different phases simultaneously.
- **Pipeline Flush:** The clearing of pre-fetched pipeline stages caused by an unexpected branch or jump, incurring a latency penalty.
- **Opcode:** The binary bit pattern representing a specific machine language operation.

## Engineering Deep Dive
In advanced processors (e.g. ARM Cortex-M7), the pipeline extends to a **6-stage dual-issue superscalar** architecture with static branch prediction. When a conditional branch (\`BNE\`, \`BEQ\`) occurs, if the branch predictor guesses incorrectly, the speculative instructions already fetched and decoded in the pipeline must be discarded (**pipeline stall / flush**), consuming 3 to 6 penalty clock cycles. Firmware engineers optimize performance-critical code loops by unrolling loops or utilizing branchless arithmetic instructions.

## Related Topics
- CPU and ALU
- Registers
- Program Counter and Stack Pointer
`,
    quiz: {
      title: "The Instruction Cycle Assessment",
      description: "Verify your mastery of CPU clocking, pipelining, and instruction execution stages.",
      passingScore: 70,
      questions: [
        {
          question: "What are the three fundamental sequential phases of a basic CPU instruction cycle?",
          codeSnippet: null,
          options: JSON.stringify([
            "Fetch, Decode, Execute",
            "Compile, Link, Run",
            "Read, Write, Erase",
            "Sample, Hold, Convert"
          ]),
          correctOptionIndex: 0,
          explanation: "The classical processor cycle fetches the opcode from memory, decodes control signals, and executes the operation in hardware.",
          points: 10,
        },
        {
          question: "What is the primary benefit of an instruction pipeline in a microcontroller?",
          codeSnippet: null,
          options: JSON.stringify([
            "It doubles the amount of physical Flash storage.",
            "It allows the CPU to fetch, decode, and execute different consecutive instructions simultaneously in the same clock cycle.",
            "It eliminates the need for an internal ground plane.",
            "It prevents electromagnetic interference."
          ]),
          correctOptionIndex: 1,
          explanation: "Pipelining overlaps the execution phases of consecutive instructions, approaching an effective throughput of one instruction completed per clock tick.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "The Fetch-Decode-Execute Pipeline",
        slug: "instruction-execution-pipeline",
        difficulty: "BEGINNER",
        estimatedMinutes: 12,
        order: 1,
        summary: "Step through machine cycle execution, instruction registers, and pipeline stage timings.",
        content: `### Pipeline Mechanics
Modern RISC microcontrollers overlap the fetch, decode, and execution of subsequent instructions to achieve high instruction-per-cycle throughput.`,
      },
      {
        lessonNumber: 2,
        title: "Clock Trees, PLL & Reset Circuitry",
        slug: "clock-trees-pll-reset",
        difficulty: "BEGINNER",
        estimatedMinutes: 18,
        order: 2,
        summary: "Understand high-speed internal (HSI), external crystals (HSE), PLL multipliers, and power-on reset circuits.",
        content: `### The Master Clock
Crystal oscillators provide stable baseline frequencies, which Phase-Locked Loops (PLL) multiply to high system frequencies.`,
      },
    ],
  },

  {
    chapterNumber: 4,
    title: "CPU and ALU",
    slug: "cpu-and-alu",
    level: "BEGINNER",
    estimatedMinutes: 25,
    summary:
      "Inside the computational heart of silicon: how ALUs execute integer math, bitwise logic, and barrel shifts, and how condition flags guide branching.",
    keyTakeaways: JSON.stringify([
      "The Arithmetic Logic Unit (ALU) performs hardware binary addition, subtraction, AND, OR, XOR, and bit-shifting.",
      "Condition flags (Negative, Zero, Carry, Overflow) record the mathematical outcome of every ALU operation.",
      "Hardware multipliers and dividers accelerate complex calculations without multi-cycle software loops.",
      "Modern Cortex-M4/M7 cores add single-precision IEEE 754 Floating-Point Units (FPUs) and SIMD DSP instructions."
    ]),
    content: `# CPU Core & The Arithmetic Logic Unit (ALU)

## Beginner-Friendly Overview
If the CPU is the conductor of the microcontroller orchestra, the **Arithmetic Logic Unit (ALU)** is the computational calculator. Whenever your code calculates \`voltage = raw_adc * 3.3 / 4095\` or checks if \`temperature > 75\`, it is the ALU executing the calculations in hardware.

The ALU accepts two binary numbers, applies an operation (such as adding them, subtracting them, or performing bitwise AND/OR), and outputs the result alongside a set of status flags—like a note saying "the result was exactly zero" or "the addition overflowed the maximum capacity."

## Formal Technical Definition
The **Arithmetic Logic Unit (ALU)** is a combinational digital electronic circuit that performs arithmetic operations (addition, subtraction, two's-complement negation) and bitwise logic operations (AND, OR, NOT, XOR, barrel shifting) on $N$-bit binary input words. It interfaces directly with the processor's register file and drives the **Application Program Status Register (APSR)** flags: **N** (Negative), **Z** (Zero), **C** (Carry / Unsigned overflow), and **V** (oVerflow / Signed overflow).

## Technical Architecture & Diagram
\`\`\`
       Operand A (from Reg File)        Operand B (from Reg File)
                  |                                |
                  v                                v
       +-------------------------------------------------------+
       |             ARITHMETIC LOGIC UNIT (ALU)               |
       |                                                       |
       |   [ 32-Bit Full Adder ]       [ Barrel Shifter ]      |
       |   [ Bitwise Logic: AND, OR ]  [ Comparator Unit ]     |
       +-------------------------------------------------------+
                                   |
                   +---------------+---------------+
                   |                               |
                   v                               v
             Result Output                 Condition Flags (xPSR)
         (to Destination Reg)              [N] [Z] [C] [V]
\`\`\`

## Real-World Engineering Example
**Digital Anti-Lock Braking System (ABS) Slip Calculation:** The wheel speed sensor sends pulses to calculate wheel velocity. The ALU executes a subtraction between vehicle chassis speed and wheel speed:
$$\\text{Slip Ratio} = \\frac{V_{\\text{vehicle}} - V_{\\text{wheel}}}{V_{\\text{vehicle}}}$$
If the subtraction result sets the Zero flag ($Z=1$), slip is zero. If the result exceeds a critical threshold, the ALU calculation immediately triggers an interrupt to release hydraulic caliper pressure.

## Practical Application & Firmware
\`\`\`c
// How C conditional branching translates to ALU flags in ARM Thumb-2
int check_limit(int sensor_val, int threshold) {
    // Generates assembly:
    // CMP  R0, R1    <- ALU executes (R0 - R1) and discards result, updating flags
    // BLE  safe_exit <- Branch if Negative != Overflow (signed less than or equal)
    if (sensor_val > threshold) {
        return 1; // Alarm condition
    }
    return 0;
}
\`\`\`

## Important Terminology
- **Barrel Shifter:** Hardware circuit capable of shifting or rotating a binary word by any number of bit positions in a single clock cycle.
- **Carry Flag (C):** Set when an addition generates an unsigned carry-out, or when a subtraction requires no borrow.
- **Overflow Flag (V):** Set when an arithmetic operation on signed two's-complement numbers generates an invalid result exceeding bit limits.
- **FPU (Floating-Point Unit):** Specialized co-processor executing IEEE 754 32-bit (single) or 64-bit (double) floating-point calculations.

## Engineering Deep Dive
In ARM Cortex-M4 and Cortex-M7 silicon, the ALU is augmented with **DSP (Digital Signal Processing)** extensions supporting single-cycle **Multiply-Accumulate (MAC)** and **SIMD (Single Instruction, Multiple Data)** operations. The instruction \`SMLAD\` (Signed Multiply Accumulate Dual) loads two 32-bit registers containing two packed 16-bit integers each, multiplies both pairs simultaneously, and adds the products into a 32-bit accumulator in a single clock cycle:
$$\\text{Accumulator} = \\text{Accumulator} + (A_1 \\times B_1) + (A_2 \\times B_2)$$
This provides the mathematical backbone for real-time digital FIR/IIR filters, Fast Fourier Transforms (FFT), and TinyML neural network inference at the edge.

## Related Topics
- Registers
- Program Counter and Stack Pointer
- Real-Time Systems & Physical AI
`,
    quiz: {
      title: "CPU & ALU Architecture Assessment",
      description: "Assess your understanding of ALU operations, condition status flags, and math acceleration.",
      passingScore: 70,
      questions: [
        {
          question: "Which condition flag in the status register is set when the result of an ALU arithmetic operation equals zero?",
          codeSnippet: null,
          options: JSON.stringify([
            "Carry Flag (C)",
            "Negative Flag (N)",
            "Zero Flag (Z)",
            "Overflow Flag (V)"
          ]),
          correctOptionIndex: 2,
          explanation: "The Zero Flag (Z) is set to 1 whenever the mathematical outcome of an ALU operation is exactly zero.",
          points: 10,
        },
        {
          question: "What hardware capability enables an ARM Cortex-M4 ALU to perform digital signal filtering efficiently?",
          codeSnippet: null,
          options: JSON.stringify([
            "Single-cycle Multiply-Accumulate (MAC) DSP instructions",
            "Analog relay switching",
            "Dynamic RAM address translation",
            "External coprocessor bus polling"
          ]),
          correctOptionIndex: 0,
          explanation: "Single-cycle MAC instructions allow simultaneous multiplication and accumulation essential for digital audio and vibration filters.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "ALU & General-Purpose Register Banking",
        slug: "alu-register-banking",
        difficulty: "BEGINNER",
        estimatedMinutes: 15,
        order: 1,
        summary: "Master arithmetic logic, condition code flags (NZCV), and register allocation.",
        content: `### ALU Execution
The ALU sits at the center of the CPU execution datapath, performing Boolean logic, arithmetic additions, and bitwise barrel shifts.`,
      },
      {
        lessonNumber: 2,
        title: "Floating-Point Units (FPU) and DSP Hardware Extensions",
        slug: "fpu-dsp-coprocessors",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 18,
        order: 2,
        summary: "Explore hardware single-precision IEEE 754 FPUs and SIMD saturated math.",
        content: `### FPU Hardware
Hardware FPUs execute floating-point additions and multiplications in 1 to 2 cycles rather than hundred-cycle software emulations.`,
      },
    ],
  },

  {
    chapterNumber: 5,
    title: "Registers",
    slug: "registers",
    level: "BEGINNER",
    estimatedMinutes: 25,
    summary:
      "Master internal register files: general-purpose registers (R0-R12), AAPCS calling conventions, and special function control registers.",
    keyTakeaways: JSON.stringify([
      "Registers are the fastest storage locations in computing, located directly inside the CPU core.",
      "ARM Cortex-M processors feature 16 core registers: R0-R12 (General Purpose), R13 (SP), R14 (LR), and R15 (PC).",
      "Under the AAPCS standard, R0-R3 pass function arguments and return values.",
      "Special Function Registers (SFRs) control on-chip hardware peripherals via memory-mapped addresses."
    ]),
    content: `# Registers: High-Speed Silicon Storage

## Beginner-Friendly Overview
Imagine working at an electronics workbench:
- **Flash memory** is like the large reference textbook stored on the bookshelf.
- **SRAM** is like a notebook lying on your desk where you jot down temporary readings.
- **Registers** are the tools in your active hands.

Registers are ultra-fast binary storage slots built directly into the silicon core of the CPU. The CPU cannot add two numbers located in Flash or RAM directly; it must first load the numbers into registers, tell the ALU to calculate their sum into a destination register, and then write the result back.

## Formal Technical Definition
A **register** is a small, high-speed storage element constructed from D flip-flops located directly within the CPU datapath, accessible within zero wait-states in a single sub-nanosecond clock phase. The ARM Cortex-M architecture provides a register bank containing sixteen 32-bit core registers (\`R0\` to \`R15\`) plus specialized status registers (\`xPSR\`, \`CONTROL\`, \`PRIMASK\`). Peripheral configuration registers are mapped to specific physical addresses as **Memory-Mapped I/O (MMIO)** Special Function Registers (SFRs).

## Technical Architecture & Diagram
\`\`\`
+-------------------------------------------------------------+
|             ARM CORTEX-M CORE REGISTER FILE                 |
|                                                             |
|  R0  [ Argument 1 / Return Value ]                          |
|  R1  [ Argument 2                ]                          |
|  R2  [ Argument 3                ]  AAPCS Caller-Saved      |
|  R3  [ Argument 4                ]  (Scratch Registers)     |
|  R12 [ Intra-Procedure Call Scratch ]                       |
|  ---------------------------------------------------------  |
|  R4 through R11 [ General Purpose Local Variables ]         |
|                 (Callee-Saved across function calls)        |
|  ---------------------------------------------------------  |
|  R13 / SP [ Stack Pointer: Top of Stack in SRAM ]           |
|  R14 / LR [ Link Register: Function Return Address ]        |
|  R15 / PC [ Program Counter: Next Instruction Address ]     |
|  xPSR     [ Program Status Register: NZCV Flags & State ]   |
+-------------------------------------------------------------+
\`\`\`

## Real-World Engineering Example
**Real-Time Flight Controller Gyro Loop:** When an IMU triggers an SPI interrupt at 8,000 Hz, the drone flight controller must read 6-axis acceleration and angular rate vectors. By keeping PID loop constants ($K_p, K_i, K_d$) cached inside registers \`R4\`, \`R5\`, and \`R6\`, the compiler avoids wasteful SRAM read transactions, completing the attitude stabilization math in under 12 microseconds.

## Practical Application & Firmware
\`\`\`c
// ARM Architecture Procedure Call Standard (AAPCS) in action:
// Function arguments: a -> R0, b -> R1, c -> R2, d -> R3
int compute_vector(int a, int b, int c, int d) {
    // Return value is stored in R0
    return (a * b) + (c * d);
}

// Accessing Special Function Registers (SFRs) via C pointers:
#define RCC_CR (*(volatile uint32_t*)0x40023800) // Clock Control Register
RCC_CR |= (1 << 0); // Set bit 0 (HSION) directly in silicon
\`\`\`

## Important Terminology
- **AAPCS:** ARM Architecture Procedure Call Standard, governing how registers are utilized across compiled C functions.
- **Caller-Saved Registers:** Registers (\`R0-R3\`, \`R12\`) that the called function may freely overwrite; caller must save them on the stack if values are needed later.
- **Callee-Saved Registers:** Registers (\`R4-R11\`) that a called function must preserve and restore before returning.
- **SFR (Special Function Register):** Silicon register that controls or reports status for an on-chip peripheral (e.g., UART baud rate register).

## Engineering Deep Dive
Register access consumes zero bus cycles because register flip-flops are physically routed with dedicated copper interconnections directly into the ALU input multiplexers. By comparison, loading a variable from SRAM requires routing through the AHB bus matrix, incurring bus arbitration latencies. In C, declaring a local loop counter as \`register int i;\` was historically used to advise the compiler, though modern optimizing compilers (GCC \`-O2\` and Clang) automatically perform sophisticated **graph-coloring register allocation** to keep high-frequency variables in physical registers.

## Related Topics
- CPU and ALU
- Program Counter and Stack Pointer
- Memory Organization & Bus Matrix Topologies
`,
    quiz: {
      title: "Register Architecture Assessment",
      description: "Verify your understanding of processor core registers and calling conventions.",
      passingScore: 70,
      questions: [
        {
          question: "Under the standard ARM AAPCS calling convention, which core registers are used to pass the first four 32-bit function arguments?",
          codeSnippet: null,
          options: JSON.stringify([
            "R0, R1, R2, R3",
            "R4, R5, R6, R7",
            "R12, R13, R14, R15",
            "SP and PC only"
          ]),
          correctOptionIndex: 0,
          explanation: "R0 through R3 are defined by AAPCS to pass the first four function arguments and hold scalar return values.",
          points: 10,
        },
        {
          question: "Why are register operations significantly faster than accessing variables stored in SRAM?",
          codeSnippet: null,
          options: JSON.stringify([
            "Registers are located directly on the CPU datapath and require no bus transactions or arbitration.",
            "Registers operate at double the voltage of SRAM.",
            "SRAM can only be read once per second.",
            "Registers do not store binary data."
          ]),
          correctOptionIndex: 0,
          explanation: "Registers reside inside the processor execution core, allowing zero-latency single-cycle access directly into the ALU.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "General-Purpose Registers and Calling Conventions",
        slug: "core-register-file-mechanics",
        difficulty: "BEGINNER",
        estimatedMinutes: 12,
        order: 1,
        summary: "Understand register allocation, AAPCS conventions, and callee vs caller saves.",
        content: `### Register Banking
Core registers R0 through R15 form the high-speed working scratchpad of the CPU execution core.`,
      },
      {
        lessonNumber: 2,
        title: "Special Function Registers (SFRs) and Hardware Peripheral Control",
        slug: "special-function-registers",
        difficulty: "BEGINNER",
        estimatedMinutes: 14,
        order: 2,
        summary: "Inspect how peripheral control registers map to exact 32-bit memory addresses.",
        content: `### Memory-Mapped SFRs
Special Function Registers map directly to hardware blocks, allowing software to toggle pins, configure timers, and trigger interrupts.`,
      },
    ],
  },

  {
    chapterNumber: 6,
    title: "Program Counter and Stack Pointer",
    slug: "program-counter-and-stack-pointer",
    level: "BEGINNER",
    estimatedMinutes: 30,
    summary:
      "Control program execution flow and context switching: understand the Program Counter (PC), Link Register (LR), and Main vs Process Stack Pointers (MSP/PSP).",
    keyTakeaways: JSON.stringify([
      "The Program Counter (PC / R15) holds the address of the next instruction word to be executed.",
      "The Stack Pointer (SP / R13) tracks the current top of the descending call stack in SRAM.",
      "The Link Register (LR / R14) holds the return address when calling functions via BL.",
      "ARM Cortex-M implements banked stack pointers: Main Stack Pointer (MSP) and Process Stack Pointer (PSP) for RTOS isolation."
    ]),
    content: `# Program Counter and Stack Pointer

## Beginner-Friendly Overview
When a computer runs software, how does it know where it is and how to get back after calling a function?
- **The Program Counter (PC):** Like a bookmark in an instruction manual that advances step-by-step to the next line of code. If you make a decision (e.g. \`if (button_pressed)\`), the bookmark jumps to another page.
- **The Stack Pointer (SP):** Like a stack of plates in a cafeteria. Every time you enter a new function, you place a new plate containing your local variables on top of the stack. When the function finishes, you remove that plate. The Stack Pointer always points to the top plate.

## Formal Technical Definition
The **Program Counter (PC / R15)** is a dedicated CPU register containing the memory address of the instruction currently being prefetched or executed. In ARM Thumb-2 state, bit 0 must always be \`1\` to signify Thumb execution.

The **Stack Pointer (SP / R13)** is an address register referencing the current top-of-stack in volatile SRAM. In ARM Cortex-M, the stack is **Full Descending**: it grows downwards towards lower memory addresses upon a \`PUSH\` operation and shrinks towards higher addresses upon a \`POP\`. The architecture implements two banked physical stack pointers:
- **Main Stack Pointer (MSP):** Used by kernel code, reset handlers, and hardware interrupt service routines (ISRs).
- **Process Stack Pointer (PSP):** Used by user-space application threads in preemptive RTOS environments.

## Technical Architecture & Diagram
\`\`\`
Memory Address                 SRAM CALL STACK (Full Descending)
High Memory (0x2001_FFFF) +----------------------------------+
                          |   Top of SRAM (Initial SP)       |
                          +----------------------------------+
                          | Previous Function Stack Frame    |
                          | - Local variables                |
                          | - Saved R4-R7                    |
                          | - Saved Return Address (LR)      |
                          +----------------------------------+
Current SP (0x2001_FFB0)->| Active Function Stack Frame      |
                          | (Grows downwards on PUSH)        |
                          +----------------------------------+
                          |      [ Available Stack Space ]   |
                          |                |                 |
                          |                v                 |
Low Memory (0x2000_0000)  |      [ HEAP MEMORY / GLOBALS ]   |
                          +----------------------------------+
\`\`\`

## Real-World Engineering Example
**Spacecraft Attitude Control Hard-Fault Avoidance:** Deep in space, radiation can trigger single-event upsets (SEU). If a recursive function exceeds its allocated memory, the Stack Pointer descends past its boundary and overwrites global heap variables—a catastrophic **Stack Overflow**. Modern space-grade MCUs configure an on-die **Memory Protection Unit (MPU)** region directly beneath the stack as a guard region (\`Execute-Never / No-Access\`). If the Stack Pointer touches this boundary, a hardware fault triggers a safe reboot before corrupting flight telemetry.

## Practical Application & Firmware
\`\`\`c
// Inspecting Stack Pointer and Program Counter in Bare-Metal C
void print_execution_context(void) {
    uint32_t current_sp;
    uint32_t current_pc;

    // Read Stack Pointer (MSP)
    __asm volatile ("mrs %0, msp" : "=r" (current_sp));
    // Read Program Counter (PC)
    __asm volatile ("mov %0, pc"  : "=r" (current_pc));

    // current_sp points to SRAM (e.g. 0x20007FE0)
    // current_pc points to Flash code (e.g. 0x08000424)
}
\`\`\`

## Important Terminology
- **Stack Frame:** The block of memory pushed onto the stack containing a function's local variables, caller-saved registers, and return address.
- **Link Register (LR / R14):** Stores the return address for function calls (\`BL\` instruction) and holds special \`EXC_RETURN\` codes during interrupts.
- **Stack Overflow:** A critical bug where stack allocation exceeds allocated SRAM boundaries, overwriting global variables or peripheral buffers.
- **Full Descending Stack:** A stack convention where the pointer points to the last used memory location and decrements before storing new data.

## Engineering Deep Dive
When an interrupt arrives, ARM Cortex-M hardware executes automatic **Context Stacking** without software intervention. In exactly 12 clock cycles, the hardware pushes 8 registers (\`R0-R3, R12, LR, PC, xPSR\`) onto the active stack (MSP or PSP) and loads the Interrupt Vector address into the Program Counter. The Link Register is set to a special hardware code called **\`EXC_RETURN\`** (e.g., \`0xFFFFFFF9\`). When the ISR executes \`BX LR\`, the processor hardware detects this sentinel value, pops the saved context registers from the stack, and seamlessly resumes main code execution.

## Related Topics
- Registers
- Interrupts & The NVIC
- Memory Organization & Bus Matrix Topologies
`,
    quiz: {
      title: "Program Counter & Stack Pointer Assessment",
      description: "Test your understanding of execution flow, stack memory dynamics, and context switching.",
      passingScore: 70,
      questions: [
        {
          question: "In an ARM Cortex-M processor with a full-descending stack, what happens to the Stack Pointer address during a PUSH operation?",
          codeSnippet: null,
          options: JSON.stringify([
            "The Stack Pointer address decrements towards lower memory.",
            "The Stack Pointer address increments towards higher memory.",
            "The Stack Pointer resets to 0x00000000.",
            "The Stack Pointer jumps to the Flash vector table."
          ]),
          correctOptionIndex: 0,
          explanation: "In full-descending stack architectures, the stack pointer decrements as items are pushed onto the stack.",
          points: 10,
        },
        {
          question: "What is stored in the Link Register (LR / R14) when a function call instruction (BL) is executed?",
          codeSnippet: null,
          options: JSON.stringify([
            "The return address of the next sequential instruction in the calling function.",
            "The current temperature of the silicon die.",
            "The maximum size of the heap.",
            "The baud rate of the UART interface."
          ]),
          correctOptionIndex: 0,
          explanation: "The Branch with Link (BL) instruction writes the address of the next instruction into the Link Register so the function knows where to return.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "Program Counter, Link Register, and Branch Prediction",
        slug: "pc-lr-execution-flow",
        difficulty: "BEGINNER",
        estimatedMinutes: 14,
        order: 1,
        summary: "Understand instruction addressing, function linkage, and branch penalties.",
        content: `### Execution Flow Control
The Program Counter governs which instruction word is fed into the decoder, while the Link Register enables subroutines to return cleanly.`,
      },
      {
        lessonNumber: 2,
        title: "Stack Pointer, Stack Frame Allocation & Overflow Protection",
        slug: "stack-pointer-stack-frames",
        difficulty: "BEGINNER",
        estimatedMinutes: 16,
        order: 2,
        summary: "Analyze stack memory frames, local variable allocation, and MPU guard rings.",
        content: `### The Call Stack
Function calls push return addresses and local variables onto the descending stack; managing stack depth prevents catastrophic memory corruption.`,
      },
    ],
  },

  {
    chapterNumber: 7,
    title: "Memory Organization",
    slug: "memory-organization",
    level: "INTERMEDIATE",
    estimatedMinutes: 30,
    summary:
      "Navigate the 32-bit linear address space: explore code, SRAM, peripheral spaces, memory protection units (MPU), and multi-layer AHB/APB bus matrices.",
    keyTakeaways: JSON.stringify([
      "32-bit architectures provide a flat 4 Gigabyte (0x0000_0000 to 0xFFFF_FFFF) address space.",
      "The address space is segmented: Code/Flash (0x0800_0000), SRAM (0x2000_0000), Peripherals (0x4000_0000).",
      "Peripherals are memory-mapped: interacting with hardware pins uses standard memory load/store instructions.",
      "The Multi-Layer AHB bus matrix permits simultaneous concurrent data transfers between multiple bus masters."
    ]),
    content: `# Memory Organization & Bus Matrix Topologies

## Beginner-Friendly Overview
How does a microcontroller organize all its components? It gives everything an **address**, just like houses on a long street. In a 32-bit microcontroller, there are over 4 billion unique address locations (4 Gigabytes), even if the chip only has 512 Kilobytes of actual storage.

The memory map divides this massive space into designated neighborhoods:
- Address \`0x08000000\`: The Flash memory district where your compiled program code lives.
- Address \`0x20000000\`: The SRAM district where your variables, strings, and stack live.
- Address \`0x40000000\`: The Peripheral district where every single hardware pin, timer, and serial port has an address. If you write a \`1\` to address \`0x40020014\`, a real physical pin on the chip turns on!

## Formal Technical Definition
A **memory-mapped architecture** assigns all storage elements (NOR Flash, volatile SRAM) and peripheral device control/status registers to designated regions within a unified linear 32-bit address space ($2^{32} = 4,294,967,296$ bytes). Interconnection is managed by an **Advanced High-performance Bus (AHB)** and **Advanced Peripheral Bus (APB)** multi-layer bus matrix, permitting concurrent, non-blocking bus transactions between multiple bus masters (CPU Core, DMA1, DMA2) and slaves.

## Technical Architecture & Diagram
\`\`\`
Address Range      ARM Cortex-M Standard 4GB Memory Map
0xFFFF_FFFF +---------------------------------------------------+
            | System Control Space (NVIC, MPU, SysTick: 0xE000_E000)
0xE000_0000 +---------------------------------------------------+
            | External Memory / Devices                         |
0xA000_0000 +---------------------------------------------------+
            | External RAM                                      |
0x6000_0000 +---------------------------------------------------+
            | Peripheral Region: AHB / APB Peripherals          |
            | (GPIOA, TIM1, USART1, SPI1: 0x4000_0000)          |
0x4000_0000 +---------------------------------------------------+
            | SRAM Region (Internal Volatile Data: 0x2000_0000) |
0x2000_0000 +---------------------------------------------------+
            | Code / Flash Region (Internal Flash: 0x0800_0000) |
0x0000_0000 +---------------------------------------------------+
\`\`\`

## Real-World Engineering Example
**Industrial Motion Controller Multi-Master Bus Concurrency:** A 6-axis robotic welding arm requires continuous trajectory streaming. The **DMA Controller** reads motor trajectory coordinates from an SPI Flash chip into SRAM on Bus Layer 1, while the **CPU Core** simultaneously reads sensor feedback and computes inverse kinematics from another SRAM bank on Bus Layer 2. Because of the Multi-Layer AHB matrix, both high-speed transfers execute in parallel without stalling each other.

## Practical Application & Firmware
\`\`\`c
// Linker Script (.ld) Section Allocation: Mapping software to memory regions
/*
MEMORY
{
  FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 512K
  RAM (rwx)  : ORIGIN = 0x20000000, LENGTH = 96K
}

SECTIONS
{
  .text : { *(.text*) } > FLASH   // Program code in Flash
  .rodata : { *(.rodata*) } > FLASH // Constants in Flash
  .data : { *(.data*) } > RAM AT > FLASH // Initialized variables
  .bss : { *(.bss*) } > RAM       // Uninitialized variables (zeroed at boot)
}
*/
\`\`\`

## Important Terminology
- **Memory Map:** The definitive blueprint assigning address ranges to physical silicon memory banks and peripheral control registers.
- **Bus Matrix:** A multi-layered hardware crossbar switch enabling multiple bus masters to communicate with multiple slaves simultaneously.
- **MMIO (Memory-Mapped I/O):** Interfacing with hardware peripherals using standard load/store CPU instructions rather than specialized I/O opcodes.
- **Little-Endian:** The byte-ordering convention where the least significant byte (LSB) is stored at the lowest memory address.

## Engineering Deep Dive
In Harvard-derived ARM Cortex-M designs, the CPU core exposes three separate internal bus interfaces to the bus matrix:
1. **I-Code Bus:** Fetches instructions from Flash memory.
2. **D-Code Bus:** Performs literal data loads and debug accesses from Flash memory.
3. **S-Bus (System Bus):** Accesses volatile SRAM and peripherals.
By separating instruction fetching (I-Code) from data operand access (D-Code and System bus), the processor achieves 0-wait-state instruction throughput, eliminating the historic Von Neumann memory bottleneck.

## Related Topics
- RAM, ROM, Flash and EEPROM
- GPIO: General Purpose Input/Output
- Direct Memory Access (DMA)
`,
    quiz: {
      title: "Memory Organization Assessment",
      description: "Test your architectural mastery of address spaces, bus topologies, and memory mapping.",
      passingScore: 70,
      questions: [
        {
          question: "What is Memory-Mapped I/O (MMIO)?",
          codeSnippet: null,
          options: JSON.stringify([
            "A system where hardware peripheral registers are accessed using the same address space and load/store instructions as memory.",
            "A software simulator that creates virtual memory on an SD card.",
            "A hardware method that prevents writing to Flash memory.",
            "An algorithm for sorting integer arrays in SRAM."
          ]),
          correctOptionIndex: 0,
          explanation: "Memory-Mapped I/O maps hardware registers into the processor's linear memory address space, allowing standard C pointers to control peripherals.",
          points: 10,
        },
        {
          question: "What is the primary function of a Multi-Layer AHB Bus Matrix in a microcontroller?",
          codeSnippet: null,
          options: JSON.stringify([
            "It allows multiple bus masters (like CPU and DMA) to access different slave peripherals simultaneously without contention.",
            "It converts digital voltages to analog signals.",
            "It generates the system reset pulse.",
            "It acts as a mechanical switch."
          ]),
          correctOptionIndex: 0,
          explanation: "The Multi-Layer Bus Matrix acts as a crossbar switch, enabling concurrent data transfers between different masters and slaves.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "4GB Memory Map, Linker Scripts & Section Alignment",
        slug: "linear-address-space-mapping",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 15,
        order: 1,
        summary: "Inspect linear memory segment allocations and linker section directives (.text, .data, .bss).",
        content: `### Memory Segmentation
The 4GB address space maps Flash code, volatile SRAM, and memory-mapped peripheral control registers into distinct regions.`,
      },
      {
        lessonNumber: 2,
        title: "Multi-Layer AHB/APB Bus Matrix & Master/Slave Arbitration",
        slug: "bus-matrix-interconnect",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 15,
        order: 2,
        summary: "Analyze crossbar arbitration, bus bridges, and concurrent master/slave transactions.",
        content: `### High-Speed Interconnects
The AHB and APB bus networks allow CPUs, DMA controllers, and high-speed peripherals to exchange data with minimal arbitration delays.`,
      },
    ],
  },

  {
    chapterNumber: 8,
    title: "RAM, ROM, Flash and EEPROM",
    slug: "ram-rom-flash-eeprom",
    level: "INTERMEDIATE",
    estimatedMinutes: 30,
    summary:
      "Evaluate embedded semiconductor memories: static SRAM cells, non-volatile NOR Flash erase sectors, endurance cycles, and EEPROM emulated storage.",
    keyTakeaways: JSON.stringify([
      "SRAM is fast, volatile memory built from 6-transistor latch circuits, losing its state upon power removal.",
      "NOR Flash is non-volatile memory storing firmware code, executing instructions directly in-place (XIP).",
      "Flash memory can be programmed byte-by-byte from 1 to 0, but erasing can only reset cells back to 1 in entire sectors.",
      "EEPROM provides byte-level erasability and high write endurance (1,000,000+ cycles) for device calibration data."
    ]),
    content: `# RAM, ROM, Flash and EEPROM: Embedded Memory Technologies

## Beginner-Friendly Overview
Microcontrollers use different types of memory tailored to specific physical constraints:
- **SRAM (Static RAM):** The working memory. Extremely fast and responsive, but completely erased the moment power is turned off. Used for active variables, calculations, and the call stack.
- **ROM (Read-Only Memory):** Factory-burned silicon memory that can never be modified. Often contains the chip's factory bootloader.
- **Flash Memory:** The permanent code storage. Non-volatile (retains data without power), dense, and durable. This is where your compiled binary code resides.
- **EEPROM:** Electrically Erasable Programmable Read-Only Memory. Can modify single individual bytes without erasing large blocks, perfect for storing user settings, calibration offsets, and device serial numbers.

## Formal Technical Definition
- **SRAM:** Volatile static random-access memory utilizing 6-transistor (6T) CMOS bistable latches. It requires no periodic refresh cycles and provides symmetrical, single-cycle read and write access times.
- **NOR Flash:** Non-volatile floating-gate or charge-trap semiconductor storage organized into pages and sectors. Read operations support byte-level random access, enabling **eXecute-In-Place (XIP)**. Write operations can only transition bits from \`1\` to \`0\`; transitioning bits back from \`0\` to \`1\` mandates an erase cycle across an entire multi-kilobyte sector.
- **EEPROM:** Byte-erasable, non-volatile memory employing floating-gate Fowler-Nordheim tunneling, offering high endurance ($10^6$ write cycles) compared to Flash ($10^4$ to $10^5$ cycles).

## Technical Architecture & Diagram
\`\`\`
+-------------------+--------------------+--------------------+--------------------+
| PARAMETER         | SRAM               | NOR FLASH          | EEPROM             |
+-------------------+--------------------+--------------------+--------------------+
| Volatility        | Volatile (Lost)    | Non-Volatile       | Non-Volatile       |
| Cell Structure    | 6 Transistors (6T) | 1 Floating-Gate    | 2 Transistors (FLOTOX)
| Read Speed        | Single Cycle (<10ns)| 20-30ns (Wait states)| ~100ns            |
| Write Speed       | Single Cycle (<10ns)| ~20-50 microseconds| ~3-5 milliseconds  |
| Erase Granularity | Single Word / Byte | Sector (16K-128KB) | Single Byte        |
| Write Endurance   | Unlimited          | 10,000 - 100,000   | 1,000,000+ cycles  |
+-------------------+--------------------+--------------------+--------------------+
\`\`\`

## Real-World Engineering Example
**Smart Utility Electricity Meter:** The meter firmware runs from on-chip **NOR Flash** (eXecute-In-Place). Active AC voltage and current wave calculations take place in high-speed **SRAM**. Every 15 minutes, total cumulative kilowatt-hours are saved into **EEPROM** (or emulated Flash EEPROM with wear leveling) to survive blackouts and power outages without losing billing data over a 20-year operational life.

## Practical Application & Firmware
\`\`\`c
// Flash Programming Sequence (STM32 Bare-Metal)
void flash_unlock(void) {
    // 1. Authorize Flash control register access via key values
    FLASH->KEYR = 0x45670123;
    FLASH->KEYR = 0xCDEF89AB;
}

void flash_erase_sector(uint8_t sector_num) {
    // Wait until Flash is not busy
    while (FLASH->SR & FLASH_SR_BSY);
    // Set Sector Erase bit and specify sector index
    FLASH->CR |= FLASH_CR_SER;
    FLASH->CR |= (sector_num << FLASH_CR_SNB_Pos);
    FLASH->CR |= FLASH_CR_STRT; // Trigger erase cycle
    while (FLASH->SR & FLASH_SR_BSY);
}
\`\`\`

## Important Terminology
- **Wear Leveling:** Firmware algorithm that distributes erase and write cycles across Flash memory blocks to prevent premature localized cell degradation.
- **Wait States (Latency):** Delay clock cycles inserted when CPU frequency exceeds the intrinsic physical access speed of Flash memory.
- **eXecute-In-Place (XIP):** The capability to execute machine instructions directly from non-volatile Flash without copying them to RAM first.
- **Endurance:** The maximum guaranteed number of erase/program cycles a non-volatile memory cell can withstand before insulating oxide breakdown occurs.

## Engineering Deep Dive
Because modern microcontrollers run at frequencies up to 84 MHz, 168 MHz, or 480 MHz, while silicon NOR Flash memory read access times are physically limited to approximately $20\\text{ ns}$ to $30\\text{ ns}$, the CPU must insert **Flash Wait States (LATENCY)**. At 84 MHz (clock period $11.9\\text{ ns}$), reading Flash requires 2 wait states. To eliminate this performance penalty, manufacturers integrate proprietary memory accelerators (such as STMicroelectronics' **ART Accelerator** or Microchip's Cache Controller) containing small instruction and data caches plus prefetch buffers, restoring 0-wait-state equivalent performance.

## Related Topics
- Memory Organization & Bus Matrix Topologies
- Direct Memory Access (DMA)
- What is a Microcontroller?
`,
    quiz: {
      title: "Embedded Memory Technologies Assessment",
      description: "Test your understanding of volatile SRAM, NOR Flash mechanics, and non-volatile endurance.",
      passingScore: 70,
      questions: [
        {
          question: "Why must Flash memory be erased in entire sectors rather than modified on an individual byte-by-byte basis?",
          codeSnippet: null,
          options: JSON.stringify([
            "Physical floating-gate charge tunneling requires high voltage applied across shared substrate well lines, resetting all bits in the sector to 1.",
            "Flash memory does not contain transistors.",
            "The CPU instruction decoder forbids single-byte operations.",
            "Flash memory is volatile."
          ]),
          correctOptionIndex: 0,
          explanation: "Flash memory architecture ties the source lines of floating-gate transistors together within a block, necessitating block-level erasure.",
          points: 10,
        },
        {
          question: "What is the primary operational advantage of SRAM over Flash memory?",
          codeSnippet: null,
          options: JSON.stringify([
            "SRAM provides symmetrical single-cycle read and write access without erase cycles or wear limits.",
            "SRAM retains its data for 50 years without power.",
            "SRAM costs less per gigabyte than magnetic tape.",
            "SRAM can only store constant numbers."
          ]),
          correctOptionIndex: 0,
          explanation: "SRAM provides single-cycle read/write access with unlimited endurance, making it optimal for active program variables and stacks.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "Flash Memory, Wait States & Cache",
        slug: "flash-memory-wait-states",
        difficulty: "ADVANCED",
        estimatedMinutes: 16,
        order: 1,
        summary: "Analyze NOR Flash physics, access latencies, wait-state calibration, and prefetch caches.",
        content: `### Flash Latency
When CPU frequencies outpace Flash access times, hardware wait states and prefetch buffers prevent memory starvation.`,
      },
      {
        lessonNumber: 2,
        title: "SRAM 6T Physics vs Flash Floating-Gate Tunneling",
        slug: "sram-eeprom-durability",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 14,
        order: 2,
        summary: "Compare volatile bistable latches against non-volatile tunneling oxide wear.",
        content: `### Semiconductor Storage
SRAM delivers symmetric zero-wear read/write speeds, while Flash and EEPROM trade write speed for non-volatile persistence.`,
      },
    ],
  },

  {
    chapterNumber: 9,
    title: "Digital and Analog Signals",
    slug: "digital-and-analog-signals",
    level: "BEGINNER",
    estimatedMinutes: 25,
    summary:
      "Bridge the physical analog world and digital silicon: voltage thresholds (VIH/VIL), noise margins, logic high/low, and Nyquist-Shannon sampling fundamentals.",
    keyTakeaways: JSON.stringify([
      "Digital signals represent information as discrete binary logic levels: HIGH (1) and LOW (0).",
      "Analog signals vary continuously in voltage over time, reflecting physical phenomena (sound, temperature, pressure).",
      "CMOS input thresholds (VIH and VIL) define the exact voltages recognized as valid logic levels.",
      "The Nyquist-Shannon theorem dictates that sampling rate must be at least twice the highest frequency present in an analog signal."
    ]),
    content: `# Digital and Analog Signals: Voltage Levels & Sampling

## Beginner-Friendly Overview
The physical universe is analog: sound waves, temperature, sunlight, and heartbeats are smooth, continuously flowing variations. Microcontrollers, however, speak the language of digital logic: they deal strictly in discrete 1s and 0s.
- **Digital Signal:** An electrical voltage that toggles between two defined states—either ON (HIGH, typically 3.3V) or OFF (LOW, 0V Ground).
- **Analog Signal:** An electrical voltage that can assume any value along a continuous range (for instance, a temperature sensor outputting 1.427 Volts).

To interact with the physical world, microcontrollers use specialized converter blocks: **ADCs** (Analog-to-Digital Converters) to listen, and **DACs** or **PWM** to speak.

## Formal Technical Definition
A **digital signal** is a quantized, time-discrete or time-continuous signal whose amplitude is constrained to discrete states representing binary logic symbols. In complementary metal-oxide-semiconductor (CMOS) logic, valid voltage ranges are defined by standard switching thresholds:
- $V_{\\text{IL}}$ (Maximum Input Low Voltage): Highest voltage guaranteed to be read as Logic \`0\` (e.g. $0.3 \\times V_{\\text{DD}} \\approx 0.99\\text{ V}$).
- $V_{\\text{IH}}$ (Minimum Input High Voltage): Lowest voltage guaranteed to be read as Logic \`1\` (e.g. $0.7 \\times V_{\\text{DD}} \\approx 2.31\\text{ V}$).
- **Noise Margin:** The buffer between output drive voltages ($V_{\\text{OL}}, V_{\\text{OH}}$) and input thresholds ($V_{\\text{IL}}, V_{\\text{IH}}$) that rejects electromagnetic noise.

## Technical Architecture & Diagram
\`\`\`
Voltage (V)             CMOS 3.3V LOGIC THRESHOLDS
3.3V +---------------------------------------------------------+
     |   LOGIC HIGH REGION (Guaranteed Logic 1)                |
2.3V + - - - - - - - - - - - - - - - - - - - - - - - - - - - - + VIH (Min Input High)
     |   FORBIDDEN / INDETERMINATE REGION                      |
     |   (Noise can cause oscillating or undefined states)     |
1.0V + - - - - - - - - - - - - - - - - - - - - - - - - - - - - + VIL (Max Input Low)
     |   LOGIC LOW REGION (Guaranteed Logic 0)                 |
0.0V +---------------------------------------------------------+
\`\`\`

## Real-World Engineering Example
**Automotive Crankshaft Position Sensor:** An inductive reluctor wheel sensor mounted on an engine crankshaft produces an analog sinusoidal voltage whose amplitude and frequency vary with engine RPM. If fed directly to an MCU digital input, electrical noise in the indeterminate region would trigger false ignition events. The signal is conditioned through a **Schmitt Trigger** circuit with hysteresis to convert the noisy analog sine wave into a clean, crisp square wave.

## Practical Application & Firmware
\`\`\`c
// Reading Digital vs Analog Input in C
#include <stdbool.h>
#include <stdint.h>

// Reading a digital pin (returns binary true/false)
bool read_door_sensor(void) {
    return (GPIOC->IDR & (1 << 13)) ? true : false;
}

// Reading an analog pin via ADC (returns discrete 12-bit integer: 0 to 4095)
uint16_t read_temperature_sensor(void) {
    ADC1->CR2 |= ADC_CR2_SWSTART; // Trigger conversion
    while (!(ADC1->SR & ADC_SR_EOC)); // Wait for End Of Conversion
    return (uint16_t)(ADC1->DR);  // Read digital quantized result
}
\`\`\`

## Important Terminology
- **Schmitt Trigger:** A comparator circuit with positive feedback that implements hysteresis, preventing noise-induced chatter at voltage threshold boundaries.
- **Noise Margin:** The quantitative difference between the output voltage level produced by a driving gate and the input voltage required by a receiving gate.
- **Hysteresis:** The intentional difference between the rising switching threshold and falling switching threshold voltage.
- **Slew Rate:** The maximum rate of change of an electrical voltage per unit time (expressed in $\\text{V}/\\mu\\text{s}$).

## Engineering Deep Dive
When an analog signal enters an unconditioned CMOS digital input pin resting in the indeterminate zone (between $V_{\\text{IL}}$ and $V_{\\text{IH}}$), both the high-side P-MOS and low-side N-MOS transistors conduct simultaneously. This forms a low-resistance path directly from $V_{\\text{DD}}$ to Ground (**crowbar current**), generating excessive thermal dissipation and parasitic substrate noise. Modern microcontroller input pins incorporate integrated internal Schmitt triggers on digital I/O channels to guarantee clean, nanosecond-speed digital edges.

## Related Topics
- GPIO: General Purpose Input/Output
- ADC and DAC: Translating Continuous Realities
- Timers and Counters: Hardware Timing & PWM
`,
    quiz: {
      title: "Digital & Analog Signals Assessment",
      description: "Assess your understanding of signal physics, voltage thresholds, and noise margins.",
      passingScore: 70,
      questions: [
        {
          question: "What happens if a voltage entering a standard digital CMOS input pin rests in the indeterminate region between VIL and VIH?",
          codeSnippet: null,
          options: JSON.stringify([
            "Both internal P-MOS and N-MOS transistors may conduct simultaneously, causing crowbar currents and unpredictable logic readings.",
            "The microcontroller immediately executes a factory reset.",
            "The Flash memory is erased.",
            "The voltage is converted to a sine wave."
          ]),
          correctOptionIndex: 0,
          explanation: "In the indeterminate region, complementary CMOS transistors can both partially conduct, drawing shoot-through currents and causing logic ambiguity.",
          points: 10,
        },
        {
          question: "What circuit feature is incorporated into microcontroller digital pins to eliminate spurious switching from electrical noise?",
          codeSnippet: null,
          options: JSON.stringify([
            "Schmitt Trigger with voltage hysteresis",
            "A step-down transformer",
            "A mechanical relay",
            "A vacuum tube"
          ]),
          correctOptionIndex: 0,
          explanation: "Schmitt triggers provide hysteresis (different switching thresholds for rising and falling edges), rejecting noise near the switching threshold.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "CMOS Logic Voltage Levels & Noise Margins",
        slug: "cmos-logic-levels-thresholds",
        difficulty: "BEGINNER",
        estimatedMinutes: 12,
        order: 1,
        summary: "Understand VIL, VIH, VOL, VOH thresholds and noise rejection in 3.3V and 5V circuits.",
        content: `### Logic Thresholds
Digital logic relies on guaranteed voltage thresholds to reliably differentiate binary ones from zeros amidst electrical noise.`,
      },
      {
        lessonNumber: 2,
        title: "Physical Transducers, Sampling Theorems & Quantization",
        slug: "analog-continuous-phenomena",
        difficulty: "BEGINNER",
        estimatedMinutes: 13,
        order: 2,
        summary: "Trace physical sensor signals into discrete digital representations.",
        content: `### Analog Realities
Transducers translate temperature, pressure, and light into continuous voltages that require filtering and quantization.`,
      },
    ],
  },

  {
    chapterNumber: 10,
    title: "GPIO",
    slug: "gpio",
    level: "BEGINNER",
    estimatedMinutes: 30,
    summary:
      "Control external electronics: master push-pull vs open-drain transistors, internal pull-up/pull-down resistors, slew rates, and atomic BSRR bitmasking.",
    keyTakeaways: JSON.stringify([
      "GPIO pins interface silicon directly with external LEDs, buttons, relays, and communication transceivers.",
      "Push-Pull output actively drives the pin both HIGH (via P-MOS) and LOW (via N-MOS).",
      "Open-Drain output only drives LOW, requiring an external pull-up resistor to reach HIGH (essential for I2C).",
      "Atomic Bit Set/Reset Registers (BSRR) eliminate read-modify-write race conditions in multi-threaded code."
    ]),
    content: `# GPIO: General Purpose Input/Output Subsystem

## Beginner-Friendly Overview
**GPIO** (General Purpose Input/Output) pins are the physical metallic hands and eyes of the microcontroller. Each pin on the chip package can be configured through software:
- **As an Input:** Like an eye observing an electrical circuit. It can tell whether an external pushbutton is pressed or whether an optical safety barrier has been broken.
- **As an Output:** Like a switch controlling the flow of electricity. It can energize an LED indicator, trigger a solid-state relay, or drive a buzzer.

Crucially, each pin can be tailored with internal resistors (pull-up or pull-down) so you do not need to solder extra resistors on your circuit board.

## Formal Technical Definition
A **General Purpose Input/Output (GPIO)** port is a peripheral subsystem comprising a set of multi-mode bidirectional physical pins connected to memory-mapped registers. Each pin features programmable operating modes: **Input**, **General Purpose Output**, **Alternate Function (AF)**, and **Analog**. The output driver incorporates a high-side P-channel MOSFET and a low-side N-channel MOSFET supporting both **Push-Pull** and **Open-Drain** configurations, alongside selectable slew-rate output speeds and programmable weak pull-up/pull-down resistors.

## Technical Architecture & Diagram
\`\`\`
                           +--- VDD (3.3V)
                           |
                        [P-MOS]  (Conducts for Logic 1 in Push-Pull)
                           |
Pin Terminal <-------------+------------------ Output Driver Stage
                           |
                        [N-MOS]  (Conducts for Logic 0)
                           |
                          GND
                           |
                           +------------------ Input Buffer Stage
                           |
                    [Schmitt Trigger] ---> To Input Data Register (IDR)
                           |
             [Pull-Up / Pull-Down Resistors]
\`\`\`

## Real-World Engineering Example
**Emergency Stop Pushbutton Interfacing:** In an industrial packaging machine, a safety emergency stop button is wired to a GPIO input configured with an **Internal Pull-Up resistor**. When the switch is open, the pin reads a solid Logic \`1\` ($3.3\\text{ V}$). When an operator hits the button, it grounds the pin to Logic \`0\` ($0\\text{ V}$), immediately triggering an External Interrupt (EXTI) that halts all conveyor servomotors in under 5 microseconds.

## Practical Application & Firmware
\`\`\`c
// Direct Bare-Metal C Register Configuration (STM32)
#define GPIOA_MODER   (*(volatile uint32_t*)0x40020000)
#define GPIOA_OTYPER  (*(volatile uint32_t*)0x40020004)
#define GPIOA_PUPDR   (*(volatile uint32_t*)0x4002000C)
#define GPIOA_BSRR    (*(volatile uint32_t*)0x40020018)

void configure_led_pin(void) {
    // 1. Set PA5 mode to Output (01b in bits [11:10])
    GPIOA_MODER &= ~(3UL << 10);
    GPIOA_MODER |=  (1UL << 10);

    // 2. Set Push-Pull output type (0 in bit 5)
    GPIOA_OTYPER &= ~(1UL << 5);

    // 3. No pull-up / pull-down (00b in bits [11:10])
    GPIOA_PUPDR &= ~(3UL << 10);
}

void toggle_led_atomic(void) {
    GPIOA_BSRR = (1UL << 5);        // Atomic SET: Turn LED ON
    GPIOA_BSRR = (1UL << (5 + 16)); // Atomic RESET: Turn LED OFF
}
\`\`\`

## Important Terminology
- **Push-Pull:** Output circuit utilizing complementary P-MOS and N-MOS transistors to actively source current to $V_{\\text{DD}}$ or sink current to Ground.
- **Open-Drain:** Output circuit utilizing only the low-side N-MOS transistor; when off, the pin floats in a high-impedance state, requiring a pull-up resistor to achieve a logic HIGH.
- **Atomic Bit Operation:** A register write operation completed in a single indivisible clock cycle that cannot be interrupted by an ISR.
- **High-Impedance (Hi-Z):** A high-resistance state where a pin is electronically disconnected from the circuit, drawing virtually zero current.

## Engineering Deep Dive
Modifying pin states via the Output Data Register (\`GPIOA->ODR |= (1 << 5)\`) is **unsafe** in multi-threaded firmware because it requires three distinct CPU assembly instructions: **Load (LDR)**, **Or (ORR)**, and **Store (STR)**. If an interrupt fires between the \`LDR\` and \`STR\` instructions and modifies another pin on Port A, the subsequent \`STR\` instruction will inadvertently overwrite and corrupt the interrupt's modification. Microcontrollers solve this with dedicated **Bit Set/Reset Registers (BSRR)**: writing a \`1\` to bits \`0-15\` sets the corresponding pin, while writing a \`1\` to bits \`16-31\` clears it in a single atomic instruction.

## Related Topics
- Digital and Analog Signals
- Interrupts & The NVIC
- Communication Protocols: UART, SPI and I2C
`,
    quiz: {
      title: "GPIO Subsystem Assessment",
      description: "Test your practical knowledge of pin topologies, output configurations, and atomic registers.",
      passingScore: 70,
      questions: [
        {
          question: "Why is an open-drain output configuration required when connecting multiple devices to a shared bus like I2C?",
          codeSnippet: null,
          options: JSON.stringify([
            "It prevents catastrophic short-circuits (shoot-through) when one device outputs LOW while another outputs HIGH.",
            "It doubles the communication baud rate.",
            "It eliminates the need for Ground wires.",
            "It allows the microcontroller to output 12 Volts."
          ]),
          correctOptionIndex: 0,
          explanation: "Open-drain nodes only pull down to Ground; pull-up resistors pull up to VDD. If two nodes talk simultaneously, neither can short-circuit the power supply.",
          points: 10,
        },
        {
          question: "Why is the Bit Set/Reset Register (BSRR) preferred over the Output Data Register (ODR) when updating pins?",
          codeSnippet: null,
          options: JSON.stringify([
            "BSRR operations are atomic single-cycle writes that eliminate read-modify-write race conditions.",
            "ODR can only be written once after power-on reset.",
            "BSRR consumes half the silicon area of ODR.",
            "ODR is an analog register."
          ]),
          correctOptionIndex: 0,
          explanation: "BSRR writes are atomic single-cycle operations, preventing race conditions when interrupts modify the same I/O port.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "GPIO Subsystem: Push-Pull vs Open-Drain",
        slug: "gpio-push-pull-open-drain",
        difficulty: "BEGINNER",
        estimatedMinutes: 14,
        order: 1,
        summary: "Analyze complementary transistor stages, wired-AND topologies, and pull-up resistor calculations.",
        content: `### Output Stages
Push-pull drivers actively drive both high and low rail voltages; open-drain drivers rely on passive pull-ups for multi-node buses.`,
      },
      {
        lessonNumber: 2,
        title: "Memory-Mapped I/O & Register Bit Manipulation",
        slug: "mmio-register-bitmasking",
        difficulty: "BEGINNER",
        estimatedMinutes: 18,
        order: 2,
        summary: "Master bitwise operators (|=, &= ~, ^=) and atomic single-cycle BSRR register manipulation.",
        content: `### Bitmasking Mechanics
Direct register bit manipulation ensures firmware modifies designated peripheral control bits without corrupting adjacent configurations.`,
      },
    ],
  },

  {
    chapterNumber: 11,
    title: "Timers and Counters",
    slug: "timers-and-counters",
    level: "INTERMEDIATE",
    estimatedMinutes: 35,
    summary:
      "Silicon timekeeping without CPU overhead: prescalers, auto-reload registers, input capture edge measurement, and complementary PWM motor drive.",
    keyTakeaways: JSON.stringify([
      "Hardware timers run independently of the CPU core, eliminating timing jitter caused by software delay loops.",
      "A timer consists of a clock source, a Prescaler (PSC) frequency divider, and a Counter (CNT) register.",
      "Pulse Width Modulation (PWM) modulates the duty cycle to simulate analog voltages and control motors.",
      "Input Capture registers record exact timestamps of incoming electrical pulses for frequency and tachometer measurement."
    ]),
    content: `# Hardware Timers, Counters & PWM Generation

## Beginner-Friendly Overview
In software, creating a delay by writing \`for(int i=0; i<1000000; i++);\` is like counting seconds in your head while trying to drive a car: the moment you get distracted by an interrupt, your timing falls apart, and your CPU wastes 100% of its energy doing nothing.

Microcontrollers solve this with **Hardware Timers**. A hardware timer is an autonomous digital clockwork block etched onto the silicon. You can tell it: "Tick every microsecond, and ring an alarm bell (interrupt) every 10 milliseconds." The CPU is completely freed up to do other work, while the timer runs with precision down to the nanosecond.

## Formal Technical Definition
A **hardware timer/counter** is a peripheral block comprising an $N$-bit counter register (\`CNT\`), a programmable prescaler register (\`PSC\`), an auto-reload register (\`ARR\`), and multiple capture/compare channels (\`CCR1\`-\`CCR4\`). Operating synchronously with a peripheral bus clock ($f_{\\text{CLK}}$), the counter increments or decrements on every prescaled pulse. In **Output Compare / PWM Mode**, the hardware continuously compares \`CNT\` against \`CCR\` to toggle physical output pins with nanosecond accuracy.

## Technical Architecture & Diagram
\`\`\`
Clock Source (f_CLK: 84 MHz)
           |
           v
+-----------------------+     +-----------------------+
|  PRESCALER (PSC + 1)  | --> |  COUNTER REG (CNT)    | <---+ Auto-Reload (ARR)
+-----------------------+     +-----------------------+     | (Rolls back to 0)
                                          |
                                          v
                              +-----------------------+
                              | DIGITAL COMPARATOR    | <--- Compare Val (CCR)
                              +-----------------------+
                                          |
                                          v
                                 PWM Output Signal (Pin)
\`\`\`

## Real-World Engineering Example
**Quadcopter Brushless Motor ESC Control:** Quadcopter flight controllers must update motor thrust 400 times per second using PWM pulses between 1.0 ms (idle) and 2.0 ms (full throttle). Hardware Timer \`TIM2\` generates four hardware PWM signals directly to motor gate drivers. The CPU never handles pin toggling; it simply writes new thrust values into \`TIM2->CCR1-4\` once every control cycle.

## Practical Application & Firmware
\`\`\`c
// Configuring Hardware Timer for 20 kHz PWM (Motor Drive)
// System Clock = 84 MHz; Target PWM Freq = 20,000 Hz
// Formula: f_PWM = f_CLK / ((PSC + 1) * (ARR + 1))
void timer_pwm_init(void) {
    TIM1->PSC = 3;       // Prescaler divides 84 MHz by (3 + 1) = 21 MHz
    TIM1->ARR = 1049;    // 21 MHz / (1049 + 1) = 20,000 Hz (50 microsecond period)
    TIM1->CCR1 = 525;    // 50% Duty Cycle (525 / 1050)

    // Configure Channel 1 as PWM Mode 1
    TIM1->CCMR1 |= (6UL << 4);
    TIM1->CCER  |= (1UL << 0); // Enable output
    TIM1->CR1   |= (1UL << 0); // Start timer
}
\`\`\`

## Important Terminology
- **Prescaler (PSC):** A programmable frequency divider that reduces a high-speed clock frequency before it reaches the counter register.
- **Auto-Reload Register (ARR):** The register specifying the maximum count period before the counter rolls over and resets to zero.
- **Duty Cycle:** The ratio of time a digital PWM signal remains HIGH relative to the total waveform period, expressed as a percentage.
- **Input Capture:** A hardware timer mode where an edge on an external pin latches the instantaneous \`CNT\` value into a register, used for tachometers and ultrasonic echo timing.

## Engineering Deep Dive
In high-power motor drivers, **Dead-Time Insertion** is critical. A motor half-bridge contains a high-side MOSFET connected to $V_{\\text{power}}$ and a low-side MOSFET connected to Ground. Because real-world transistors take several hundred nanoseconds to turn off, if the high-side switch turns on before the low-side switch has fully turned off, a catastrophic short circuit (**shoot-through**) connects $V_{\\text{power}}$ directly to Ground, vaporizing the silicon. Advanced microcontroller timers (such as STM32 \`TIM1\`/\`TIM8\`) generate complementary outputs with hardware dead-time generators that enforce non-overlapping switching intervals down to the nanosecond.

## Related Topics
- Digital and Analog Signals
- Interrupts & The NVIC
- Memory Organization & Bus Matrix Topologies
`,
    quiz: {
      title: "Timers, Counters & PWM Assessment",
      description: "Test your mathematical understanding of prescalers, auto-reload values, and PWM modulation.",
      passingScore: 70,
      questions: [
        {
          question: "Given a timer clock of 84 MHz, Prescaler PSC = 3, and ARR = 1049, what is the resulting PWM frequency?",
          codeSnippet: "f_PWM = f_CLK / ((PSC + 1) * (ARR + 1))\nf_CLK = 84,000,000 Hz, PSC = 3, ARR = 1049",
          options: JSON.stringify([
            "10,000 Hz",
            "20,000 Hz",
            "40,000 Hz",
            "84,000 Hz"
          ]),
          correctOptionIndex: 1,
          explanation: "84 MHz / ((3 + 1) * (1049 + 1)) = 84,000,000 / (4 * 1050) = 84,000,000 / 4200 = 20,000 Hz (20 kHz).",
          points: 10,
        },
        {
          question: "Why is hardware dead-time insertion mandatory when controlling complementary H-Bridge motor drivers?",
          codeSnippet: null,
          options: JSON.stringify([
            "It prevents catastrophic shoot-through short circuits between high-side and low-side transistors during switching transitions.",
            "It speeds up the UART baud rate.",
            "It cools down the external quartz crystal.",
            "It allows the motor to run without electrical power."
          ]),
          correctOptionIndex: 0,
          explanation: "Dead-time delays the turn-on of one MOSFET until its complementary partner has fully ceased conducting, preventing power-to-ground short circuits.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "Hardware Timers, Prescalers & Input Capture",
        slug: "timers-prescalers-input-capture",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 18,
        order: 1,
        summary: "Step through timer clock division, auto-reload interrupts, and input frequency capture.",
        content: `### Autonomous Timekeeping
Hardware timers count clock pulses independently of the CPU core, eliminating timing jitter and software overhead.`,
      },
      {
        lessonNumber: 2,
        title: "PWM Generation & Motor Drive Topologies",
        slug: "pwm-generation-motor-drive",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 22,
        order: 2,
        summary: "Calculate PWM period, duty cycles, and complementary dead-time protection for motor inverters.",
        content: `### Pulse Width Modulation
Modulating duty cycle simulates variable voltages and drives BLDC motor inverters with nanosecond precision.`,
      },
    ],
  },

  {
    chapterNumber: 12,
    title: "ADC and DAC",
    slug: "adc-and-dac",
    level: "INTERMEDIATE",
    estimatedMinutes: 35,
    summary:
      "Convert analog voltages into digital words with Successive Approximation Register (SAR) ADCs, manage reference voltages, and synthesize analog voltages via DACs.",
    keyTakeaways: JSON.stringify([
      "An ADC samples continuous physical voltages and quantizes them into discrete binary integers.",
      "Most modern microcontrollers utilize 12-bit Successive Approximation Register (SAR) ADCs.",
      "A 12-bit ADC with a 3.3V reference provides a resolution (1 LSB) of approximately 0.806 millivolts.",
      "Digital-to-Analog Converters (DAC) convert digital numbers into genuine continuous analog voltages."
    ]),
    content: `# ADC and DAC: Translating Continuous Realities

## Beginner-Friendly Overview
How does a microcontroller read a temperature sensor or output audio to a speaker?
- **ADC (Analog-to-Digital Converter):** The translator for incoming signals. An analog sensor might output $1.65\\text{ Volts}$. A 12-bit ADC reads this voltage, tests it against a known reference, and converts it into a digital number: \`2048\`. Your software code can now process that number.
- **DAC (Digital-to-Analog Converter):** The translator for outgoing signals. Your software writes the number \`3000\`, and the DAC generates an actual analog voltage of $2.41\\text{ Volts}$ on an output pin.

## Formal Technical Definition
An **Analog-to-Digital Converter (ADC)** samples continuous voltage waveforms and maps them to a discrete $N$-bit binary integer space ($2^N$ quantization levels). The **Successive Approximation Register (SAR)** topology utilizes an internal Sample-and-Hold (S/H) capacitor, an internal DAC, and a high-speed analog comparator to execute a binary search algorithm resolving one bit per clock cycle from Most Significant Bit (MSB) to Least Significant Bit (LSB).

The voltage resolution of 1 Least Significant Bit (LSB) is given by:
$$\\text{LSB} = \\frac{V_{\\text{REF+}} - V_{\\text{REF-}}}{2^N - 1}$$

## Technical Architecture & Diagram
\`\`\`
Analog Input (Vin: 0 - 3.3V)
           |
           v
+---------------------+
| Sample & Hold (S/H) |
| Capacitor Array     |
+----------+----------+
           |
           v
     Analog Comparator <------- Internal R-2R DAC
           |                           ^
           v                           |
+---------------------+                |
| SAR BINARY SEARCH   |----------------+
| LOGIC ENGINE        |
+----------+----------+
           |
           v
Digital 12-Bit Conversion Result (0 to 4095) -> Data Register (ADC_DR)
\`\`\`

## Real-World Engineering Example
**Medical Pulse Oximeter Sensor:** Red and infrared LEDs shine light through a patient's fingertip onto a photodiode, producing a minute micro-ampere analog current proportional to blood oxygen saturation ($SpO_2$). The analog voltage is amplified and fed into a 12-bit SAR ADC sampling at 100 samples/sec. The microcontroller calculates the ratio of AC to DC absorption peaks to compute blood oxygen percentage with 0.1% resolution.

## Practical Application & Firmware
\`\`\`c
// 12-bit SAR ADC Reading with STM32 Bare-Metal C
#define ADC1_SR   (*(volatile uint32_t*)0x40012000)
#define ADC1_CR2  (*(volatile uint32_t*)0x40012008)
#define ADC1_DR   (*(volatile uint32_t*)0x4001204C)

uint16_t adc_read_channel(void) {
    ADC1_CR2 |= (1 << 30); // SWSTART: Trigger conversion
    while (!(ADC1_SR & (1 << 1))); // Wait until EOC (End Of Conversion) flag sets

    // Read 12-bit result (0 to 4095)
    uint16_t raw_val = (uint16_t)ADC1_DR;
    return raw_val;
}

// Convert raw ADC integer to physical millivolts (Vref = 3300 mV)
uint32_t convert_to_millivolts(uint16_t raw) {
    return (raw * 3300UL) / 4095UL;
}
\`\`\`

## Important Terminology
- **SAR (Successive Approximation Register):** The dominant ADC architecture in microcontrollers, executing a binary search over $N$ clock cycles.
- **Quantization Error:** The intrinsic round-off error between an analog input voltage and the nearest discrete digital representation, bounded by $\\pm \\frac{1}{2}\\text{ LSB}$.
- **VREF:** The stable reference voltage against which all analog inputs are compared.
- **Anti-Aliasing Filter:** An analog low-pass filter placed before an ADC input to reject frequencies higher than half the sampling rate ($f_s / 2$).

## Engineering Deep Dive
SAR ADC accuracy is severely degraded if the analog source impedance ($R_{\\text{AIN}}$) is too high. During the **sampling phase**, the ADC connects the external pin to an internal sampling capacitor ($C_{\\text{ADC}} \\approx 5\\text{ pF}$). If the source impedance exceeds $\\sim 10\\text{ k}\\Omega$, the RC time constant prevents the sampling capacitor from fully charging to the input voltage before conversion begins, causing measurement errors. Firmware engineers must either increase the configured **Sampling Time cycles** (e.g., from 3 cycles to 84 cycles) or place an operational amplifier voltage follower buffer directly before the pin.

## Related Topics
- Digital and Analog Signals
- Timers and Counters
- Direct Memory Access (DMA)
`,
    quiz: {
      title: "ADC & DAC Architecture Assessment",
      description: "Assess your mastery of SAR binary searches, quantization resolution, and reference voltages.",
      passingScore: 70,
      questions: [
        {
          question: "For a 12-bit ADC powered with a 3.3V reference voltage, what is the voltage resolution corresponding to 1 LSB?",
          codeSnippet: "LSB = V_REF / (2^12 - 1)\nV_REF = 3.300 V, 2^12 - 1 = 4095",
          options: JSON.stringify([
            "~0.806 millivolts",
            "~3.30 millivolts",
            "~12.0 millivolts",
            "~50.0 millivolts"
          ]),
          correctOptionIndex: 0,
          explanation: "3.300V / 4095 = 0.0008058V, which is approximately 0.806 millivolts per discrete integer step.",
          points: 10,
        },
        {
          question: "How does a Successive Approximation Register (SAR) ADC resolve an N-bit analog reading?",
          codeSnippet: null,
          options: JSON.stringify([
            "It performs a binary search from MSB to LSB over N clock cycles, comparing the sampled voltage against an internal DAC.",
            "It discharges an external capacitor through a resistor and counts clock ticks.",
            "It relies on an external internet API.",
            "It uses mechanical galvanometers."
          ]),
          correctOptionIndex: 0,
          explanation: "SAR ADCs execute a binary search, testing each bit from MSB to LSB against an internal reference DAC over N clock cycles.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "SAR ADC Mechanics & Quantization Error",
        slug: "sar-adc-quantization",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 16,
        order: 1,
        summary: "Step through sample-and-hold capacitors, binary search trees, and quantization noise.",
        content: `### SAR Conversions
Successive Approximation Register ADCs balance high conversion speed (1-5 Msps) with 12-bit resolution for embedded sensing.`,
      },
      {
        lessonNumber: 2,
        title: "Digital-to-Analog Converters (DAC) & R-2R Resistor Ladders",
        slug: "dac-r2r-resistor-ladders",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 14,
        order: 2,
        summary: "Synthesize analog waveforms using R-2R resistor ladders and voltage output buffers.",
        content: `### Analog Generation
Digital-to-Analog Converters (DAC) generate genuine continuous analog voltages for audio synthesis and motor reference setpoints.`,
      },
    ],
  },

  {
    chapterNumber: 13,
    title: "Interrupts",
    slug: "interrupts",
    level: "INTERMEDIATE",
    estimatedMinutes: 35,
    summary:
      "Respond to real-world stimuli within nanoseconds: Vector Tables, NVIC hardware priority arbitration, tail-chaining, and the critical 'volatile' keyword.",
    keyTakeaways: JSON.stringify([
      "Interrupts enable microcontrollers to respond asynchronously to physical events without wasteful polling loops.",
      "The Nested Vectored Interrupt Controller (NVIC) handles priority arbitration and subpriority preemption.",
      "The Interrupt Vector Table maps peripheral IRQ lines to dedicated Interrupt Service Routine (ISR) function pointers.",
      "Variables shared between ISRs and main thread code must be qualified with volatile to prevent compiler caching."
    ]),
    content: `# Interrupts & The NVIC: Real-Time Event Dispatch

## Beginner-Friendly Overview
Imagine waiting for an important parcel delivery:
- **Polling Approach:** You walk to the front door every 30 seconds, open it, check the porch, and walk back. You get no other work done, waste immense energy, and might still miss the courier by 29 seconds.
- **Interrupt Approach:** You sit at your desk doing productive work. When the courier arrives, they ring the doorbell. You pause what you are doing, answer the door, and resume your work right where you left off.

In a microcontroller, **Interrupts** are electronic doorbells. When a button is pushed, a timer expires, or a serial byte arrives, the hardware pauses the main loop instantly and executes a specialized function called an **Interrupt Service Routine (ISR)**.

## Formal Technical Definition
An **interrupt** is an asynchronous hardware signal asserting an Interrupt Request (IRQ) line that forces the central processing unit to preempt its current execution context, save architectural registers onto the stack, and branch to a deterministic handler address stored in the **Interrupt Vector Table (IVT)**.

In ARM Cortex-M processors, interrupts are governed by the **Nested Vectored Interrupt Controller (NVIC)**, which supports hardware priority grouping (preemption priority vs subpriority), automatic 12-cycle context stacking, and **tail-chaining** (handling back-to-back interrupts in 6 cycles without redundant context restoration).

## Technical Architecture & Diagram
\`\`\`
Normal Execution: Main Thread Loop (Thread Mode)
       |
       |  [ External Signal: Sensor Pin Falling Edge! ]
       v
+-------------------------------------------------------------+
| 1. NVIC EVALUATION: Checks Priority vs Active Context       |
| 2. HARDWARE CONTEXT STACKING: Pushes R0-R3, R12, LR, PC, xPSR|
| 3. VECTOR FETCH: Reads ISR address from 0x0000_005C         |
+-------------------------------------------------------------+
       |
       v
ISR Execution: EXTI0_IRQHandler() [ Handler Mode ]
- Read sensor data
- Set volatile flag: event_ready = true
- Clear hardware pending interrupt flag
       |
       v
+-------------------------------------------------------------+
| 4. HARDWARE UN-STACKING: Pops saved registers from Stack     |
| 5. RETURN FROM EXCEPTION: Restores PC and status flags      |
+-------------------------------------------------------------+
       |
       v
Resumes Main Thread Loop exactly where preempted!
\`\`\`

## Real-World Engineering Example
**Airbag Deployment Electronic Control Unit:** When a vehicle experiences a collision, MEMS crash accelerometers detect an impact exceeding 20 Gs. The sensor pulls an external interrupt pin LOW. The MCU’s NVIC immediately preempts low-priority infotainment and dashboard tasks within 140 nanoseconds, entering the high-priority crash ISR to energize the pyrotechnic airbag squib before the vehicle's structural frame collapses.

## Practical Application & Firmware
\`\`\`c
#include <stdbool.h>
#include <stdint.h>

// CRITICAL: volatile keyword tells compiler this variable changes asynchronously!
volatile bool button_pressed = false;

// Interrupt Service Routine (matched to Vector Table name)
void EXTI0_IRQHandler(void) {
    if (EXTI->PR & (1 << 0)) {     // Check if EXTI line 0 triggered
        button_pressed = true;     // Signal main thread
        EXTI->PR = (1 << 0);       // Clear pending flag by writing 1!
    }
}

int main(void) {
    hardware_init();
    NVIC_EnableIRQ(EXTI0_IRQn);    // Enable interrupt in NVIC
    NVIC_SetPriority(EXTI0_IRQn, 2); // Set priority tier

    while (1) {
        if (button_pressed) {
            button_pressed = false;
            handle_event();
        }
        // CPU can enter low-power sleep waiting for next interrupt
        __WFI(); // Wait For Interrupt: saves power!
    }
}
\`\`\`

## Important Terminology
- **NVIC:** Nested Vectored Interrupt Controller; the integrated silicon block prioritizing and managing interrupts on ARM Cortex-M.
- **Tail-Chaining:** Hardware optimization where consecutive pending interrupts are executed back-to-back without popping and re-pushing context registers.
- **Interrupt Latency:** The exact elapsed time between an external signal asserting an IRQ and the execution of the first instruction in the ISR.
- **Volatile:** A C language type qualifier preventing compiler optimization from caching a variable in a CPU register instead of reading from memory.

## Engineering Deep Dive
Why is the **\`volatile\`** keyword mandatory in firmware? Compilers optimize code under the assumption that variables only change when written by explicit sequential code instructions. In the loop \`while (!button_pressed);\`, an optimizing compiler (\`-O2\`) will load \`button_pressed\` into register \`R1\` once before the loop begins and repeatedly check \`R1\`. Because the ISR runs asynchronously outside the visible sequential flow, the CPU will stay stuck in an infinite loop forever unless \`volatile\` forces the compiler to re-read the variable from SRAM on every single iteration.

## Related Topics
- Program Counter and Stack Pointer
- GPIO: General Purpose Input/Output
- Real-Time Systems & Physical AI
`,
    quiz: {
      title: "Interrupts & The NVIC Assessment",
      description: "Test your understanding of interrupt vectors, context stacking, and compiler volatile invariants.",
      passingScore: 70,
      questions: [
        {
          question: "Why MUST variables modified inside an Interrupt Service Routine (ISR) and checked in the main loop be declared as 'volatile' in C?",
          codeSnippet: "volatile bool flag = false;",
          options: JSON.stringify([
            "To prevent the compiler from caching the variable in a CPU register, forcing an SRAM read on every access.",
            "To encrypt the variable against memory tampering.",
            "To store the variable in Flash memory instead of SRAM.",
            "To allow the variable to be shared over Wi-Fi."
          ]),
          correctOptionIndex: 0,
          explanation: "The volatile qualifier informs the compiler that the variable can be modified asynchronously outside the visible thread of execution, preventing register caching.",
          points: 10,
        },
        {
          question: "What is 'tail-chaining' in the ARM Cortex-M NVIC?",
          codeSnippet: null,
          options: JSON.stringify([
            "A hardware acceleration mechanism that transitions between back-to-back interrupts in 6 cycles without redundant register un-stacking and re-stacking.",
            "A software linked-list algorithm for sorting bytes.",
            "A protocol for chaining multiple USB devices.",
            "A hardware watchdog reset timer."
          ]),
          correctOptionIndex: 0,
          explanation: "Tail-chaining avoids wasteful register restore/save cycles when another interrupt is pending immediately upon exit from an active ISR.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "Interrupt Service Routines & Nested Priority",
        slug: "nested-interrupt-handling",
        difficulty: "BEGINNER",
        estimatedMinutes: 20,
        order: 1,
        summary: "Understand NVIC priority groupings, preemption, and vector table initialization.",
        content: `### Interrupt Architecture
Interrupts provide deterministic response times to asynchronous physical events without wasting CPU compute in polling loops.`,
      },
      {
        lessonNumber: 2,
        title: "NVIC Hardware Context Stacking & Volatile Invariants",
        slug: "nvic-hardware-context-stacking",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 15,
        order: 2,
        summary: "Step through automatic 12-cycle register stacking, tail-chaining, and thread synchronization.",
        content: `### Context Stacking
When an IRQ fires, hardware automatically pushes R0-R3, R12, LR, PC, and xPSR onto the stack in exactly 12 clock cycles.`,
      },
    ],
  },

  {
    chapterNumber: 14,
    title: "Communication Protocols: UART, SPI and I2C",
    slug: "communication-protocols-uart-spi-i2c",
    level: "INTERMEDIATE",
    estimatedMinutes: 40,
    summary:
      "Master the fundamental embedded communication triumvirate: asynchronous UART framing, high-speed synchronous 4-wire SPI, and multi-drop 2-wire open-drain I2C.",
    keyTakeaways: JSON.stringify([
      "UART is asynchronous, using matching baud rates, start/stop framing bits, and two wires (TX, RX).",
      "SPI is synchronous, full-duplex, and ultra-fast (50+ MHz), requiring 4 wires plus a dedicated Chip Select (CS) per peripheral.",
      "I2C is a 2-wire half-duplex open-drain bus with 7-bit addressing, supporting multiple devices with pull-up resistors.",
      "Direct Memory Access (DMA) offloads serial communication transfers completely from the CPU core."
    ]),
    content: `# Embedded Communication Protocols: UART, SPI and I2C

## Beginner-Friendly Overview
Microcontrollers rarely work in isolation; they must talk to displays, sensors, memory chips, and other computers. Instead of running 32 individual copper wires to send a 32-bit number, microcontrollers use **Serial Communication**: sending bits one after another down a small set of wires.

The three primary embedded serial protocols are:
1. **UART:** Two walkie-talkies. No shared clock line; both sides agree in advance to speak at the exact same speed (the Baud Rate). Used for debugging and GPS modules.
2. **SPI:** The high-speed highway. A shared clock line and dedicated data lines allow continuous data streaming up to 80 Megabits per second. Used for SD cards and color display screens.
3. **I2C:** The organized boardroom meeting. Uses only two wires to connect up to 127 different devices. Every chip has an address; when the master speaks an address, only that device responds. Used for sensors and real-time clocks.

## Formal Technical Definition
- **UART (Universal Asynchronous Receiver/Transmitter):** Point-to-point asynchronous serial transmission using NRZ (Non-Return-to-Zero) encoding. Data frames comprise a Start bit, 5-9 data bits (LSB first), optional Parity, and 1-2 Stop bits. Clock recovery relies on $16\\times$ oversampling aligned to the falling edge of the Start bit.
- **SPI (Serial Peripheral Interface):** De facto synchronous, full-duplex, 4-wire master-slave bus (MOSI, MISO, SCK, CS). Clock polarity (\`CPOL\`) and clock phase (\`CPHA\`) define four distinct operating modes.
- **I2C (Inter-Integrated Circuit):** Synchronous, half-duplex, 2-wire (SDA, SCL), multi-master open-drain bus with bidirectional communication governed by 7-bit addressing, hardware ACK/NACK signaling, and clock stretching.

## Technical Architecture & Diagram
\`\`\`
+------------------+-----------------------+--------------------+---------------------+
| PROTOCOL         | WIRES REQUIRED        | MAXIMUM SPEED      | CLOCKING TYPE       |
+------------------+-----------------------+--------------------+---------------------+
| UART             | 2 (TX, RX) + GND      | ~1 - 3 Mbps        | Asynchronous        |
| SPI              | 4 (MOSI, MISO, SCK, CS)| 50 - 80 Mbps       | Synchronous (SCK)   |
| I2C              | 2 (SDA, SCL) + GND    | 100k, 400k, 1 Mbps | Synchronous (SCL)   |
+------------------+-----------------------+--------------------+---------------------+

I2C Open-Drain Bus Structure:
3.3V VDD ----+---------------+
             | Pull-Up Res   | Pull-Up Res
             [ 4.7 kOhm ]    [ 4.7 kOhm ]
             |               |
SCL Line ----+---------------+----------- Master & All Slaves share SCL
             |               |
SDA Line ----+---------------+----------- Master & All Slaves share SDA
             |               |
       [ MCU Master ]  [ Sensor Slave ]
\`\`\`

## Real-World Engineering Example
**Space Station Environmental Monitoring Node:** An environmental monitoring board uses **I2C** at 400 kHz to query ambient temperature, barometric pressure, and humidity sensors on two shared wires. Simultaneously, high-resolution air particulate data is read from an optical mass sensor over high-speed **SPI** at 10 MHz. The processed atmospheric data packet is then transmitted to the central avionics telemetry computer via **UART** RS-422 at 115,200 baud.

## Practical Application & Firmware
\`\`\`c
// Transmitting a Character over UART (STM32 Bare-Metal)
void uart_send_char(char c) {
    // Wait until Transmit Data Register Empty (TXE) flag is set
    while (!(USART2->SR & (1 << 7)));
    USART2->DR = (uint8_t)c; // Write byte to hardware shift register
}

// Full-Duplex SPI Transfer (Send byte and simultaneously receive byte)
uint8_t spi_transfer(uint8_t tx_byte) {
    while (!(SPI1->SR & SPI_SR_TXE)); // Wait for TX buffer empty
    SPI1->DR = tx_byte;               // Initiate clocking & transfer
    while (!(SPI1->SR & SPI_SR_RXNE)); // Wait for RX buffer not empty
    return (uint8_t)SPI1->DR;         // Return received byte
}
\`\`\`

## Important Terminology
- **Baud Rate:** The rate of data transmission expressed in symbols or bits per second (e.g. 115,200 bps).
- **CPOL & CPHA:** Clock Polarity and Clock Phase configurations specifying clock idle level and sampling edges in SPI.
- **Clock Stretching:** An I2C mechanism where a slow slave holds the SCL line LOW to pause the master until it has processed data.
- **ACK / NACK:** Acknowledge (ACK = 0) and Not Acknowledge (NACK = 1) signaling bits asserting reception in I2C.

## Engineering Deep Dive
Why does I2C use open-drain outputs with pull-up resistors while SPI uses push-pull? In push-pull architectures, if two chips accidentally transmit at the same time (one driving 3.3V and the other driving 0V Ground), high currents flow directly through the opposing transistors, resulting in burned output stages. Because I2C uses **open-drain**, chips can only pull the wire LOW; they never drive it HIGH. If two chips transmit simultaneously, the wire simply stays LOW (**Wired-AND** logic). This enables both multi-master bus arbitration and seamless clock stretching without hardware damage.

## Related Topics
- Digital and Analog Signals
- GPIO: General Purpose Input/Output
- Memory Organization & Bus Matrix Topologies
`,
    quiz: {
      title: "Embedded Communication Protocols Assessment",
      description: "Test your mastery of physical layers, packet structures, and timing across UART, SPI, and I2C.",
      passingScore: 70,
      questions: [
        {
          question: "Why does the I2C communication protocol require external pull-up resistors on both the SDA and SCL lines?",
          codeSnippet: null,
          options: JSON.stringify([
            "Because I2C pins are open-drain and can only actively pull the lines LOW; pull-up resistors are required to restore the bus to logic HIGH.",
            "To convert digital signals into radio waves.",
            "To prevent the microcontroller from overheating.",
            "Because I2C operates exclusively on 240 Volts."
          ]),
          correctOptionIndex: 0,
          explanation: "Open-drain nodes only pull signals down to Ground; passive pull-up resistors pull the voltage up to VDD when all nodes are idle.",
          points: 10,
        },
        {
          question: "What is the primary operational advantage of SPI over I2C and UART?",
          codeSnippet: null,
          options: JSON.stringify([
            "Significantly higher throughput (often 50+ MHz) with full-duplex simultaneous transmission and reception.",
            "SPI requires only 1 wire for all devices.",
            "SPI has built-in internet routing protocols.",
            "SPI devices never consume electrical power."
          ]),
          correctOptionIndex: 0,
          explanation: "Dedicated push-pull clock and data lines allow SPI to achieve data rates exceeding 50 Mbps with full-duplex transfers.",
          points: 10,
        },
      ],
    },
    lessons: [
      {
        lessonNumber: 1,
        title: "Asynchronous Serial: UART Framing & Baud Timing",
        slug: "uart-framing-baud-timing",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 15,
        order: 1,
        summary: "Master oversampling clocks, start/stop bit alignment, and parity checks.",
        content: `### Asynchronous Serial
UART transfers data without a shared clock by synchronizing internal oversampling clocks to the falling edge of the Start bit.`,
      },
      {
        lessonNumber: 2,
        title: "SPI vs I2C: Bus Architectures & Signal Integrity",
        slug: "spi-vs-i2c-bus-comparison",
        difficulty: "INTERMEDIATE",
        estimatedMinutes: 20,
        order: 2,
        summary: "Compare high-speed push-pull synchronous SPI with 2-wire open-drain addressed I2C networks.",
        content: `### Bus Comparison
SPI maximizes throughput for single devices, while I2C minimizes pin count for multi-sensor topologies.`,
      },
      {
        lessonNumber: 3,
        title: "Direct Memory Access (DMA) & Zero-Copy Streams",
        slug: "dma-zero-copy-streams",
        difficulty: "ADVANCED",
        estimatedMinutes: 20,
        order: 3,
        summary: "Stream serial and ADC data directly into SRAM buffers without CPU execution.",
        content: `### DMA Offloading
DMA controllers move bulk communication buffers between peripherals and memory without CPU intervention.`,
      },
      {
        lessonNumber: 4,
        title: "Real-Time Determinism & Preemptive Scheduling",
        slug: "real-time-scheduling-rtos",
        difficulty: "ADVANCED",
        estimatedMinutes: 25,
        order: 4,
        summary: "Transition from bare-metal super-loops to preemptive RTOS priority scheduling.",
        content: `### Real-Time Schedulers
Preemptive RTOS schedulers enforce priority guarantees for mission-critical tasks.`,
      },
      {
        lessonNumber: 5,
        title: "Edge AI & TinyML: Quantized Inference on Cortex-M",
        slug: "tinyml-quantized-edge-ai",
        difficulty: "ADVANCED",
        estimatedMinutes: 25,
        order: 5,
        summary: "Execute quantized INT8 deep learning neural networks on low-power microcontrollers.",
        content: `### Physical AI at the Edge
Quantizing neural network weights to 8-bit integers enables machine learning models to run inside MCU SRAM.`,
      },
    ],
  },
];

async function seedMilestone4() {
  console.log("Seeding Milestone 4 Curriculum: 14 Comprehensive Chapters & Quizzes...");

  for (const chData of chaptersData) {
    const { lessons, quiz, ...chapterFields } = chData;

    // 1. Upsert Chapter by chapterNumber
    const chapter = await prisma.chapter.upsert({
      where: { chapterNumber: chapterFields.chapterNumber },
      update: {
        title: chapterFields.title,
        slug: chapterFields.slug,
        level: chapterFields.level,
        estimatedMinutes: chapterFields.estimatedMinutes,
        summary: chapterFields.summary,
        keyTakeaways: chapterFields.keyTakeaways,
        content: chapterFields.content,
        isPublished: true,
      },
      create: {
        chapterNumber: chapterFields.chapterNumber,
        title: chapterFields.title,
        slug: chapterFields.slug,
        level: chapterFields.level,
        estimatedMinutes: chapterFields.estimatedMinutes,
        summary: chapterFields.summary,
        keyTakeaways: chapterFields.keyTakeaways,
        content: chapterFields.content,
        isPublished: true,
      },
    });

    console.log(`✓ Chapter ${chapter.chapterNumber}: ${chapter.title} [${chapter.slug}]`);

    // 2. Upsert Lessons
    if (lessons && lessons.length > 0) {
      for (const les of lessons) {
        await prisma.lesson.upsert({
          where: { slug: les.slug },
          update: {
            chapterId: chapter.id,
            lessonNumber: les.lessonNumber,
            title: les.title,
            difficulty: les.difficulty || "BEGINNER",
            estimatedMinutes: les.estimatedMinutes || 15,
            order: les.order || les.lessonNumber,
            summary: les.summary || les.title,
            content: les.content || "Detailed technical instruction.",
            isPublished: true,
          },
          create: {
            chapterId: chapter.id,
            lessonNumber: les.lessonNumber,
            title: les.title,
            slug: les.slug,
            difficulty: les.difficulty || "BEGINNER",
            estimatedMinutes: les.estimatedMinutes || 15,
            order: les.order || les.lessonNumber,
            summary: les.summary || les.title,
            content: les.content || "Detailed technical instruction.",
            isPublished: true,
          },
        });
      }
    }

    // 3. Upsert Quiz & Questions
    if (quiz) {
      let existingQuiz = await prisma.quiz.findUnique({
        where: { chapterId: chapter.id },
      });

      if (!existingQuiz) {
        existingQuiz = await prisma.quiz.create({
          data: {
            chapterId: chapter.id,
            title: quiz.title,
            description: quiz.description,
            passingScore: quiz.passingScore,
          },
        });
      } else {
        existingQuiz = await prisma.quiz.update({
          where: { id: existingQuiz.id },
          data: {
            title: quiz.title,
            description: quiz.description,
            passingScore: quiz.passingScore,
          },
        });
      }

      // Upsert questions
      if (quiz.questions && quiz.questions.length > 0) {
        // Delete previous questions to replace with fresh rich questions
        await prisma.quizQuestion.deleteMany({
          where: { quizId: existingQuiz.id },
        });

        for (const q of quiz.questions) {
          await prisma.quizQuestion.create({
            data: {
              quizId: existingQuiz.id,
              question: q.question,
              codeSnippet: q.codeSnippet,
              options: q.options,
              correctOptionIndex: q.correctOptionIndex,
              explanation: q.explanation,
              points: q.points,
            },
          });
        }
      }
    }
  }

  const finalChapterCount = await prisma.chapter.count();
  const finalLessonCount = await prisma.lesson.count();
  const finalQuizCount = await prisma.quiz.count();
  const finalQuestionCount = await prisma.quizQuestion.count();

  console.log("=======================================================");
  console.log(`  MILESTONE 4 CURRICULUM SEED COMPLETE`);
  console.log(`  Chapters in DB:  ${finalChapterCount}`);
  console.log(`  Lessons in DB:   ${finalLessonCount}`);
  console.log(`  Quizzes in DB:   ${finalQuizCount}`);
  console.log(`  Questions in DB: ${finalQuestionCount}`);
  console.log("=======================================================");
}

seedMilestone4()
  .catch((err) => {
    console.error("Error seeding Milestone 4:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });