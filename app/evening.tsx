import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupplications } from '@/contexts/SupplicationContext';
import { useSound } from '@/contexts/SoundContext';
import ScreenHeader from '@/components/ScreenHeader';
import SupplicationCard from '@/components/SupplicationCard';
import CompletionModal from '@/components/CompletionModal';
import AddSupplicationForm from '@/components/AddSupplicationForm';

export default function EveningSupplicationsScreen() {
  const { theme, isDarkMode } = useTheme();
  const { t, supplications } = useLanguage();
  const { completedSupplications, customSupplications, resetSupplications } = useSupplications();
  const { playCompletionSound } = useSound();

  const [isCompletionModalVisible, setIsCompletionModalVisible] = useState(false);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [completionCount, setCompletionCount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Combine standard supplications with custom ones
  const allSupplications = [
    ...supplications.evening,
    ...customSupplications.filter(s => s.type === 'evening'),
  ];

  // Check completion status when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      checkCompletionStatus();
    }, [completedSupplications, allSupplications])
  );

  // Check if all supplications are completed
  const checkCompletionStatus = () => {
    const total = allSupplications.length;
    const completed = allSupplications.filter(item => completedSupplications[item.id]).length;

    setCompletionCount(completed);
    setTotalItems(total);

    if (total > 0 && completed === total) {
      setIsCompletionModalVisible(true);
      playCompletionSound();
    }
  };

  // Handle supplication card completion
  const handleSupplicationComplete = () => {
    checkCompletionStatus();
  };

  // Reset all evening supplications
  const handleReset = async () => {
    await resetSupplications('evening');
  };

  // Render supplication card
  const renderSupplicationItem = ({ item }: { item: typeof allSupplications[0] }) => {
    return (
      <SupplicationCard
        supplication={item}
        onComplete={handleSupplicationComplete}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <ScreenHeader
        title={t('evening')}
        showBackButton
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setIsAddFormVisible(true)}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <FontAwesome name="plus" size={20} color={theme.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.headerButton, styles.resetButton]}
              onPress={handleReset}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <FontAwesome name="refresh" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        }
      />

      <FlatList
        data={allSupplications}
        renderItem={renderSupplicationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <CompletionModal
        visible={isCompletionModalVisible}
        onClose={() => setIsCompletionModalVisible(false)}
      />

      <AddSupplicationForm
        visible={isAddFormVisible}
        onClose={() => setIsAddFormVisible(false)}
        type="evening"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 80,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  resetButton: {
    marginLeft: 8,
  },
});
