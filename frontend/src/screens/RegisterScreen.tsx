import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { registerUser } from '../services/api';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
  route?: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onAuthenticated = route?.params?.onAuthenticated;

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não correspondem.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Você será redirecionado para o login.');
        
        if (onAuthenticated) {
          onAuthenticated();
        } else {
          // fallback: navega para MainTabs/Home se não houver callback
          try {
            // Quando o RootNavigator usa MainTabs, navegamos para a aba Home.
            navigation.reset({ index: 0, routes: [{ name: "MainTabs" as any }] });
          } catch {
            // se reset falhar por algum motivo (tipos ou runtime), tenta ir para Home
            try {
              navigation.navigate("MainTabs", { screen: "Home" } as any);
            } catch {}
          }
        }
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.message || 'Falha ao criar conta.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
        <Text style={styles.linkText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#4CAF50',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default RegisterScreen;
