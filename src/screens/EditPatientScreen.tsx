import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { usePatients, PatientInput } from '../context/PatientContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import SpeciesSelector from '../components/SpeciesSelector';
import { colors, spacing, radius } from '../theme/colors';
import { RootStackParamList, PrioridadPaciente, EstadoPaciente, TIPOS_SERVICIO } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditPatient'>;
  route: RouteProp<RootStackParamList, 'EditPatient'>;
};

const SEX_OPTIONS = ['Macho', 'Hembra', 'No especificado'] as const;

interface FormErrors {
  nombre?: string;
  nombreDueno?: string;
  telefono?: string;
  email?: string;
}

export default function EditPatientScreen({ navigation, route }: Props) {
  const { patientId } = route.params;
  const { getPatientById, updatePatient } = usePatients();
  const patient = getPatientById(patientId);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [especie, setEspecie] = useState(patient?.especie ?? 'Perro');
  const [nombre, setNombre] = useState(patient?.nombre ?? '');
  const [raza, setRaza] = useState(patient?.raza ?? '');
  const [edad, setEdad] = useState(patient?.edad ?? '');
  const [sexo, setSexo] = useState(patient?.sexo ?? '');
  const [peso, setPeso] = useState(patient?.peso ?? '');
  const [color, setColor] = useState(patient?.color ?? '');
  const [nombreDueno, setNombreDueno] = useState(patient?.nombreDueno ?? '');
  const [telefono, setTelefono] = useState(patient?.telefono ?? '');
  const [email, setEmail] = useState(patient?.email ?? '');
  const [direccion, setDireccion] = useState(patient?.direccion ?? '');
  const [motivoConsulta, setMotivoConsulta] = useState(patient?.motivoConsulta ?? '');
  const [observaciones, setObservaciones] = useState(patient?.observaciones ?? '');
  const [tipoServicio, setTipoServicio] = useState(patient?.tipoServicio ?? TIPOS_SERVICIO[0]);
  const [prioridad, setPrioridad] = useState<PrioridadPaciente>(patient?.prioridad ?? 'MEDIA');
  const [estado, setEstado] = useState<EstadoPaciente>(patient?.estado ?? 'PENDIENTE');

  if (!patient) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textMuted }}>Paciente no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!nombreDueno.trim()) e.nombreDueno = 'El nombre del dueño es obligatorio';
    if (!telefono.trim()) e.telefono = 'El teléfono es obligatorio';
    else if (!/^\d{7,15}$/.test(telefono.replace(/[\s\-]/g, '')))
      e.telefono = 'Ingresa un teléfono válido';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Ingresa un correo válido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) {
      Alert.alert('Campos incompletos', 'Por favor corrige los errores antes de continuar.');
      return;
    }
    setLoading(true);
    try {
      const data: PatientInput = {
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
        tipoServicio,
        prioridad,
        estado,
        motivoConsulta: motivoConsulta.trim(),
        observaciones: observaciones.trim(),
      };
      await updatePatient(patient!.id, data);
      Alert.alert('¡Guardado!', 'Los datos del paciente fueron actualizados.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar paciente</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Especie */}
          <View style={styles.section}>
            <SectionLabel icon="🐾" label="Especie" />
            <SpeciesSelector value={especie} onChange={setEspecie} />
          </View>

          {/* Estado y tipo */}
          <View style={styles.section}>
            <SectionLabel icon="🏥" label="Tipo de atención" />
            <Text style={styles.fieldLabel}>Tipo de servicio</Text>
            <View style={styles.chipsGrid}>
              {(TIPOS_SERVICIO as readonly string[]).map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  onPress={() => setTipoServicio(tipo)}
                  style={[styles.chip, tipoServicio === tipo && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, tipoServicio === tipo && styles.chipTextSelected]}>
                    {tipo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: spacing.sm }]}>Estado</Text>
            <View style={styles.sexRow}>
              {(['PENDIENTE', 'EN_ATENCION', 'FINALIZADO'] as EstadoPaciente[]).map((e) => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setEstado(e)}
                  style={[styles.sexOption, estado === e && styles.sexOptionSelected]}
                >
                  <Text style={[styles.sexOptionText, estado === e && styles.sexOptionTextSelected]}>
                    {e === 'EN_ATENCION' ? 'En atención' : e.charAt(0) + e.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: spacing.sm }]}>Prioridad</Text>
            <View style={styles.sexRow}>
              {(['BAJA', 'MEDIA', 'ALTA'] as PrioridadPaciente[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPrioridad(p)}
                  style={[
                    styles.sexOption,
                    prioridad === p && styles.sexOptionSelected,
                    prioridad === p && p === 'ALTA' ? { backgroundColor: '#FEE2E2', borderColor: '#E24B4A' } : undefined,
                    prioridad === p && p === 'MEDIA' ? { backgroundColor: '#FEF3C7', borderColor: '#D97706' } : undefined,
                  ]}
                >
                  <Text style={[styles.sexOptionText, prioridad === p && styles.sexOptionTextSelected]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Datos mascota */}
          <View style={styles.section}>
            <SectionLabel icon="❤️" label="Datos de la mascota" />
            <InputField label="Nombre de la mascota" value={nombre} onChangeText={setNombre}
              placeholder="Ej: Max, Luna..." required error={errors.nombre} />
            <InputField label="Raza" value={raza} onChangeText={setRaza} placeholder="Ej: Labrador..." />
            <View style={styles.row}>
              <InputField label="Edad" value={edad} onChangeText={setEdad}
                placeholder="Ej: 2 años" style={{ flex: 1 }} />
              <View style={{ width: spacing.sm }} />
              <InputField label="Peso" value={peso} onChangeText={setPeso}
                placeholder="Ej: 5.2 kg" keyboardType="decimal-pad" style={{ flex: 1 }} />
            </View>
            <Text style={styles.fieldLabel}>Sexo</Text>
            <View style={styles.sexRow}>
              {SEX_OPTIONS.map((opt) => (
                <TouchableOpacity key={opt} onPress={() => setSexo(opt)}
                  style={[styles.sexOption, sexo === opt && styles.sexOptionSelected]}>
                  <Text style={[styles.sexOptionText, sexo === opt && styles.sexOptionTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <InputField label="Color / características" value={color} onChangeText={setColor}
              placeholder="Ej: Marrón con manchas blancas" />
          </View>

          {/* Datos dueño */}
          <View style={styles.section}>
            <SectionLabel icon="👤" label="Datos del dueño" />
            <InputField label="Nombre completo" value={nombreDueno} onChangeText={setNombreDueno}
              placeholder="Nombre y apellido" required error={errors.nombreDueno} />
            <InputField label="Teléfono" value={telefono} onChangeText={setTelefono}
              placeholder="Ej: 987 654 321" keyboardType="phone-pad" required error={errors.telefono} />
            <InputField label="Correo electrónico" value={email} onChangeText={setEmail}
              placeholder="correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none"
              error={errors.email} />
            <InputField label="Dirección" value={direccion} onChangeText={setDireccion}
              placeholder="Dirección del dueño" />
          </View>

          {/* Notas */}
          <View style={styles.section}>
            <SectionLabel icon="📋" label="Notas clínicas" />
            <InputField label="Motivo de consulta" value={motivoConsulta} onChangeText={setMotivoConsulta}
              placeholder="Ej: Vacunación anual..." multiline />
            <InputField label="Observaciones adicionales" value={observaciones}
              onChangeText={setObservaciones} placeholder="Alergias, medicamentos..." multiline />
          </View>

          <Button title="Guardar cambios" onPress={handleSave} size="lg"
            loading={loading} style={styles.submitBtn} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 20, color: colors.white, fontWeight: '300' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: colors.white },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxxl },
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    margin: spacing.lg,
    marginBottom: 0,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  sectionLabelIcon: { fontSize: 14 },
  sectionLabelText: {
    fontSize: 12, fontWeight: '700', color: colors.primary,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  row: { flexDirection: 'row' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  sexRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  sexOption: {
    flex: 1, paddingVertical: 10, borderRadius: radius.sm,
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center',
  },
  sexOptionSelected: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  sexOptionText: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  sexOptionTextSelected: { color: colors.primaryDark, fontWeight: '700' },
  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full,
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  chipTextSelected: { color: colors.primaryDark, fontWeight: '700' },
  submitBtn: { margin: spacing.lg, marginTop: spacing.lg, borderRadius: radius.lg },
});
