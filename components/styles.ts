import styled from 'styled-components/native';
import { TextInput } from 'react-native';
import { ThemeType } from '@/constants/theme';

export const ButtonContainer = styled.TouchableOpacity<{ theme: ThemeType }>`
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text<{ theme: ThemeType }>`
  color: ${({ theme }) => theme.COLORS.TEXT_ON_PRIMARY};
  font-size: 16px;
`;

export const InputContainer = styled(TextInput)<{ theme: ThemeType }>`
  width: 100%;
  height: 50px;
  padding: 10px;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  color: ${({ theme }) => theme.COLORS.TEXT};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.COLORS.PRIMARY};
`;

export const TextAreaContainer = styled(TextInput)<{ theme: ThemeType }>`
  width: 100%;
  height: 150px;
  padding: 10px;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
  color: ${({ theme }) => theme.COLORS.TEXT};
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.COLORS.PRIMARY};
  text-align-vertical: top; /* Ensures text starts at the top */
`;

export const Container = styled.View<{ theme: ThemeType }>`
  flex: 1;
  padding: 24px;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.Text<{ theme: ThemeType }>`
  font-size: 24px;
  color: ${({ theme }) => theme.COLORS.TEXT};
  font-weight: bold;
`;

export const Form = styled.View`
  flex: 1;
`;