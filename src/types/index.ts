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
