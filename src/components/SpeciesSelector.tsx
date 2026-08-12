import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
// Interfaz para estructurar los datos de cada opción de especie
interface Species {
  label: string;
  emoji: string;
  value: string;
}
// Lista estática de especies disponibles para seleccionar
const SPECIES: Species[] = [
  { label: 'Perro', emoji: '🐶', value: 'Perro' },
  { label: 'Gato', emoji: '🐱', value: 'Gato' },
  { label: 'Conejo', emoji: '🐰', value: 'Conejo' },
  { label: 'Ave', emoji: '🐦', value: 'Ave' },
  { label: 'Hamster', emoji: '🐹', value: 'Hamster' },
  { label: 'Otro', emoji: '🐾', value: 'Otro' },
];

export const SPECIES_EMOJI: Record<string, string> = Object.fromEntries(
  SPECIES.map((s) => [s.value, s.emoji])
);

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SpeciesSelector({ value, onChange }: Props) {
  return (
    <View style={styles.grid}>
      {SPECIES.map((s) => {
        const selected = value === s.value;
        return (
          <TouchableOpacity
            key={s.value}
            onPress={() => onChange(s.value)}
            activeOpacity={0.7}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={styles.emoji}>{s.emoji}</Text>
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
});
