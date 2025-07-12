import api from '../../../api.ts';
import type {Stock} from "../models/stockModel.ts";

export const stockService = {
  getByBeverage(boissonId: number) {
    return api.get<Stock>(`/stocks/boisson/${boissonId}`);
  },
};

