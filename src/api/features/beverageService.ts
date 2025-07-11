import api from '../api';
import type { Beverage, CreateBeverageRequest } from './beverageModel';

export const beverageService = {
  getAll() {
    return api.get<Beverage[]>('/boissons');
  },
  create(data: CreateBeverageRequest) {
    return api.post<Beverage>('/boissons', data);
  },
  // Placeholders for update/delete if needed in the future
  // update(id: number, data: Partial<CreateBeverageRequest>) {
  //   return api.put<Beverage>(`/boissons/${id}`, data);
  // },
  // delete(id: number) {
  //   return api.delete(`/boissons/${id}`);
  // },
};

