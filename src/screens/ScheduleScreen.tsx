import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform, // Import Platform para o DatePicker
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Import corrigido
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme";
import DateTimePicker, {
  DateTimePickerEvent, // Importe o tipo de evento
} from "@react-native-community/datetimepicker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App"; // Importe os tipos

// Defina o tipo de navegação
type ScheduleNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Schedule"
>;

export default function ScheduleScreen() {
  const nav = useNavigation<ScheduleNavigationProp>(); // Tipe o hook
  const theme = useTheme();

  // Tipe os estados
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // Seus horários fixos
  const times = ["10:00", "11:30", "13:00", "14:00", "15:30"];

  // Tipe o evento do DateTimePicker
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Oculta o seletor (necessário no Android)
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: theme.fonts.primaryBold }]}>
          Escolha a data
        </Text>
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={[styles.dateButton, { backgroundColor: theme.colors.surface }]}
        >
          <Text
            style={[
              styles.dateText,
              { fontFamily: theme.fonts.primaryRegular },
            ]}
          >
            {date.toLocaleDateString("pt-BR")}
          </Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
            minimumDate={new Date()} // Não permite selecionar datas passadas
          />
        )}
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {times.map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.timeButton,
              { backgroundColor: theme.colors.surface },
            ]}
            // Corrigido: Removido o 'as any'
            onPress={() => nav.navigate("Purchase", { time: t })}
          >
            <Text
              style={[styles.timeText, { fontFamily: theme.fonts.primaryBold }]}
            >
              {t}
            </Text>
            <Text
              style={[styles.availabilityText, { color: theme.colors.muted }]}
            >
              Disponível • 25 vagas
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Adicionei um StyleSheet para organizar
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 28,
  },
  dateButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dateText: {
    fontSize: 18,
  },
  list: {
    paddingHorizontal: 24,
  },
  timeButton: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  timeText: {
    fontSize: 22,
  },
  availabilityText: {
    fontSize: 14,
    marginTop: 4,
  },
});
