import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Supplication } from '@/assets/data/supplications';
import { useLanguage } from './LanguageContext';

interface CustomSupplication extends Supplication {
  isCustom: boolean;
  type: 'morning' | 'evening';
}

interface SupplicationContextType {
  completedSupplications: { [id: string]: boolean };
  customSupplications: CustomSupplication[];
  addCustomSupplication: (supplication: Omit<CustomSupplication, 'id'>) => Promise<void>;
  removeCustomSupplication: (id: string) => Promise<void>;
  markSupplicationCompleted: (id: string) => Promise<void>;
  resetSupplications: (type: 'morning' | 'evening' | 'all') => Promise<void>;
}

// Create context with default values
const SupplicationContext = createContext<SupplicationContextType>({
  completedSupplications: {},
  customSupplications: [],
  addCustomSupplication: async () => {},
  removeCustomSupplication: async () => {},
  markSupplicationCompleted: async () => {},
  resetSupplications: async () => {},
});

interface SupplicationProviderProps {
  children: ReactNode;
}

export const SupplicationProvider: React.FC<SupplicationProviderProps> = ({ children }) => {
  const { language } = useLanguage();
  const [completedSupplications, setCompletedSupplications] = useState<{ [id: string]: boolean }>({});
  const [customSupplications, setCustomSupplications] = useState<CustomSupplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from AsyncStorage when component mounts or language changes
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load completed supplications
        const completedData = await AsyncStorage.getItem(`completedSupplications_${language}`);
        if (completedData) {
          setCompletedSupplications(JSON.parse(completedData));
        } else {
          setCompletedSupplications({});
        }

        // Load custom supplications
        const customData = await AsyncStorage.getItem(`customSupplications_${language}`);
        if (customData) {
          setCustomSupplications(JSON.parse(customData));
        } else {
          setCustomSupplications([]);
        }
      } catch (error) {
        console.error('Error loading supplication data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [language]);

  // Mark a supplication as completed
  const markSupplicationCompleted = async (id: string) => {
    try {
      const updatedCompletions = {
        ...completedSupplications,
        [id]: true,
      };

      await AsyncStorage.setItem(
        `completedSupplications_${language}`,
        JSON.stringify(updatedCompletions)
      );

      setCompletedSupplications(updatedCompletions);
    } catch (error) {
      console.error('Error marking supplication as completed:', error);
    }
  };

  // Reset completed supplications
  const resetSupplications = async (type: 'morning' | 'evening' | 'all') => {
    try {
      if (type === 'all') {
        await AsyncStorage.setItem(`completedSupplications_${language}`, JSON.stringify({}));
        setCompletedSupplications({});
        return;
      }

      // Filter completed supplications to keep the ones of the other type
      const filteredCompletions = Object.entries(completedSupplications).reduce((acc, [key, value]) => {
        // For morning reset, keep evening supplications (those starting with 'e')
        // For evening reset, keep morning supplications (those starting with 'm')
        if ((type === 'morning' && key.startsWith('e')) || (type === 'evening' && key.startsWith('m'))) {
          acc[key] = value;
        }
        return acc;
      }, {} as { [id: string]: boolean });

      await AsyncStorage.setItem(
        `completedSupplications_${language}`,
        JSON.stringify(filteredCompletions)
      );

      setCompletedSupplications(filteredCompletions);
    } catch (error) {
      console.error('Error resetting supplications:', error);
    }
  };

  // Add a custom supplication
  const addCustomSupplication = async (supplication: Omit<CustomSupplication, 'id'>) => {
    try {
      const newSupplication: CustomSupplication = {
        ...supplication,
        id: `custom_${Date.now()}`,
        isCustom: true,
      };

      const updatedCustomSupplications = [...customSupplications, newSupplication];

      await AsyncStorage.setItem(
        `customSupplications_${language}`,
        JSON.stringify(updatedCustomSupplications)
      );

      setCustomSupplications(updatedCustomSupplications);
    } catch (error) {
      console.error('Error adding custom supplication:', error);
    }
  };

  // Remove a custom supplication
  const removeCustomSupplication = async (id: string) => {
    try {
      const updatedCustomSupplications = customSupplications.filter(
        (supplication) => supplication.id !== id
      );

      await AsyncStorage.setItem(
        `customSupplications_${language}`,
        JSON.stringify(updatedCustomSupplications)
      );

      setCustomSupplications(updatedCustomSupplications);

      // Also remove from completed if it's there
      if (completedSupplications[id]) {
        const { [id]: _, ...updatedCompletions } = completedSupplications;

        await AsyncStorage.setItem(
          `completedSupplications_${language}`,
          JSON.stringify(updatedCompletions)
        );

        setCompletedSupplications(updatedCompletions);
      }
    } catch (error) {
      console.error('Error removing custom supplication:', error);
    }
  };

  // Skip rendering until data is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <SupplicationContext.Provider
      value={{
        completedSupplications,
        customSupplications,
        addCustomSupplication,
        removeCustomSupplication,
        markSupplicationCompleted,
        resetSupplications,
      }}
    >
      {children}
    </SupplicationContext.Provider>
  );
};

// Custom hook to use the supplication context
export const useSupplications = () => useContext(SupplicationContext);

export default SupplicationContext;
