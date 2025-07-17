export const AdjustmentType = {
  CASSE: 'CASSE',
  VOL: 'VOL',
  PERTE: 'PERTE',
  RETOUR_CLIENT: 'RETOUR_CLIENT',
} as const

export type AdjustmentType = (typeof AdjustmentType)[keyof typeof AdjustmentType]
