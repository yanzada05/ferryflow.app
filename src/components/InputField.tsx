import React from 'react';
import { TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secure?: boolean;
};

export default function InputField({ value, onChangeText, placeholder, secure }: Props) {
  return (
    <View style={{marginBottom:12}}>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} secureTextEntry={secure} placeholderTextColor="#9CA3AF" style={{height:52, backgroundColor:'#fff', borderRadius:10, paddingLeft:16, borderWidth:1, borderColor:'#E5E7EB'}} />
    </View>
  );
}
