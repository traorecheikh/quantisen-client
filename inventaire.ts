//
// // TypeScript interfaces for the Inventory Management API
//
// // --- Data Transfer Objects (DTOs) ---
//
// export interface Boisson {
//   id?: number;
//   nom: string;
//   description?: string;
//   prix: number;
//   volume?: number;
//   unite?: string;
//   seuil?: number;
//   isActive?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }
//
// export interface Utilisateur {
//   id?: number;
//   firstName?: string;
//   lastName?: string;
//   email: string;
//   role?: 'ADMIN' | 'USER';
//   motDePasse?: string;
//   isActive?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }
//
// export interface Lot {
//   id?: number;
//   numeroLot: string;
//   quantiteInitiale: number;
//   quantiteActuelle?: number;
//   mouvementEntree?: Mouvement;
//   dateEntree?: string; // Format: YYYY-MM-DD
//   datePeremption: string; // Format: YYYY-MM-DD
//   boisson: Boisson;
//   vendable?: boolean;
// }
//
// export interface Mouvement {
//   id?: number;
//   type: 'ENTREE' | 'SORTIE' | 'AJUSTEMENT';
//   dateMouvement?: string; // Format: YYYY-MM-DD
//   quantite: number;
//   utilisateur: Utilisateur;
//   ligneOperations?: LigneOperation[];
//   typeAjustement?: 'POSITIVE' | 'NEGATIVE';
//   raison?: string;
// }
//
// export interface LigneOperation {
//   id?: number;
//   mouvement?: Mouvement;
//   lot?: Lot;
//   quantite: number;
// }
//
//
// // --- Request Bodies ---
//
//
//
