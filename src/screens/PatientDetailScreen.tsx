import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { usePatients } from '../context/PatientContext';
import { SPECIES_EMOJI } from '../components/SpeciesSelector';
import { colors, spacing, radius } from '../theme/colors';
import { RootStackParamList, EstadoPaciente } from '../types';

const ESTADO_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  PENDIENTE:   { bg: '#FEF3C7', text: '#92400E', label: 'PENDIENTE' },
  EN_ATENCION: { bg: '#DBEAFE', text: '#1E40AF', label: 'EN ATENCIÓN' },
  FINALIZADO:  { bg: '#E1F5EE', text: '#0F6E56', label: 'FINALIZADO' },
};

const PRIORIDAD_CONFIG: Record<string, { bg: string; text: string }> = {
  BAJA:  { bg: '#F3F4F6', text: '#6B7280' },
  MEDIA: { bg: '#FEF3C7', text: '#92400E' },
  ALTA:  { bg: '#FEE2E2', text: '#991B1B' },
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientDetail'>;
  route: RouteProp<RootStackParamList, 'PatientDetail'>;
};

export default function PatientDetailScreen({ navigation, route }: Props) {
  const { patient: paramPatient } = route.params;
  const { patients, deletePatient, updateEstado } = usePatients();

  // Leer el paciente en vivo para que los cambios de estado se reflejen al instante
  const patient = patients.find((p) => p.id === paramPatient.id) ?? paramPatient;

  function handleDelete() {
    Alert.alert(
      `Eliminar a ${patient.nombre}`,
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deletePatient(patient.id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  const emoji = SPECIES_EMOJI[patient.especie] ?? '🐾';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.greenHeader}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ficha del paciente</Text>
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarEmoji}>{emoji}</Text>
          </View>
          <Text style={styles.heroName}>{patient.nombre}</Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              {patient.especie}
              {patient.raza ? ` · ${patient.raza}` : ''}
            </Text>
          </View>
          <Text style={styles.heroDate}>
            Registrado el {patient.fechaRegistro} · {patient.horaRegistro}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <CardTitle icon="🏥" title="Estado de atención" />
          <InfoRow label="Tipo de servicio" value={patient.tipoServicio ?? 'Consulta'} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prioridad</Text>
            <View style={[styles.chip, { backgroundColor: PRIORIDAD_CONFIG[patient.prioridad ?? 'BAJA'].bg }]}>
              <Text style={[styles.chipText, { color: PRIORIDAD_CONFIG[patient.prioridad ?? 'BAJA'].text }]}>
                {patient.prioridad ?? 'BAJA'}
              </Text>
            </View>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0, alignItems: 'flex-start', flexDirection: 'column', gap: 8 }]}>
            <Text style={styles.infoLabel}>Estado</Text>
            <View style={styles.estadoRow}>
              {(['PENDIENTE', 'EN_ATENCION', 'FINALIZADO'] as EstadoPaciente[]).map((e) => {
                const cfg = ESTADO_CONFIG[e];
                const isActive = (patient.estado ?? 'PENDIENTE') === e;
                return (
                  <TouchableOpacity
                    key={e}
                    onPress={() => updateEstado(patient.id, e)}
                    style={[
                      styles.estadoChip,
                      isActive && { backgroundColor: cfg.bg, borderColor: cfg.text },
                    ]}
                  >
                    <Text style={[styles.estadoChipText, isActive && { color: cfg.text, fontWeight: '700' }]}>
                      {cfg.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <CardTitle icon="❤️" title="Datos de la mascota" />
          <InfoRow label="Nombre" value={patient.nombre} />
          <InfoRow label="Especie" value={patient.especie} />
          {patient.raza ? <InfoRow label="Raza" value={patient.raza} /> : null}
          {patient.edad ? <InfoRow label="Edad" value={patient.edad} /> : null}
          {patient.sexo ? <InfoRow label="Sexo" value={patient.sexo} /> : null}
          {patient.peso ? <InfoRow label="Peso" value={patient.peso} /> : null}
          {patient.color ? <InfoRow label="Color" value={patient.color} /> : null}
        </View>

        <View style={styles.card}>
          <CardTitle icon="👤" title="Datos del dueño" />
          <InfoRow label="Nombre" value={patient.nombreDueno} />
          <InfoRow label="Teléfono" value={patient.telefono} />
          {patient.email ? <InfoRow label="Correo" value={patient.email} /> : null}
          {patient.direccion ? <InfoRow label="Dirección" value={patient.direccion} /> : null}
        </View>

        {(patient.motivoConsulta || patient.observaciones) ? (
          <View style={styles.card}>
            <CardTitle icon="📋" title="Notas clínicas" />
            {patient.motivoConsulta ? (
              <View style={styles.noteBlock}>
                <Text style={styles.noteLabel}>Motivo de consulta</Text>
                <Text style={styles.noteText}>{patient.motivoConsulta}</Text>
              </View>
            ) : null}
            {patient.observaciones ? (
              <View style={styles.noteBlock}>
                <Text style={styles.noteLabel}>Observaciones</Text>
                <Text style={styles.noteText}>{patient.observaciones}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function CardTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.cardTitle}>
      <Text style={styles.cardTitleIcon}>{icon}</Text>
      <Text style={styles.cardTitleText}>{title}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  greenHeader: {
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: colors.white,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: { fontSize: 16 },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarEmoji: { fontSize: 44 },
  heroName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: spacing.sm,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  heroDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  cardTitleIcon: { fontSize: 14 },
  cardTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    flex: 2,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    textAlign: 'right',
  },
  noteBlock: {
    marginBottom: spacing.md,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  noteText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  estadoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  estadoChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  estadoChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
});
