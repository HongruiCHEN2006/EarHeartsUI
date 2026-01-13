import { Patient, PatientsMap } from '../types';
import JSZip from 'jszip'; 
import { bufferToWave } from './wavUtils'; 

// --- 1. 基础工具函数 (保留原来的) ---
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString();
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPatient(patientName: string, patient: Patient): void {
  const patientData = { ...patient, name: patientName };
  
  const dateStr = new Date().toISOString().split('T')[0];
  downloadJsonFile(patientData, `${patientName}_Backup_${dateStr}.json`);
}

export function exportAllPatients(patients: PatientsMap): void {
  const allPatientsData = { ...patients };
  const dateStr = new Date().toISOString().split('T')[0];
  downloadJsonFile(allPatientsData, `All_Patients_Backup_${dateStr}.json`);
}

export function downloadAudioFile(blob: Blob, patientName: string, patient: Patient): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `${patientName}_${timestamp}.wav`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

//新增：ZIP 完整打包导出 ---
export async function exportToZip(patients: PatientsMap) {
  const zip = new JSZip();
  const recordingsFolder = zip.folder("recordings");
  const metadata: any = {};
  
  for (const name in patients) {
    const p = patients[name];
    metadata[name] = { ...p, waveform: null }; // JSON里不存数组

    if (p.waveform && p.waveform.length > 0) {
      const wavBlob = bufferToWave(p.waveform);
      recordingsFolder?.file(`${name}.wav`, wavBlob);
    }
  }

  zip.file("patients_metadata.json", JSON.stringify(metadata, null, 2));

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Heart_Full_Backup_${new Date().getTime()}.zip`;
  a.click();
}

//新增：ZIP 完整导入 ---
export async function importFromZip(
  file: File,
  onComplete: (data: PatientsMap) => void
) {
  const zip = await JSZip.loadAsync(file);
  const metaFile = zip.file("patients_metadata.json");
  if (!metaFile) throw new Error("无效的备份文件");

  const patients: PatientsMap = JSON.parse(await metaFile.async("string"));
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

  for (const name in patients) {
    const wavFile = zip.file(`recordings/${name}.wav`);
    if (wavFile) {
      const arrayBuffer = await wavFile.async("arraybuffer");
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      patients[name].waveform = Array.from(audioBuffer.getChannelData(0));
    }
  }
  onComplete(patients);
}