import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useTheme } from "../theme";
import MiniMap from "../components/MiniMap";

export default function FerryStatusScreen() {
  const [status, setStatus] = useState<any[]>([]);
  const theme = useTheme();
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "ferries"), (snap) => {
      setStatus(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 16 }}
    >
      <Text style={{ fontWeight: "700", marginBottom: 12 }}>
        Status do Ferry
      </Text>
      {status.map((s) => (
        <View
          key={s.id}
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 10,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontWeight: "700" }}>{s.name || "Ferry"}</Text>
          <Text style={{ color: theme.colors.muted }}>
            {s.state || "Desconhecido"}
          </Text>
          <MiniMap latitude={s.lat || -12.98} longitude={s.lng || -38.51} />
        </View>
      ))}
    </SafeAreaView>
  );
}
