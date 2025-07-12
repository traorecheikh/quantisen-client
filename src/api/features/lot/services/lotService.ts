import api from '../../../api.ts';
import type {CreateLotRequest, Lot, UpdateLotRequest} from "../models/lotModel.ts";

export const lotService = {
  getAll() {
    return api.get<Lot[]>('/lots');
  },
  create(data: CreateLotRequest) {
    return api.post<Lot>('/lots', data);
  },
  update(data: UpdateLotRequest) {
    return api.put('/lots', data);
  },
  isAvailable(lotId: number) {
    return api.get<boolean>(`/lots/${lotId}/is-available`);
  },
  isExpired(lotId: number) {
    return api.get<boolean>(`/lots/${lotId}/is-expired`);
  },
  getLotsByBeverageOrdered(boissonId: number) {
    return api.get<Lot[]>(`/lots/boisson/${boissonId}/ordre-peremption`);
  },
  removeQuantity(lotId: number, quantity: number) {
    return api.post(`/lots/${lotId}/remove-quantity?quantity=${quantity}`);
  },
};

