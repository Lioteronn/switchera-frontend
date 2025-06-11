import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const validateName = (name: string) => {
    if (!name) return "El nombre es obligatorio";
    if (name.length < 2) return "El nombre debe tener al menos 2 caracteres";
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "El correo es obligatorio";
    if (!emailRegex.test(email)) return "Formato de correo inválido";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "La contraseña es obligatoria";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) return "Debes confirmar la contraseña";
    if (confirmPassword !== password) return "Las contraseñas no coinciden";
    return "";
  };

  const handleRegister = async () => {
    // Validar formulario
    const nameValidationError = validateName(name);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = validateConfirmPassword(confirmPassword);
    
    setNameError(nameValidationError);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);
    
    if (
      nameValidationError || 
      emailValidationError || 
      passwordValidationError || 
      confirmPasswordValidationError
    ) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simula una operación asíncrona de registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí integrarías la lógica real de registro
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Password:', password);
      
      // Redirigir al usuario a la pantalla de login tras registro exitoso
      router.push('/(auth)/login');
    } catch (error) {
      console.error('Error de registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Fondo con burbujas animadas */}

      
      {/* Botón para volver atrás */}
      <TouchableOpacity 
        style={[styles.backButton, { top: insets.top + 10 }]} 
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contenedor del formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a la comunidad de Switchera</Text>
          
          {/* Campo de nombre */}
          <View style={styles.inputContainer}>
            <User size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameError('');
              }}
              placeholderTextColor="#94a3b8"
            />
          </View>
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          
          {/* Campo de email */}
          <View style={styles.inputContainer}>
            <Mail size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              keyboardType="email-address"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          
          {/* Campo de contraseña */}
          <View style={styles.inputContainer}>
            <Lock size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
                if (confirmPassword) setConfirmPasswordError(text !== confirmPassword ? "Las contraseñas no coinciden" : "");
              }}
              secureTextEntry
              placeholderTextColor="#94a3b8"
            />
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          
          {/* Campo de confirmar contraseña */}
          <View style={styles.inputContainer}>
            <Lock size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError(password !== text ? "Las contraseñas no coinciden" : "");
              }}
              secureTextEntry
              placeholderTextColor="#94a3b8"
            />
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          
          {/* Texto de términos y condiciones */}
          <Text style={styles.termsText}>
            Al registrarte, aceptas nuestros{' '}
            <Text style={styles.termsLink}>Términos de servicio</Text> y{' '}
            <Text style={styles.termsLink}>Política de privacidad</Text>.
          </Text>
          
          {/* Botón de registro */}
          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Crear cuenta</Text>
            )}
          </TouchableOpacity>
          
          {/* Enlace para iniciar sesión */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    paddingVertical: 12,
    color: '#334155',
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 12,
    marginTop: -8,
    paddingLeft: 12,
  },
  termsText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 20,
  },
  termsLink: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#4f46e5', // Indigo color
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#a5b4fc', // Indigo más claro
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#64748b',
    fontSize: 15,
  },
  loginLink: {
    color: '#4f46e5', // Indigo color
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Register;