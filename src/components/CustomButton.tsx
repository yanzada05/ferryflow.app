import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
};

export default function CustomButton({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={style as any}>
      <LinearGradient colors={['#1E88E5', '#1565C0']} style={{paddingVertical:12, alignItems:'center', borderRadius:10}}>
        <Text style={{color:'#fff', fontWeight:'700'}}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
