export const MovementType = {
ENTREE : 'ENTREE',
SORTIE : 'SORTIE',
AJUSTEMENT : 'AJUSTEMENT'
} as const;

export type MovementType = typeof MovementType[keyof typeof MovementType];
