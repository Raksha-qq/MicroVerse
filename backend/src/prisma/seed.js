const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting MICROVERSE database seed...");

  // 1. Clean existing records safely
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.savedExperiment.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.controller.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const adminPassword = await bcrypt.hash("AdminPass123!", 10);
  const engineerPassword = await bcrypt.hash("Engineer123!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@microverse.lab",
      passwordHash: adminPassword,
      name: "Dr. Elena Vance",
      role: "ADMIN",
      bio: "Lead Embedded Architect & Physical AI Systems Director at MICROVERSE Laboratories.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
  });

  const engineer = await prisma.user.create({
    data: {
      email: "engineer@microverse.lab",
      passwordHash: engineerPassword,
      name: "Alex Mercer",
      role: "USER",
      bio: "Firmware and Mechatronics Engineer exploring real-time control and TinyML.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("Users seeded successfully.");

  // 3. Seed Badges
  const badges = [
    {
      code: "FIRST_EXPERIMENT",
      title: "Silicon Ignition",
      description: "Initialized and ran your first interactive microcontroller experiment.",
      icon: "Zap",
      category: "Laboratory",
    },
    {
      code: "BIT_TWIDDLER",
      title: "Bit Twiddler",
      description: "Successfully configured GPIO MODER and bitmask registers in the lab.",
      icon: "Binary",
      category: "Firmware",
    },
    {
      code: "TIMER_MAESTRO",
      title: "Timer Maestro",
      description: "Calibrated hardware prescalers and generated stable PWM waveforms.",
      icon: "Clock",
      category: "Hardware",
    },
    {
      code: "PROTOCOL_SLEUTH",
      title: "Protocol Sleuth",
      description: "Captured and decoded serial packets on UART, SPI, or I2C bus analyzer.",
      icon: "Activity",
      category: "Communication",
    },
    {
      code: "PID_NAVIGATOR",
      title: "Closed-Loop Pilot",
      description: "Tuned robotic joint PID gains to achieve critically damped convergence.",
      icon: "Compass",
      category: "Robotics",
    },
    {
      code: "SILICON_SCHOLAR",
      title: "Silicon Scholar",
      description: "Completed educational chapters and proved architectural mastery.",
      icon: "GraduationCap",
      category: "Knowledge",
    },
  ];

  for (const b of badges) {
    await prisma.badge.create({ data: b });
  }

  // Grant demo user some starting badges
  const b1 = await prisma.badge.findUnique({ where: { code: "FIRST_EXPERIMENT" } });
  const b2 = await prisma.badge.findUnique({ where: { code: "BIT_TWIDDLER" } });
  if (b1) await prisma.userBadge.create({ data: { userId: engineer.id, badgeId: b1.id } });
  if (b2) await prisma.userBadge.create({ data: { userId: engineer.id, badgeId: b2.id } });

  console.log("Badges seeded successfully.");

  // 4. Seed Microcontrollers
  const controllers = [
    // STM32 Family
    {
      name: "STM32F401RET6",
      commonName: "STM32F401RE (Nucleo Core)",
      family: "STM32",
      architecture: "ARMv7E-M (32-bit RISC)",
      core: "ARM Cortex-M4 with FPU",
      manufacturer: "STMicroelectronics",
      bitWidth: 32,
      maxClockSpeedMHz: 84.0,
      flashKb: 512.0,
      sramKb: 96.0,
      eepromKb: null,
      operatingVoltageMin: 1.7,
      operatingVoltageMax: 3.6,
      logicLevel: "3.3V (5V tolerant I/O)",
      gpioCount: 50,
      adcChannels: 16,
      adcResolutionBits: 12,
      dacChannels: 0,
      timers: 11,
      uartCount: 3,
      spiCount: 4,
      i2cCount: 3,
      canCount: 0,
      usbSupport: true,
      wireless: "None (Requires external transceiver)",
      fpu: true,
      dsp: true,
      dmaChannels: 16,
      deepSleepCurrentUa: 11.0,
      packageTypes: "LQFP64, UFQFPN48, WLCSP49",
      description: "High-performance Dynamic Efficiency line featuring ARM Cortex-M4 with single-precision FPU and DSP instructions. Includes ST ART Accelerator (Adaptive Real-Time memory accelerator) achieving 0-wait state execution from Flash at 84 MHz.",
      architecturalNotes: "Commonly encountered on ST Nucleo-F401RE boards. Notice: The board includes an ST-LINK debugger and Arduino Uno rev3 headers, but the chip is STM32F401RET6 running ARMv7E-M architecture.",
      datasheetUrl: "https://www.st.com/resource/en/datasheet/stm32f401re.pdf",
      pinoutDiagram: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      isFeatured: true,
    },
    {
      name: "STM32F103C8T6",
      commonName: "STM32F103C8 ('Blue Pill')",
      family: "STM32",
      architecture: "ARMv7-M (32-bit RISC)",
      core: "ARM Cortex-M3",
      manufacturer: "STMicroelectronics",
      bitWidth: 32,
      maxClockSpeedMHz: 72.0,
      flashKb: 64.0,
      sramKb: 20.0,
      eepromKb: null,
      operatingVoltageMin: 2.0,
      operatingVoltageMax: 3.6,
      logicLevel: "3.3V (Most pins 5V tolerant)",
      gpioCount: 37,
      adcChannels: 10,
      adcResolutionBits: 12,
      dacChannels: 0,
      timers: 4,
      uartCount: 3,
      spiCount: 2,
      i2cCount: 2,
      canCount: 1,
      usbSupport: true,
      wireless: "None",
      fpu: false,
      dsp: false,
      dmaChannels: 7,
      deepSleepCurrentUa: 14.0,
      packageTypes: "LQFP48",
      description: "Industry-standard Medium-density performance line MCU based on Cortex-M3. Ubiquitous in maker projects via the low-cost 'Blue Pill' development board. Contains USB 2.0 Full Speed and CAN 2.0B interfaces sharing a dedicated 512-byte SRAM.",
      architecturalNotes: "The 'Blue Pill' is merely a breakout PCB layout; the chip is STM32F103C8T6. Does not feature hardware floating-point; float math is handled via software emulation.",
      datasheetUrl: "https://www.st.com/resource/en/datasheet/stm32f103c8.pdf",
      pinoutDiagram: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
      isFeatured: false,
    },
    {
      name: "STM32H743VIT6",
      commonName: "STM32H743VI High-Performance",
      family: "STM32",
      architecture: "ARMv7E-M (32-bit RISC with L1 Cache)",
      core: "ARM Cortex-M7 with DP-FPU",
      manufacturer: "STMicroelectronics",
      bitWidth: 32,
      maxClockSpeedMHz: 480.0,
      flashKb: 2048.0,
      sramKb: 1024.0,
      eepromKb: null,
      operatingVoltageMin: 1.62,
      operatingVoltageMax: 3.6,
      logicLevel: "3.3V",
      gpioCount: 82,
      adcChannels: 36,
      adcResolutionBits: 16,
      dacChannels: 2,
      timers: 22,
      uartCount: 8,
      spiCount: 6,
      i2cCount: 4,
      canCount: 2,
      usbSupport: true,
      wireless: "None",
      fpu: true,
      dsp: true,
      dmaChannels: 22,
      deepSleepCurrentUa: 32.0,
      packageTypes: "LQFP100, TFBGA100",
      description: "Extreme performance flagship microcontroller featuring 480 MHz ARM Cortex-M7 with 32KB I-Cache, 32KB D-Cache, double-precision FPU, 1MB SRAM, hardware cryptographic accelerator, and Chrom-ART 2D graphical accelerator. Prime choice for Physical AI vision edge inference.",
      architecturalNotes: "High-speed AXI system bus matrix with dedicated TCM (Tightly Coupled Memory) for zero-latency deterministic interrupt response.",
      datasheetUrl: "https://www.st.com/resource/en/datasheet/stm32h743vi.pdf",
      pinoutDiagram: null,
      isFeatured: true,
    },

    // AVR Family
    {
      name: "ATmega328P",
      commonName: "ATmega328P (8-bit AVR)",
      family: "AVR",
      architecture: "AVR 8-bit Harvard RISC",
      core: "AVR Core",
      manufacturer: "Microchip Technology (formerly Atmel)",
      bitWidth: 8,
      maxClockSpeedMHz: 20.0,
      flashKb: 32.0,
      sramKb: 2.0,
      eepromKb: 1.0,
      operatingVoltageMin: 1.8,
      operatingVoltageMax: 5.5,
      logicLevel: "5.0V (Standard) or 3.3V",
      gpioCount: 23,
      adcChannels: 6,
      adcResolutionBits: 10,
      dacChannels: 0,
      timers: 3,
      uartCount: 1,
      spiCount: 1,
      i2cCount: 1,
      canCount: 0,
      usbSupport: false,
      wireless: "None",
      fpu: false,
      dsp: false,
      dmaChannels: 0,
      deepSleepCurrentUa: 0.1,
      packageTypes: "DIP-28, TQFP-32, QFN/MLF-32",
      description: "Low-power CMOS 8-bit microcontroller based on the AVR enhanced RISC architecture. Executes powerful instructions in a single clock cycle, achieving throughputs approaching 1 MIPS per MHz. Famous as the core chip on the Arduino Uno Rev3 and Nano boards.",
      architecturalNotes: "CRITICAL DISTINCTION: Arduino Uno is a development board; ATmega328P is the microcontroller; AVR is the processor architecture; C++/Wiring with avr-gcc is the toolchain. Never confuse Arduino as an architecture.",
      datasheetUrl: "https://ww1.microchip.com/downloads/en/DeviceDoc/ATmega48A-PA-88A-PA-168A-PA-328-P-DS-DS40002061B.pdf",
      pinoutDiagram: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
      isFeatured: true,
    },
    {
      name: "ATtiny85",
      commonName: "ATtiny85 (Ultra-Compact AVR)",
      family: "AVR",
      architecture: "AVR 8-bit Harvard RISC",
      core: "AVR Tiny Core",
      manufacturer: "Microchip Technology",
      bitWidth: 8,
      maxClockSpeedMHz: 20.0,
      flashKb: 8.0,
      sramKb: 0.512,
      eepromKb: 0.512,
      operatingVoltageMin: 1.8,
      operatingVoltageMax: 5.5,
      logicLevel: "5.0V / 3.3V",
      gpioCount: 6,
      adcChannels: 4,
      adcResolutionBits: 10,
      dacChannels: 0,
      timers: 2,
      uartCount: 0,
      spiCount: 1,
      i2cCount: 1,
      canCount: 0,
      usbSupport: false,
      wireless: "None",
      fpu: false,
      dsp: false,
      dmaChannels: 0,
      deepSleepCurrentUa: 0.1,
      packageTypes: "DIP-8, SOIC-8, TSSOP-8, QFN-20",
      description: "Extremely compact 8-pin microcontroller with 8KB in-system programmable Flash. Features a high-speed 64MHz PLL timer capable of fast PWM output for audio synthesis and switching regulator control.",
      architecturalNotes: "No dedicated hardware UART module; serial communication is achieved via software bit-banging or the Universal Serial Interface (USI).",
      datasheetUrl: "https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-2586-AVR-8-bit-Microcontroller-ATtiny25-ATtiny45-ATtiny85_Datasheet.pdf",
      pinoutDiagram: null,
      isFeatured: false,
    },

    // ESP32 Family
    {
      name: "ESP32-D0WDQ6",
      commonName: "ESP32 (Original Dual-Core)",
      family: "ESP32",
      architecture: "Tensilica Xtensa Dual-Core 32-bit LX6",
      core: "Xtensa LX6 (Dual Core)",
      manufacturer: "Espressif Systems",
      bitWidth: 32,
      maxClockSpeedMHz: 240.0,
      flashKb: 4096.0,
      sramKb: 520.0,
      eepromKb: null,
      operatingVoltageMin: 2.3,
      operatingVoltageMax: 3.6,
      logicLevel: "3.3V (Strictly NOT 5V tolerant)",
      gpioCount: 34,
      adcChannels: 18,
      adcResolutionBits: 12,
      dacChannels: 2,
      timers: 4,
      uartCount: 3,
      spiCount: 3,
      i2cCount: 2,
      canCount: 1,
      usbSupport: false,
      wireless: "Wi-Fi 802.11 b/g/n + Bluetooth 4.2 BR/EDR & BLE",
      fpu: true,
      dsp: true,
      dmaChannels: 8,
      deepSleepCurrentUa: 5.0,
      packageTypes: "QFN-48 (Module: ESP-WROOM-32)",
      description: "Revolutionary IoT System-on-Chip integrating dual-core 32-bit Xtensa LX6 processors, integrated 2.4 GHz Wi-Fi and Bluetooth 4.2 baseband/MAC, hardware cryptographic engines (AES, SHA-2, RSA, ECC), and an ultra-low-power (ULP) coprocessor.",
      architecturalNotes: "Dual-core asymmetric/symmetric multiprocessing (PRO_CPU and APP_CPU). Utilizes FreeRTOS natively in ESP-IDF. The Flash memory is external QSPI Flash mapped into CPU address space via MMU cache.",
      datasheetUrl: "https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf",
      pinoutDiagram: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      isFeatured: true,
    },
    {
      name: "ESP32-S3",
      commonName: "ESP32-S3 (AI & Vector Acceleration)",
      family: "ESP32",
      architecture: "Xtensa Dual-Core 32-bit LX7 with Vector Extensions",
      core: "Xtensa LX7 Vector",
      manufacturer: "Espressif Systems",
      bitWidth: 32,
      maxClockSpeedMHz: 240.0,
      flashKb: 8192.0,
      sramKb: 512.0,
      eepromKb: null,
      operatingVoltageMin: 3.0,
      operatingVoltageMax: 3.6,
      logicLevel: "3.3V",
      gpioCount: 45,
      adcChannels: 20,
      adcResolutionBits: 12,
      dacChannels: 0,
      timers: 4,
      uartCount: 3,
      spiCount: 4,
      i2cCount: 2,
      canCount: 1,
      usbSupport: true,
      wireless: "Wi-Fi 802.11 b/g/n + Bluetooth 5.0 (LE / Mesh)",
      fpu: true,
      dsp: true,
      dmaChannels: 10,
      deepSleepCurrentUa: 7.0,
      packageTypes: "QFN-56 (Modules: ESP32-S3-WROOM-1/2)",
      description: "Designed specifically for Edge AI and TinyML applications. Integrates dual-core Xtensa LX7 with SIMD vector instructions specifically accelerating INT8 quantized neural network inference, matrix multiplication, and FFT calculations.",
      architecturalNotes: "Includes native USB OTG full-speed controller and dedicated camera/LCD parallel interfaces. Ideal for voice recognition and low-cost vision AI pipelines.",
      datasheetUrl: "https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf",
      pinoutDiagram: null,
      isFeatured: true,
    },
    {
      name: "ESP32-C3",
      commonName: "ESP32-C3 (Open RISC-V Architecture)",
      family: "ESP32",
      architecture: "RISC-V 32-bit RV32IMC",
      core: "Single-core RISC-V",
      manufacturer: "Espressif Systems",
      bitWidth: 32,
      maxClockSpeedMHz: 160.0,
      flashKb: 4096.0,
      sramKb: 400.0,
      eepromKb: null,
      operatingVoltageMin: 3.0,
      operatingVoltageMax: 3.6,
      logicLevel: "3.3V",
      gpioCount: 22,
      adcChannels: 6,
      adcResolutionBits: 12,
      dacChannels: 0,
      timers: 2,
      uartCount: 2,
      spiCount: 3,
      i2cCount: 1,
      canCount: 1,
      usbSupport: false,
      wireless: "Wi-Fi 4 (802.11 b/g/n) + Bluetooth 5.0 LE",
      fpu: false,
      dsp: false,
      dmaChannels: 3,
      deepSleepCurrentUa: 5.0,
      packageTypes: "QFN-32",
      description: "Entry-level cost-effective IoT chip based on the open-standard RISC-V 32-bit instruction set architecture (RV32IMC). Replaces legacy 8-bit and 16-bit controllers with 32-bit RISC-V performance.",
      architecturalNotes: "Implements standard 32-bit RISC-V integer, multiplication/division, and compressed instruction set extensions.",
      datasheetUrl: "https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf",
      pinoutDiagram: null,
      isFeatured: false,
    },

    // RP2040 Family
    {
      name: "RP2040",
      commonName: "RP2040 (Raspberry Pi Dual-Cortex-M0+)",
      family: "RP2040",
      architecture: "ARMv6-M (32-bit RISC)",
      core: "Dual-Core ARM Cortex-M0+",
      manufacturer: "Raspberry Pi Ltd",
      bitWidth: 32,
      maxClockSpeedMHz: 133.0,
      flashKb: 2048.0,
      sramKb: 264.0,
      eepromKb: null,
      operatingVoltageMin: 1.8,
      operatingVoltageMax: 3.3,
      logicLevel: "3.3V (NOT 5V tolerant)",
      gpioCount: 30,
      adcChannels: 4,
      adcResolutionBits: 12,
      dacChannels: 0,
      timers: 2,
      uartCount: 2,
      spiCount: 2,
      i2cCount: 2,
      canCount: 0,
      usbSupport: true,
      wireless: "None (External CYW43439 on Pico W board)",
      fpu: false,
      dsp: false,
      dmaChannels: 12,
      deepSleepCurrentUa: 180.0,
      packageTypes: "QFN-56 (7x7mm)",
      description: "First custom silicon designed by Raspberry Pi. Contains dual ARM Cortex-M0+ cores, 264KB multi-bank SRAM, and a groundbreaking Programmable I/O (PIO) peripheral containing 8 autonomous state machines that can bit-bang custom hardware protocols (DVI, VGA, WS2812B, CAN) without CPU intervention.",
      architecturalNotes: "No internal Flash memory; executes code from external SPI/QSPI NOR Flash via an internal 16KB direct-mapped cache.",
      datasheetUrl: "https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf",
      pinoutDiagram: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
      isFeatured: true,
    },
    {
      name: "RP2350A",
      commonName: "RP2350 (Dual Cortex-M33 / Hazard3 RISC-V)",
      family: "RP2040",
      architecture: "ARMv8-M / RISC-V Dual Architecture",
      core: "Dual ARM Cortex-M33 OR Dual Hazard3 RISC-V",
      manufacturer: "Raspberry Pi Ltd",
      bitWidth: 32,
      maxClockSpeedMHz: 150.0,
      flashKb: 4096.0,
      sramKb: 520.0,
      eepromKb: null,
      operatingVoltageMin: 1.8,
      operatingVoltageMax: 3.3,
      logicLevel: "3.3V",
      gpioCount: 30,
      adcChannels: 4,
      adcResolutionBits: 12,
      dacChannels: 0,
      timers: 4,
      uartCount: 2,
      spiCount: 2,
      i2cCount: 2,
      canCount: 0,
      usbSupport: true,
      wireless: "None",
      fpu: true,
      dsp: true,
      dmaChannels: 16,
      deepSleepCurrentUa: 120.0,
      packageTypes: "QFN-60",
      description: "Second-generation silicon from Raspberry Pi featuring user-selectable boot into either dual ARM Cortex-M33 cores with TrustZone & FPU or dual Hazard3 open-source RISC-V cores. Enhanced PIO system upgraded to 12 state machines.",
      architecturalNotes: "Features hardware SHA-256 accelerator, true random number generator (TRNG), and anti-glitch power security filters.",
      datasheetUrl: "https://datasheets.raspberrypi.com/rp2350/rp2350-datasheet.pdf",
      pinoutDiagram: null,
      isFeatured: false,
    },

    // PIC Family
    {
      name: "PIC16F877A",
      commonName: "PIC16F877A (Mid-Range 8-bit PIC)",
      family: "PIC",
      architecture: "PIC Mid-Range 14-bit Word Harvard RISC",
      core: "PIC16 Core (35 Instructions)",
      manufacturer: "Microchip Technology",
      bitWidth: 8,
      maxClockSpeedMHz: 20.0,
      flashKb: 14.3,
      sramKb: 0.368,
      eepromKb: 0.256,
      operatingVoltageMin: 2.0,
      operatingVoltageMax: 5.5,
      logicLevel: "5.0V",
      gpioCount: 33,
      adcChannels: 8,
      adcResolutionBits: 10,
      dacChannels: 0,
      timers: 3,
      uartCount: 1,
      spiCount: 1,
      i2cCount: 1,
      canCount: 0,
      usbSupport: false,
      wireless: "None",
      fpu: false,
      dsp: false,
      dmaChannels: 0,
      deepSleepCurrentUa: 0.3,
      packageTypes: "DIP-40, PLCC-44, TQFP-44",
      description: "Classic educational workhorse 8-bit microcontroller with 35 single-word instructions. Features 10-bit analog-to-digital converter, Capture/Compare/PWM (CCP) modules, and Synchronous Serial Port supporting SPI and I2C.",
      architecturalNotes: "Uses banked RAM architecture (4 banks) requiring explicit register page manipulation (STATUS register RP0/RP1 bits) in assembly language.",
      datasheetUrl: "https://ww1.microchip.com/downloads/en/DeviceDoc/39582b.pdf",
      pinoutDiagram: null,
      isFeatured: true,
    },
    {
      name: "PIC32MZ2048EFH144",
      commonName: "PIC32MZ EF (MIPS32 with FPU)",
      family: "PIC",
      architecture: "MIPS32 microAptiv / M-Class",
      core: "MIPS M5150 with Hardware FPU",
      manufacturer: "Microchip Technology",
      bitWidth: 32,
      maxClockSpeedMHz: 252.0,
      flashKb: 2048.0,
      sramKb: 512.0,
      eepromKb: null,
      operatingVoltageMin: 2.1,
      operatingVoltageMax: 3.6,
      logicLevel: "3.3V",
      gpioCount: 120,
      adcChannels: 48,
      adcResolutionBits: 12,
      dacChannels: 0,
      timers: 9,
      uartCount: 6,
      spiCount: 6,
      i2cCount: 5,
      canCount: 2,
      usbSupport: true,
      wireless: "None",
      fpu: true,
      dsp: true,
      dmaChannels: 8,
      deepSleepCurrentUa: 45.0,
      packageTypes: "TQFP-144, LQFP-144",
      description: "High-end 32-bit microcontroller built on MIPS32 architecture delivering 415 DMIPS at 252 MHz. Equipped with single and double-precision IEEE-754 FPU, Hi-Speed USB 2.0 with PHY, 10/100 Ethernet MAC, and dual CAN 2.0B interfaces.",
      architecturalNotes: "MIPS architecture features 32 general-purpose 32-bit registers (zero, at, v0-v1, a0-a3, t0-t9, s0-s7, k0-k1, gp, sp, fp, ra) unlike ARM's register conventions.",
      datasheetUrl: "https://ww1.microchip.com/downloads/en/DeviceDoc/PIC32MZ-Embedded-Connectivity-with-Floating-Point-Unit-Family-Data-Sheet-DS60001320H.pdf",
      pinoutDiagram: null,
      isFeatured: false,
    },

    // 8051 Family
    {
      name: "AT89S52",
      commonName: "AT89S52 (Modern In-System 8051)",
      family: "8051",
      architecture: "MCS-51 8-bit CISC Harvard",
      core: "8051 Core",
      manufacturer: "Microchip Technology (formerly Atmel)",
      bitWidth: 8,
      maxClockSpeedMHz: 33.0,
      flashKb: 8.0,
      sramKb: 0.256,
      eepromKb: null,
      operatingVoltageMin: 4.0,
      operatingVoltageMax: 5.5,
      logicLevel: "5.0V TTL",
      gpioCount: 32,
      adcChannels: 0,
      adcResolutionBits: 0,
      dacChannels: 0,
      timers: 3,
      uartCount: 1,
      spiCount: 0,
      i2cCount: 0,
      canCount: 0,
      usbSupport: false,
      wireless: "None",
      fpu: false,
      dsp: false,
      dmaChannels: 0,
      deepSleepCurrentUa: 50.0,
      packageTypes: "DIP-40, PLCC-44, TQFP-44",
      description: "Low-power, high-performance CMOS 8-bit microcontroller with 8KB of In-System Programmable (ISP) Flash memory. Compatible with the industry-standard 80C51 instruction set and pinout. Includes 256 bytes of internal RAM, 32 I/O lines, and three 16-bit timer/counters.",
      architecturalNotes: "Classic CISC machine with separate Program ROM and Data RAM address spaces (MOVC vs MOVX instructions), Accumulator (ACC) and B register for hardware MUL/DIV.",
      datasheetUrl: "https://ww1.microchip.com/downloads/en/DeviceDoc/doc1919.pdf",
      pinoutDiagram: null,
      isFeatured: true,
    },
    {
      name: "C8051F380",
      commonName: "Silicon Labs C8051F380 (Pipelined 48MHz USB 8051)",
      family: "8051",
      architecture: "CIP-51 Pipelined 8-bit CISC",
      core: "CIP-51 (1 Clock Cycle per Instruction)",
      manufacturer: "Silicon Laboratories",
      bitWidth: 8,
      maxClockSpeedMHz: 48.0,
      flashKb: 64.0,
      sramKb: 4.352,
      eepromKb: null,
      operatingVoltageMin: 2.7,
      operatingVoltageMax: 5.25,
      logicLevel: "5.0V / 3.3V Tolerant",
      gpioCount: 40,
      adcChannels: 21,
      adcResolutionBits: 10,
      dacChannels: 0,
      timers: 5,
      uartCount: 2,
      spiCount: 1,
      i2cCount: 1,
      canCount: 0,
      usbSupport: true,
      wireless: "None",
      fpu: false,
      dsp: false,
      dmaChannels: 0,
      deepSleepCurrentUa: 8.0,
      packageTypes: "TQFP-48, QFN-32",
      description: "Ultra-modern pipelined 8051 microcontroller running at 48 MIPS (70% of instructions execute in 1 clock cycle). Contains dedicated Full-Speed USB 2.0 controller with integrated clock recovery, high-speed 10-bit 500ksps ADC, and internal oscillator.",
      architecturalNotes: "Solves the traditional 12-clock-cycle limitation of the original 1980 Intel 8051 through a pipelined instruction decoder.",
      datasheetUrl: "https://www.silabs.com/documents/public/data-sheets/C8051F38x.pdf",
      pinoutDiagram: null,
      isFeatured: false,
    },
  ];

  for (const c of controllers) {
    await prisma.controller.create({ data: c });
  }

  console.log(`Seeded ${controllers.length} Microcontrollers successfully.`);

  // 5. Seed 8 Chapters with Authentic Embedded Curricula
  const chapters = [
    {
      chapterNumber: 1,
      title: "Foundations of Embedded Computing: Architecture & Topology",
      slug: "foundations-of-embedded-computing",
      level: "BEGINNER",
      estimatedMinutes: 25,
      summary: "Understand the core dichotomy between microprocessors and microcontrollers, explore Harvard vs Von Neumann architectures, and master clock generation and bus matrix topologies.",
      keyTakeaways: JSON.stringify([
        "A microcontroller integrates CPU, memory, and peripheral controllers on a monolithic die, whereas a microprocessor relies on external buses.",
        "Harvard architecture separates program and data memory buses, permitting simultaneous instruction fetch and data read/write.",
        "Clock generation utilizes crystal oscillators (HSE) multiplied via Phase-Locked Loops (PLL) and divided by prescalers for peripheral sub-systems.",
        "Arduino is an open hardware development board and software wiring library, NOT an architecture or silicon chip."
      ]),
      content: `## 1. Microprocessor (MPU) vs Microcontroller (MCU)

In computing engineering, the fundamental divide lies between **discrete system architectures** and **monolithic embedded systems**:

* **Microprocessor (e.g., Intel Core i9, AMD Ryzen, ARM Cortex-A78):**
  A general-purpose computational engine containing high-speed ALUs, register files, and multi-level caches (L1/L2/L3), but **no integrated persistent RAM, Flash, or physical I/O ports on the CPU silicon die**. It requires external memory controllers, DDR5 DRAM chips, power management ICs (PMICs), and chipset bridges communicating over high-speed differential transmission lines (PCIe, QPI).

* **Microcontroller (e.g., STM32F401, ATmega328P, RP2040):**
  A self-contained computer on a single silicon chip (System-on-Chip). It incorporates the **CPU Core**, **volatile static RAM (SRAM)**, **non-volatile program memory (NOR Flash / EEPROM)**, **system clock generators (Oscillator/PLL)**, and **hardware peripherals (GPIO, Timers, ADC, UART, SPI, I2C, DMA)** directly connected via an internal multi-layer bus matrix.

\`\`\`
+-------------------------------------------------------+
|                MICROCONTROLLER DIE                    |
|                                                       |
|  +---------------+  +------------+  +--------------+  |
|  | CPU Core      |  | Flash      |  | SRAM         |  |
|  | (ALU/Regs)    |  | (Code/ROM) |  | (Data/Stack) |  |
|  +-------+-------+  +-----+------+  +------+-------+  |
|          |                |                |          |
|  ========+================+================+========  |
|                  INTERNAL BUS MATRIX                  |
|  ========+================+================+========  |
|          |                |                |          |
|  +-------+-------+  +-----+------+  +------+-------+  |
|  | GPIO / Timers |  | ADC / DAC  |  | USART/SPI/I2C|  |
|  +---------------+  +------------+  +--------------+  |
+-------------------------------------------------------+
\`\`\`

---

## 2. Von Neumann vs. Harvard Architecture

### Von Neumann Architecture
Both machine code instructions and program data share a single physical bus and memory address space.
* **Bottleneck:** The "Von Neumann Bottleneck" — the CPU cannot simultaneously read an instruction and read/write operand data during the same clock cycle.
* **Example:** Original Intel x86, classic CISC processors.

### Harvard Architecture
Physical memory and data transmission buses are physically isolated into **Program Memory (ROM/Flash)** and **Data Memory (SRAM)**.
* **Advantage:** The CPU can fetch the next 32-bit instruction word over the **Instruction Bus (ICode)** at the exact same clock edge that the ALU loads an 8-bit or 32-bit variable over the **Data Bus (DCode)**.
* **Example:** AVR (ATmega328P), PIC, and modern ARM Cortex-M (Modified Harvard with unified memory map but separate internal bus lines).

---

## 3. Clock Distribution & The Phase-Locked Loop (PLL)

Microcontrollers do not run from a single static clock. They employ a **Clock Tree**:

1. **HSI (High-Speed Internal):** An on-chip RC oscillator (e.g., 16 MHz in STM32). Fast boot-up, low cost, but sensitive to thermal drift (±1% to ±2% accuracy).
2. **HSE (High-Speed External):** An external quartz crystal resonator (e.g., 8 MHz or 25 MHz) providing high stability (±20 ppm), essential for USB, CAN, and high-speed UART baud rates.
3. **PLL (Phase-Locked Loop):** An analog frequency multiplier that multiplies an input clock frequency by a factor $N$ and divides by $M$:
   $$f_{\\text{SYSCLK}} = f_{\\text{IN}} \\times \\frac{N}{M \\times P}$$
   For example, in an STM32F4: an 8 MHz HSE crystal is divided by 8 ($1\\text{ MHz}$), multiplied by 336 ($336\\text{ MHz}$), and divided by 4 to generate an $84\\text{ MHz}$ system clock.
4. **Prescalers:** Programmable frequency dividers (AHB Prescaler, APB1 Prescaler, APB2 Prescaler) that step down the clock for lower-frequency peripheral buses to conserve power.

---

## 4. The Cardinal Rule: Arduino is NOT an Architecture

In professional embedded engineering:
* **Architecture:** The Instruction Set Architecture (ISA) and execution model (e.g., **ARMv7E-M**, **AVR 8-bit RISC**, **Xtensa LX6**, **RISC-V RV32IMC**).
* **Microcontroller:** The integrated silicon component (e.g., **ATmega328P-PU**, **STM32F401RET6**).
* **Development Board:** The PCB carrier providing power regulation, crystal, pin headers, and USB-to-UART bridge (e.g., **Arduino Uno Rev3**, **STM32 Nucleo-64**, **ESP32 NodeMCU**).
* **Software Ecosystem:** Arduino is a C++ runtime abstraction framework featuring \`pinMode()\`, \`digitalWrite()\`, and a simplified HAL.
`,
    },
    {
      chapterNumber: 2,
      title: "The Core Execution Engine: ALU, Registers & Interrupts",
      slug: "core-execution-engine-registers-interrupts",
      level: "BEGINNER",
      estimatedMinutes: 30,
      summary: "Inspect the Arithmetic Logic Unit, general-purpose register files, Program Counter, Stack Pointer, and understand deterministic interrupt handling via the NVIC.",
      keyTakeaways: [
        "The Program Counter (PC) holds the address of the next instruction word, automatically incremented or branched by jumps/calls.",
        "The Stack Pointer (SP) manages the LIFO stack frame during function calls and interrupt context saves.",
        "The Nested Vectored Interrupt Controller (NVIC) prioritizes hardware events and directly executes Interrupt Service Routines (ISRs) with low latency.",
        "Volatile keyword in C is mandatory for variables shared between main execution threads and hardware ISRs."
      ],
      content: `## 1. Register Architecture & The CPU Core

Inside a modern 32-bit RISC processor such as the ARM Cortex-M4, execution revolves around a tightly coupled set of core registers:

* **R0 through R12 (General Purpose Registers):** Used for arithmetic operands, pointers, and temporary local variables. Under the ARM Architecture Procedure Call Standard (AAPCS), \`R0-R3\` pass arguments to functions and return values.
* **R13 / SP (Stack Pointer):** Points to the current top of the descending call stack in SRAM. Cortex-M features banked stack pointers:
  * **MSP (Main Stack Pointer):** Used by the OS kernel and interrupt handlers.
  * **PSP (Process Stack Pointer):** Used by application threads in RTOS environments.
* **R14 / LR (Link Register):** Stores the return address when a function call (\`BL\` instruction) is made, or holds special EXC_RETURN codes during an interrupt exit.
* **R15 / PC (Program Counter):** Contains the memory address of the instruction currently being executed or prefetched.
* **xPSR (Program Status Register):** Contains condition flags: **N** (Negative), **Z** (Zero), **C** (Carry), **V** (oVerflow), and the **T** bit (Thumb state).

\`\`\`c
// In ARM assembly: Adding two values and branching
LDR  R0, [R1]      // Load 32-bit value from address in R1 into R0
ADDS R0, R0, #10   // R0 = R0 + 10; update condition flags (N, Z, C, V)
BEQ  target_label  // Branch if Zero flag is set (Z == 1)
\`\`\`

---

## 2. The Interrupt Vector Table (IVT)

Embedded microcontrollers must respond to real-world asynchronous events (timer ticks, incoming UART bytes, edge changes on sensor pins) in real time.

Instead of wasteful **polling** loops (\`while(!button_pressed)\`), the hardware implements **hardware interrupts**:

1. When a peripheral signal triggers an interrupt request line (IRQ), the **Nested Vectored Interrupt Controller (NVIC)** evaluates its hardware priority.
2. If priority exceeds the current execution context, the CPU initiates **Hardware Context Stacking**:
   The hardware pushes \`R0-R3, R12, LR, PC, xPSR\` onto the stack in exactly 12 clock cycles.
3. The CPU fetches the function pointer directly from the **Interrupt Vector Table** located at memory address \`0x00000000\` (or relocated via the VTOR register).
4. The CPU executes the user's **Interrupt Service Routine (ISR)**.
5. On exit, hardware un-stacks the registers and restores the main application execution context seamlessly.

\`\`\`
Address        Vector Content
0x0000_0000 -> Initial Stack Pointer (MSP value)
0x0000_0004 -> Reset_Handler (Boot entry point)
0x0000_0008 -> NMI_Handler (Non-Maskable Interrupt)
0x0000_000C -> HardFault_Handler
...
0x0000_0058 -> USART1_IRQHandler
0x0000_005C -> EXTI0_IRQHandler
\`\`\`

---

## 3. The Critical Role of \`volatile\` in Firmware

When variables are modified inside an ISR and observed in the main loop, modern optimizing compilers (like \`gcc -O2\` or \`clang\`) may cache the variable in a CPU register instead of re-reading memory, causing an infinite loop:

\`\`\`c
// DANGEROUS BUG:
bool flag = false;

void EXTI0_IRQHandler(void) {
    flag = true; // Compiler does not know this function runs asynchronously!
}

int main(void) {
    while (!flag) {
        // Compiler optimizes this to: if (!flag) while(1);
    }
}

// CORRECT EMBEDDED C:
volatile bool flag = false; // Forces compiler to load from SRAM every iteration
\`\`\`
`,
    },
    {
      chapterNumber: 3,
      title: "Digital I/O & Memory-Mapped Registers: Inside the GPIO Subsystem",
      slug: "digital-io-memory-mapped-registers-gpio",
      level: "BEGINNER",
      estimatedMinutes: 30,
      summary: "Understand how physical silicon pins interface with memory-mapped registers. Master MODER, ODR, IDR, PUPDR, push-pull vs open-drain circuitry, and bitwise manipulation.",
      keyTakeaways: [
        "In memory-mapped I/O, physical hardware registers exist at exact addresses in the 32-bit memory space.",
        "Push-Pull output uses complementary P-MOS and N-MOS transistors to actively drive signals both HIGH and LOW.",
        "Open-Drain output only drives LOW (via N-MOS) and relies on external pull-up resistors for HIGH, enabling wired-AND buses like I2C.",
        "Bitwise masking (|=, &= ~, ^=) modifies targeted control bits without corrupting adjacent pin configurations."
      ],
      content: `## 1. Memory-Mapped I/O Architecture

In ARM Cortex-M and modern microcontrollers, peripherals do NOT use special I/O instructions (like x86 \`IN\` / \`OUT\`). Instead, every peripheral control register is mapped to a specific address in the 4GB address space (\`0x40000000\` to \`0x5FFFFFFF\`).

For example, on an STM32F4:
* **GPIOA Base Address:** \`0x40020000\`
* **Offset \`0x00\` (MODER):** Mode register (Input, Output, Alternate Function, Analog)
* **Offset \`0x04\` (OTYPER):** Output type (Push-Pull vs Open-Drain)
* **Offset \`0x08\` (OSPEEDR):** Slew rate speed (Low, Medium, High, Very High)
* **Offset \`0x0C\` (PUPDR):** Pull-Up / Pull-Down resistor configuration
* **Offset \`0x10\` (IDR):** Input Data Register (read physical pin logic)
* **Offset \`0x14\` (ODR):** Output Data Register (write pin logic)
* **Offset \`0x18\` (BSRR):** Bit Set/Reset Register (atomic single-cycle bit modification)

\`\`\`c
// Direct Bare-Metal Register Access in C
#define GPIOA_BASE   0x40020000UL
#define GPIOA_MODER  (*(volatile uint32_t*)(GPIOA_BASE + 0x00))
#define GPIOA_ODR    (*(volatile uint32_t*)(GPIOA_BASE + 0x14))
#define GPIOA_BSRR   (*(volatile uint32_t*)(GPIOA_BASE + 0x18))

// Configure PA5 as general-purpose output (pin 5 = bits [11:10] = 01)
GPIOA_MODER &= ~(0x3UL << (5 * 2)); // Clear bits 11:10
GPIOA_MODER |=  (0x1UL << (5 * 2)); // Set bit 10 (Output mode)

// Atomic Pin Toggle using BSRR (Thread and Interrupt Safe!)
GPIOA_BSRR = (1UL << 5);         // Sets PA5 HIGH (bit 5)
GPIOA_BSRR = (1UL << (5 + 16));  // Resets PA5 LOW (bit 21 = bit 5 + 16)
\`\`\`

---

## 2. Output Stages: Push-Pull vs Open-Drain

A physical output pin contains two internal MOSFET transistors: a high-side **P-Channel MOSFET** connected to $V_{\\text{DD}}$, and a low-side **N-Channel MOSFET** connected to $V_{\\text{SS}}$ (Ground):

### Push-Pull Configuration
* To drive **HIGH (1)**: P-MOS is switched ON, N-MOS is switched OFF. The pin is actively tied to $V_{\\text{DD}}$ (low impedance, high sourcing current).
* To drive **LOW (0)**: P-MOS is OFF, N-MOS is ON. The pin is actively tied to GND (low impedance, sinking current).
* **Application:** High-speed SPI clock/data, push-pull UART TX, LED drivers.

### Open-Drain Configuration
* The P-MOS transistor is permanently disconnected.
* To drive **LOW (0)**: N-MOS is switched ON, grounding the line.
* To drive **HIGH (1)**: N-MOS is switched OFF. The pin enters a **High-Impedance (Hi-Z)** floating state. An **external pull-up resistor** ($R_{\\text{pull-up}}$, typically $2.2\\text{ k}\\Omega$ to $10\\text{ k}\\Omega$) pulls the bus wire up to $V_{\\text{DD}}$.
* **Application:** I2C bus (\`SDA\`, \`SCL\`), 1-Wire, shared interrupt lines. Allows multiple chips to be tied together without short-circuiting if two outputs conflict (**Wired-AND** logic).

---

## 3. Pull-Up and Pull-Down Resistors

Floating CMOS inputs have nearly infinite input impedance ($>10^{12}\\ \\Omega$). If an input pin is left disconnected, parasitic electromagnetic noise will cause the input buffer to rapidly toggle between 0 and 1, wasting power and causing spurious false triggers.

* **Internal Pull-Up:** Ties the pin to $V_{\\text{DD}}$ through an internal $\\sim 40\\text{ k}\\Omega$ resistor. Used with active-low pushbuttons connected to Ground.
* **Internal Pull-Down:** Ties the pin to Ground through an internal $\\sim 40\\text{ k}\\Omega$ resistor. Used with active-high inputs.
`,
    },
    {
      chapterNumber: 4,
      title: "Interfacing the Analog Realm: ADC, DAC & Signal Conditioning",
      slug: "interfacing-analog-realm-adc-dac",
      level: "INTERMEDIATE",
      estimatedMinutes: 35,
      summary: "Explore Successive Approximation Register (SAR) and Sigma-Delta ADCs, the Nyquist-Shannon sampling theorem, quantization error, and analog voltage references.",
      keyTakeaways: [
        "A Successive Approximation Register (SAR) ADC performs binary search comparisons over N clock cycles to resolve an N-bit value.",
        "Nyquist theorem mandates that sampling rate must be at least twice the highest frequency component of the analog signal.",
        "Voltage resolution is defined as LSB = Vref / (2^N - 1). For 3.3V and 12-bit, 1 LSB ≈ 0.806 mV.",
        "An anti-aliasing low-pass analog filter is required before the ADC input to reject frequencies above the Nyquist threshold."
      ],
      content: `## 1. Successive Approximation Register (SAR) ADC

Most modern microcontrollers (STM32, ESP32, PIC, AVR) feature integrated **SAR ADCs** because they offer an optimal balance of high speed (1 to 5 Megasamples/second), low power, and moderate resolution (10 to 16 bits).

### How SAR Works Internally
A SAR ADC consists of:
1. **Sample and Hold (S/H) capacitor:** Charges to match the input voltage $V_{\\text{in}}$ during a configurable sampling time.
2. **Internal DAC:** Generates reference comparison voltages.
3. **High-speed analog comparator:** Compares $V_{\\text{in}}$ against the internal DAC output.
4. **SAR Logic:** Executes a binary search starting from the Most Significant Bit (MSB):
   * Set MSB ($B_{N-1}$) to 1. If $V_{\\text{in}} > V_{\\text{DAC}}$, keep 1; else clear to 0.
   * Repeat sequentially for each subsequent bit down to LSB ($B_0$).

$$V_{\\text{in}} = V_{\\text{ref}} \\times \\frac{\\text{ADC\\_VAL}}{2^N - 1}$$

For a 12-bit ADC ($2^{12} - 1 = 4095$) with $V_{\\text{ref}} = 3.3\\text{ V}$:
$$\\text{LSB} = \\frac{3.300\\text{ V}}{4095} \\approx 0.80586\\text{ mV}$$

\`\`\`
Binary Search Resolution Example (12-bit, Vref = 3.3V, Vin = 2.10V):
Step 1: Test 1000_0000_0000 (1.650V) -> 2.10V > 1.65V -> Keep Bit 11 = 1
Step 2: Test 1100_0000_0000 (2.475V) -> 2.10V < 2.48V -> Clear Bit 10 = 0
Step 3: Test 1010_0000_0000 (2.062V) -> 2.10V > 2.06V -> Keep Bit 9 = 1
...
Final Result: 0xA3D (2621 dec) -> (2621 / 4095) * 3.3V = 2.11V
\`\`\`

---

## 2. The Nyquist-Shannon Sampling Theorem & Aliasing

To reconstruct an analog waveform of bandwidth $B$ without distortion, the sampling frequency $f_s$ must strictly satisfy:

$$f_s \\ge 2 \\times f_{\\text{max}}$$

If high-frequency noise or signals exceeding $\\frac{f_s}{2}$ (the Nyquist frequency) enter the ADC, they "fold back" into the audible or measurable spectrum as an artificial ghost frequency known as **aliasing**:

$$f_{\\text{alias}} = |f_{\\text{signal}} - k \\cdot f_s|$$

**Engineering Rule:** Always place a passive or active analog RC Low-Pass Filter (**Anti-Aliasing Filter**) directly in front of the MCU's ADC pin with a cutoff frequency:
$$f_c = \\frac{1}{2\\pi R C} \\le \\frac{f_s}{2}$$
`,
    },
    {
      chapterNumber: 5,
      title: "Embedded Communication Protocols: UART, SPI, I2C & CAN Bus",
      slug: "embedded-communication-protocols-uart-spi-i2c-can",
      level: "INTERMEDIATE",
      estimatedMinutes: 40,
      summary: "Deep dive into physical layer electrical dynamics, frame formatting, arbitration, and clock synchronization across UART, SPI, I2C, and automotive CAN buses.",
      keyTakeaways: [
        "UART is asynchronous, relying on matching pre-configured baud rates, start/stop framing bits, and optional parity.",
        "SPI is synchronous, full-duplex, and capable of high throughput (50+ MHz), but requires a dedicated Chip Select (CS) line per slave.",
        "I2C is a 2-wire half-duplex open-drain bus with 7-bit addressing, clock stretching, and hardware ACK/NACK signaling.",
        "CAN bus uses differential voltage signaling (CANH - CANL) with non-destructive bitwise arbitration for noise-immune robotics and automotive telemetry."
      ],
      content: `## 1. Protocol Comparison Matrix

| Parameter | UART | SPI | I2C | CAN Bus |
| :--- | :--- | :--- | :--- | :--- |
| **Clocking** | Asynchronous | Synchronous (SCK) | Synchronous (SCL) | Asynchronous (Bit timing) |
| **Duplex** | Full Duplex | Full Duplex | Half Duplex | Half Duplex |
| **Wires Required** | 2 (TX, RX) + GND | 4 (MOSI, MISO, SCK, CS) | 2 (SDA, SCL) + GND | 2 (CAN_H, CAN_L) |
| **Typical Speeds** | 115.2 kbps - 3 Mbps | 10 Mbps - 80 Mbps | 100 kbps, 400 kbps, 1 Mbps | 125 kbps - 1 Mbps (FD: 5 Mbps) |
| **Bus Topology** | Point-to-Point | Multi-drop (CS per slave) | Multi-master, multi-slave | Multi-master broadcast |
| **Signaling** | Single-ended TTL | Single-ended CMOS | Single-ended Open-Drain | Differential ($V_H - V_L$) |

---

## 2. UART (Universal Asynchronous Receiver/Transmitter)

Because UART has no shared clock line, both transmitter and receiver must agree on an exact **Baud Rate** (bits per second, e.g., 115200 bps):

* **Idle State:** The line rests at logic HIGH ($V_{\\text{DD}}$).
* **Start Bit:** The transmitter pulls the line LOW for 1 bit-period. The receiver detects this falling edge to align its internal $16\\times$ oversampling clock.
* **Data Payload:** 5 to 9 bits (typically 8 bits), transmitted **LSB (Least Significant Bit) first**.
* **Optional Parity:** Even or Odd parity bit for basic error detection.
* **Stop Bit:** Line returns to logic HIGH for 1 or 2 bit-periods.

$$\\text{Bit Period} = \\frac{1}{\\text{Baud Rate}} \\implies \\frac{1}{115200} \\approx 8.68\\ \\mu\\text{s per bit}$$

---

## 3. I2C (Inter-Integrated Circuit)

Developed by Philips, I2C connects sensors, RTCs, and EEPROMs using only two wires: \`SDA\` (Serial Data) and \`SCL\` (Serial Clock).

* **Open-Drain Bus:** Both lines are pulled up to 3.3V or 5V by resistors ($R_p \\approx 4.7\\text{ k}\\Omega$). Any node can pull the line LOW, but no node drives HIGH.
* **Start Condition:** \`SDA\` falls while \`SCL\` is HIGH.
* **Stop Condition:** \`SDA\` rises while \`SCL\` is HIGH.
* **Addressing:** 7-bit slave address followed by a Read/Write bit ($R/\\bar{W}$).
* **Acknowledge (ACK):** The receiver pulls \`SDA\` LOW during the 9th clock pulse to acknowledge receipt.

---

## 4. CAN Bus (Controller Area Network)

Designed by Bosch for extreme automotive and industrial robotics environments:
* **Differential Signaling:** Transmits over twisted pair wires: \`CAN_H\` and \`CAN_L\`. Noise induced on both wires equally is rejected by the differential receiver:
  $$V_{\\text{diff}} = V_{\\text{CAN\\_H}} - V_{\\text{CAN\\_L}}$$
  * **Recessive (Logic 1):** Both lines at $\\sim 2.5\\text{ V}$ ($V_{\\text{diff}} \\approx 0\\text{ V}$).
  * **Dominant (Logic 0):** \`CAN_H\` drives to $3.5\\text{ V}$, \`CAN_L\` drops to $1.5\\text{ V}$ ($V_{\\text{diff}} \\approx 2.0\\text{ V}$).
* **Non-Destructive Bitwise Arbitration:** When multiple nodes transmit simultaneously, the message with the lowest Message Identifier (more leading dominant zeros) wins the bus without data corruption!
`,
    },
    {
      chapterNumber: 6,
      title: "Hardware Timers, PWM & Motion Control",
      slug: "hardware-timers-pwm-motion-control",
      level: "INTERMEDIATE",
      estimatedMinutes: 35,
      summary: "Demystify hardware timer counter blocks, prescalers, auto-reload registers, input capture, and center-aligned PWM with dead-time insertion for motor H-Bridges.",
      keyTakeaways: [
        "A hardware timer counter counts clock pulses independently of the CPU core, eliminating timing jitter.",
        "PWM frequency is determined by timer input clock, Prescaler (PSC), and Auto-Reload Register (ARR).",
        "Duty Cycle is set by the Capture/Compare Register (CCR): Duty = CCR / ARR * 100%.",
        "Dead-time insertion prevents catastrophic shoot-through currents in complementary half-bridge and H-bridge motor drivers."
      ],
      content: `## 1. Anatomy of a Hardware Timer

Software delay loops (\`for (int i=0; i<10000; i++)\`) suffer from unpredictable jitter, CPU starvation, and compiler optimization degradation. Modern MCUs solve this through dedicated **Hardware Timers**.

A hardware timer block consists of:
1. **Clock Source ($f_{\\text{CLK}}$):** System or APB peripheral bus clock (e.g., 84 MHz).
2. **Prescaler Register (PSC):** A 16-bit divider that steps down the clock:
   $$f_{\\text{counter}} = \\frac{f_{\\text{CLK}}}{\\text{PSC} + 1}$$
3. **Counter Register (CNT):** Increments (up-counting) or decrements (down-counting) on every pulse of $f_{\\text{counter}}$.
4. **Auto-Reload Register (ARR):** Sets the maximum count period before the counter rolls back to 0 and triggers an Update Event (UEV).
5. **Capture/Compare Register (CCR):** Stores the threshold value compared against \`CNT\` to modulate the output pin.

---

## 2. Pulse Width Modulation (PWM) Generation

PWM simulates an analog voltage by rapidly switching a digital output pin between 0V and $V_{\\text{DD}}$:

$$f_{\\text{PWM}} = \\frac{f_{\\text{CLK}}}{(\\text{PSC} + 1) \\times (\\text{ARR} + 1)}$$

$$\\text{Duty Cycle (\\%)} = \\frac{\\text{CCR}}{\\text{ARR}} \\times 100\\%$$

$$\\bar{V}_{\\text{out}} = V_{\\text{DD}} \\times \\frac{\\text{Duty Cycle}}{100}$$

\`\`\`
          |<------------ Period (ARR) ------------>|
Signal:   +-------------------+                    +-------------------+
          |     CCR (ON)      |                    |     CCR (ON)      |
          |                   |     OFF            |                   |     OFF
          +                   +--------------------+                   +--------------------+
          |<- Duty Cycle (t) ->|
\`\`\`

### RC Low-Pass Filter Demodulation
When smoothed through an RC low-pass filter with cutoff $f_c \\ll f_{\\text{PWM}}$, the average voltage emerges:
$$V_{\\text{analog}} = V_{\\text{DD}} \\times \\frac{\\text{CCR}}{\\text{ARR}}$$

---

## 3. Complementary PWM & Dead-Time Insertion for Motor Drives

In H-Bridge motor drivers, high-side and low-side MOSFET transistors must never conduct simultaneously; doing so creates a dead short between $V_{\\text{power}}$ and Ground, resulting in instantaneous semiconductor destruction (**shoot-through**).

Hardware advanced timers (such as STM32 \`TIM1\` / \`TIM8\`) provide:
* **Complementary Outputs:** Pin \`TIM1_CH1\` drives the high-side MOSFET, and \`TIM1_CH1N\` drives the low-side MOSFET.
* **Dead-Time Generator:** Automatically inserts a calibrated nanosecond delay ($t_{\\text{dead}}$, e.g. 150 ns) ensuring the high-side switch is completely turned off before the low-side switch is energized.
`,
    },
    {
      chapterNumber: 7,
      title: "Memory Hierarchy, Flash & Direct Memory Access (DMA)",
      slug: "memory-hierarchy-flash-direct-memory-access-dma",
      level: "ADVANCED",
      estimatedMinutes: 40,
      summary: "Analyze SRAM organization, NOR Flash erase cycles, wait states, cache architecture, and zero-CPU Direct Memory Access (DMA) for high-bandwidth data transfers.",
      keyTakeaways: [
        "Embedded SRAM provides single-cycle read/write access, while Flash memory requires wait-states at high clock frequencies.",
        "Flash memory can only be programmed byte-by-byte from 1 to 0; erasing requires resetting entire sectors back to 1.",
        "Direct Memory Access (DMA) offloads bulk data transfers between peripherals and SRAM without CPU instruction execution.",
        "Circular DMA buffers enable seamless audio streaming and continuous high-speed ADC sampling without dropped samples."
      ],
      content: `## 1. Embedded Memory Technologies

Unlike desktop computers with gigabytes of DDR DRAM, microcontrollers utilize embedded on-die memories with distinct physics and access latencies:

* **Internal SRAM (Static RAM):**
  Constructed from 6-transistor (6T) CMOS flip-flop cells. Extremely fast (single clock cycle access), volatile (loses data on power loss), and low density (typically 2KB to 1MB).
* **Internal NOR Flash:**
  Non-volatile floating-gate transistors. Stores boot firmware, vector tables, and constant lookup tables.
  * **Wait States:** Flash read access time is typically $\\sim 20\\text{ ns}$ to $30\\text{ ns}$. When the CPU runs at 84 MHz (clock period $11.9\\text{ ns}$), the CPU must insert **Flash Wait States (LATENCY)** unless accelerated by an instruction prefetch cache (like ST's ART Accelerator).
  * **Erase/Write Asymmetry:** Flash cells can be written from \`1\` to \`0\` at byte level, but erasing can only reset cells back to \`1\` in **entire sectors** (e.g., 16KB or 128KB blocks). Rated for $\\sim 10,000$ to $100,000$ write/erase cycles.

---

## 2. Direct Memory Access (DMA) Architecture

In traditional software I/O, receiving 1,000 bytes over UART requires the CPU to trigger an interrupt for every single byte, stack registers, copy the byte from \`USART_DR\` to an array in SRAM, and un-stack registers — consuming over 30% of total CPU cycles:

\`\`\`
Traditional CPU-Driven Transfer:
Peripheral -> [Interrupt Request] -> CPU Core Stacks Regs -> Reads Peripheral -> Writes SRAM -> Unstacks Regs

DMA-Driven Transfer:
Peripheral -> [DMA Request] -> DMA Controller copies byte direct to SRAM -> CPU continues computing!
\`\`\`

The **DMA Controller** is an autonomous bus master coprocessor with dedicated internal FIFOs and stream counters:
* **Peripheral-to-Memory (P2M):** ADC continuous multi-channel conversions transferred directly to an SRAM array.
* **Memory-to-Peripheral (M2P):** Streaming an audio WAV buffer from Flash/SRAM to a DAC or PWM timer.
* **Memory-to-Memory (M2M):** Ultra-fast block memcpy between SRAM regions.

### Circular Buffer Mode
In circular buffer mode, once the DMA stream fills the designated memory array, it automatically wraps its pointer back to the start address and asserts a **Half-Transfer Complete (HT)** and **Transfer Complete (TC)** interrupt, allowing real-time DSP double-buffering (ping-pong buffers) without dropping a single sample.
`,
    },
    {
      chapterNumber: 8,
      title: "Real-Time Systems, Embedded Optimization & Physical AI",
      slug: "real-time-systems-embedded-optimization-physical-ai",
      level: "ADVANCED",
      estimatedMinutes: 45,
      summary: "Transition from bare-metal super-loops to preemptive Real-Time Operating Systems (FreeRTOS), determinism, context switching, and executing TinyML neural nets on microcontrollers.",
      keyTakeaways: [
        "A super-loop architecture lacks determinism when task execution times vary; an RTOS provides priority-based preemptive scheduling.",
        "FreeRTOS tasks each maintain their own stack frame; context switches are triggered via the PendSV exception handler.",
        "TinyML executes quantized (INT8) deep learning models on resource-constrained microcontrollers using CMSIS-NN and TensorFlow Lite for Microcontrollers.",
        "Physical AI bridges sensor perception, real-time closed-loop control, and edge inference on physical embedded actuators."
      ],
      content: `## 1. Bare-Metal Super-Loop vs Real-Time Operating System (RTOS)

### Bare-Metal Super-Loop
\`\`\`c
int main(void) {
    system_init();
    while (1) {
        read_sensors();       // If this takes 50ms...
        run_pid_control();    // ...this motor control step is delayed!
        update_display();     // Non-deterministic jitter degrades control stability
    }
}
\`\`\`

### Preemptive Real-Time Operating System (FreeRTOS)
An RTOS introduces a **Preemptive Scheduler** governed by a periodic timer interrupt (**SysTick**, typically every $1\\text{ ms}$):
* Tasks are assigned strict priority numbers ($0$ to $N$).
* High-priority real-time motor control tasks immediately preempt lower-priority tasks (like GUI rendering or logging).
* **PendSV Exception:** ARM Cortex-M utilizes the Pendable Service Call (PendSV) interrupt configured at the lowest priority to perform register context switches cleanly outside time-critical ISRs.

---

## 2. TinyML: Edge AI on Microcontrollers

Physical AI requires microcontrollers to sense, interpret, and respond to their physical environment without streaming high-bandwidth raw sensor data to cloud servers.

### The Quantization Revolution
Standard deep learning frameworks (PyTorch, TensorFlow) train models using 32-bit floating-point numbers (\`FP32\`, 4 bytes per weight). Microcontrollers lack the multi-gigabyte memory and high-power GPUs needed for FP32 matrix multiplication.

Through **Post-Training Quantization (PTQ)**:
* Weights and activations are scaled into 8-bit signed integers (\`INT8\`, 1 byte per weight):
  $$q = \\text{round}\\left(\\frac{r}{S}\\right) + Z$$
  Where $S$ is the scale factor and $Z$ is the zero-point integer offset.
* **Benefits:**
  * **$4\\times$ memory reduction:** A 400KB FP32 model shrinks to 100KB, fitting inside an STM32 or ESP32 internal SRAM.
  * **$3\\times$ to $5\\times$ speedup:** 32-bit ARM Cortex-M4/M7 processors feature SIMD instructions (\`SADD8\`, \`SMUAD\`) that execute two or four 8-bit multiply-accumulate operations in a single clock cycle via **ARM CMSIS-NN**.

### Practical Physical AI Deployments
1. **Acoustic Anomaly Detection:** Motor vibration analysis using 3-axis accelerometer FFTs to predict bearing failure.
2. **Gesture Recognition:** IMU sensor data classified into robotic navigation commands.
3. **Computer Vision at Micro-Power:** ESP32-S3 or STM32H7 running person detection models at 15 FPS drawing under 500 mW.
`,
    },
  ];

  for (const ch of chapters) {
    const chapterData = {
      ...ch,
      keyTakeaways: typeof ch.keyTakeaways === "string" ? ch.keyTakeaways : JSON.stringify(ch.keyTakeaways),
    };
    await prisma.chapter.create({ data: chapterData });
  }

  console.log(`Seeded ${chapters.length} Educational Chapters.`);

  // 6. Seed Quizzes & Authentic Questions (Evaluated Server-Side Only)
  const allChapters = await prisma.chapter.findMany();

  const quizDefinitions = [
    {
      chapterNumber: 1,
      title: "Foundations of Embedded Computing Quiz",
      description: "Assess your mastery of MPU vs MCU distinctions, Harvard architecture, clock distribution, and platform nomenclature.",
      passingScore: 70,
      questions: [
        {
          question: "Which of the following is the fundamental distinguishing characteristic of a Microcontroller (MCU) compared to a Microprocessor (MPU)?",
          codeSnippet: null,
          options: JSON.stringify([
            "An MCU operates at clock frequencies exceeding 3 GHz with out-of-order execution pipelines.",
            "An MCU integrates CPU core, RAM, Flash memory, and peripheral controllers onto a single monolithic die.",
            "An MCU does not contain an ALU or general-purpose register file.",
            "An MCU cannot execute C or C++ compiled machine code."
          ]),
          correctOptionIndex: 1,
          explanation: "Microcontrollers are self-contained systems on a chip combining CPU core, SRAM, non-volatile Flash, and peripheral interfaces on a single silicon die.",
          points: 10,
        },
        {
          question: "In a Harvard computer architecture, why is execution throughput higher than in a classic Von Neumann architecture?",
          codeSnippet: null,
          options: JSON.stringify([
            "It eliminates the need for an instruction decoding stage.",
            "Program memory and data memory have physically separate buses, allowing simultaneous instruction fetch and operand data read/write.",
            "It runs at double the clock speed of any Von Neumann system.",
            "It stores all variables permanently in ROM."
          ]),
          correctOptionIndex: 1,
          explanation: "Harvard architecture features physically isolated instruction and data buses, eliminating the Von Neumann bus bottleneck and enabling single-cycle fetch-and-execute.",
          points: 10,
        },
        {
          question: "Consider an external crystal oscillator (HSE) of 8 MHz. If a microcontroller's PLL is configured with division factor M = 8, multiplier N = 336, and post-divider P = 4, what is the resulting SYSCLK frequency?",
          codeSnippet: "f_SYSCLK = f_IN * (N / (M * P))\nf_IN = 8 MHz, M = 8, N = 336, P = 4",
          options: JSON.stringify([
            "48 MHz",
            "72 MHz",
            "84 MHz",
            "168 MHz"
          ]),
          correctOptionIndex: 2,
          explanation: "8 MHz * (336 / (8 * 4)) = 8 MHz * (336 / 32) = 8 MHz * 10.5 = 84 MHz, which is the exact maximum operating clock of an STM32F401.",
          points: 10,
        },
        {
          question: "Which statement regarding Arduino is technically accurate?",
          codeSnippet: null,
          options: JSON.stringify([
            "Arduino is a 32-bit RISC instruction set architecture comparable to ARM Cortex-M.",
            "Arduino is a microcontroller silicon chip manufactured by Atmel.",
            "Arduino is a software framework and hardware breakout board ecosystem; the actual MCU on an Uno R3 is the Microchip ATmega328P running AVR architecture.",
            "Arduino boards do not use microcontrollers; they use FPGAs."
          ]),
          correctOptionIndex: 2,
          explanation: "Arduino is an abstraction framework and physical board design; the silicon chip is the ATmega328P executing 8-bit AVR RISC instructions.",
          points: 10,
        },
      ],
    },
    {
      chapterNumber: 2,
      title: "Core Execution Engine & Interrupts Quiz",
      description: "Test your understanding of register calling conventions, Interrupt Service Routines, and thread synchronization.",
      passingScore: 70,
      questions: [
        {
          question: "Under the standard ARM Architecture Procedure Call Standard (AAPCS), which registers are used to pass function arguments and receive return values?",
          codeSnippet: null,
          options: JSON.stringify([
            "R0 through R3",
            "R13 and R14",
            "R8 through R11",
            "R15 only"
          ]),
          correctOptionIndex: 0,
          explanation: "Under AAPCS, registers R0-R3 are caller-saved and pass the first four 32-bit function arguments; R0 holds the scalar return value.",
          points: 10,
        },
        {
          question: "Why MUST variables shared between an Interrupt Service Routine (ISR) and the main loop be qualified with the 'volatile' keyword in C?",
          codeSnippet: "volatile bool event_flag = false;\n\nvoid EXTI0_IRQHandler(void) {\n    event_flag = true;\n}",
          options: JSON.stringify([
            "To place the variable in Flash memory instead of SRAM.",
            "To prevent compiler optimizations from caching the variable in a CPU register, forcing memory reads on every access.",
            "To encrypt the variable against memory tampering.",
            "To prevent the variable from consuming space on the call stack."
          ]),
          correctOptionIndex: 1,
          explanation: "The volatile qualifier warns the compiler that the memory location can be modified asynchronously outside the current compiler-visible thread of execution, preventing register caching optimization.",
          points: 10,
        },
        {
          question: "What is the function of the Program Counter (PC / R15) in an ARM processor?",
          codeSnippet: null,
          options: JSON.stringify([
            "It stores the top address of the current execution stack.",
            "It holds the address of the instruction currently being executed or prefetched.",
            "It counts the number of clock cycles elapsed since power-on reset.",
            "It holds the hardware priority of the active interrupt."
          ]),
          correctOptionIndex: 1,
          explanation: "The Program Counter points to the address of the next instruction word in memory to be executed by the pipeline.",
          points: 10,
        },
      ],
    },
    {
      chapterNumber: 3,
      title: "Digital I/O & Memory-Mapped Registers Quiz",
      description: "Validate your bare-metal register bitmasking skills and understanding of output pin topologies.",
      passingScore: 70,
      questions: [
        {
          question: "Why is the Bit Set/Reset Register (BSRR) preferred over the Output Data Register (ODR) when modifying pin states in multi-threaded or interrupt-driven firmware?",
          codeSnippet: "// Method A:\nGPIOA->ODR |= (1 << 5);\n\n// Method B:\nGPIOA->BSRR = (1 << 5);",
          options: JSON.stringify([
            "BSRR operations are atomic and execute in a single clock cycle without read-modify-write race conditions.",
            "ODR can only drive pins LOW, never HIGH.",
            "BSRR bypasses the physical pin and writes to EEPROM.",
            "ODR consumes 10 times more electrical power than BSRR."
          ]),
          correctOptionIndex: 0,
          explanation: "BSRR provides atomic single-cycle pin manipulation. Unlike ODR |= bit (which requires 3 instructions: load, or, store), BSRR prevents race conditions if an interrupt occurs mid-instruction.",
          points: 10,
        },
        {
          question: "Which output configuration is required for communication buses like I2C that support multiple masters and open-drain lines?",
          codeSnippet: null,
          options: JSON.stringify([
            "Push-Pull with internal pulldown",
            "Open-Drain with pull-up resistor",
            "Differential push-pull",
            "Analog high-impedance exclusively"
          ]),
          correctOptionIndex: 1,
          explanation: "Open-drain output stages allow multiple transceivers to connect to the same wire without short circuits, pulled high by an external pull-up resistor (Wired-AND logic).",
          points: 10,
        },
      ],
    },
  ];

  for (const qDef of quizDefinitions) {
    const chapter = allChapters.find((c) => c.chapterNumber === qDef.chapterNumber);
    if (!chapter) continue;

    const quiz = await prisma.quiz.create({
      data: {
        chapterId: chapter.id,
        title: qDef.title,
        description: qDef.description,
        passingScore: qDef.passingScore,
      },
    });

    for (const q of qDef.questions) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
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

  console.log("Quizzes and questions seeded successfully.");

  // 7. Seed Initial Saved Experiments
  await prisma.savedExperiment.create({
    data: {
      userId: engineer.id,
      title: "STM32 GPIO Blink & Atomic BSRR Configuration",
      description: "Simulation of PA5 LED blinking on STM32 Nucleo using atomic BSRR bit set and reset registers.",
      experimentType: "GPIO",
      configState: JSON.stringify({
        pin: "PA5",
        mode: "OUTPUT",
        outputType: "PUSH_PULL",
        resistor: "NONE",
        frequencyHz: 2.0,
        dutyPercent: 50,
        registers: {
          MODER: "0x00000400",
          OTYPER: "0x00000000",
          ODR: "0x00000020",
          PUPDR: "0x00000000",
        },
      }),
    },
  });

  await prisma.savedExperiment.create({
    data: {
      userId: engineer.id,
      title: "Motor PWM 20kHz Dead-Time Generator",
      description: "Complementary PWM wave for H-Bridge motor driver with 150ns dead-time insertion.",
      experimentType: "PWM",
      configState: JSON.stringify({
        timer: "TIM1",
        clockMHz: 84,
        psc: 3,
        arr: 1049,
        ccr: 525,
        deadTimeNs: 150,
        complementary: true,
      }),
    },
  });

  await prisma.savedExperiment.create({
    data: {
      userId: engineer.id,
      title: "Robotic Joint Closed-Loop PID Tuner",
      description: "PID parameters tuned for 90-degree robotic arm servo joint under 0.5 Nm gravitational torque.",
      experimentType: "PID",
      configState: JSON.stringify({
        targetAngle: 90.0,
        kp: 3.8,
        ki: 0.45,
        kd: 0.95,
        massKg: 0.8,
        frictionCoeff: 0.15,
        disturbanceMagnitude: 10.0,
      }),
    },
  });

  console.log("Saved experiments seeded successfully.");
  console.log("MICROVERSE database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
