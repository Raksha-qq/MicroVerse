export const DESIGN_TOKENS = {
  colors: {
    midnight: "#0B1220",     // Primary Background
    deepBlue: "#111E30",     // Secondary Background / Panels
    slateBlue: "#192B40",    // Elevated Surfaces & Borders
    cyanGlow: "#55C7FF",     // Primary Accent
    iceBlue: "#A5E3FF",      // Secondary Accent
    coolWhite: "#EAF5FF",    // Primary Readable Text
    mutedBlue: "#8FA6BC",    // Secondary Text & Registers
    status: {
      online: "#10B981",
      warning: "#FBBF24",
      danger: "#EF4444",
      info: "#55C7FF",
    },
  },
  typography: {
    heading: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
    sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  glows: {
    cyanSm: "0 0 10px rgba(85, 199, 255, 0.18)",
    cyanMd: "0 0 20px rgba(85, 199, 255, 0.28)",
    cyanLg: "0 0 35px rgba(85, 199, 255, 0.38)",
    text: "0 0 12px rgba(85, 199, 255, 0.5)",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.16, 1, 0.3, 1)",
    normal: "250ms cubic-bezier(0.16, 1, 0.3, 1)",
    slow: "400ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
};
