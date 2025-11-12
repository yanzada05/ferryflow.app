import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useTheme } from '../theme';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export default function TicketScreen({ route }: any) {
  const { ticketId } = route.params || {};
  const [ticket, setTicket] = useState<any>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!ticketId) return;
    (async () => {
      const d = await getDoc(doc(db, 'tickets', ticketId));
      if (d.exists()) setTicket(d.data());
    })();
  }, [ticketId]);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada para notificações');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), { notificationToken: token }, { merge: true });
        Alert.alert('Notificações ativadas!');
      }
    } catch (err: any) {
      Alert.alert('Erro ao ativar notificações', String(err));
    }
  };

  if (!ticket) return (
    <SafeAreaView style={{flex:1, alignItems:'center', justifyContent:'center'}}><Text>Carregando...</Text></SafeAreaView>
  );

  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.colors.bg, padding:16}}>
      <View style={{backgroundColor:'#fff', padding:16, borderRadius:12}}>
        <Text style={{fontWeight:'700', fontSize:18}}>Ticket #{ticketId}</Text>
        <Text>Rota: {ticket.origin || 'Ponta da Espera'} → {ticket.destination || 'Cujupe'}</Text>
        <Text>Horário: {ticket.time}</Text>
        <Text>Passageiros: {ticket.passengers || ticket.adults}</Text>
        <Text>Total: R$ {ticket.total?.toFixed(2)}</Text>
      </View>

      <TouchableOpacity onPress={registerForPushNotificationsAsync} style={{marginTop:16}}>
        <View style={{backgroundColor:'#1E88E5', padding:12, borderRadius:10, alignItems:'center'}}>
          <Text style={{color:'#fff', fontWeight:'700'}}>Ativar notificações de mudanças na fila</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
