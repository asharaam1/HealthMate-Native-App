// src/context/FamilyMemberContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/api';
import type { FamilyMember, FamilyMemberContextType } from '../types/index'; 

interface ProfileImage {
  url: string;
  publicId: string;
}


const FamilyMemberContext = createContext<FamilyMemberContextType | undefined>(
  undefined,
);

export const FamilyMemberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFamilyMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/family-members');
      setMembers(data.data);
      if (!selectedMember && data.data.length > 0) {
        setSelectedMember(data.data[0]);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'Failed to fetch family members',
      );
    } finally {
      setLoading(false);
    }
  }, [selectedMember]);

  const createFamilyMember = useCallback(async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/family-members', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMembers(prev => [...prev, data.data]);
      setSelectedMember(data.data);
      return data.data;
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'Failed to create family member',
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFamilyMember = useCallback(
    async (id: string, formData: FormData) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.put(`/family-members/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMembers(prev => prev.map(m => (m._id === id ? data.data : m)));
        if (selectedMember?._id === id) {
          setSelectedMember(data.data);
        }
        return data.data;
      } catch (error: any) {
        setError(
          error.response?.data?.message || 'Failed to update family member',
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedMember],
  );

  const deleteFamilyMember = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/family-members/${id}`);
        setMembers(prev => prev.filter(m => m._id !== id));
        if (selectedMember?._id === id) {
          setSelectedMember(members[0] || null);
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message || 'Failed to delete family member',
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedMember, members],
  );

  const deleteFamilyMemberImage = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/family-members/${id}/image`);
        setMembers(prev =>
          prev.map(m => (m._id === id ? { ...m, profileImage: undefined } : m)),
        );
        if (selectedMember?._id === id) {
          setSelectedMember({ ...selectedMember, profileImage: undefined });
        }
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete image');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedMember],
  );

  const clearError = () => setError(null);

  return (
    <FamilyMemberContext.Provider
      value={{
        members,
        selectedMember,
        loading,
        error,
        fetchFamilyMembers,
        createFamilyMember,
        updateFamilyMember,
        deleteFamilyMember,
        deleteFamilyMemberImage,
        setSelectedMember,
        clearError,
      }}
    >
      {children}
    </FamilyMemberContext.Provider>
  );
};

export const useFamilyMembers = () => {
  const context = useContext(FamilyMemberContext);
  if (!context) {
    throw new Error(
      'useFamilyMembers must be used within FamilyMemberProvider',
    );
  }
  return context;
};
