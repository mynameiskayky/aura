import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 54,
    fontWeight: '800',
    lineHeight: 54 * 1.1,
  },
  heroSm: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 30 * 1.2,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 24 * 1.3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 18 * 1.4,
  },
  body: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 15 * 1.5,
  },
  overline: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 13 * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.65,
  },
  tiny: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 11 * 1.3,
  },
} as const satisfies Record<string, TextStyle>;
