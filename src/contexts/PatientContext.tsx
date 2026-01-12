import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  PatientsMap,
  PatientContextType,
  Sex,
} from '../types';

import { extractAndProcessMiddleSegment, estimateHeartRate } from '../utils/audioProcessing';

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<PatientsMap>({});
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [currentNotesContent, setCurrentNotesContent] = useState('');
  const [originalNotesContent, setOriginalNotesContent] = useState('');
  const [pendingPatientSwitch, setPendingPatientSwitch] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem('heartRecorderPatients');
      const savedSelected = localStorage.getItem('heartRecorderSelectedPatient');

      if (savedPatients) {
        const parsedPatients = JSON.parse(savedPatients);
        const patientsMap: PatientsMap = {};
        
        for (const name in parsedPatients) {
          patientsMap[name] = {
            ...parsedPatients[name],
            waveform: null, // Audio data not restored from localStorage
          };
        }
        
        setPatients(patientsMap);
      }

      if (savedSelected && savedPatients) {
        const parsedPatients = JSON.parse(savedPatients);
        if (parsedPatients[savedSelected]) {
          setSelectedPatient(savedSelected);
          setCurrentNotesContent(parsedPatients[savedSelected].note || '');
          setOriginalNotesContent(parsedPatients[savedSelected].note || '');
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever patients change
  useEffect(() => {
    try {
      const patientsForStorage: Record<string, Omit<Patient, 'waveform'> & { hasWaveform: boolean }> = {};
      
      for (const name in patients) {
        patientsForStorage[name] = {
          name: patients[name].name,
          age: patients[name].age,
          sex: patients[name].sex,
          deviceHeartRate: patients[name].deviceHeartRate,
          doctorHeartRate: patients[name].doctorHeartRate,
          note: patients[name].note,
          recordingDate: patients[name].recordingDate,
          lastModified: patients[name].lastModified,
          hasWaveform: !!patients[name].waveform,
        };
      }
      
      localStorage.setItem('heartRecorderPatients', JSON.stringify(patientsForStorage));
      if (selectedPatient) {
        localStorage.setItem('heartRecorderSelectedPatient', selectedPatient);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [patients, selectedPatient]);

  const addPatient = (name: string, age: string, sex: Sex | '') => {
    if (patients[name]) {
      throw new Error('Patient already exists');
    }

    const newPatient: Patient = {
      name,
      age,
      sex,
      note: '',
      waveform: null,
      recordingDate: null,
      lastModified: new Date().toISOString(),
    };

    setPatients((prev) => ({ ...prev, [name]: newPatient }));
    setSelectedPatient(name);
    setCurrentNotesContent('');
    setOriginalNotesContent('');
  };

  const deletePatient = (name: string) => {
    setPatients((prev) => {
      const newPatients = { ...prev };
      delete newPatients[name];
      return newPatients;
    });

    if (selectedPatient === name) {
      setSelectedPatient(null);
      setCurrentNotesContent('');
      setOriginalNotesContent('');
    }
  };

  const selectPatient = (name: string, force = false) => {
    if (name === selectedPatient) return;

    if (!force && hasUnsavedNotes()) {
      setPendingPatientSwitch(name);
      return;
    }

    setSelectedPatient(name);
    const patient = patients[name];
    if (patient) {
      setCurrentNotesContent(patient.note || '');
      setOriginalNotesContent(patient.note || '');
    }
  };

  // const updatePatientInfo = (field: 'age' | 'sex', value: string) => {
  //   if (!selectedPatient) return;

  //   setPatients((prev) => ({
  //     ...prev,
  //     [selectedPatient]: {
  //       ...prev[selectedPatient],
  //       [field]: value,
  //       lastModified: new Date().toISOString(),
  //     },
  //   }));
  // };

  const updatePatientInfo = (
    field: 'age' | 'sex' | 'doctorHeartRate' | 'deviceHeartRate', 
    value: string | number | null
  ) => {
    if (!selectedPatient) return;

    setPatients((prev) => ({
      ...prev,
      [selectedPatient]: {
        ...prev[selectedPatient],
        [field]: value,
        lastModified: new Date().toISOString(),
      },
    }));
  };


  const updateNotes = (content: string) => {
    setCurrentNotesContent(content);
  };

  const saveNotes = () => {
    if (!selectedPatient) return;

    setPatients((prev) => ({
      ...prev,
      [selectedPatient]: {
        ...prev[selectedPatient],
        note: currentNotesContent,
        lastModified: new Date().toISOString(),
      },
    }));

    setOriginalNotesContent(currentNotesContent);
  };

  const clearNotes = () => {
    setCurrentNotesContent('');
  };

  const hasUnsavedNotes = (): boolean => {
    return (
      currentNotesContent !== originalNotesContent &&
      currentNotesContent.trim() !== ''
    );
  };

  // const setWaveform = (waveform: number[]) => {
  //   if (!selectedPatient) return;

  //   setPatients((prev) => ({
  //     ...prev,
  //     [selectedPatient]: {
  //       ...prev[selectedPatient],
  //       waveform,
  //       recordingDate: new Date().toISOString(),
  //       lastModified: new Date().toISOString(),
  //     },
  //   }));
  // };

  const setWaveform = (waveform: number[]) => {
    if (!selectedPatient) return;

    const SAMPLE_RATE = 44100; 
    const processedData = extractAndProcessMiddleSegment(waveform, SAMPLE_RATE);

    const calculatedBpm = estimateHeartRate(processedData, SAMPLE_RATE);

    setPatients((prev) => ({
      ...prev,
      [selectedPatient]: {
        ...prev[selectedPatient],
        waveform,
        deviceHeartRate: calculatedBpm > 0 ? calculatedBpm : null,
        recordingDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    }));
  };

  const confirmSwitchWithSave = () => {
    saveNotes();
    if (pendingPatientSwitch) {
      selectPatient(pendingPatientSwitch, true);
      setPendingPatientSwitch(null);
    }
  };

  const confirmSwitchWithoutSave = () => {
    if (pendingPatientSwitch) {
      selectPatient(pendingPatientSwitch, true);
      setPendingPatientSwitch(null);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        selectedPatient,
        currentNotesContent,
        originalNotesContent,
        addPatient,
        deletePatient,
        selectPatient,
        updatePatientInfo,
        updateNotes,
        saveNotes,
        clearNotes,
        hasUnsavedNotes,
        setWaveform,
        pendingPatientSwitch,
        setPendingPatientSwitch,
        confirmSwitchWithSave,
        confirmSwitchWithoutSave,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients(): PatientContextType {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}

