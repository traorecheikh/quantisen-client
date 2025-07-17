export const UserRole = {
  GERANT: 'GERANT',
  EMPLOYE: 'EMPLOYE',
  LIVREUR: 'LIVREUR',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]
