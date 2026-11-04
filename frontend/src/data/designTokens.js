/**
 * MICROVERSE Engineering Journal Design Tokens
 * Updated to match the warm engineering-paper palette.
 * These tokens mirror what is defined in tokens.css and index.css.
 * Use CSS custom properties from tokens.css wherever possible;
 * import this file only where you need JS-level token access.
 */
export const DESIGN_TOKENS = {
  colors: {
    // Paper & Background surfaces
    paperBg: '#F5EBDD',         // Primary background (engineering paper)
    paperSec: '#EDE1CE',        // Secondary background
    paper: '#FAF5EB',           // Elevated surface / card surface

    // Ink & Text
    inkPrimary: '#22201D',      // Primary text (near-black)
    inkSecondary: '#655F55',    // Secondary text
    inkMuted: '#8C8275',        // Muted / annotations

    // Drafting lines & borders
    draftLine: '#C9BDAA',       // Borders and drafting lines
    draftSubtle: '#DFD5C5',     // Very subtle borders

    // Accent palette
    burntOrange: '#D87535',     // Primary accent — CTA, links, hover states
    terracotta: '#B95D32',      // Error states, destructive actions
    olive: '#87945B',           // Success states, completed indicators
    blueGrey: '#71818B',        // Info / secondary accent

    // Instrument panels (dark workspace)
    panelCharcoal: '#242522',   // Dark panel background
    panelBezel: '#1E1C19',      // Deeper panel / oscilloscope bg
    instrumentGreen: '#C8DE72', // Signal / waveform green

    // Status
    status: {
      online: '#87945B',        // System online / success
      warning: '#D87535',       // Warning
      danger: '#B95D32',        // Error / danger
      info: '#71818B',          // Info
    },
  },

  typography: {
    serif: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'IBM Plex Mono', 'JetBrains Mono', monospace",
    cursive: "'Caveat', cursive, serif",
  },

  shadows: {
    xs: '0 1px 2px rgba(34,32,29,0.06)',
    sm: '0 2px 4px rgba(34,32,29,0.08)',
    md: '0 4px 12px rgba(34,32,29,0.10)',
    lg: '0 8px 24px rgba(34,32,29,0.12)',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
    slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
};
