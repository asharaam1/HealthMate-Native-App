import api from '../api/api';
import { Report } from '../types';

export const reportService = {

  getRecent: async (limit = 5): Promise<Report[]> => {
    const res = await api.get(`/reports?limit=${limit}`);
    return res.data.reports;
  },

  upload: async (formData: FormData): Promise<Report> => {
    const res = await api.post('/reports/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.report;
  },

  getById: async (id: string): Promise<Report> => {
    const res = await api.get(`/reports/${id}`);
    return res.data.report;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },
};