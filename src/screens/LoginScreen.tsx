import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App"; // 1. Importe os tipos do App.tsx
import { FirebaseError } from "firebase/app"; // 2. Importe o tipo de Erro

// 3. Defina o tipo de navegação para esta tela
type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const nav = useNavigation<LoginNavigationProp>(); // 4. Tipe o useNavigation
  const theme = useTheme();

  // 5. Tipe os estados (embora o TypeScript possa inferir, é bom ser explícito)
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (loading) return;
    if (!email || !password)
      return Alert.alert("Atenção", "Preencha todos os campos.");

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLoading(false);

      // 6. Tipe o erro para um tratamento seguro
      if (err instanceof FirebaseError) {
        if (
          err.code === "auth/invalid-credential" ||
          err.code === "auth/wrong-password" ||
          err.code === "auth/user-not-found"
        ) {
          Alert.alert("Erro no login", "E-mail ou senha inválidos.");
        } else {
          Alert.alert("Erro no login", "Ocorreu um erro. Tente novamente.");
          console.error(err.message);
        }
      } else {
        Alert.alert("Erro no login", "Ocorreu um erro desconhecido.");
        console.error(err);
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
    >
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logoBackground,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.logoEmoji, { color: theme.colors.primary }]}>
            ⛴️
          </Text>
        </View>
        <Text style={[styles.title, { fontFamily: theme.fonts.primaryBold }]}>
          FerryFlow
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
          Entre para acessar o sistema
        </Text>
      </View>

      <InputField
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <InputField
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        secure
      />

      <CustomButton
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
      />

      <TouchableOpacity
        onPress={() => nav.navigate("Register")}
        style={styles.registerButton}
      >
        <Text style={{ color: theme.colors.primary }}>Cadastrar-se</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// O StyleSheet permanece o mesmo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBackground: {
    width: 92,
    height: 92,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  registerButton: {
    marginTop: 16,
    alignItems: "center",
  },
});
