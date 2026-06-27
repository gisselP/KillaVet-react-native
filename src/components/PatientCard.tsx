import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { SPECIES_EMOJI } from './SpeciesSelector';
import { usePatients } from '../context/PatientContext';
import { Patient } from '../types';

interface Props {
  patient: Patient;
  onPress: () => void;
}

export default function PatientCard({ patient, onPress }: Props) {
  const { deletePatient } = usePatients();

  function handleLongPress() {
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

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      style={styles.card}
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
});
