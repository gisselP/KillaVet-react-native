import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radius } from '../theme/colors';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePatients } from '../context/PatientContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { patients } = usePatients();

  const pendientes = patients.filter((p) => p.estado === 'PENDIENTE').length;
  const enAtencion = patients.filter((p) => p.estado === 'EN_ATENCION').length;
  const finalizados = patients.filter((p) => p.estado === 'FINALIZADO').length;

  function handleLogout() {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => logout().catch(() => {}),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi perfil</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👨‍⚕️</Text>
          </View>
          <Text style={styles.userName}>Veterinario</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.uidBadge}>
            <Text style={styles.uidText} numberOfLines={1}>
              UID: {user?.uid?.slice(0, 16)}…
            </Text>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Resumen de pacientes</Text>
          <View style={styles.statsGrid}>
            <StatBox value={patients.length} label="Total" color={colors.primary} />
            <StatBox value={pendientes} label="Pendientes" color="#D97706" />
            <StatBox value={enAtencion} label="En atención" color="#3B82F6" />
            <StatBox value={finalizados} label="Finalizados" color="#1D9E75" />
          </View>
        </View>

        {/* Info de cuenta */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔐 Información de cuenta</Text>
          <InfoRow label="Correo" value={user?.email ?? '—'} />
          <InfoRow label="Proveedor" value="Firebase Authentication" />
          <InfoRow label="Almacenamiento" value="SQLite + Firestore" />
          <InfoRow label="Estado" value="✅ Verificado" />
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
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
  scroll: { paddingBottom: 48 },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.primary,
    paddingBottom: 48,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: { fontSize: 44 },
  userName: { fontSize: 22, fontWeight: '700', color: colors.white, marginBottom: 4 },
  userEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  uidBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 4,
    maxWidth: 260,
  },
  uidText: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statBox: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 28, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: colors.textMuted, textAlign: 'center' },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: { flex: 1, fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  infoValue: { flex: 2, fontSize: 13, color: colors.textPrimary, textAlign: 'right', fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: '#FEE2E2',
    borderRadius: radius.lg,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutIcon: { fontSize: 18 },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#991B1B' },
});
