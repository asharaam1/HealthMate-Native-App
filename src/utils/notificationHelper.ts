import { showNotification } from './notifications';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

let lastCheckTime = 0;
// ✅ Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout
let interval: ReturnType<typeof setInterval> | null = null;

// Poll for pending AI analyses
export const startPollingForAIAnalysis = () => {
  // ✅ Temporarily disabled - backend endpoint not ready yet
  console.log('⏸️ Polling is disabled. Backend endpoint /reports/pending-analysis needed.');
  return;
  if (interval) clearInterval(interval);

  // Check every 10 seconds
  interval = setInterval(async () => {
    await checkPendingAnalyses();
  }, 10000);
};

export const stopPollingForAIAnalysis = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

const checkPendingAnalyses = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.log('No token found, skipping poll');
      return;
    }

    console.log('🔄 Polling for pending analyses...');

    const response = await api.get('/reports/pending-analysis', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📡 Polling response:', response.data);

    const completed = response.data.completed || [];

    for (const item of completed) {
      const notifiedKey = `notified_${item._id}`;
      const alreadyNotified = await AsyncStorage.getItem(notifiedKey);

      if (!alreadyNotified) {
        await showNotification(
          '📄 AI Analysis Complete',
          `Your report "${item.title}" has been analyzed!`,
          { type: 'report', id: item._id }
        );
        await AsyncStorage.setItem(notifiedKey, 'true');
      }
    }
  } catch (error: any) {
    console.error('❌ Polling error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
};