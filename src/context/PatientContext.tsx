import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient, EstadoPaciente } from '../types';

type PatientInput = Omit<Patient, 'id' | 'fechaRegistro' | 'horaRegistro'>;

interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  addPatient: (data: PatientInput) => Promise<Patient>;
  updateEstado: (id: string, estado: EstadoPaciente) => void;
  deletePatient: (id: string) => Promise<void>;
}

const PatientContext = createContext<PatientContextType | null>(null);

const STORAGE_KEY = '@killavet_patients';

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPatients(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error cargando pacientes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addPatient(patientData: PatientInput): Promise<Patient> {
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...patientData,
      fechaRegistro: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      horaRegistro: new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated = [newPatient, ...patients];
    setPatients(updated);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error guardando paciente:', error);
    }

    return newPatient;
  }

  function updateEstado(id: string, estado: EstadoPaciente): void {
    const updated = patients.map((p) => (p.id === id ? { ...p, estado } : p));
    setPatients(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  }

  async function deletePatient(id: string): Promise<void> {
    const updated = patients.filter((p) => p.id !== id);
    setPatients(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error eliminando paciente:', error);
    }
  }

  return (
    <PatientContext.Provider value={{ patients, loading, addPatient, updateEstado, deletePatient }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients(): PatientContextType {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatients debe usarse dentro de PatientProvider');
  return ctx;
}
