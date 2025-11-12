import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native";
import { useTheme } from "../theme";
import CustomButton from "../components/CustomButton";
import PriceSummary from "../components/PriceSummary";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { WebView } from "react-native-webview";

export default function PurchaseScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const theme = useTheme();
  const passedTime = (route.params as any)?.time;
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [vehicle, setVehicle] = useState("Carro pequeno");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [currentTicketId, setCurrentTicketId] = useState<string | null>(null);

  const vehicleExtra =
    {
      "Carro pequeno": 25,
      Caminhonete: 50,
      Caminhão: 75,
      Ônibus: 100,
    }[vehicle] || 0;

  const total = adults * 40 + children * 15 + vehicleExtra;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      // 1) Create a ticket in Firestore with status PENDING
      const user = auth.currentUser;
      const docRef = await addDoc(collection(db, "tickets"), {
        uid: user?.uid,
        adults,
        children,
        vehicle,
        paymentMethod,
        total,
        time: passedTime || "14:00",
        status: "PENDING",
        createdAt: serverTimestamp(),
      });
      setCurrentTicketId(docRef.id);

      // 2) Call Cloud Function to create Mercado Pago preference (returns init_point)
      // Replace the URL below with your deployed Cloud Function URL
      const cfUrl =
        "https://us-central1-YOUR_PROJECT.cloudfunctions.net/createPreference";
      const resp = await axios.post(cfUrl, {
        title: "Passagem FerryFlow",
        quantity: 1,
        price: total,
        ticketId: docRef.id,
      });
      setCheckoutUrl(resp.data.init_point);
    } catch (err: any) {
      Alert.alert("Erro", err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  if (checkoutUrl) {
    return (
      <WebView
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("success")) {
            Alert.alert(
              "Pagamento iniciado. Verifique o ticket para o status."
            );
          }
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>
          Comprar Passagem
        </Text>
        <Text style={{ color: theme.colors.muted }}>
          Rota: Ponta da Espera → Cujupe
        </Text>

        <View
          style={{
            marginTop: 12,
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontWeight: "700" }}>Adultos</Text>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => setAdults(Math.max(0, adults - 1))}
              style={{
                padding: 8,
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <View style={{ justifyContent: "center" }}>
              <Text>{adults}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setAdults(adults + 1)}
              style={{
                padding: 8,
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                marginLeft: 8,
              }}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontWeight: "700", marginTop: 12 }}>Crianças</Text>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => setChildren(Math.max(0, children - 1))}
              style={{
                padding: 8,
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <View style={{ justifyContent: "center" }}>
              <Text>{children}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setChildren(children + 1)}
              style={{
                padding: 8,
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                marginLeft: 8,
              }}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontWeight: "700", marginTop: 12 }}>
            Tipo de veículo
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
          >
            {["Carro pequeno", "Caminhonete", "Caminhão", "Ônibus"].map((v) => (
              <TouchableOpacity
                key={v}
                onPress={() => setVehicle(v)}
                style={{
                  padding: 8,
                  backgroundColor: v === vehicle ? "#E0F2FE" : "#fff",
                  borderRadius: 8,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Text>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ fontWeight: "700", marginTop: 12 }}>
            Método de pagamento
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
          >
            {["Pix", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"].map(
              (m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setPaymentMethod(m)}
                  style={{
                    padding: 8,
                    backgroundColor: m === paymentMethod ? "#E0F2FE" : "#fff",
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Text>{m}</Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <PriceSummary total={total} />

          <View style={{ marginTop: 12 }}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <CustomButton title="Confirmar Compra" onPress={handleConfirm} />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
