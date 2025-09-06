export const premiumTheme = {
  colors: {
    primary: '#6366f1',      // Indigo moderno
    secondary: '#ec4899',    // Pink vibrante
    success: '#10b981',      // Emerald
    warning: '#f59e0b',      // Amber
    danger: '#ef4444',       // Red
    info: '#06b6d4',         // Cyan
    background: '#0f0f23',   // Dark navy
    surface: '#1a1a2e',      // Dark blue-gray
    surfaceLight: '#242449', // Lighter surface
    text: '#e2e8f0',         // Light gray
    textSecondary: '#94a3b8', // Muted gray
    border: '#334155',       // Border color
    borderLight: '#475569',  // Light border
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    achievement: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    warning: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    danger: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    info: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
    successGlow: '0 0 20px rgba(16, 185, 129, 0.3)',
    warningGlow: '0 0 20px rgba(245, 158, 11, 0.3)',
  },
  animations: {
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideUp: 'slideUp 0.4s ease-out',
    slideDown: 'slideDown 0.4s ease-out',
    bounceIn: 'bounceIn 0.6s ease-out',
    scaleIn: 'scaleIn 0.3s ease-out',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    shimmer: 'shimmer 2s linear infinite',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  }
};

export const themes = [
  {
    name: 'Dark Professional',
    colors: ['#0f172a', '#1e293b', '#6366f1'],
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #6366f1 100%)'
  },
  {
    name: 'Ocean Blue',
    colors: ['#0c4a6e', '#0369a1', '#0284c7'],
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)'
  },
  {
    name: 'Forest Green',
    colors: ['#14532d', '#166534', '#16a34a'],
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #16a34a 100%)'
  },
  {
    name: 'Sunset Orange',
    colors: ['#9a3412', '#c2410c', '#ea580c'],
    gradient: 'linear-gradient(135deg, #9a3412 0%, #c2410c 50%, #ea580c 100%)'
  },
  {
    name: 'Royal Purple',
    colors: ['#581c87', '#7c3aed', '#a855f7'],
    gradient: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)'
  }
];

export type Theme = typeof premiumTheme;
export type ThemeName = typeof themes[number]['name'];