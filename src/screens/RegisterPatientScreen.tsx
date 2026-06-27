import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePatients } from '../context/PatientContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import SpeciesSelector from '../components/SpeciesSelector';
import { colors, spacing, radius } from '../theme/colors';
import { RootStackParamList, Patient } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RegisterPatient'>;
};

const SEX_OPTIONS = ['Macho', 'Hembra', 'No especificado'] as const;

interface FormErrors {
  nombre?: string;
  nombreDueno?: string;
  telefono?: string;
  email?: string;
}

export default function RegisterPatientScreen({ navigation }: Props) {
  const { addPatient } = usePatients();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedPatient, setSavedPatient] = useState<Patient | null>(null);

  const [especie, setEspecie] = useState('Perro');
  const [nombre, setNombre] = useState('');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [peso, setPeso] = useState('');
  const [color, setColor] = useState('');
  const [nombreDueno, setNombreDueno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!nombreDueno.trim()) newErrors.nombreDueno = 'El nombre del dueño es obligatorio';
    if (!telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    else if (!/^\d{7,15}$/.test(telefono.replace(/[\s\-]/g, '')))
      newErrors.telefono = 'Ingresa un teléfono válido';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Ingresa un correo válido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) {
      Alert.alert('Campos incompletos', 'Por favor corrige los errores antes de continuar.');
      return;
    }

    setLoading(true);
    try {
      const patient = await addPatient({
        especie,
        nombre: nombre.trim(),
        raza: raza.trim(),
        edad: edad.trim(),
        sexo,
        peso: peso.trim(),
        color: color.trim(),
        nombreDueno: nombreDueno.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        direccion: direccion.trim(),
        motivoConsulta: motivoConsulta.trim(),
        observaciones: observaciones.trim(),
      });
      setSavedPatient(patient);
      setShowSuccess(true);
    } catch {
      Alert.alert('Error', 'Hubo un problema al guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  function handleSuccessClose() {
    setShowSuccess(false);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nuevo paciente</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <SectionLabel icon="🐾" label="Especie" />
            <SpeciesSelector value={especie} onChange={setEspecie} />
          </View>

          <View style={styles.section}>
            <SectionLabel icon="❤️" label="Datos de la mascota" />
            <InputField
              label="Nombre de la mascota"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Max, Luna, Rocky..."
              required
              error={errors.nombre}
            />
            <InputField
              label="Raza"
              value={raza}
              onChangeText={setRaza}
              placeholder="Ej: Labrador, Persa, Siamés..."
            />
            <View style={styles.row}>
              <InputField
                label="Edad"
                value={edad}
                onChangeText={setEdad}
                placeholder="Ej: 2 años"
                style={{ flex: 1 }}
              />
              <View style={{ width: spacing.sm }} />
              <InputField
                label="Peso"
                value={peso}
                onChangeText={setPeso}
                placeholder="Ej: 5.2 kg"
                keyboardType="decimal-pad"
                style={{ flex: 1 }}
              />
            </View>

            <Text style={styles.fieldLabel}>Sexo</Text>
            <View style={styles.sexRow}>
              {SEX_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSexo(opt)}
                  style={[
                    styles.sexOption,
                    sexo === opt && styles.sexOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.sexOptionText,
                      sexo === opt && styles.sexOptionTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <InputField
              label="Color / características"
              value={color}
              onChangeText={setColor}
              placeholder="Ej: Marrón con manchas blancas"
            />
          </View>

          <View style={styles.section}>
            <SectionLabel icon="👤" label="Datos del dueño" />
            <InputField
              label="Nombre completo"
              value={nombreDueno}
              onChangeText={setNombreDueno}
              placeholder="Nombre y apellido"
              required
              error={errors.nombreDueno}
            />
            <InputField
              label="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Ej: 987 654 321"
              keyboardType="phone-pad"
              autoCapitalize="none"
              required
              error={errors.telefono}
            />
            <InputField
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <InputField
              label="Dirección"
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Dirección del dueño"
            />
          </View>

          <View style={styles.section}>
            <SectionLabel icon="📋" label="Notas clínicas" />
            <InputField
              label="Motivo de consulta"
              value={motivoConsulta}
              onChangeText={setMotivoConsulta}
              placeholder="Ej: Vacunación anual, revisión general..."
              multiline
            />
            <InputField
              label="Observaciones adicionales"
              value={observaciones}
              onChangeText={setObservaciones}
              placeholder="Alergias conocidas, medicamentos actuales, antecedentes..."
              multiline
            />
          </View>

          <Button
            title="Guardar paciente"
            onPress={handleSubmit}
            size="lg"
            loading={loading}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconContainer}>
              <Text style={styles.successEmoji}>🐾</Text>
            </View>
            <Text style={styles.successTitle}>
              ¡{savedPatient?.nombre} registrado!
            </Text>
            <Text style={styles.successSub}>
              Dueño: {savedPatient?.nombreDueno}
            </Text>
            <Text style={styles.successSub2}>{savedPatient?.telefono}</Text>
            <Text style={styles.successDate}>
              Registrado el {savedPatient?.fechaRegistro} a las{' '}
              {savedPatient?.horaRegistro}
            </Text>
            <Button
              title="Ver todos los pacientes"
              onPress={handleSuccessClose}
              size="lg"
              style={{ marginTop: spacing.xl }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.sectionLabel}>
      <Text style={styles.sectionLabelIcon}>{icon}</Text>
      <Text style={styles.sectionLabelText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    margin: spacing.lg,
    marginBottom: 0,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  sectionLabelIcon: { fontSize: 14 },
  sectionLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  sexRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sexOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  sexOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  sexOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  sexOptionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  submitBtn: {
    margin: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radius.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 52, 44, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  successCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xxxl,
    width: '100%',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successEmoji: { fontSize: 32 },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDeep,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  successSub2: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  successDate: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
