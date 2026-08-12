import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import PatientCard from '../components/PatientCard';
import { colors, spacing, radius } from '../theme/colors';
import { RootStackParamList, Patient } from '../types';
import { fetchDogBreeds } from '../services/api';

const FILTROS = [
  { value: 'TODOS',       label: 'Todos',       bg: '#E1F5EE', border: '#1D9E75', text: '#0F6E56' },
  { value: 'PENDIENTE',   label: 'Pendiente',   bg: '#FEF3C7', border: '#D97706', text: '#92400E' },
  { value: 'EN_ATENCION', label: 'En atención', bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
  { value: 'FINALIZADO',  label: 'Finalizado',  bg: '#E1F5EE', border: '#1D9E75', text: '#0F6E56' },
] as const;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { patients, loading } = usePatients();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  const [breeds, setBreeds] = useState<string[]>([]);
  const [breedsLoading, setBreedsLoading] = useState(true);
  const [breedsError, setBreedsError] = useState<string | null>(null);

  useEffect(() => {
    fetchDogBreeds().then(({ breeds: b, error }) => {
      setBreeds(b.slice(0, 18));
      setBreedsError(error);
      setBreedsLoading(false);
    });
  }, []);

  const filteredPatients = patients.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      p.nombre.toLowerCase().includes(q) ||
      p.nombreDueno.toLowerCase().includes(q);
    const matchesEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
    return matchesSearch && matchesEstado;
  });

  function renderHeader() {
    return (
      <>
        <View style={styles.greenHeader}>
          <View style={styles.topbar}>
            <Text style={styles.logo}>
              Killa <Text style={styles.logoAccent}>Vet</Text>
            </Text>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>🐾 Clínica</Text>
            </View>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate('Profile')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroTitle}>
              Bienvenido a{' '}
              <Text style={styles.heroTitleAccent}>Killa Vet</Text>
            </Text>
            <Text style={styles.heroSub}>
              {user?.email}
            </Text>
          </View>
        </View>

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

        <View style={styles.breedsSection}>
          <Text style={styles.breedsSectionTitle}>🐕 Razas disponibles</Text>
          <Text style={styles.breedsSectionSub}>Vía Dog CEO API</Text>
          {breedsLoading && (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 8 }} />
          )}
          {breedsError && !breedsLoading && (
            <View style={styles.breedsError}>
              <Text style={styles.breedsErrorText}>⚠️ No se pudieron cargar las razas: {breedsError}</Text>
            </View>
          )}
          {!breedsLoading && !breedsError && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.breedsScroll}>
              {breeds.map((breed) => (
                <View key={breed} style={styles.breedChip}>
                  <Text style={styles.breedChipText}>{breed}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por mascota o dueño..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filtersRow}>
          {FILTROS.map((f) => (
            <TouchableOpacity
              key={f.value}
              onPress={() => setFiltroEstado(f.value)}
              style={[
                styles.filterChip,
                filtroEstado === f.value && { backgroundColor: f.bg, borderColor: f.border },
              ]}
            >
              <Text style={[
                styles.filterChipText,
                filtroEstado === f.value && { color: f.text, fontWeight: '700' },
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredPatients.length > 0 && (
          <Text style={styles.sectionTitle}>
            {filteredPatients.length}{' '}
            {filteredPatients.length === 1 ? 'paciente' : 'pacientes'}
          </Text>
        )}
      </>
    );
  }

  function renderEmpty() {
    const isFiltered = search.trim() !== '' || filtroEstado !== 'TODOS';
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyEmoji}>{isFiltered ? '🔍' : '🐾'}</Text>
        </View>
        <Text style={styles.emptyTitle}>
          {isFiltered ? 'Sin resultados' : 'Sin pacientes aún'}
        </Text>
        <Text style={styles.emptySub}>
          {isFiltered
            ? 'Prueba con otro texto o filtro'
            : 'Registra tu primer paciente con el botón de abajo'}
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
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <PatientCard
            patient={item}
            onPress={() => navigation.navigate('PatientDetail', { patientId: item.id })}
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
  safeArea: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  listContent: { paddingBottom: 100 },
  greenHeader: { backgroundColor: colors.primary, paddingBottom: 44 },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
  },
  logo: { fontSize: 22, fontWeight: '800', color: colors.white },
  logoAccent: { color: colors.primaryMid },
  logoBadge: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  logoBadgeText: { fontSize: 12, color: colors.white, fontWeight: '500' },
  profileBtn: {
    marginLeft: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: { fontSize: 16 },
  hero: { paddingHorizontal: spacing.xl, paddingTop: spacing.xs, paddingBottom: spacing.lg },
  heroTitle: { fontSize: 26, fontWeight: '800', color: colors.white, marginBottom: 4 },
  heroTitleAccent: { color: colors.primaryMid },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: -36,
    marginBottom: spacing.md,
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
  statNum: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 10, color: colors.textMuted, textAlign: 'center', marginTop: 3, lineHeight: 14 },
  // Breeds API section
  breedsSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breedsSectionTitle: { fontSize: 13, fontWeight: '700', color: colors.primaryDeep, marginBottom: 2 },
  breedsSectionSub: { fontSize: 10, color: colors.textMuted, marginBottom: spacing.sm },
  breedsScroll: { marginTop: 4 },
  breedChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  breedChipText: { fontSize: 11, color: colors.primaryDark, fontWeight: '600' },
  breedsError: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#D97706',
  },
  breedsErrorText: { fontSize: 11, color: '#92400E' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { fontSize: 15, marginRight: spacing.sm },
  searchInput: { flex: 1, height: 44, fontSize: 14, color: colors.textPrimary },
  searchClear: { fontSize: 13, color: colors.textMuted, paddingLeft: spacing.sm },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipText: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.primaryDeep, marginBottom: spacing.sm },
  emptySub: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
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
  fabIcon: { fontSize: 22, color: colors.white, fontWeight: '300', lineHeight: 22 },
  fabText: { fontSize: 15, fontWeight: '700', color: colors.white },
});
