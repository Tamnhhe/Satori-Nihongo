import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '100',
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
  android: {
    regular: {
      fontFamily: 'Roboto',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: '100',
    },
  },
};

export const materialTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    primaryContainer: '#E3F2FD',
    secondary: '#FF9800',
    secondaryContainer: '#FFF3E0',
    tertiary: '#4CAF50',
    tertiaryContainer: '#E8F5E8',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#D32F2F',
    errorContainer: '#FFEBEE',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#1976D2',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#FF9800',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#4CAF50',
    onSurface: '#212121',
    onSurfaceVariant: '#757575',
    onBackground: '#212121',
    onError: '#FFFFFF',
    onErrorContainer: '#D32F2F',
    outline: '#BDBDBD',
    outlineVariant: '#E0E0E0',
    inverseSurface: '#424242',
    inverseOnSurface: '#FAFAFA',
    inversePrimary: '#90CAF9',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F5F5F5',
      level3: '#EEEEEE',
      level4: '#E8E8E8',
      level5: '#E0E0E0',
    },
  },
  roundness: 12,
};

export default materialTheme;
