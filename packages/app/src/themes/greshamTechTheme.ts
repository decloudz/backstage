/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  createBaseThemeOptions,
  createUnifiedTheme,
  palettes,
  genPageTheme,
} from '@backstage/theme';

// Gresham Technologies Official Brand Colors
// Based on professional financial services branding
const greshamTechPalette = {
  // Primary brand colors - professional finance industry standard
  primary: '#003366', // Deep professional blue (Gresham primary)
  primaryLight: '#0066CC', // Lighter blue for interactions
  primaryDark: '#001A33', // Darker blue for emphasis

  // Secondary/accent colors
  secondary: '#006699', // Complementary blue tone
  accent: '#FF6B35', // Professional orange accent

  // Neutral colors - clean professional palette
  lightGrey: '#F8F9FA', // Very light background
  mediumGrey: '#E9ECEF', // Medium background/borders
  darkGrey: '#495057', // Text/icons

  // Semantic colors
  success: '#28A745', // Green for success states
  warning: '#FFC107', // Amber for warnings
  error: '#DC3545', // Red for errors
  info: '#17A2B8', // Teal for information

  // Text colors
  textPrimary: '#212529', // Dark grey (not pure black)
  textSecondary: '#6C757D', // Medium grey for secondary text
  textLight: '#FFFFFF', // White text for dark backgrounds
};

// Professional typography based on modern financial services
const greshamTechTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
  htmlFontSize: 16,
  h1: {
    fontSize: '2.5rem',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
    marginBottom: 16,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
    marginBottom: 14,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.4,
    marginBottom: 12,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.4,
    marginBottom: 10,
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    letterSpacing: '0.02em',
  },
};

// Gresham Technologies Light Theme
export const greshamTechLightTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: {
      ...palettes.light,
      primary: {
        main: greshamTechPalette.primary,
        light: greshamTechPalette.primaryLight,
        dark: greshamTechPalette.primaryDark,
        contrastText: greshamTechPalette.textLight,
      },
      secondary: {
        main: greshamTechPalette.secondary,
        light: '#4D94CC',
        dark: '#004D7A',
        contrastText: greshamTechPalette.textLight,
      },
      error: {
        main: greshamTechPalette.error,
        light: '#E85D75',
        dark: '#B21E2B',
        contrastText: greshamTechPalette.textLight,
      },
      warning: {
        main: greshamTechPalette.warning,
        light: '#FFD54F',
        dark: '#F57F17',
        contrastText: greshamTechPalette.textPrimary,
      },
      success: {
        main: greshamTechPalette.success,
        light: '#5CBB5D',
        dark: '#1E7E34',
        contrastText: greshamTechPalette.textLight,
      },
      info: {
        main: greshamTechPalette.info,
        light: '#58C4DC',
        dark: '#117A8B',
        contrastText: greshamTechPalette.textLight,
      },
      background: {
        default: greshamTechPalette.lightGrey,
        paper: '#FFFFFF',
      },
      text: {
        primary: greshamTechPalette.textPrimary,
        secondary: greshamTechPalette.textSecondary,
      },
      grey: {
        50: '#F8F9FA',
        100: '#F1F3F4',
        200: '#E8EAED',
        300: '#DADCE0',
        400: '#BDC1C6',
        500: '#9AA0A6',
        600: '#80868B',
        700: '#5F6368',
        800: '#3C4043',
        900: '#202124',
      },
      navigation: {
        background: '#FFFFFF',
        indicator: greshamTechPalette.primary,
        color: greshamTechPalette.textPrimary,
        selectedColor: greshamTechPalette.primary,
        navItem: {
          hoverBackground: greshamTechPalette.lightGrey,
        },
      },
    },
  }),
  fontFamily: greshamTechTypography.fontFamily,
  typography: greshamTechTypography,
  defaultPageTheme: 'home',
  pageTheme: {
    home: genPageTheme({
      colors: [greshamTechPalette.primary, greshamTechPalette.primaryLight],
      shape: 'wave',
    }),
    documentation: genPageTheme({
      colors: [greshamTechPalette.secondary, greshamTechPalette.info],
      shape: 'wave2',
    }),
    tool: genPageTheme({
      colors: [greshamTechPalette.accent, '#FF8A65'],
      shape: 'round',
    }),
    service: genPageTheme({
      colors: [greshamTechPalette.primary, greshamTechPalette.secondary],
      shape: 'wave',
    }),
    website: genPageTheme({
      colors: [greshamTechPalette.info, greshamTechPalette.primaryLight],
      shape: 'wave',
    }),
    library: genPageTheme({
      colors: [greshamTechPalette.success, '#66BB6A'],
      shape: 'wave2',
    }),
    other: genPageTheme({
      colors: [greshamTechPalette.darkGrey, greshamTechPalette.mediumGrey],
      shape: 'wave',
    }),
    app: genPageTheme({
      colors: [greshamTechPalette.primary, greshamTechPalette.accent],
      shape: 'wave',
    }),
    apis: genPageTheme({
      colors: [greshamTechPalette.secondary, greshamTechPalette.primaryLight],
      shape: 'round',
    }),
  },
});

// Gresham Technologies Dark Theme
export const greshamTechDarkTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: {
      ...palettes.dark,
      primary: {
        main: greshamTechPalette.primaryLight,
        light: '#3399FF',
        dark: greshamTechPalette.primary,
        contrastText: greshamTechPalette.textLight,
      },
      secondary: {
        main: '#4D94CC',
        light: '#7DB3E0',
        dark: greshamTechPalette.secondary,
        contrastText: greshamTechPalette.textLight,
      },
      background: {
        default: '#0A0E1A',
        paper: '#1A1D2E',
      },
      text: {
        primary: '#E8EAED',
        secondary: '#9AA0A6',
      },
      navigation: {
        background: '#1A1D2E',
        indicator: greshamTechPalette.primaryLight,
        color: '#E8EAED',
        selectedColor: greshamTechPalette.primaryLight,
        navItem: {
          hoverBackground: '#2A2D3E',
        },
      },
    },
  }),
  fontFamily: greshamTechTypography.fontFamily,
  typography: greshamTechTypography,
  defaultPageTheme: 'home',
  pageTheme: {
    home: genPageTheme({
      colors: [greshamTechPalette.primaryLight, '#3399FF'],
      shape: 'wave',
    }),
    documentation: genPageTheme({
      colors: ['#4D94CC', greshamTechPalette.info],
      shape: 'wave2',
    }),
    tool: genPageTheme({
      colors: [greshamTechPalette.accent, '#FF8A65'],
      shape: 'round',
    }),
    service: genPageTheme({
      colors: [greshamTechPalette.primaryLight, '#4D94CC'],
      shape: 'wave',
    }),
    website: genPageTheme({
      colors: [greshamTechPalette.info, greshamTechPalette.primaryLight],
      shape: 'wave',
    }),
    library: genPageTheme({
      colors: [greshamTechPalette.success, '#66BB6A'],
      shape: 'wave2',
    }),
    other: genPageTheme({
      colors: ['#6C757D', '#9AA0A6'],
      shape: 'wave',
    }),
    app: genPageTheme({
      colors: [greshamTechPalette.primaryLight, greshamTechPalette.accent],
      shape: 'wave',
    }),
    apis: genPageTheme({
      colors: ['#4D94CC', greshamTechPalette.primaryLight],
      shape: 'round',
    }),
  },
});
