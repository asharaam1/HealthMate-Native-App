import { useState, useEffect, useCallback } from 'react';
import { Report } from '../types';

// Dummy Data — backend ready hone par yeh hat jayega
const DUMMY_REPORTS: Report[] = [
    {
        _id: '1',
        title: 'CBC Blood Test',
        date: '12 Apr 2025',
        type: 'Lab Report',
        status: 'Analyzed',
        aiSummary: {
            en: 'Hemoglobin is slightly low (10.2 g/dL). WBC count is normal.',
            ur: 'Hemoglobin thoda kam hai. WBC theek hai.',
            questions: ['Iron supplement leni chahiye?', 'Repeat after 1 month?'],
            foods: ['Spinach', 'Red meat', 'Pomegranate juice'],
        },
    },
    {
        _id: '2',
        title: 'Chest X-Ray',
        date: '05 Mar 2025',
        type: 'X-Ray',
        status: 'Pending',
    },
    {
        _id: '3',
        title: 'Diabetes Panel',
        date: '20 Feb 2025',
        type: 'Lab Report',
        status: 'Analyzed',
        aiSummary: {
            en: 'HbA1c is 6.2%. Fasting glucose slightly elevated. Monitor diet.',
            ur: 'HbA1c 6.2% hai. Khana control rakhein.',
            questions: ['Medicine start karni chahiye?', 'Diet plan kya hoga?'],
            foods: ['Avoid sugar', 'Eat more fiber', 'Drink water'],
        },
    },
];


export const useReports = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReports = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            //Backend ready hone par: 

            // const data = await reportService.getRecent();
            // setReports(data);

            setReports(DUMMY_REPORTS); // dummy — hat jayega backend se
        } catch {
            setError('Reports load nahi ho sake.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        try {
            // const data = await reportService.getRecent();
            // setReports(data);
            setReports(DUMMY_REPORTS); // dummy
        } catch {
            setError('Refresh failed.');
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Computed values — screen mein calculate karne ki zaroorat nahi
    const analyzedCount = reports.filter(r => r.status === 'Analyzed').length;
    const pendingCount = reports.filter(r => r.status === 'Pending').length;

    return {
        reports,
        isLoading,
        refreshing,
        error,
        refresh,
        analyzedCount,
        pendingCount,
    };
};