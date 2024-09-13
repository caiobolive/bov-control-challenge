import React from 'react';
import { TextInputProps } from 'react-native';
import { TextAreaContainer } from './styles';

type TextAreaProps = TextInputProps;

export function TextArea({ ...rest }: TextAreaProps) {
  return <TextAreaContainer multiline numberOfLines={4} {...rest} />;
}