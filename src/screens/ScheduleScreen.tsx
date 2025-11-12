import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ScheduleScreen() {
  const nav = useNavigation();
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const times = ["10:00", "11:30", "13:00", "14:00", "15:30"];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: "700" }}>Escolha a data</Text>
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={{
            marginTop: 8,
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(e, d) => {
              setShow(false);
              if (d) setDate(d);
            }}
          />
        )}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {times.map((t) => (
          <TouchableOpacity
            key={t}
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
            }}
            onPress={() => nav.navigate("Purchase" as any, { time: t })}
          >
            <Text style={{ fontWeight: "700" }}>{t}</Text>
            <Text style={{ color: "#6B7280" }}>Disponível • 25 vagas</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
