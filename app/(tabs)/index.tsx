import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AdviceCard from '@/components/AdviceCard';

export default function HomeScreen() {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Navigate to morning or evening supplications
  const navigateToSupplications = (type: 'morning' | 'evening') => {
    router.push(`/${type}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {t('home')}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, { width: width > 500 ? width / 2 - 30 : width - 32 }]}
            onPress={() => navigateToSupplications('morning')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={isDarkMode ? ['#4a6da7', '#4a6da740'] : ['#a9c1e6', '#a9c1e640']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="sunny" size={40} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{t('morning')}</Text>
                <Ionicons name="arrow-forward-circle" size={24} color="#fff" style={styles.cardArrow} />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { width: width > 500 ? width / 2 - 30 : width - 32 }]}
            onPress={() => navigateToSupplications('evening')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={isDarkMode ? ['#6989bc', '#3e5a87'] : ['#87a2d0', '#4f6ea9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="moon" size={40} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{t('evening')}</Text>
                <Ionicons name="arrow-forward-circle" size={24} color="#fff" style={styles.cardArrow} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.adviceSection}>
          <AdviceCard />
        </View>
      </ScrollView>
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
    flexGrow: 1,
    paddingBottom: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  card: {
    height: 180,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardArrow: {
    alignSelf: 'flex-end',
  },
  adviceSection: {
    marginTop: 16,
    paddingBottom: 60,
  },
});
