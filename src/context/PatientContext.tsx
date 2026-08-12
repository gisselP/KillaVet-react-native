import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Patient, EstadoPaciente } from '../types';
import {
  initDatabase,
  getAllPatients,
  insertPatient,
  updatePatientData,
  deletePatientById,
} from '../services/database';

export type PatientInput = Omit<Patient, 'id' | 'userId' | 'fechaRegistro' | 'horaRegistro'>;

interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  addPatient: (data: PatientInput) => Promise<Patient>;
  updatePatient: (id: string, data: PatientInput) => Promise<void>;
  updateEstado: (id: string, estado: EstadoPaciente) => void;
  deletePatient: (id: string) => Promise<void>;
  getPatientById: (id: string) => Patient | undefined;
}

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPatients([]);
      setLoading(false);
      return;
    }
    initDatabase();
    const local = getAllPatients(user.uid);
    setPatients(local);
    setLoading(false);
    syncFromFirestore(user.uid);
  }, [user?.uid]);

  async function syncFromFirestore(uid: string) {
    try {
      const q = query(collection(firestore, 'patients'), where('userId', '==', uid));
      const snapshot = await getDocs(q);
      const firestorePatients = snapshot.docs.map((d) => d.data() as Patient);

      const localIds = new Set(getAllPatients(uid).map((p) => p.id));
      for (const p of firestorePatients) {
        if (!localIds.has(p.id)) {
          insertPatient(p);
        }
      }
      setPatients(getAllPatients(uid));
    } catch (e) {
      // sin conexión, se usan los datos locales
    }
  }

  async function addPatient(patientData: PatientInput): Promise<Patient> {
    if (!user) throw new Error('Usuario no autenticado');

    const newPatient: Patient = {
      id: Date.now().toString(),
      userId: user.uid,
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

    insertPatient(newPatient);
    setPatients(getAllPatients(user.uid));
    setDoc(doc(firestore, 'patients', newPatient.id), newPatient).catch(() => {});

    return newPatient;
  }

  async function updatePatient(id: string, data: PatientInput): Promise<void> {
    if (!user) return;
    const existing = patients.find((p) => p.id === id);
    if (!existing) return;
    const updated: Patient = { ...existing, ...data };
    updatePatientData(updated);
    setPatients(getAllPatients(user.uid));
    setDoc(doc(firestore, 'patients', id), updated).catch(() => {});
  }

  function updateEstado(id: string, estado: EstadoPaciente): void {
    if (!user) return;
    const updated = patients.map((p) => (p.id === id ? { ...p, estado } : p));
    const patient = updated.find((p) => p.id === id);
    if (patient) {
      updatePatientData(patient);
      updateDoc(doc(firestore, 'patients', id), { estado }).catch(() => {});
    }
    setPatients(updated);
  }

  async function deletePatient(id: string): Promise<void> {
    if (!user) return;
    deletePatientById(id);
    setPatients(getAllPatients(user.uid));
    deleteDoc(doc(firestore, 'patients', id)).catch(() => {});
  }

  function getPatientById(id: string): Patient | undefined {
    return patients.find((p) => p.id === id);
  }

  return (
    <PatientContext.Provider
      value={{ patients, loading, addPatient, updatePatient, updateEstado, deletePatient, getPatientById }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients(): PatientContextType {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error('usePatients debe usarse dentro de PatientProvider');
  return ctx;
}
