import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components/native';
import { ButtonContainer, ButtonText } from './styles';

type ButtonProps = {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
};

export function Button({ title, onPress, isLoading = false }: ButtonProps) {
  const theme = useTheme();

  return (
    <ButtonContainer onPress={onPress} disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator color={theme.COLORS.TEXT_ON_PRIMARY} />
      ) : (
        <ButtonText>{title}</ButtonText>
      )}
    </ButtonContainer>
  );
}