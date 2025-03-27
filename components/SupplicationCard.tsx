import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { Supplication } from '@/assets/data/supplications';
import { useTheme } from '@/contexts/ThemeContext';
import { useSupplications } from '@/contexts/SupplicationContext';
import { useSound } from '@/contexts/SoundContext';

interface SupplicationCardProps {
  supplication: Supplication;
  onComplete?: () => void;
}

const SupplicationCard: React.FC<SupplicationCardProps> = ({ supplication, onComplete }) => {
  const { theme } = useTheme();
  const { completedSupplications, markSupplicationCompleted } = useSupplications();
  const { playTapSound } = useSound();

  const [count, setCount] = useState(supplication.count);
  const [opacity] = useState(new Animated.Value(1));
  const [scale] = useState(new Animated.Value(1));
  const [isCompleted, setIsCompleted] = useState(false);

  // Check if the supplication is already completed
  useEffect(() => {
    if (completedSupplications[supplication.id]) {
      setIsCompleted(true);
      setCount(0);
    }
  }, [completedSupplications, supplication.id]);

  // Hide card when completed
  useEffect(() => {
    if (isCompleted) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }, [isCompleted, opacity, scale, onComplete]);

  const handlePress = async () => {
    if (isCompleted) return;

    // Play tap sound
    await playTapSound();

    // Animate press
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Decrease count
    if (count > 1) {
      setCount(count - 1);
    } else {
      setCount(0);
      setIsCompleted(true);
      await markSupplicationCompleted(supplication.id);
    }
  };

  if (isCompleted) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable
        style={styles.cardContent}
        onPress={handlePress}
        android_ripple={{ color: theme.primary + '40' }}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.arabicText, { color: theme.primary }]}>
            {supplication.arabicText}
          </Text>
          <Text style={[styles.translatedText, { color: theme.text }]}>
            {supplication.translatedText}
          </Text>
        </View>
        <View style={[styles.countContainer, { backgroundColor: theme.primary }]}>
          <Text style={[styles.countText, { color: theme.buttonText }]}>{count}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  arabicText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
    lineHeight: 28,
  },
  translatedText: {
    fontSize: 16,
    lineHeight: 22,
  },
  countContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SupplicationCard;
