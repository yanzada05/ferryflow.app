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
import { RootStackParamList } from "../../App";
import { FirebaseError } from "firebase/app";

// 1. IMPORTAÇÕES ADICIONADAS
import Svg, { Path } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const nav = useNavigation<LoginNavigationProp>();
  const theme = useTheme();

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

  // 2. FUNÇÃO ADICIONADA (PLACEHOLDER)
  const handleForgotPassword = () => {
    Alert.alert(
      "Redefinir Senha",
      "A funcionalidade de redefinir senha ainda será implementada."
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
    >
      <View style={styles.logoContainer}>
        {/* 3. ÍCONE E FUNDO ATUALIZADOS */}
        <LinearGradient
          colors={["#3B82F6", "#1E40AF"]} // Cores do 'from-blue-500 to-blue-700'
          style={styles.logoBackground}
        >
          {/* Este é o SVG exato do seu arquivo .doc */}
          <Svg width="48" height="48" fill="white" viewBox="0 0 24 24">
            <Path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v-2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v2h-2zM3.95 19H2v-2h2c1.38 0 2.74-.35 4-.99.52.26 1.04.48 1.58.66C8.78 17.35 7.39 18 6 18c-.69 0-1.36-.12-2-.34-.69.22-1.36.34-2.05.34zM22 17h-1.95c-.69 0-1.36-.12-2.05-.34-.64.22-1.31.34-2 .34-1.39 0-2.78-.65-3.58-1.33.54-.18 1.06-.4 1.58-.66 1.26.64 2.62.99 4 .99h2v2zM12 15.5c-1.25 0-2.45-.2-3.57-.57C7.55 14.41 7 13.74 7 13c0-.55.45-1 1-1h8c.55 0 1 .45 1 1 0 .74-.55 1.41-1.43 1.93-1.12.37-2.32.57-3.57.57zM6 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM18 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </Svg>
        </LinearGradient>

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

      {/* 4. BOTÃO "ESQUECI MINHA SENHA" ADICIONADO */}
      <TouchableOpacity
        onPress={handleForgotPassword}
        style={styles.forgotPasswordButton}
      >
        <Text
          style={[styles.forgotPasswordText, { color: theme.colors.muted }]}
        >
          Esqueci minha senha
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => nav.navigate("Register")}
        style={styles.registerButton}
      >
        <Text style={{ color: theme.colors.primary }}>Cadastrar-se</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
  // 5. ESTILOS DO LOGO ATUALIZADOS (tamanho e rotação)
  logoBackground: {
    width: 96, // w-24
    height: 96, // h-24
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    transform: [{ rotate: "3deg" }], // Rotação do design
  },
  title: {
    fontSize: 28,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  // 6. ESTILOS ADICIONADOS
  forgotPasswordButton: {
    marginTop: 24, // Mais espaço
    alignItems: "center",
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  registerButton: {
    marginTop: 16,
    alignItems: "center",
  },
});
