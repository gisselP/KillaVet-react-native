import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { SPECIES_EMOJI } from './SpeciesSelector';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { Patient } from '../types';

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

const ESTADO_BORDER: Record<string, string> = {
  PENDIENTE:   '#D97706',
  EN_ATENCION: '#3B82F6',
  FINALIZADO:  '#1D9E75',
};

interface Props {
  patient: Patient;
  onPress: () => void;
}

export default function PatientCard({ patient, onPress }: Props) {
  const { deletePatient } = usePatients();
  const { user } = useAuth();
  const isOwner = patient.userId === user?.uid;

  function handleLongPress() {
    if (!isOwner) return;
    Alert.alert(
      `Eliminar a ${patient.nombre}`,
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deletePatient(patient.id),
        },
      ]
    );
  }

  const emoji = SPECIES_EMOJI[patient.especie] ?? '🐾';
  const estado = patient.estado ?? 'PENDIENTE';
  const prioridad = patient.prioridad ?? 'BAJA';
  const ec = ESTADO_CONFIG[estado];
  const pc = PRIORIDAD_CONFIG[prioridad];

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      style={[styles.card, { borderLeftColor: ESTADO_BORDER[estado] }]}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarEmoji}>{emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.petName}>{patient.nombre}</Text>
        <Text style={styles.petMeta} numberOfLines={1}>
          {patient.especie}
          {patient.raza ? ` · ${patient.raza}` : ''}
        </Text>
        <Text style={styles.ownerName} numberOfLines={1}>
          👤 {patient.nombreDueno}
        </Text>
        <View style={styles.chipsRow}>
          <View style={[styles.chip, { backgroundColor: ec.bg }]}>
            <Text style={[styles.chipText, { color: ec.text }]}>{ec.label}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: pc.bg }]}>
            <Text style={[styles.chipText, { color: pc.text }]}>{prioridad}</Text>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{patient.fechaRegistro}</Text>
        </View>
        <Text style={styles.timeText}>{patient.horaRegistro}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  petName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDeep,
  },
  petMeta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  ownerName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 5,
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
