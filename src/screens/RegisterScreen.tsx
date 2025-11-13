import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App"; // Importe os tipos do App.tsx
import { FirebaseError } from "firebase/app"; // 1. IMPORTE O TIPO DE ERRO

// Defina o tipo de navegação para esta tela
type RegisterNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export default function RegisterScreen() {
  const nav = useNavigation<RegisterNavigationProp>(); // Tipe o useNavigation
  const theme = useTheme();

  // Tipe os estados
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (loading) return;
    if (!email || !password || !confirmPassword) {
      return Alert.alert("Atenção", "Preencha todos os campos.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Atenção", "As senhas não conferem.");
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      // 2. 'err' é do tipo 'unknown'
      setLoading(false);

      // 3. ESTA É A CORREÇÃO: Verifique o tipo do erro
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          Alert.alert(
            "Erro no cadastro",
            "Este e-mail já está em uso. Por favor, tente fazer login."
          );
        } else if (err.code === "auth/weak-password") {
          Alert.alert(
            "Erro no cadastro",
            "Sua senha é muito fraca. Ela deve ter pelo menos 6 caracteres."
          );
        } else {
          Alert.alert("Erro no cadastro", err.message);
        }
      } else {
        // 4. Trate outros erros que não são do Firebase
        Alert.alert("Erro no cadastro", "Ocorreu um erro desconhecido.");
        console.error(err);
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { fontFamily: theme.fonts.primaryBold }]}>
          Criar Conta
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
          Comece sua jornada conosco
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
      <InputField
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirmar Senha"
        secure
      />

      <CustomButton
        title={loading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleRegister}
        disabled={loading}
      />

      <TouchableOpacity onPress={() => nav.goBack()} style={styles.loginButton}>
        <Text style={{ color: theme.colors.muted }}>Já tem uma conta? </Text>
        <Text style={{ color: theme.colors.primary }}>Faça login</Text>
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
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  loginButton: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
