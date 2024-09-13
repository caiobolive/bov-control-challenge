import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
};

export function IconButton({ icon, onPress, size = 24, color }: IconButtonProps) {
  const theme = useTheme();
  const iconColor = color || theme.COLORS.TEXT;

  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name={icon} size={size} color={iconColor} />
    </TouchableOpacity>
  );
}