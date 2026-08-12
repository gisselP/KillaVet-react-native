import { Patient } from '../types';

const STORAGE_KEY = 'killavet_patients';

function loadAll(): Patient[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Patient[]) : [];
  } catch {
    return [];
  }
}

function saveAll(patients: Patient[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

export function initDatabase(): void {
  // No-op on web
}

export function getAllPatients(): Patient[] {
  return loadAll().reverse();
}

export function insertPatient(patient: Patient): void {
  const all = loadAll();
  const idx = all.findIndex((p) => p.id === patient.id);
  if (idx >= 0) {
    all[idx] = patient;
  } else {
    all.push(patient);
  }
  saveAll(all);
}

export function updatePatientData(patient: Patient): void {
  const all = loadAll();
  const idx = all.findIndex((p) => p.id === patient.id);
  if (idx >= 0) {
    all[idx] = patient;
    saveAll(all);
  }
}

export function deletePatientById(id: string): void {
  saveAll(loadAll().filter((p) => p.id !== id));
}
