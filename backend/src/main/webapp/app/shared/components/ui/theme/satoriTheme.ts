import { createTheme } from '@mui/material/styles';

// Japanese-inspired color palette
export const japaneseColors = {
  // Primary colors inspired by traditional Japanese aesthetics
  primary: {
    main: '#1976D2', // Japanese Blue (Ai-iro)
    light: '#42A5F5',
    dark: '#1565C0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#FF9800', // Warm Orange (Persimmon)
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#000000',
  },
  // Background colors for clean, minimal aesthetic
  background: {
    default: '#FAFAFA', // Clean white
    paper: '#FFFFFF',
    elevated: '#F5F5F5',
  },
  // Surface colors with subtle variations
  surface: {
    main: '#F5F5F5',
    light: '#FAFAFA',
    dark: '#EEEEEE',
  },
  // Japanese traditional colors for accents
  accent: {
    sakura: '#FFB7C5', // Cherry blossom pink
    midori: '#4CAF50', // Fresh green
    sumi: '#2C2C2C', // Ink black
    washi: '#F8F8F8', // Paper white
  },
  // Educational status colors
  educational: {
    beginner: '#4CAF50', // Green for N5-N4
    intermediate: '#FF9800', // Orange for N3-N2
    advanced: '#F44336', // Red for N1
    completed: '#9C27B0', // Purple for completed
  },
  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

// Typography scale optimized for educational content
export const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif',
    // Japanese fonts
    'Hiragino Sans',
    'ヒラギノ角ゴ ProN W3',
    'Hiragino Kaku Gothic ProN',
    'メイリオ',
    'Meiryo',
  ].join(','),
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.4,
  },
  // Custom typography for Japanese text
  japanese: {
    large: {
      fontSize: '1.5rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    medium: {
      fontSize: '1.25rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    small: {
      fontSize: '1rem',
      lineHeight: 1.4,
      fontWeight: 400,
    },
  },
};

// Custom theme for Satori Nihongo platform
export const satoriTheme = createTheme({
  palette: {
    mode: 'light',
    primary: japaneseColors.primary,
    secondary: japaneseColors.secondary,
    background: japaneseColors.background,
    success: {
      main: japaneseColors.success,
    },
    warning: {
      main: japaneseColors.warning,
    },
    error: {
      main: japaneseColors.error,
    },
    info: {
      main: japaneseColors.info,
    },
  },
  typography,
  spacing: 8, // 8px base spacing unit
  shape: {
    borderRadius: 8, // Consistent rounded corners
  },
  components: {
    // Card component styling
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
          border: '1px solid #E0E0E0',
        },
      },
    },
    // Button component styling
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '12px 24px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    // Chip component for status indicators
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    // AppBar for custom header
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: japaneseColors.primary.main,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    // Drawer for navigation sidebar
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: japaneseColors.background.paper,
          borderRight: `1px solid ${japaneseColors.surface.main}`,
        },
      },
    },
    // List items for navigation
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: japaneseColors.primary.light + '20',
            color: japaneseColors.primary.main,
            '&:hover': {
              backgroundColor: japaneseColors.primary.light + '30',
            },
          },
        },
      },
    },
  },
  // Custom breakpoints for responsive design
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default satoriTheme;
