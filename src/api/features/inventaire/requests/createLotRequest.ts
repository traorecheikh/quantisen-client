import type {Lot, Utilisateur} from "../../../../../inventaire.ts";

export interface CreateLotRequest {
    lot: Omit<Lot, 'id' | 'quantiteActuelle' | 'mouvementEntree' | 'dateEntree' | 'vendable'>;
    utilisateur: Pick<Utilisateur, 'id'>;
}

