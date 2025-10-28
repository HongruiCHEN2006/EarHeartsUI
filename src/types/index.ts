export enum Sex {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum Language {
  English = 'English',
  Deutsch = 'Deutsch',
  French = 'fr',
  Wolof = 'wo',
}

export interface Patient {
  name: string;
  age: string;
  sex: Sex | '';
  note: string;
  waveform: number[] | null;
  recordingDate: string | null;
  lastModified: string | null;
}

export type PatientsMap = Record<string, Patient>;

export interface PatientContextType {
  patients: PatientsMap;
  selectedPatient: string | null;
  currentNotesContent: string;
  originalNotesContent: string;
  addPatient: (name: string, age: string, sex: Sex | '') => void;
  deletePatient: (name: string) => void;
  selectPatient: (name: string, force?: boolean) => void;
  updatePatientInfo: (field: 'age' | 'sex', value: string) => void;
  updateNotes: (content: string) => void;
  saveNotes: () => void;
  clearNotes: () => void;
  hasUnsavedNotes: () => boolean;
  setWaveform: (waveform: number[]) => void;
  pendingPatientSwitch: string | null;
  setPendingPatientSwitch: (name: string | null) => void;
  confirmSwitchWithSave: () => void;
  confirmSwitchWithoutSave: () => void;
}

export interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface TranslationKey {
  add_patient: string;
  start_recording: string;
  delete_patient: string;
  list_label: string;
  select_patient_warning: string;
  recording: string;
  finished: string;
  patient_info: string;
  name: string;
  age: string;
  sex: string;
  male: string;
  female: string;
  other: string;
  select: string;
  patient_exists: string;
  enter_name: string;
  doctors_notes: string;
  save_notes: string;
  clear_notes: string;
  notes_saved: string;
  notes_modified: string;
  no_notes: string;
  notes_placeholder: string;
  unsaved_changes: string;
  unsaved_warning: string;
  discard: string;
  save_switch: string;
  cancel: string;
  recorded: string;
  no_recording: string;
  data_management: string;
  export_patient: string;
  export_all: string;
  import_data: string;
  export_success: string;
  import_success: string;
  no_patients_export: string;
  confirm_import: string;
  confirm_clear_notes: string;
  confirm_delete_patient: string;
  recording_timer: string;
  recording_failed: string;
}

export type Translations = Record<Language, TranslationKey>;

