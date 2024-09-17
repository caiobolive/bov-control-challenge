import styled from 'styled-components/native';
import { css } from 'styled-components/native';
import { TextInput, View, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';

export const ButtonView = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
`;

export const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_ON_PRIMARY};
  font-size: 16px;
`;

export const InputContainer = styled(TextInput)`
  width: 100%;
  height: 50px;
  padding: 10px;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  color: ${({ theme }) => theme.COLORS.TEXT};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.COLORS.PRIMARY};
  margin-bottom: 8px;
`;

export const TextAreaContainer = styled(TextInput)`
  width: 100%;
  height: 150px;
  padding: 10px;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  color: ${({ theme }) => theme.COLORS.TEXT};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.COLORS.PRIMARY};
  text-align-vertical: top; /* Ensures text starts at the top */
`;

export const Container = styled.View`
  flex: 1;
  margin: 32px 32px 0 32px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.COLORS.TEXT};
  font-weight: bold;
`;

export const Form = styled.View`
  flex: 1;
`;

export const TitleContainer = styled(ThemedView)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 32px 32px 0 32px;
`;

export const ItemContainer = styled(ThemedView)`
  padding: 16px;
  margin: 32px 32px 0 32px;
  border-radius: 4px;
  elevation: 5;
`;

export const shadowStyles = StyleSheet.create({
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});

export const SearchInput = styled.TextInput`
  margin-vertical: 10px;
  padding: 10px;
  border-color: #ccc;
  border-width: 1px;
  border-radius: 5px;
`;