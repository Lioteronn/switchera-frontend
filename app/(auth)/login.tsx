import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Input,
  InputField,
  Button,
  ButtonText
} from '@gluestack-ui/themed';
import { ArrowLeft } from 'lucide-react-native';
import AnimatedBackground from '../../components/AnimatedBackground';



const COLORS = {
  background: '#f3f4f6',
  text: '#11181C',
  accent: '#2563eb',
  cardBg: '#ffffff',
  inputBg: '#f9fafb',
  borderColor: '#e5e7eb',
  errorColor: '#ef4444'
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Aquí va tu lógica de login
    router.push('/');
  };

  return (
    <AnimatedBackground>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={COLORS.text} size={24} />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.subtitle}>Accede a tu cuenta en SkillSwap</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo electrónico</Text>
              <Input style={styles.input}>
                <InputField
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
              </Input>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <Input style={styles.input}>
                <InputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Tu contraseña"
                    secureTextEntry
                />
              </Input>
            </View>

            <Button
                style={styles.loginButton}
                backgroundColor={COLORS.accent}
                onPress={handleLogin}>
              <ButtonText>Iniciar sesión</ButtonText>
            </Button>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 16
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: COLORS.text,
    fontWeight: '500'
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.borderColor,
    borderRadius: 8
  },
  loginButton: {
    height: 50,
    borderRadius: 8
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  registerText: {
    color: '#6b7280'
  },
  registerLink: {
    color: COLORS.accent,
    fontWeight: '500'
  },
  errorText: {
    color: COLORS.errorColor,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14
  }
});
