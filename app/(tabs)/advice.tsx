import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdviceScreen() {
  const { theme, isDarkMode } = useTheme();
  const { t, adviceList } = useLanguage();

  // Render each advice item
  const renderAdviceItem = ({ item, index }: { item: typeof adviceList[0]; index: number }) => {
    return (
      <View style={[styles.adviceItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme.accent + '20' }]}>
          <Ionicons name="information-circle" size={24} color={theme.accent} />
        </View>
        <View style={styles.adviceTextContainer}>
          <Text style={[styles.adviceNumber, { color: theme.textSecondary }]}>
            {index + 1}.
          </Text>
          <Text style={[styles.adviceText, { color: theme.text }]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t('advice')}
        </Text>
      </View>

      <FlatList
        data={adviceList}
        renderItem={renderAdviceItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  adviceItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adviceTextContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  adviceNumber: {
    fontSize: 16,
    marginRight: 6,
    fontWeight: '500',
  },
  adviceText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
});
