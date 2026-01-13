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
  

  // 初始化加载
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
            notes: parsedPatients[name].notes || '', 
            waveform: null,
          };
        }
        setPatients(patientsMap);
      }

      if (savedSelected && savedPatients) {
        setSelectedPatient(savedSelected);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // 自动保存
  useEffect(() => {
    try {
      const patientsForStorage: any = {};
      for (const name in patients) {
        patientsForStorage[name] = {
          ...patients[name],
          waveform: null, // 录音不存本地
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

  // 同步当前笔记
  useEffect(() => {
    if (selectedPatient && patients[selectedPatient]) {
      const note = patients[selectedPatient].notes || '';
      setCurrentNotesContent(note);
      setOriginalNotesContent(note);
    } else {
      setCurrentNotesContent('');
      setOriginalNotesContent('');
    }
  }, [selectedPatient, patients]);

  // --- 修复 addPatient ---
  const addPatient = (name: string, age: string, sex: Sex | '') => {
    if (patients[name]) return;

    // 关键：这里必须包含 Patient 接口定义的所有字段
    const newPatient: Patient = {
      name,
      age,
      sex: sex as Sex, // 强制断言，解决 "" 无法赋值给 Sex 的问题
      notes: '',
      waveform: null,
      deviceHeartRate: null,
      doctorHeartRate: null,
      recordingDate: null,
      lastModified: new Date().toISOString(),
    };

    setPatients((prev) => ({ ...prev, [name]: newPatient }));
    setSelectedPatient(name);
  };

  const deletePatient = (name: string) => {
    setPatients((prev) => {
      const newPatients = { ...prev };
      delete newPatients[name];
      return newPatients;
    });
    if (selectedPatient === name) setSelectedPatient(null);
  };

  const selectPatient = (name: string, force = false) => {
    if (name === selectedPatient) return;
    if (!force && hasUnsavedNotes()) {
      setPendingPatientSwitch(name);
      return;
    }
    setSelectedPatient(name);
  };

  // --- 修复 updatePatientInfo：匹配 (field, value) 模式 ---
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

  const updateNotes = (content: string) => setCurrentNotesContent(content);

  const saveNotes = () => {
    if (!selectedPatient) return;
    setPatients((prev) => ({
      ...prev,
      [selectedPatient]: {
        ...prev[selectedPatient],
        notes: currentNotesContent,
        lastModified: new Date().toISOString(),
      },
    }));
    setOriginalNotesContent(currentNotesContent);
  };

  const clearNotes = () => setCurrentNotesContent('');

  const hasUnsavedNotes = (): boolean => {
    return currentNotesContent !== originalNotesContent && currentNotesContent.trim() !== '';
  };

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

  // --- 新增：批量导入功能 (ZIP 恢复核心) ---
  const importAllPatients = (newPatients: PatientsMap) => {
    setPatients(newPatients);
    const names = Object.keys(newPatients);
    if (names.length > 0) {
      setSelectedPatient(names[0]);
    }
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
        importAllPatients,
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
  if (!context) throw new Error('usePatients must be used within a PatientProvider');
  return context;
}