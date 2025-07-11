import api from '../api';
import type {Stock} from "./stockModel.ts";

export const stockService = {
  getByBeverage(boissonId: number) {
    return api.get<Stock>(`/stocks/boisson/${boissonId}`);
  },
};

