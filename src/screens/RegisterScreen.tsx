import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, Alert } from "react-native";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
export default function RegisterScreen() {
  const nav = useNavigation();
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = async () => {
    if (!name || !email || !password)
      return Alert.alert("Preencha todos os campos");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      nav.replace("Home" as any);
    } catch (err: any) {
      Alert.alert("Erro no cadastro", err.message || String(err));
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg,
        padding: 24,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Criar Conta</Text>
      <InputField value={name} onChangeText={setName} placeholder="Nome" />
      <InputField value={email} onChangeText={setEmail} placeholder="Email" />
      <InputField
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        secure
      />
      <CustomButton title="Cadastrar" onPress={handleRegister} />
      <TouchableOpacity
        onPress={() => nav.goBack()}
        style={{ marginTop: 12, alignItems: "center" }}
      >
        <Text>Voltar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
