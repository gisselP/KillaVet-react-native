import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { PatientProvider } from './src/context/PatientContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PatientProvider>
          <AppNavigator />
          <StatusBar style="light" backgroundColor={colors.primary} />
        </PatientProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
