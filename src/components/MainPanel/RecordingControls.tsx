import { Button, Alert, Box } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePatients } from '../../contexts/PatientContext';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { downloadAudioFile } from '../../utils/dataExport';

export function RecordingControls() {
  const { t } = useLanguage();
  const { selectedPatient, patients, setWaveform } = usePatients();
  const { startRecording, isRecording, recordingTime, error } =
    useAudioRecorder();

  const handleRecord = async () => {
    if (!selectedPatient) {
      alert(t('select_patient_warning'));
      return;
    }

    const result = await startRecording();

    if (result) {
      setWaveform(result.waveform);
      
      // Download audio file
      const patient = patients[selectedPatient];
      downloadAudioFile(result.audioBlob, selectedPatient, patient);

      alert(t('finished').replace('{}', selectedPatient));
    } else if (error) {
      alert(t('recording_failed') + error);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color={isRecording ? 'error' : 'primary'}
        size="large"
        startIcon={<FiberManualRecord />}
        onClick={handleRecord}
        disabled={isRecording}
        fullWidth
        sx={{ mb: 2, py: 2, fontSize: '1.1rem' }}
      >
        {isRecording ? 'Recording...' : t('start_recording')}
      </Button>

      {isRecording && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('recording_timer').replace('{}', recordingTime.toString())}
        </Alert>
      )}

      {error && !isRecording && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t('recording_failed')} {error}
        </Alert>
      )}
    </Box>
  );
}

