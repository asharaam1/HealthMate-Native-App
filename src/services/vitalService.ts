import api from '../api/api';
import { Vital } from '../types';

export const vitalService = {

  getRecent: async (limit = 3): Promise<Vital[]> => {
    const res = await api.get(`/vitals?limit=${limit}`);
    return res.data.vitals;
  },

  add: async (data: Omit<Vital, '_id'>): Promise<Vital> => {
    const res = await api.post('/vitals', data);
    return res.data.vital;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/vitals/${id}`);
  },
};