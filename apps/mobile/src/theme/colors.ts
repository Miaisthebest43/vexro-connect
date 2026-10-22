export const colors = {
  bg: '#0A0B10',
  bg2: '#12141D',
  bg3: '#1A1D27',
  bg4: '#232736',
  border: '#1F222E',
  text: '#FFFFFF',
  textDim: '#8E95A5',
  textMuted: '#5C6273',
  accent: '#6A5CFF',
  accentDim: '#5247C9',
  success: '#23A559',
  danger: '#DA373C',
  warning: '#F0B232',
  gradient: ['#6A5CFF', '#12141D'] as const,
  gradientDark: ['#12141D', '#0A0B10'] as const,
  gradientAccent: ['#0A0B10', '#12141D'] as const,
};
export const darkColors = colors;
export const lightColors = { ...colors };