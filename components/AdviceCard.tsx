import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const AdviceCard: React.FC = () => {
  const { theme } = useTheme();
  const { adviceList } = useLanguage();
  const [currentAdvice, setCurrentAdvice] = useState(adviceList[0]);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  // Change advice every 20 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start(() => {
        // Change advice
        const randomIndex = Math.floor(Math.random() * adviceList.length);
        setCurrentAdvice(adviceList[randomIndex]);

        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease,
        }).start();
      });
    }, 20000);

    return () => clearInterval(intervalId);
  }, [fadeAnim, adviceList]);

  // Set random advice on first render or when language changes
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * adviceList.length);
    setCurrentAdvice(adviceList[randomIndex]);
  }, [adviceList]);

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.iconContainer}>
        <FontAwesome name="lightbulb-o" size={24} color={theme.accent} />
      </View>
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={[styles.adviceText, { color: theme.text }]}>{currentAdvice.text}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  adviceText: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default AdviceCard;
