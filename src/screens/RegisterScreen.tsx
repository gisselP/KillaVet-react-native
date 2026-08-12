import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { colors, spacing, radius } from '../theme/colors';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

interface Errores {
  email?: string;
  password?: string;
  confirm?: string;
  general?: string;
}

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errores, setErrores] = useState<Errores>({});
  const [cargando, setCargando] = useState(false);

  function validar(): boolean {
    const e: Errores = {};
    if (!email.trim()) e.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Correo inválido';
    if (!password) e.password = 'La contraseña es obligatoria';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (password !== confirm) e.confirm = 'Las contraseñas no coinciden';
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validar()) return;
    setCargando(true);
    try {
      await register(email.trim(), password);
    } catch (e: any) {
      const msg =
        e.code === 'auth/email-already-in-use'
          ? 'Este correo ya está registrado'
          : e.code === 'auth/invalid-email'
          ? 'Correo inválido'
          : 'Error al registrar. Intenta de nuevo.';
      setErrores({ general: msg });
    } finally {
      setCargando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
            <Text style={styles.headerTitle}>Crear cuenta</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.topSection}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🐾</Text>
            </View>
            <Text style={styles.welcomeText}>Únete a Killa Vet</Text>
            <Text style={styles.welcomeSub}>Crea tu cuenta para comenzar</Text>
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
              onChangeText={(t) => { setEmail(t); if (errores.email || errores.general) setErrores({}); }}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              required
              error={errores.email}
            />

            <InputField
              label="Contraseña"
              value={password}
              onChangeText={(t) => { setPassword(t); if (errores.password || errores.general) setErrores({}); }}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              required
              error={errores.password}
            />

            <InputField
              label="Confirmar contraseña"
              value={confirm}
              onChangeText={(t) => { setConfirm(t); if (errores.confirm) setErrores({}); }}
              placeholder="Repite tu contraseña"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              required
              error={errores.confirm}
            />

            <Button
              title="Crear cuenta"
              onPress={handleRegister}
              size="lg"
              loading={cargando}
              style={styles.registerBtn}
            />
          </View>

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={styles.loginLinkBold}>Inicia sesión</Text>
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
  topSection: { alignItems: 'center', paddingVertical: 32 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconEmoji: { fontSize: 44 },
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
  registerBtn: { marginTop: 8, borderRadius: radius.lg },
  loginLink: { alignItems: 'center', marginTop: spacing.xl },
  loginLinkText: { fontSize: 14, color: colors.textMuted },
  loginLinkBold: { color: colors.primary, fontWeight: '700' },
});
