import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupplications } from '@/contexts/SupplicationContext';
import Button from './Button';

interface AddSupplicationFormProps {
  visible: boolean;
  onClose: () => void;
  type: 'morning' | 'evening';
}

const AddSupplicationForm: React.FC<AddSupplicationFormProps> = ({
  visible,
  onClose,
  type,
}) => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const { addCustomSupplication } = useSupplications();

  // Form state
  const [arabicText, setArabicText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [count, setCount] = useState('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!arabicText.trim()) {
      setError('Arabic text is required');
      return;
    }

    if (!translatedText.trim()) {
      setError('Translated text is required');
      return;
    }

    const countNum = parseInt(count);
    if (isNaN(countNum) || countNum < 1 || countNum > 100) {
      setError('Count must be a number between 1 and 100');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addCustomSupplication({
        arabicText,
        translatedText,
        count: countNum,
        isCustom: true,
        type,
      });

      setSuccess(true);

      // Reset form
      setArabicText('');
      setTranslatedText('');
      setCount('3');

      // Close after 1.5 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);

    } catch (err) {
      setError('Failed to add supplication');
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal is closed
  const handleClose = () => {
    setArabicText('');
    setTranslatedText('');
    setCount('3');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.content, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              {t('addCustom')}
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={[styles.label, { color: theme.text }]}>
              {language === 'ar' ? 'النص' : 'Arabic Text'}
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.arabicInput,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text
                }
              ]}
              value={arabicText}
              onChangeText={setArabicText}
              placeholder={language === 'ar' ? 'اكتب النص هنا' : 'Enter Arabic text here'}
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlign={language === 'ar' ? 'right' : 'left'}
              textAlignVertical="top"
            />

            <Text style={[styles.label, { color: theme.text }]}>
              {language === 'ar' ? 'الترجمة' : 'Translated Text'}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text
                }
              ]}
              value={translatedText}
              onChangeText={setTranslatedText}
              placeholder={t('enterText')}
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
            />

            <Text style={[styles.label, { color: theme.text }]}>
              {language === 'ar' ? 'عدد المرات' : 'Count'}
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.countInput,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  color: theme.text
                }
              ]}
              value={count}
              onChangeText={setCount}
              placeholder={t('enterCount')}
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
              maxLength={3}
            />

            {error ? (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {error}
              </Text>
            ) : null}

            {success ? (
              <Text style={[styles.successText, { color: theme.success }]}>
                {t('customAdded')}
              </Text>
            ) : null}
          </ScrollView>

          <View style={styles.actions}>
            <Button
              title={t('cancel')}
              onPress={handleClose}
              variant="outline"
              style={styles.button}
            />
            <Button
              title={t('save')}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading || success}
              style={styles.button}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
    maxHeight: 400,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
  },
  arabicInput: {
    fontFamily: Platform.OS === 'ios' ? 'ArialHebrew' : 'sans-serif',
  },
  countInput: {
    minHeight: 50,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default AddSupplicationForm;
