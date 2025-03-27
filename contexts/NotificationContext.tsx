import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

interface NotificationContextType {
  notificationsEnabled: boolean;
  morningReminderTime: string;
  eveningReminderTime: string;
  toggleNotifications: () => void;
  setMorningReminderTime: (time: string) => void;
  setEveningReminderTime: (time: string) => void;
}

// Create context with default values
const NotificationContext = createContext<NotificationContextType>({
  notificationsEnabled: false,
  morningReminderTime: '06:00',
  eveningReminderTime: '18:00',
  toggleNotifications: () => {},
  setMorningReminderTime: () => {},
  setEveningReminderTime: () => {},
});

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [morningReminderTime, setMorningReminderTimeState] = useState('06:00');
  const [eveningReminderTime, setEveningReminderTimeState] = useState('18:00');
  const [isLoaded, setIsLoaded] = useState(false);

  // Request permissions for notifications
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

  // Schedule daily notifications
  const scheduleDailyNotifications = async () => {
    // Cancel all previous notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!notificationsEnabled) {
      return;
    }

    // Parse times
    const [morningHours, morningMinutes] = morningReminderTime.split(':').map(Number);
    const [eveningHours, eveningMinutes] = eveningReminderTime.split(':').map(Number);

    // Schedule morning notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Morning Supplications',
        body: 'Time to read your morning supplications',
      },
      trigger: {
        hour: morningHours,
        minute: morningMinutes,
        repeats: true,
      },
    });

    // Schedule evening notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Evening Supplications',
        body: 'Time to read your evening supplications',
      },
      trigger: {
        hour: eveningHours,
        minute: eveningMinutes,
        repeats: true,
      },
    });
  };

  // Load notification settings from storage
  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const enabled = await AsyncStorage.getItem('notificationsEnabled');
        if (enabled !== null) {
          setNotificationsEnabled(enabled === 'true');
        }

        const morningTime = await AsyncStorage.getItem('morningReminderTime');
        if (morningTime) {
          setMorningReminderTimeState(morningTime);
        }

        const eveningTime = await AsyncStorage.getItem('eveningReminderTime');
        if (eveningTime) {
          setEveningReminderTimeState(eveningTime);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadNotificationSettings();
  }, []);

  // Update scheduled notifications when settings change
  useEffect(() => {
    if (isLoaded) {
      scheduleDailyNotifications();
    }
  }, [notificationsEnabled, morningReminderTime, eveningReminderTime, isLoaded]);

  // Toggle notifications on/off
  const toggleNotifications = async () => {
    try {
      const newState = !notificationsEnabled;
      await AsyncStorage.setItem('notificationsEnabled', newState.toString());
      setNotificationsEnabled(newState);

      if (newState) {
        const hasPermission = await requestPermissions();
        if (hasPermission) {
          await scheduleDailyNotifications();
        } else {
          // If permission denied, revert the toggle
          await AsyncStorage.setItem('notificationsEnabled', 'false');
          setNotificationsEnabled(false);
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  // Update morning reminder time
  const setMorningReminderTime = async (time: string) => {
    try {
      await AsyncStorage.setItem('morningReminderTime', time);
      setMorningReminderTimeState(time);
    } catch (error) {
      console.error('Error saving morning reminder time:', error);
    }
  };

  // Update evening reminder time
  const setEveningReminderTime = async (time: string) => {
    try {
      await AsyncStorage.setItem('eveningReminderTime', time);
      setEveningReminderTimeState(time);
    } catch (error) {
      console.error('Error saving evening reminder time:', error);
    }
  };

  // Skip rendering until settings are loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        morningReminderTime,
        eveningReminderTime,
        toggleNotifications,
        setMorningReminderTime,
        setEveningReminderTime,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext;
