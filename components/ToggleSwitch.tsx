import React from 'react';
import { StyleSheet, View, Pressable, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [animatedValue] = React.useState(new Animated.Value(value ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const toggleSwitch = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.disabled, theme.primary],
  });

  const circleTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <Pressable
      onPress={toggleSwitch}
      disabled={disabled}
      style={({ pressed }) => [
        { opacity: (pressed && !disabled) ? 0.7 : 1 },
        styles.container,
      ]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: theme.buttonText,
            transform: [{ translateX: circleTranslateX }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 28,
    justifyContent: 'center',
    borderRadius: 14,
  },
  track: {
    width: 50,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ToggleSwitch;
