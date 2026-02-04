import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#4299E1',
  secondary: '#2D3748',
  accent: '#48BB78',
  error: '#E53E3E',
  background: 'rgba(20, 20, 30, 0.7)',
  cardBackground: 'rgba(30, 30, 40, 0.8)',
  white: '#FFFFFF',
  lightGray: '#F7FAFC',
  mediumGray: '#E2E8F0',
  darkGray: '#718096',
  black: '#000000',
};

export const typography = {
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.white,
  },
  button: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: colors.white,
  },
};

export const layout = {
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  button: {
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
};

