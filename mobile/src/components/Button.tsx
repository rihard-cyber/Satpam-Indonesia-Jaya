import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'gold' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
}: ButtonProps) {
  const isGold = variant === 'gold';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        isGold && styles.gold,
        isOutline && styles.outline,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={isGold ? COLORS.black : COLORS.white}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              isGold && styles.goldText,
              isOutline && styles.outlineText,
              isGhost && styles.ghostText,
              icon ? { marginLeft: SPACING.sm } : null,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.navy[600],
  },
  gold: {
    backgroundColor: COLORS.gold,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  goldText: {
    color: COLORS.black,
  },
  outlineText: {
    color: COLORS.gold,
  },
  ghostText: {
    color: COLORS.text.secondary,
  },
});
