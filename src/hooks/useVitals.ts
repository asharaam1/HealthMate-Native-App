import { useState, useEffect, useCallback } from 'react';
import { Vital } from '../types';

// Dummy Data
const DUMMY_VITALS: Vital[] = [
    { _id: 'v1', type: 'BP', value: '130/80', date: '15 Apr 2025', note: 'After lunch' },
    { _id: 'v2', type: 'Sugar', value: '95', date: '14 Apr 2025', note: 'Fasting' },
    { _id: 'v3', type: 'Weight', value: '72', date: '10 Apr 2025' },
];

export const useVitals = () => {
    const [vitals, setVitals] = useState<Vital[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVitals = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Backend ready hone par
            // const data = await vitalService.getRecent();
            // setVitals(data);
            setVitals(DUMMY_VITALS); // dummy — hata do backend pe
        } catch {
            setError('Vitals load nahi ho sake.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVitals();
    }, [fetchVitals]);

    return { vitals, isLoading, error };
};