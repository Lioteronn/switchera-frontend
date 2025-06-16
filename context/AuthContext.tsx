import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRepository } from '../api/userRepository'; // Cambiar esta importación

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;

}

interface AuthContextType {
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, firstName: string, lastName: string, email: string, password: string) => Promise<void>; // Añadir register
  logout: () => Promise<void>;
  isLoading: boolean;
  user: User | null;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Debug: Log cada cambio de estado
  useEffect(() => {
    console.log(' Auth state changed:', {
      isAuthenticated,
      hasTokens: !!tokens,
      hasUser: !!user,
      isLoading,
      tokenPreview: tokens?.accessToken?.substring(0, 20)
    });
  }, [isAuthenticated, tokens, isLoading, user]);

  // Verificar token al iniciar la app
  useEffect(() => {
    console.log(' AuthProvider mounted, starting checkAuthState...');
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    console.log(' Checking auth state...');
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userData = await AsyncStorage.getItem('userData');
      
      console.log(' Stored auth data:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userData,
        accessTokenPreview: accessToken?.substring(0, 20)
      });
      
      if (accessToken && refreshToken) {
        console.log(' Valid tokens found, authenticating user...');
        setTokens({ accessToken, refreshToken });
        setIsAuthenticated(true);
        
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            console.log(' User data loaded from storage:', {
              id: parsedUser.id,
              username: parsedUser.username,
              email: parsedUser.email
            });
          } catch (parseError) {
            console.error(' Error parsing user data:', parseError);
          }
        }
        
        console.log(' User authenticated from storage');
      } else {
        console.log(' No valid tokens in storage');
        setIsAuthenticated(false);
        setTokens(null);
        setUser(null);
      }
    } catch (error) {
      console.error(' Error checking auth state:', error);
      setIsAuthenticated(false);
      setTokens(null);
      setUser(null);
      await clearAuthData();
    } finally {
      setIsLoading(false);
      console.log(' checkAuthState completed');
    }
  };

  const login = async (username: string, password: string) => {
    console.log(' login process...');
    console.log('Login credentials:', { username, passwordLength: password.length });
    setIsLoading(true);
    
    try {
      console.log('Calling UserRepository.login...');
      const response = await UserRepository.login(username, password);
      
      console.log('Login response received:', {
        hasData: !!response?.data,
        accessToken: response?.data?.access ? 'Present' : 'Missing',
        refreshToken: response?.data?.refresh ? 'Present' : 'Missing'
      });

      if (!response?.data?.access || !response?.data?.refresh) {
        throw new Error('Invalid response: missing tokens');
      }

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
      
      console.log('Storing tokens in AsyncStorage...');
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      
      // Crear datos de usuario básicos (desde el token o datos adicionales)
      const basicUserData = {
        id: response.data.user_id || 0, // Si viene en la respuesta
        username: username,
        email: response.data.email || '', // Si viene en la respuesta
      };
      
      console.log(' Storing user data:', basicUserData);
      await AsyncStorage.setItem('userData', JSON.stringify(basicUserData));
      
      // Update state
      setTokens({ accessToken, refreshToken });
      setUser(basicUserData);
      setIsAuthenticated(true);
      
      console.log(' Login completed successfully!');
      
    } catch (error: any) {
      console.error(' Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      await clearAuthData();
      setIsAuthenticated(false);
      setTokens(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, firstName: string, lastName: string, email: string, password: string) => {
    console.log(' Starting registration process...');
    console.log(' Registration data:', {
      username,
      firstName,
      lastName,
      email,
      passwordLength: password.length
    });
    setIsLoading(true);
    
    try {
      console.log(' Calling UserRepository.register...');
      const response = await UserRepository.register(username, firstName, lastName, email, password);
      
      console.log(' Registration response received:', {
        hasData: !!response?.data,
        status: response?.status,
        accessToken: response?.data?.access ? 'Present' : 'Missing',
        refreshToken: response?.data?.refresh ? 'Present' : 'Missing',
        responseData: response?.data
      });

      if (!response?.data) {
        throw new Error('Invalid response: no data received');
      }

      // Si la respuesta incluye tokens (auto-login después del registro)
      if (response.data.access && response.data.refresh) {
        console.log(' Auto-login after registration - storing tokens...');
        
        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;
        
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('refreshToken', refreshToken);
        
        // Crear datos de usuario
        const userData = {
          id: response.data.user?.id || response.data.id || 0,
          username: username,
          email: email,
          first_name: firstName,
          last_name: lastName,
        };
        
        console.log(' Storing user data after registration:', userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        // Update state
        setTokens({ accessToken, refreshToken });
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log(' Registration with auto-login completed successfully!');
      } else {
        console.log(' Registration completed - verification may be required');
        console.log(' User created:', {
          id: response.data.user?.id || response.data.id,
          username: response.data.user?.username || username,
          email: response.data.user?.email || email
        });
      }
      
    } catch (error: any) {
      console.error(' Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      await clearAuthData();
      setIsAuthenticated(false);
      setTokens(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log(' Starting logout process...');
    try {
      await clearAuthData();
      setTokens(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log(' Logout completed');
    } catch (error) {
      console.error(' Error during logout:', error);
      setTokens(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const clearAuthData = async () => {
    console.log(' Clearing auth data...');
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
      console.log(' Auth data cleared');
    } catch (error) {
      console.error(' Error clearing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        tokens,
        login,
        register, // Añadir register al contexto
        logout,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};