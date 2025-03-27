import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  // Calculate button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          borderColor: theme.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primary,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
    }
  };

  // Calculate text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.buttonText;
      case 'outline':
        return theme.primary;
      default:
        return theme.buttonText;
    }
  };

  // Calculate button size
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 4,
        };
      case 'medium':
        return {
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
        };
      case 'large':
        return {
          paddingVertical: 14,
          paddingHorizontal: 28,
          borderRadius: 8,
        };
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 8,
        };
    }
  };

  // Get font size based on button size
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabledButton,
        disabled && { backgroundColor: theme.disabled, borderColor: theme.disabled },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? theme.primary : theme.buttonText}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: getTextColor(), fontSize: getFontSize() },
            disabled && styles.disabledText,
            disabled && { color: variant === 'outline' ? theme.disabled : theme.buttonText },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  disabledText: {
    opacity: 0.8,
  },
});

export default Button;
