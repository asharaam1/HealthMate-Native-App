// src/context/ReportContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/api';

interface AbnormalValue {
  parameter: string;
  value: string;
  normalRange: string;
  status: 'high' | 'low' | 'critical';
}

interface AISummary {
  englishSummary: string;
  romanUrduSummary: string;
  abnormalValues: AbnormalValue[];
  doctorQuestions: string[];
  foodsToAvoid: string[];
  recommendedFoods: string[];
  homeRemedies: string[];
  disclaimer: string;
}

interface Report {
  _id: string;
  userId: string;
  familyMemberId: string;
  title: string;
  reportType: string;
  reportDate: string;
  file: {
    url: string;
    publicId: string;
    fileType: string;
  };
  aiSummary: AISummary;
  notes: string;
  isProcessed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  pages: number;
}

interface ReportContextType {
  reports: Report[];
  currentReport: Report | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
  uploadReport: (formData: FormData) => Promise<Report>;
  getReports: (params?: any) => Promise<void>;
  getReportById: (id: string) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentReport: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const uploadReport = useCallback(async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setReports(prev => [data.report, ...prev]);
      return data.report;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Upload failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReports = useCallback(async (params: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/reports', { params });
      setReports(data.reports);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const getReportById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/reports/${id}`);
      setCurrentReport(data.report);
      return data.report;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch report');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReport = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/reports/${id}`);
        setReports(prev => prev.filter(r => r._id !== id));
        if (currentReport?._id === id) {
          setCurrentReport(null);
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete report');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentReport],
  );

  const clearError = () => setError(null);
  const clearCurrentReport = () => setCurrentReport(null);

  return (
    <ReportContext.Provider
      value={{
        reports,
        currentReport,
        loading,
        error,
        total,
        page,
        pages,
        uploadReport,
        getReports,
        getReportById,
        deleteReport,
        clearError,
        clearCurrentReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within ReportProvider');
  }
  return context;
};
