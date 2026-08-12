import * as SQLite from 'expo-sqlite';
import { Patient } from '../types';

const db = SQLite.openDatabaseSync('killavet.db');

export function initDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      data TEXT NOT NULL
    );
  `);
}

export function getAllPatients(): Patient[] {
  const rows = db.getAllSync(
    'SELECT data FROM patients ORDER BY rowid DESC'
  ) as { data: string }[];
  return rows.map((row) => JSON.parse(row.data) as Patient);
}

export function insertPatient(patient: Patient): void {
  db.runSync(
    'INSERT OR REPLACE INTO patients (id, userId, data) VALUES (?, ?, ?)',
    [patient.id, patient.userId ?? '', JSON.stringify(patient)]
  );
}

export function updatePatientData(patient: Patient): void {
  db.runSync(
    'UPDATE patients SET data = ? WHERE id = ?',
    [JSON.stringify(patient), patient.id]
  );
}

export function deletePatientById(id: string): void {
  db.runSync('DELETE FROM patients WHERE id = ?', [id]);
}
