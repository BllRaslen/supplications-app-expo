import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Audio } from 'expo-av';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playTapSound: () => Promise<void>;
  playCompletionSound: () => Promise<void>;
}

// Create context with default values
const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  playTapSound: async () => {},
  playCompletionSound: async () => {},
});

interface SoundProviderProps {
  children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tapSound, setTapSound] = useState<Audio.Sound | null>(null);
  const [completionSound, setCompletionSound] = useState<Audio.Sound | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load sound preference from storage
  useEffect(() => {
    const loadSoundPreference = async () => {
      try {
        const enabled = await AsyncStorage.getItem('soundEnabled');
        if (enabled !== null) {
          setSoundEnabled(enabled === 'true');
        }
      } catch (error) {
        console.error('Error loading sound preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSoundPreference();
  }, []);

  // Load sound files when component mounts
  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Configure audio
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // Create tap sound
        const { sound: newTapSound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/tap.mp3'),
          { volume: 0.5 }
        );
        setTapSound(newTapSound);

        // Create completion sound
        const { sound: newCompletionSound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/completion.mp3'),
          { volume: 0.7 }
        );
        setCompletionSound(newCompletionSound);
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    };

    loadSounds();

    // Cleanup sounds when component unmounts
    return () => {
      if (tapSound) {
        tapSound.unloadAsync();
      }
      if (completionSound) {
        completionSound.unloadAsync();
      }
    };
  }, []);

  // Toggle sound on/off
  const toggleSound = async () => {
    try {
      const newState = !soundEnabled;
      await AsyncStorage.setItem('soundEnabled', newState.toString());
      setSoundEnabled(newState);
    } catch (error) {
      console.error('Error toggling sound:', error);
    }
  };

  // Play tap sound effect
  const playTapSound = async () => {
    if (!soundEnabled || !tapSound) return;

    try {
      await tapSound.replayAsync();
    } catch (error) {
      console.error('Error playing tap sound:', error);
    }
  };

  // Play completion sound effect
  const playCompletionSound = async () => {
    if (!soundEnabled || !completionSound) return;

    try {
      await completionSound.replayAsync();
    } catch (error) {
      console.error('Error playing completion sound:', error);
    }
  };

  // Skip rendering until settings are loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playTapSound,
        playCompletionSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

// Custom hook to use the sound context
export const useSound = () => useContext(SoundContext);

export default SoundContext;
