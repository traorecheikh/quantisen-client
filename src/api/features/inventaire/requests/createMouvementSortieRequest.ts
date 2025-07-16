import type {Utilisateur} from "../../utilisateurs/models/utilisateurModel.ts";

export interface CreateMouvementSortieRequest {
    boissonId: number;
    quantiteDemandee: number;
    utilisateur: Utilisateur;
}

