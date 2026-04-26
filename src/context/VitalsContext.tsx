// src/context/VitalsContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/api';

interface Vitals {
  _id: string;
  userId: string;
  familyMemberId: string;
  bloodPressure?: { systolic: number; diastolic: number };
  bloodSugar?: { value: number; type: string };
  weight?: { value: number; unit: string };
  height?: { value: number; unit: string };
  heartRate?: { value: number };
  temperature?: { value: number; unit: string };
  oxygenLevel?: { value: number };
  notes?: string;
  recordedAt: string;
}

interface VitalsResponse {
  vitals: Vitals[];
  total: number;
}

interface VitalsContextType {
  vitals: Vitals[];
  currentVital: Vitals | null;
  loading: boolean;
  error: string | null;
  total: number;
  addVitals: (vitalsData: any) => Promise<Vitals>;
  getVitals: (params?: any) => Promise<void>;
  getVitalById: (id: string) => Promise<Vitals>;
  deleteVital: (id: string) => Promise<void>;
  clearError: () => void;
}

const VitalsContext = createContext<VitalsContextType | undefined>(undefined);

export const VitalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [vitals, setVitals] = useState<Vitals[]>([]);
  const [currentVital, setCurrentVital] = useState<Vitals | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const addVitals = useCallback(async (vitalsData: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/vitals', vitalsData);
      setVitals(prev => [data.vitals, ...prev]);
      return data.vitals;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add vitals');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVitals = useCallback(async (params: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/vitals', { params });
      setVitals(data.vitals);
      setTotal(data.total);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch vitals');
    } finally {
      setLoading(false);
    }
  }, []);

  const getVitalById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/vitals/${id}`);
      setCurrentVital(data.vital);
      return data.vital;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch vital');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVital = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/vitals/${id}`);
        setVitals(prev => prev.filter(v => v._id !== id));
        if (currentVital?._id === id) {
          setCurrentVital(null);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete vitals');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentVital],
  );

  const clearError = () => setError(null);

  return (
    <VitalsContext.Provider
      value={{
        vitals,
        currentVital,
        loading,
        error,
        total,
        addVitals,
        getVitals,
        getVitalById,
        deleteVital,
        clearError,
      }}
    >
      {children}
    </VitalsContext.Provider>
  );
};

export const useVitals = () => {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error('useVitals must be used within VitalsProvider');
  }
  return context;
};
