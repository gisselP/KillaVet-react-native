export type EstadoPaciente = 'PENDIENTE' | 'EN_ATENCION' | 'FINALIZADO';
export type PrioridadPaciente = 'BAJA' | 'MEDIA' | 'ALTA';

export const TIPOS_SERVICIO = [
  'Consulta',
  'Vacunación',
  'Cirugía',
  'Emergencia',
  'Desparasitación',
  'Peluquería',
] as const;

export interface Patient {
  id: string;
  especie: string;
  nombre: string;
  raza: string;
  edad: string;
  sexo: string;
  peso: string;
  color: string;
  nombreDueno: string;
  telefono: string;
  email: string;
  direccion: string;
  tipoServicio: string;
  prioridad: PrioridadPaciente;
  estado: EstadoPaciente;
  motivoConsulta: string;
  observaciones: string;
  fechaRegistro: string;
  horaRegistro: string;
}

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Home: undefined;
  RegisterPatient: undefined;
  PatientDetail: { patient: Patient };
};
