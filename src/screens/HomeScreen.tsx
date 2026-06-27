import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePatients } from '../context/PatientContext';
import PatientCard from '../components/PatientCard';
import { colors, spacing, radius } from '../theme/colors';
import { RootStackParamList, Patient } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { patients, loading } = usePatients();

  function renderHeader() {
    return (
      <>
        {/* Banda verde: topbar + hero */}
        <View style={styles.greenHeader}>
          <View style={styles.topbar}>
            <Text style={styles.logo}>
              Killa <Text style={styles.logoAccent}>Vet</Text>
            </Text>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>🐾 Clínica</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => navigation.navigate('Landing')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.logoutText}>Salir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>
              Bienvenido a{' '}
              <Text style={styles.heroTitleAccent}>Killa Vet</Text>
            </Text>
            <Text style={styles.heroSub}>
              Gestiona los pacientes de tu clínica fácilmente
            </Text>
          </View>
        </View>

        {/* Stats superpuestas sobre la banda verde */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{patients.length}</Text>
            <Text style={styles.statLabel}>Pacientes{'\n'}registrados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>24/7</Text>
            <Text style={styles.statLabel}>Atención de{'\n'}emergencia</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>5</Text>
            <Text style={styles.statLabel}>Años de{'\n'}experiencia</Text>
          </View>
        </View>

        {patients.length > 0 && (
          <Text style={styles.sectionTitle}>Pacientes registrados</Text>
        )}
      </>
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyEmoji}>🐾</Text>
        </View>
        <Text style={styles.emptyTitle}>Sin pacientes aún</Text>
        <Text style={styles.emptySub}>
          Registra tu primer paciente con el botón de abajo
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <FlatList<Patient>
        data={patients}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <PatientCard
            patient={item}
            onPress={() => navigation.navigate('PatientDetail', { patient: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('RegisterPatient')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Registrar nuevo paciente</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  greenHeader: {
    backgroundColor: colors.primary,
    paddingBottom: 44,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  logoAccent: {
    color: colors.primaryMid,
  },
  logoBadge: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  logoBadgeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  logoutBtn: {
    marginLeft: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  logoutText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
  },
  heroTitleAccent: {
    color: colors.primaryMid,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: -36,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDeep,
    marginBottom: spacing.sm,
  },
  emptySub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 50,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primaryDeep,
    borderRadius: radius.lg,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primaryDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 22,
    color: colors.white,
    fontWeight: '300',
    lineHeight: 22,
  },
  fabText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
