// Crear este archivo en: switchera-frontend/context/settings-context.tsx
 import React, { createContext, useState, useContext, useEffect } from 'react';
 import { useColorScheme as RNUseColorScheme, AppState, AppStateStatus } from 'react-native';
 import AsyncStorage from '@react-native-async-storage/async-storage';

 type FontSize = 'Pequeño' | 'Normal' | 'Grande' | 'Muy grande';
 type Language = 'Español' | 'English' | 'Français' | 'Português';

 interface SettingsContextType {
   isDarkMode: boolean;
   setIsDarkMode: (value: boolean) => void;
   fontSize: FontSize;
   setFontSize: (value: FontSize) => void;
   language: Language;
   setLanguage: (value: Language) => void;
   notifications: boolean;
   setNotifications: (value: boolean) => void;
   saveHistory: boolean;
   setSaveHistory: (value: boolean) => void;
   theme: Theme;
   getFontSize: (element: string) => number;
 }

 interface Theme {
   background: string;
   cardBackground: string;
   text: string;
   textSecondary: string;
   icon: string;
   separator: string;
   primary: string;
 }

 export const lightTheme: Theme = {
   background: '#f8f9fa',
   cardBackground: '#ffffff',
   text: '#000000',
   textSecondary: '#666666',
   icon: '#555555',
   separator: '#e1e4e8',
   primary: '#2563eb',
 };

 export const darkTheme: Theme = {
   background: '#121212',
   cardBackground: '#1e1e1e',
   text: '#ffffff',
   textSecondary: '#a0a0a0',
   icon: '#cccccc',
   separator: '#333333',
   primary: '#3b82f6',
 };

 const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

 export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
   const systemColorScheme = RNUseColorScheme();
   const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');
   const [fontSize, setFontSize] = useState<FontSize>('Normal');
   const [language, setLanguage] = useState<Language>('Español');
   const [notifications, setNotifications] = useState<boolean>(true);
   const [saveHistory, setSaveHistory] = useState<boolean>(true);
   const [isLoaded, setIsLoaded] = useState<boolean>(false);

   useEffect(() => {
     loadSettings();
   }, []);

   useEffect(() => {
     if (isLoaded) {
       saveSettings();
     }
   }, [isDarkMode, fontSize, language, notifications, saveHistory, isLoaded]);

   // Monitorear cambios en el tema del sistema
   useEffect(() => {
     const subscription = AppState.addEventListener('change', handleAppStateChange);
     return () => {
       subscription.remove();
     };
   }, [isDarkMode]);

   const handleAppStateChange = (nextAppState: AppStateStatus) => {
     if (nextAppState === 'active') {
       // Actualizar tema si ha cambiado el tema del sistema
     }
   };

   const loadSettings = async () => {
     try {
       const settings = await AsyncStorage.getItem('@app_settings');
       if (settings) {
         const parsedSettings = JSON.parse(settings);
         setIsDarkMode(parsedSettings.isDarkMode);
         setFontSize(parsedSettings.fontSize);
         setLanguage(parsedSettings.language);
         setNotifications(parsedSettings.notifications);
         setSaveHistory(parsedSettings.saveHistory);
       }
       setIsLoaded(true);
     } catch (error) {
       console.error('Error al cargar configuración:', error);
       setIsLoaded(true);
     }
   };

   const saveSettings = async () => {
     try {
       const settings = {
         isDarkMode,
         fontSize,
         language,
         notifications,
         saveHistory
       };
       await AsyncStorage.setItem('@app_settings', JSON.stringify(settings));
     } catch (error) {
       console.error('Error al guardar configuración:', error);
     }
   };

   const theme = isDarkMode ? darkTheme : lightTheme;

   const getFontSize = (element: string) => {
     const sizesMap: Record<FontSize, Record<string, number>> = {
       'Pequeño': {
         'title': 20,
         'subtitle': 14,
         'sectionTitle': 15,
         'optionText': 14,
         'optionValue': 13,
         'versionText': 12,
         'body': 14,
         'button': 14
       },
       'Normal': {
         'title': 24,
         'subtitle': 16,
         'sectionTitle': 17,
         'optionText': 16,
         'optionValue': 14,
         'versionText': 13,
         'body': 16,
         'button': 15
       },
       'Grande': {
         'title': 28,
         'subtitle': 18,
         'sectionTitle': 19,
         'optionText': 18,
         'optionValue': 16,
         'versionText': 15,
         'body': 18,
         'button': 16
       },
       'Muy grande': {
         'title': 32,
         'subtitle': 20,
         'sectionTitle': 22,
         'optionText': 20,
         'optionValue': 18,
         'versionText': 16,
         'body': 20,
         'button': 18
       }
     };

     return sizesMap[fontSize][element] || 16; // Valor predeterminado si no existe
   };

   return (
     <SettingsContext.Provider value={{
       isDarkMode, setIsDarkMode,
       fontSize, setFontSize,
       language, setLanguage,
       notifications, setNotifications,
       saveHistory, setSaveHistory,
       theme, getFontSize
     }}>
       {children}
     </SettingsContext.Provider>
   );
 };

 // Hook personalizado para usar el contexto fácilmente
 export const useSettings = () => {
   const context = useContext(SettingsContext);
   if (context === undefined) {
     throw new Error('useSettings debe usarse dentro de un SettingsProvider');
   }
   return context;
 };