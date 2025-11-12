import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useTheme } from "../theme";

export default function StatusScreen() {
  const theme = useTheme();

  // Posição inicial fictícia (exemplo: travessia Salvador–Itaparica)
  const region = {
    latitude: -12.9714,
    longitude: -38.5014,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
    >
      <Text style={styles.title}>Status do Ferry</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          loadingEnabled={true}
        >
          <Marker
            coordinate={region}
            title="Ferry Boat"
            description="Travessia em andamento"
          />
        </MapView>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>⛴ Ferry: Itaparica → Salvador</Text>
        <Text style={styles.label}>🕓 Estimativa de chegada: 25 min</Text>
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          🌊 Situação: Em travessia
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: "bold", padding: 16 },
  mapContainer: {
    width: Dimensions.get("window").width,
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  info: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});
