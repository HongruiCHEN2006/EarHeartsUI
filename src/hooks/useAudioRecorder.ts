import { useState, useRef } from 'react';

export interface UseAudioRecorderReturn {
  startRecording: () => Promise<{
    waveform: number[];
    audioBlob: Blob;
  } | null>;
  isRecording: boolean;
  recordingTime: number;
  error: string | null;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const startRecording = async (): Promise<{
    waveform: number[];
    audioBlob: Blob;
  } | null> => {
    try {
      setError(null);
      setIsRecording(true);
      setRecordingTime(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      // Start timer
      let seconds = 0;
      timerIntervalRef.current = window.setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
        if (seconds >= 60) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
        }
      }, 1000);

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.start();

      // Wait for 60 seconds
      await new Promise((resolve) => setTimeout(resolve, 60000));
      mediaRecorder.stop();

      // Wait for recording to stop and process
      const result = await new Promise<{
        waveform: number[];
        audioBlob: Blob;
      } | null>((resolve) => {
        mediaRecorder.onstop = async () => {
          // Clean up
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          setIsRecording(false);
          setRecordingTime(0);

          // Stop all tracks
          stream.getTracks().forEach((track) => track.stop());

          try {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            const arrayBuffer = await blob.arrayBuffer();
            const audioCtx = new AudioContext();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            const channelData = audioBuffer.getChannelData(0);

            resolve({
              waveform: Array.from(channelData),
              audioBlob: blob,
            });
          } catch (err) {
            console.error('Error processing audio:', err);
            resolve(null);
          }
        };
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsRecording(false);
      setRecordingTime(0);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      return null;
    }
  };

  return {
    startRecording,
    isRecording,
    recordingTime,
    error,
  };
}

