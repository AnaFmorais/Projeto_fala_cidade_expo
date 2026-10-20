import { ActivityIndicator, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { cores } from "@/styles/index";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput } from "react-native";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "@/firebase-config";
import { router } from "expo-router";

export default function Cadastro() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confimarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(Boolean);

    async function handleCadastro() {

        if (!nome.trim() || !email.trim() || !senha.trim()) {
            setErro("Preencha todos os campos");
            return;
        }

        if (senha !== confimarSenha) {
            setErro("senhas nao sao iguais");
            return
        }

        setCarregando(true);
        try {
        const { user } = await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            senha,
        );
        await updateProfile(user, { displayName: nome.trim() });

        // Faz o e-mail de confirmação chegar em português.
        auth.languageCode = "pt-BR";
        await sendEmailVerification(user);

        // `replace` para que "voltar" não traga de novo o formulário de cadastro.
        router.replace("/");
        } catch (e) {
        setErro("erro fds");
        } finally {
        setCarregando(false);
        }
    
    }
    
    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.titulo}>Tela de Cadastro</Text>

            <TextInput 
                placeholder="Nome"
                placeholderTextColor={cores.cinzaClaro}
                style={styles.input} 
                value={nome}
                onChangeText={setNome}
            />

            <TextInput 
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor={cores.cinzaClaro} 
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput 
                keyboardType="visible-password"
                placeholder="Senha"
                placeholderTextColor={cores.cinzaClaro} 
                style={styles.input} 
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
            />

            <TextInput 
                keyboardType="visible-password"
                placeholder="Confirmar senha"
                placeholderTextColor={cores.cinzaClaro} 
                style={styles.input}
                value={confimarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
            />
            
            {erro ? <Text style={styles.erro}>{erro}</Text> : null}
            <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.botao}
                    disabled={carregando}
                    onPress={handleCadastro}
                >
                    {carregando ? (
                    <ActivityIndicator color={cores.branco} />
                    ) : (
                    <Text style={styles.textoBotao}>Cadastrar</Text>
                    )}
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.bgBrancoGelo,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  titulo: {
    color: cores.preto,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
  },
  input: {
    width: 300,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.cinzaClaro,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: cores.preto,
    marginBottom: 12,
  },
  erro: {
    color: cores.alerta,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  botao: {
    backgroundColor: cores.verde,
    width: 300,
    padding: 18,
    alignItems: "center",
    borderRadius: 15,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 18,
    fontWeight: "800",
  },
});