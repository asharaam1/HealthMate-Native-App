import notifee, { AndroidImportance, EventType, Notification } from '@notifee/react-native';
import { Platform } from 'react-native';
import { navigationRef } from '../navigation/RootNavigation';

// Request permission and create channel
export const requestNotificationPermission = async () => {
  try {
    // Request permissions (iOS only)
    if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      if (!settings.authorizationStatus) {
        console.log('User denied permissions');
        return false;
      }
    }

    // Create Android channel
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'healthmate',
        name: 'HealthMate Notifications',
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'default',
        visibility: 1, // Public
      });
    }

    console.log('Notification permission granted');
    return true;
  } catch (error) {
    console.error('Permission error:', error);
    return false;
  }
};

// Show local notification
export const showNotification = async (
  title: string,
  body: string,
  data?: { type: string; id: string }
) => {
  try {
    await notifee.displayNotification({
      title,
      body,
      data: data || {},
      android: {
        channelId: 'healthmate',
        pressAction: { id: 'default' },
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_notification', // Add this icon to res/drawable
      },
      ios: {
        sound: 'default',
      },
    });
  } catch (error) {
    console.error('Show notification error:', error);
  }
};

// Setup notification press listener
export const setupNotificationListener = () => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      // User tapped notification
      const notification = detail.notification;
      // ✅ Fix: Use optional chaining and type assertion
      const notificationData = (notification as any)?.data;

      if (notificationData && notificationData.type && notificationData.id) {
        handleNotificationPress(notificationData.type, notificationData.id);
      }
    }
  });
};

// Handle notification press - ✅ Fix: Update navigation params
const handleNotificationPress = (type: string, id: string) => {
  if (navigationRef.isReady()) {
    if (type === 'report') {
      navigationRef.navigate('ReportDetail', { reportId: id });
    } else if (type === 'vital') {
      // ✅ Fix: Use 'vitalId' matching your navigation params
      navigationRef.navigate('VitalAnalysis', { vitalId: id });
    }
  }
};