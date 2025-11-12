import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme';

export default function PriceSummary({ total }: { total: number }) {
  const theme = useTheme();
  return (
    <View style={{backgroundColor:'#fff', padding:12, borderRadius:10, marginTop:12}}>
      <Text style={{fontWeight:'700'}}>Resumo</Text>
      <Text style={{color:theme.colors.muted, marginTop:6}}>Total: R$ {total.toFixed(2)}</Text>
    </View>
  );
}
