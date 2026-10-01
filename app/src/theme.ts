export const colors = {
  primary: '#0F766E',
  primaryDark: '#0B5D57',
  primaryMid: '#14B8A6',
  primaryLight: '#D9F7F2',
  accent: '#FF7A45',
  accentLight: '#FFEADF',
  gold: '#FFB020',
  bg: '#FFFBF5',
  surface: '#FFFFFF',
  text: '#14202B',
  muted: '#6B7885',
  border: '#EFE8DE',
  success: '#16A34A',
  danger: '#E5484D',
};

export const gradients = {
  hero: ['#0B5D57', '#0F766E', '#14B8A6'] as const,
  sunset: ['#FF7A45', '#FFB020'] as const,
  green: ['#16A34A', '#4ADE80'] as const,
};

export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

export const shadow = {
  shadowColor: '#14202B',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};
