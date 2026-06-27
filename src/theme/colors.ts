export const colors = {
  // Marca principal
  primary: '#1D9E75',
  primaryDark: '#0F6E56',
  primaryDeep: '#085041',
  primaryLight: '#E1F5EE',
  primaryMid: '#9FE1CB',

  // Fondo y superficies
  background: '#F0F4F2',
  surface: '#FFFFFF',
  surfaceBeige: '#FAEEDA',

  // Texto
  textPrimary: '#2C2C2A',
  textSecondary: '#5F5E5A',
  textMuted: '#888780',
  textDisabled: '#B4B2A9',

  // Bordes
  border: '#DDE8E3',
  borderLight: '#EEF4F1',

  // Estado
  error: '#E24B4A',
  errorLight: '#FCEBEB',
  success: '#1D9E75',
  successLight: '#E1F5EE',

  // Neutros
  white: '#FFFFFF',
  black: '#2C2C2A',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const typography = {
  h1: { fontSize: 26, fontWeight: '700' as const, color: colors.primaryDeep },
  h2: { fontSize: 20, fontWeight: '600' as const, color: colors.primaryDeep },
  h3: { fontSize: 17, fontWeight: '600' as const, color: colors.primaryDeep },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textPrimary },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: colors.textSecondary },
  caption: { fontSize: 11, fontWeight: '500' as const, color: colors.textMuted },
  label: { fontSize: 13, fontWeight: '600' as const, color: colors.textSecondary },
} as const;
