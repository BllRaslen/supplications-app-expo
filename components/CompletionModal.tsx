import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSound } from '@/contexts/SoundContext';

interface CompletionModalProps {
  visible: boolean;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { playCompletionSound } = useSound();
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Play completion sound
      playCompletionSound();

      // Animate the modal entrance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations when modal is closed
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim, playCompletionSound]);

  const handleClose = () => {
    // Animate the modal exit
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.completedTitle, { color: theme.primary }]}>
              {t('completed')}
            </Text>
            <Text style={[styles.completedMessage, { color: theme.text }]}>
              {t('congratulations')}
            </Text>
            <View style={styles.duaContainer}>
              <Text style={[styles.duaText, { color: theme.textSecondary }]}>
                اللَّهُمَّ إنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا
              </Text>
              <Text style={[styles.duaTranslation, { color: theme.textSecondary }]}>
                O Allah, I ask You for beneficial knowledge, good provision, and acceptable deeds.
              </Text>
            </View>
            <Pressable
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleClose}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                {t('returnHome')}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  completedMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  duaContainer: {
    width: '100%',
    padding: 16,
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  duaText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  duaTranslation: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 160,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CompletionModal;
