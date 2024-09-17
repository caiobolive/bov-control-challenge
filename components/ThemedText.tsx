import React from 'react';
import { Text, type TextProps } from 'react-native';
import styled from 'styled-components/native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'subtitleHighlight' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let StyledTextComponent;

  switch (type) {
    case 'title':
      StyledTextComponent = TitleText;
      break;
    case 'defaultSemiBold':
      StyledTextComponent = DefaultSemiBoldText;
      break;
    case 'subtitle':
      StyledTextComponent = SubtitleText;
      break;
    case 'subtitleHighlight':
      StyledTextComponent = SubtitleTextHighlight;
      break;
    case 'link':
      StyledTextComponent = LinkText;
      break;
    case 'default':
    default:
      StyledTextComponent = DefaultText;
  }

  return <StyledTextComponent style={[{ color }, style]} {...rest} />;
}

// Styled components
const DefaultText = styled.Text`
  font-size: 16px;
  line-height: 24px;
`;

const DefaultSemiBoldText = styled.Text`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
`;

const TitleText = styled.Text`
  font-size: 32px;
  font-weight: bold;
  line-height: 32px;
`;

const SubtitleText = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const SubtitleTextHighlight = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const LinkText = styled.Text`
  font-size: 16px;
  line-height: 30px;
  color: #0a7ea4;
`;