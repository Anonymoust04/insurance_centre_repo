export const COLORS = {
  /* Type System — mirrors @theme tokens in globals.css */
  grass:        '#52B656',
  grassLight:   '#E8F7E9',
  poison:       '#9966CC',
  poisonLight:  '#F3E8FF',
  fire:         '#FF6B35',
  fireLight:    '#FFF0EB',
  psychic:      '#FF4DAE',
  psychicLight: '#FFE8F5',
  flying:       '#6D90D6',
  flyingLight:  '#EBF0FF',
  ice:          '#48CFAD',
  iceLight:     '#E5FAF4',

  /* Semantic */
  evolve:       '#2196F3',
  genderMale:   '#60A5FA',
  genderFemale: '#F472B6',
} as const;

export type ColorKey = keyof typeof COLORS;

/* Insurance Type → color mapping */
export const INSURANCE_TYPE_COLORS = {
  life:       { base: COLORS.grass,   light: COLORS.grassLight  },
  liability:  { base: COLORS.poison,  light: COLORS.poisonLight },
  property:   { base: COLORS.fire,    light: COLORS.fireLight   },
  health:     { base: COLORS.psychic, light: COLORS.psychicLight },
  travel:     { base: COLORS.flying,  light: COLORS.flyingLight },
  specialty:  { base: COLORS.ice,     light: COLORS.iceLight    },
} as const;

export type InsuranceType = keyof typeof INSURANCE_TYPE_COLORS;
