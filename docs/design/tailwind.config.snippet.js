/* IdeaForge — Tailwind config snippet
   Merge into your tailwind.config.{js,ts} under `theme.extend`.
   Works with Tailwind 3.x and 4.x (the @theme directive in v4 is similar).

   In v4, you can also just reference the CSS vars from tokens.css directly via
   arbitrary values (e.g. `bg-[var(--ink-paper)]`) without extending the theme.
*/

module.exports = {
  theme: {
    extend: {
      colors: {
        ink: {
          paper: 'var(--ink-paper)',
          'paper-2': 'var(--ink-paper-2)',
          'paper-3': 'var(--ink-paper-3)',
          100: 'var(--ink-100)',
          200: 'var(--ink-200)',
          300: 'var(--ink-300)',
          400: 'var(--ink-400)',
          500: 'var(--ink-500)',
          600: 'var(--ink-600)',
          700: 'var(--ink-700)',
          800: 'var(--ink-800)',
          900: 'var(--ink-900)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          ink: 'var(--accent-ink)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        cat: {
          devt: 'var(--cat-devt)',
          ai: 'var(--cat-ai)',
          prod: 'var(--cat-prod)',
          fin: 'var(--cat-fin)',
          saas: 'var(--cat-saas)',
          creator: 'var(--cat-creator)',
          health: 'var(--cat-health)',
          climate: 'var(--cat-climate)',
          edu: 'var(--cat-edu)',
          ecom: 'var(--cat-ecom)',
          hw: 'var(--cat-hw)',
          media: 'var(--cat-media)',
          gaming: 'var(--cat-gaming)',
          legal: 'var(--cat-legal)',
          travel: 'var(--cat-travel)',
          realestate: 'var(--cat-realestate)',
        },
        signal: {
          high: 'var(--signal-high)',
          mid: 'var(--signal-mid)',
          low: 'var(--signal-low)',
        },
        danger: 'var(--danger)',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        italic: ['"Instrument Serif"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['96px', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '500' }],
        h1: ['56px', { lineHeight: '1.0', letterSpacing: '-0.025em', fontWeight: '500' }],
        h2: ['40px', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '500' }],
        h3: ['28px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '500' }],
        h4: ['20px', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' }],
        'body-lg': ['17px', { lineHeight: '1.55' }],
        body: ['15px', { lineHeight: '1.55' }],
        'body-sm': ['13.5px', { lineHeight: '1.5' }],
        label: ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        meta: ['12.5px', { lineHeight: '1.45' }],
        kicker: ['10.5px', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        tag: ['10px', { lineHeight: '1.3', letterSpacing: '0.12em' }],
        'num-xl': ['48px', { lineHeight: '1.0', letterSpacing: '-0.03em', fontWeight: '700' }],
        'num-lg': ['30px', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '700' }],
        'num-md': ['22px', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      spacing: {
        // Tailwind has these by default; listed here if you want IdeaForge-named aliases.
        'page-gutter': 'var(--gutter-page)',
        'page-gutter-mobile': 'var(--gutter-page-mobile)',
      },
      maxWidth: {
        prose: 'var(--container-prose)',
        content: 'var(--container-content)',
        wide: 'var(--container-wide)',
        bleed: 'var(--container-bleed)',
      },
      borderRadius: {
        none: '0',
        xs: '2px',
        sm: '3px',
        md: '8px',
        pill: '999px',
      },
      boxShadow: {
        none: 'none',
        xs: '0 1px 2px rgba(15, 15, 16, 0.04)',
        sm: '0 1px 3px rgba(15, 15, 16, 0.08)',
        focus: '0 0 0 3px rgba(217, 119, 87, 0.15)',
      },
      transitionDuration: {
        instant: '80ms',
        fast: '160ms',
        base: '240ms',
        slow: '400ms',
        dial: '900ms',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        dial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
};
