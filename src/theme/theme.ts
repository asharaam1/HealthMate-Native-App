// HealthMate — Emerald Health Palette
// Usage: const { colors } = useTheme();

import { StatusBarStyle, useColorScheme } from 'react-native';

// ─── Raw Tokens ────────────────────────────────────────────────────────────────

const emerald = {
    50: '#F0FDF9',
    100: '#D1FAF0',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',  // primary
    600: '#059669',  // primary dark
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
};

const neutral = {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
};

const semantic = {
    danger: '#EF4444',
    dangerLight: '#FEF2F2',
    dangerDark: '#7F1D1D',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',
    warningDark: '#78350F',
    success: '#10B981',
    successLight: '#F0FDF9',
    successDark: '#064E3B',
    info: '#3B82F6',
    infoLight: '#EFF6FF',
    infoDark: '#1E3A8A',
};

// ─── Light Theme ───────────────────────────────────────────────────────────────

const light = {
    // Backgrounds
    background: '#F0FDF9',   // screen bg
    backgroundSecond: '#FFFFFF',   // card / surface
    backgroundThird: '#F9FAFB',   // subtle section bg
    backgroundInverse: '#064E3B',   // inverse (e.g. dark header)
    white:'#FFFFFF',
    
    // Cards & Surfaces
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',

    // Primary Brand
    primary: '#10B981',
    primaryLight: '#D1FAF0',
    primaryDark: '#059669',
    primaryText: '#FFFFFF',   // text ON primary bg

    // Text
    textPrimary: '#064E3B',   // headings
    textSecondary: '#6B7280',   // subtitles, meta
    textTertiary: '#9CA3AF',   // hints, placeholders
    textInverse: '#FFFFFF',   // text on dark bg
    textLink: '#059669',

    // Borders
    border: '#E5E7EB',
    borderFocus: '#10B981',

    // Tab Bar
    tabBar: '#FFFFFF',
    tabActive: '#10B981',
    tabInactive: '#9CA3AF',

    // Status Bar
    statusBar: 'dark-content' as StatusBarStyle,

    // Semantic
    danger: semantic.danger,
    dangerBg: semantic.dangerLight,
    warning: semantic.warning,
    warningBg: semantic.warningLight,
    success: semantic.success,
    successBg: semantic.successLight,
    info: semantic.info,
    infoBg: semantic.infoLight,

    // Report Status badges
    statusAnalyzed: '#10B981',
    statusAnalyzedBg: '#D1FAF0',
    statusPending: '#F59E0B',
    statusPendingBg: '#FFFBEB',

    // Vital type colors
    vitalBP: '#EF4444',
    vitalBPBg: '#FEF2F2',
    vitalSugar: '#F59E0B',
    vitalSugarBg: '#FFFBEB',
    vitalWeight: '#3B82F6',
    vitalWeightBg: '#EFF6FF',
    vitalOxygen: '#8B5CF6',
    vitalOxygenBg: '#F5F3FF',
};

// ─── Dark Theme ────────────────────────────────────────────────────────────────

const dark: Omit<typeof light, 'statusBar'> & { statusBar: StatusBarStyle } = {
    // Backgrounds
    background: '#0F1C18',
    backgroundSecond: '#1A2E28',
    backgroundThird: '#162420',
    backgroundInverse: '#A7F3D0',
    white:'#FFFFFF',

    // Cards & Surfaces
    card: '#1A2E28',
    cardBorder: '#2D4A42',

    // Primary Brand
    primary: '#34D399',   // lighter in dark mode — better contrast
    primaryLight: '#065F46',
    primaryDark: '#10B981',
    primaryText: '#0F1C18',

    // Text
    textPrimary: '#ECFDF5',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textInverse: '#064E3B',
    textLink: '#34D399',

    // Borders
    border: '#2D4A42',
    borderFocus: '#34D399',

    // Tab Bar
    tabBar: '#1A2E28',
    tabActive: '#34D399',
    tabInactive: '#6B7280',

    // Status Bar
    statusBar: 'light-content' as StatusBarStyle,

    // Semantic
    danger: '#F87171',
    dangerBg: '#7F1D1D',
    warning: '#FCD34D',
    warningBg: '#78350F',
    success: '#34D399',
    successBg: '#064E3B',
    info: '#60A5FA',
    infoBg: '#1E3A8A',

    // Report Status badges
    statusAnalyzed: '#34D399',
    statusAnalyzedBg: '#065F46',
    statusPending: '#FCD34D',
    statusPendingBg: '#78350F',

    // Vital type colors
    vitalBP: '#F87171',
    vitalBPBg: '#7F1D1D',
    vitalSugar: '#FCD34D',
    vitalSugarBg: '#78350F',
    vitalWeight: '#60A5FA',
    vitalWeightBg: '#1E3A8A',
    vitalOxygen: '#A78BFA',
    vitalOxygenBg: '#4C1D95',
};

// ─── Typography ────────────────────────────────────────────────────────────────

export const typography = {
    h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
    h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 30 },
    h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
    h4: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
    small: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
    tiny: { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },
    label: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.5 },
};

// ─── Spacing ───────────────────────────────────────────────────────────────────

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    xxxl: 40,
};

// ─── Border Radius ─────────────────────────────────────────────────────────────

export const radius = {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 22,
    full: 999,
};

// ─── Shadows ───────────────────────────────────────────────────────────────────

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 5,
    },
    lg: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 10,
    },
};

// ─── Theme Object ──────────────────────────────────────────────────────────────

export const theme = {
    light: {
        colors: light,
        typography,
        spacing,
        radius,
        shadows,
        dark: false,
    },
    dark: {
        colors: dark,
        typography,
        spacing,
        radius,
        shadows,
        dark: true,
    },
};

export type ThemeType = typeof theme.light;
export type ColorsType = typeof light;

// ─── useTheme Hook ─────────────────────────────────────────────────────────────
// Usage:
//   const { colors, spacing, radius, typography } = useTheme();

export const useTheme = (): ThemeType => {
    const scheme = useColorScheme();
    return scheme === 'dark' ? theme.dark : theme.light;
};

export default theme;