export const NAV_LINKS = [
  {
    name: "Discover",
    path: "/#discover",
    anchor: "discover",
    icon: "Compass",
    desc: "Overview & embedded feedback loops",
  },
  {
    name: "Anatomy",
    path: "/anatomy",
    anchor: "anatomy",
    icon: "Cpu",
    desc: "Internal silicon execution engine",
  },
  {
    name: "Archive",
    path: "/archive",
    icon: "Layers",
    desc: "Microcontroller silicon registry",
  },
  {
    name: "Compare",
    path: "/compare",
    icon: "Sliders",
    desc: "Side-by-side architecture benchmarks",
  },
  {
    name: "Robotics",
    path: "/robotics",
    icon: "Bot",
    desc: "Physical AI, kinematics & motor control",
  },
  {
    name: "Experiment",
    path: "/experiment",
    icon: "Terminal",
    desc: "Interactive simulation bench",
  },
];

export const CONTROLLER_FAMILIES = [
  { id: "ALL", label: "All Silicon" },
  { id: "ARM Cortex-M", label: "ARM Cortex-M" },
  { id: "STM32", label: "STM32" },
  { id: "ESP32", label: "ESP32 / Xtensa" },
  { id: "RP2040", label: "Raspberry Pi RP2040" },
  { id: "AVR", label: "AVR / ATmega" },
  { id: "PIC", label: "Microchip PIC" },
  { id: "8051", label: "Intel 8051" },
];
