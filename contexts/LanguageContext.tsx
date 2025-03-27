import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import { supplications_en, supplications_tr, supplications_ar, SupplicationData } from '@/assets/data/supplications';
import { advice } from '@/assets/data/advice';

// Define the language options
export type Language = 'en' | 'tr' | 'ar';

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: any;
  supplications: SupplicationData;
  t: (key: string) => string;
  adviceList: typeof advice.en;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translations: {},
  supplications: supplications_en,
  t: (key: string) => key,
  adviceList: advice.en,
});

// Define the available translations
const translations = {
  en: {
    morning: 'Morning Supplications',
    evening: 'Evening Supplications',
    completed: 'Completed!',
    congratulations: 'Congratulations on completing your supplications!',
    returnHome: 'Return to Home',
    home: 'Home',
    settings: 'Settings',
    advice: 'Advice',
    language: 'Language',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    sounds: 'Sounds',
    addCustom: 'Add Custom Supplication',
    english: 'English',
    turkish: 'Turkish',
    arabic: 'Arabic',
    on: 'On',
    off: 'Off',
    save: 'Save',
    cancel: 'Cancel',
    enterText: 'Enter Text',
    enterCount: 'Enter Count',
    success: 'Success',
    error: 'Error',
    customAdded: 'Custom supplication added successfully',
    dailyReminder: 'Daily Reminder',
    reminderText: 'Time to read your supplications',
  },
  tr: {
    morning: 'Sabah Duaları',
    evening: 'Akşam Duaları',
    completed: 'Tamamlandı!',
    congratulations: 'Dualarınızı tamamladığınız için tebrikler!',
    returnHome: 'Ana Sayfaya Dön',
    home: 'Ana Sayfa',
    settings: 'Ayarlar',
    advice: 'Tavsiye',
    language: 'Dil',
    darkMode: 'Karanlık Mod',
    notifications: 'Bildirimler',
    sounds: 'Sesler',
    addCustom: 'Özel Dua Ekle',
    english: 'İngilizce',
    turkish: 'Türkçe',
    arabic: 'Arapça',
    on: 'Açık',
    off: 'Kapalı',
    save: 'Kaydet',
    cancel: 'İptal',
    enterText: 'Metin Girin',
    enterCount: 'Sayı Girin',
    success: 'Başarılı',
    error: 'Hata',
    customAdded: 'Özel dua başarıyla eklendi',
    dailyReminder: 'Günlük Hatırlatma',
    reminderText: 'Dualarınızı okuma zamanı',
  },
  ar: {
    morning: 'أذكار الصباح',
    evening: 'أذكار المساء',
    completed: 'تم الإنتهاء!',
    congratulations: 'تهانينا على إكمال أذكارك!',
    returnHome: 'العودة إلى الصفحة الرئيسية',
    home: 'الرئيسية',
    settings: 'الإعدادات',
    advice: 'نصيحة',
    language: 'اللغة',
    darkMode: 'الوضع المظلم',
    notifications: 'الإشعارات',
    sounds: 'الأصوات',
    addCustom: 'إضافة ذكر مخصص',
    english: 'الإنجليزية',
    turkish: 'التركية',
    arabic: 'العربية',
    on: 'تشغيل',
    off: 'إيقاف',
    save: 'حفظ',
    cancel: 'إلغاء',
    enterText: 'أدخل النص',
    enterCount: 'أدخل العدد',
    success: 'نجاح',
    error: 'خطأ',
    customAdded: 'تمت إضافة الذكر المخصص بنجاح',
    dailyReminder: 'تذكير يومي',
    reminderText: 'حان وقت قراءة أذكارك',
  },
};

// Create the i18n instance
const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Get the user's preferred language from AsyncStorage or device locale
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('userLanguage');
        if (storedLanguage) {
          setLanguageState(storedLanguage as Language);
        } else {
          // Get device locale and set appropriate language
          const deviceLocale = Localization.locale.split('-')[0];
          if (deviceLocale === 'tr' || deviceLocale === 'ar') {
            setLanguageState(deviceLocale as Language);
          } else {
            setLanguageState('en');
          }
        }
      } catch (error) {
        console.error('Error loading language:', error);
        setLanguageState('en');
      } finally {
        setIsLoaded(true);
      }
    };

    loadLanguage();
  }, []);

  // Set the language and store it in AsyncStorage
  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem('userLanguage', newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  // Set the active locale for i18n
  i18n.locale = language;

  // Get the appropriate supplications data based on language
  const getSupplications = (): SupplicationData => {
    switch (language) {
      case 'ar':
        return supplications_ar;
      case 'tr':
        return supplications_tr;
      default:
        return supplications_en;
    }
  };

  // Get the appropriate advice list based on language
  const getAdviceList = () => {
    return advice[language] || advice.en;
  };

  // Translation function shorthand
  const t = (key: string) => i18n.t(key);

  // Skip rendering until language is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: translations[language],
        supplications: getSupplications(),
        adviceList: getAdviceList(),
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
