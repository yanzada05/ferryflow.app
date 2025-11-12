import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, FlatList } from "react-native";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useTheme } from "../theme";
export default function QueueScreen() {
  const [items, setItems] = useState([]);
  const theme = useTheme();
  useEffect(() => {
    const q = query(collection(db, "queue"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(arr);
    });
    return unsub;
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 16 }}
    >
      <Text style={{ fontWeight: "700", marginBottom: 12 }}>
        Fila de Espera
      </Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: "700" }}>{item.name || "Usuário"}</Text>
            <Text style={{ color: theme.colors.muted }}>
              Posição: {item.position || "-"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
