import React, { ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsItemProps {
  title: string;
  icon: string;
  onPress?: () => void;
  children?: ReactNode;
  showArrow?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  icon,
  onPress,
  children,
  showArrow = true,
}) => {
  const { theme } = useTheme();

  const content = (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={styles.mainContent}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Ionicons name={icon as any} size={22} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.rightContent}>
        {children}
        {showArrow && onPress && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textSecondary}
            style={styles.arrowIcon}
          />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 8,
  },
});

export default SettingsItem;
