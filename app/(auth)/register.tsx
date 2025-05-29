import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Input,
  InputField,
  Button,
  ButtonText,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon
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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (!name || !email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }


    //if (!acceptTerms) {
    //  setError('Debes aceptar los términos y condiciones');
    //  return;
    //}

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
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Únete a SkillSwap y comienza a intercambiar habilidades</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre completo</Text>
              <Input style={styles.input}>
                <InputField value={name} onChangeText={setName} placeholder="Tu nombre" />
              </Input>
            </View>

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
                    placeholder="Mínimo 8 caracteres"
                    secureTextEntry
                />
              </Input>
              <Text style={styles.passwordHint}>La contraseña debe tener al menos 8 caracteres</Text>
            </View>

            <View style={styles.termsContainer}>
              {/*
              <Checkbox
                  isChecked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  accessibilityLabel="Aceptar términos y condiciones"
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
              </Checkbox>
              */}
              <Text style={styles.termsText}>
                Acepto los <Text style={styles.link}>Términos de servicio</Text> y la{' '}
                <Text style={styles.link}>Política de privacidad</Text>
              </Text>
            </View>

            <Button style={styles.signupButton} backgroundColor={COLORS.accent} onPress={handleSignup}>
              <ButtonText>Crear cuenta</ButtonText>
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Iniciar sesión</Text>
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
  passwordHint: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8
  },
  termsText: {
    color: '#6b7280',
    flex: 1,
    fontSize: 13
  },
  link: {
    color: COLORS.accent,
    fontWeight: '500'
  },
  signupButton: {
    height: 50,
    borderRadius: 8
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  loginText: {
    color: '#6b7280'
  },
  loginLink: {
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
