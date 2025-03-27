import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Alert, TouchableOpacity, Modal, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useSound } from '@/contexts/SoundContext';
import SettingsItem from '@/components/SettingsItem';
import ToggleSwitch from '@/components/ToggleSwitch';
import Button from '@/components/Button';

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const {
    notificationsEnabled,
    morningReminderTime,
    eveningReminderTime,
    toggleNotifications,
    setMorningReminderTime,
    setEveningReminderTime
  } = useNotifications();
  const { soundEnabled, toggleSound } = useSound();

  // State for modals
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);

  // Handler for language selection
  const handleLanguageSelect = (selectedLanguage: 'en' | 'tr' | 'ar') => {
    setLanguage(selectedLanguage);
    setIsLanguageModalVisible(false);
  };

  // Language names mapping
  const languageNames = {
    en: 'English',
    tr: 'Turkish',
    ar: 'العربية',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t('settings')}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <SettingsItem
            title={t('language')}
            icon="language"
            onPress={() => setIsLanguageModalVisible(true)}
          >
            <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
              {languageNames[language]}
            </Text>
          </SettingsItem>

          <SettingsItem
            title={t('darkMode')}
            icon="moon"
            showArrow={false}
          >
            <ToggleSwitch value={isDarkMode} onValueChange={toggleTheme} />
          </SettingsItem>

          <SettingsItem
            title={t('notifications')}
            icon="notifications"
            onPress={() => setIsNotificationModalVisible(true)}
          >
            <ToggleSwitch value={notificationsEnabled} onValueChange={toggleNotifications} />
          </SettingsItem>

          <SettingsItem
            title={t('sounds')}
            icon="volume-high"
            showArrow={false}
          >
            <ToggleSwitch value={soundEnabled} onValueChange={toggleSound} />
          </SettingsItem>
        </View>

        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        transparent
        visible={isLanguageModalVisible}
        animationType="fade"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t('language')}
            </Text>

            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'en' && [styles.selectedOption, { borderColor: theme.primary }],
              ]}
              onPress={() => handleLanguageSelect('en')}
            >
              <Text
                style={[
                  styles.languageText,
                  { color: theme.text },
                  language === 'en' && { color: theme.primary, fontWeight: 'bold' },
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'tr' && [styles.selectedOption, { borderColor: theme.primary }],
              ]}
              onPress={() => handleLanguageSelect('tr')}
            >
              <Text
                style={[
                  styles.languageText,
                  { color: theme.text },
                  language === 'tr' && { color: theme.primary, fontWeight: 'bold' },
                ]}
              >
                Türkçe
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'ar' && [styles.selectedOption, { borderColor: theme.primary }],
              ]}
              onPress={() => handleLanguageSelect('ar')}
            >
              <Text
                style={[
                  styles.languageText,
                  { color: theme.text },
                  language === 'ar' && { color: theme.primary, fontWeight: 'bold' },
                ]}
              >
                العربية
              </Text>
            </TouchableOpacity>

            <Button
              title={t('cancel')}
              onPress={() => setIsLanguageModalVisible(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal
        transparent
        visible={isNotificationModalVisible}
        animationType="fade"
        onRequestClose={() => setIsNotificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t('notifications')}
            </Text>

            <View style={styles.notificationOption}>
              <Text style={[styles.notificationLabel, { color: theme.text }]}>
                {t('morning')}
              </Text>
              <TouchableOpacity
                style={[styles.timeButton, { borderColor: theme.border }]}
                onPress={() => {
                  // In a real app, we would open a time picker here
                  // For simplicity, we'll just show an alert
                  Alert.alert(
                    t('morning'),
                    'In a real app, this would open a time picker'
                  );
                }}
              >
                <Text style={[styles.timeText, { color: theme.text }]}>
                  {morningReminderTime}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.notificationOption}>
              <Text style={[styles.notificationLabel, { color: theme.text }]}>
                {t('evening')}
              </Text>
              <TouchableOpacity
                style={[styles.timeButton, { borderColor: theme.border }]}
                onPress={() => {
                  // In a real app, we would open a time picker here
                  // For simplicity, we'll just show an alert
                  Alert.alert(
                    t('evening'),
                    'In a real app, this would open a time picker'
                  );
                }}
              >
                <Text style={[styles.timeText, { color: theme.text }]}>
                  {eveningReminderTime}
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title={t('save')}
              onPress={() => setIsNotificationModalVisible(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  settingValue: {
    fontSize: 16,
    marginRight: 8,
  },
  appInfo: {
    padding: 16,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderWidth: 2,
  },
  languageText: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 16,
  },
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 16,
  },
});
