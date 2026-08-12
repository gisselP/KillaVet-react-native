import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors, spacing, radius } from '../theme/colors';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

type Errores = {
  email?: string;
  contrasena?: string;
  general?: string;
};

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState<Errores>({});
  const [cargando, setCargando] = useState(false);

  function validar(): boolean {
    const e: Errores = {};
    if (!email.trim()) e.email = 'El correo es obligatorio';
    if (!contrasena.trim()) e.contrasena = 'La contraseña es obligatoria';
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validar()) return;
    setCargando(true);
    try {
      await login(email.trim(), contrasena);
    } catch (e: any) {
      const msg =
        e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential'
          ? 'Correo o contraseña incorrectos'
          : e.code === 'auth/invalid-email'
          ? 'Correo inválido'
          : e.code === 'auth/too-many-requests'
          ? 'Demasiados intentos. Intenta más tarde.'
          : 'Error al iniciar sesión. Intenta de nuevo.';
      setErrores({ general: msg });
    } finally {
      setCargando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Acceso veterinario</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.imageSection}>
            <View style={styles.imageCircle}>
              <Image
                source={require('../../assets/killa-2.png')}
                style={styles.vetImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.welcomeText}>¡Hola, doc! 👋</Text>
            <Text style={styles.welcomeSub}>Ingresa tus credenciales para continuar</Text>
          </View>

          <View style={styles.card}>
            {errores.general && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️  {errores.general}</Text>
              </View>
            )}

            <InputField
              label="Correo electrónico"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errores.email || errores.general) setErrores({});
              }}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              required
              error={errores.email}
            />

            <InputField
              label="Contraseña"
              value={contrasena}
              onChangeText={(t) => {
                setContrasena(t);
                if (errores.contrasena || errores.general) setErrores({});
              }}
              placeholder="Tu contraseña"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              required
              error={errores.contrasena}
            />

            <Button
              title="Ingresar"
              onPress={handleLogin}
              size="lg"
              loading={cargando}
              style={styles.loginBtn}
            />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLinkText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.registerLinkBold}>Regístrate aquí</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontSize: 20, color: colors.white, fontWeight: '300' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
  },
  imageSection: { alignItems: 'center', paddingVertical: 32 },
  imageCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  vetImage: { width: 110, height: 110 },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryDeep,
    marginBottom: 6,
  },
  welcomeSub: { fontSize: 13, color: colors.textMuted },
  card: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorBanner: {
    backgroundColor: colors.errorLight,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorBannerText: { fontSize: 13, color: colors.error, fontWeight: '500' },
  loginBtn: { marginTop: 8, borderRadius: radius.lg },
  registerLink: { alignItems: 'center', marginTop: spacing.xl },
  registerLinkText: { fontSize: 14, color: colors.textMuted },
  registerLinkBold: { color: colors.primary, fontWeight: '700' },
});
