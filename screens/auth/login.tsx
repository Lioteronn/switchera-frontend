import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { login, isLoading, isAuthenticated, tokens } = useAuth();

  // Debug: Inspeccionar AsyncStorage al cargar el componente
  useEffect(() => {
    const inspectAsyncStorage = async () => {
      try {
        console.log(' === INSPECTING FULL ASYNCSTORAGE (FROM LOGIN) ===');
        const keys = await AsyncStorage.getAllKeys();
        console.log(' All keys in AsyncStorage:', keys);
        
        const allData = await AsyncStorage.multiGet(keys);
        console.log(' All data in AsyncStorage:');
        allData.forEach(([key, value]) => {
          console.log(`   ${key}:`, {
            exists: !!value,
            length: value?.length,
            preview: value?.substring(0, 100) + '...',
            fullValue: value
          });
        });
        console.log(' === ASYNCSTORAGE INSPECTION COMPLETE ===');
      } catch (error) {
        console.error(' Error inspecting AsyncStorage:', error);
      }
    };
    
    inspectAsyncStorage();
  }, []); // Se ejecuta solo cuando se monta el componente Login

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setError('');
      console.log(' Attempting login with username:', username);
      
      await login(username, password);
      
      // Debug del estado después del login
      console.log(' Estado inmediatamente después del login:', {
        isAuthenticated,
        hasTokens: !!tokens,
        message: 'Login completed, waiting for AuthWrapper navigation...'
      });
      
      // Verificar el estado después de un delay
      setTimeout(() => {
        console.log(' Estado 500ms después del login:', {
          isAuthenticated,
          hasTokens: !!tokens
        });
        
        // Verificar AsyncStorage después del login
        AsyncStorage.multiGet(['accessToken', 'refreshToken', 'userData']).then((data) => {
          console.log(' Tokens in AsyncStorage after login:', data);
        });
      }, 500);
      
      // AuthWrapper will handle navigation after successful login
    } catch (err) {
      console.error(' Login form error:', err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Back button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>

      {/* Form container */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Welcome to Switchera</Text>

        {/* Username field */}
        <View style={styles.inputContainer}>
          <User size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError('');
            }}
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            autoCorrect={false}
            testID="username-input"
          />
        </View>

        {/* Password field */}
        <View style={styles.inputContainer}>
          <Lock size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            secureTextEntry
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            autoCorrect={false}
            testID="password-input"
          />
        </View>

        {/* Error message */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Forgot password link */}
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </TouchableOpacity>

        {/* Login button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
          testID="login-button"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Register link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don&apos;t have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Register here</Text>
          </Pressable>
        </View>

        {/* Test credentials */}
        <View style={styles.testCredentialsContainer}>
          <Text style={styles.testCredentialsTitle}>Test Credentials</Text>
          <Text style={styles.testCredentials}>
            Username: switchera{'\n'}
            Password: bruneger2025
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#64748b',
    fontSize: 15,
  },
  registerLink: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  testCredentialsContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  testCredentialsTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
  },
  testCredentials: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Login;