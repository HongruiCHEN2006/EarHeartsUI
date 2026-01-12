import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { Save, Clear } from '@mui/icons-material';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePatients } from '../../contexts/PatientContext';

export function NotesSection() {
  const { t } = useLanguage();
  const {
    currentNotesContent,
    originalNotesContent,
    updateNotes,
    saveNotes,
    clearNotes,
    selectedPatient,
    patients,
    updatePatientInfo, 
  } = usePatients();
  const doctorHeartRate = selectedPatient ? (patients[selectedPatient]?.doctorHeartRate || '') : '';
  
  const deviceHeartRate = selectedPatient ? (patients[selectedPatient]?.deviceHeartRate ?? null) : null;

  const getNotesStatus = () => {
    const originalHR = selectedPatient ? (patients[selectedPatient]?.doctorHeartRate || '') : '';
    const hasHRChanged = doctorHeartRate !== originalHR;
    const hasNotesChanged = currentNotesContent !== originalNotesContent;

    if (!currentNotesContent.trim() && !doctorHeartRate) {
      return { label: t('no_notes'), color: 'default' as const };
    } else if (!hasNotesChanged && !hasHRChanged) {
      return { label: t('notes_saved'), color: 'success' as const };
    } else {
      return { label: t('notes_modified'), color: 'warning' as const };
    }
  };

  const status = getNotesStatus();
  
  const hasUnsavedChanges = 
    selectedPatient && 
    (currentNotesContent !== originalNotesContent || 
     doctorHeartRate !== (patients[selectedPatient]?.doctorHeartRate || ''));

  const handleClearNotes = () => {
    if (confirm(t('confirm_clear_notes'))) {
      clearNotes();
      if (selectedPatient) {
        updatePatientInfo('doctorHeartRate', '');
      }
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" color="primary">
          {t('doctors_notes')}
        </Typography>
        <Chip label={status.label} color={status.color} size="small" />
      </Box>

      {/* Notes + Heart Rate */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
        }}
      >
        {/* Left: Doctor Notes */}
        <TextField
          fullWidth
          multiline
          rows={6}
          value={currentNotesContent}
          onChange={(e) => updateNotes(e.target.value)}
          placeholder={t('notes_placeholder')}
          disabled={!selectedPatient}
        />

        {/* Right: Heart Rate panel */}
        <Box
          sx={{
            minWidth: 220,
            pl: 2,
            borderLeft: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="Doctor-measured HR"
              type="number"
              value={doctorHeartRate}
              onChange={(e) => updatePatientInfo('doctorHeartRate', e.target.value)}
              disabled={!selectedPatient}
              InputProps={{
                endAdornment: (
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    bpm
                  </Typography>
                ),
              }}
            />

            <TextField
              label="Device-measured HR"
              type="number"
              value={deviceHeartRate ?? ''}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    bpm
                  </Typography>
                ),
              }}
              disabled={!selectedPatient}
            />
          </Stack>
        </Box>
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Clear />}
          onClick={handleClearNotes}
          fullWidth
          disabled={!selectedPatient}
        >
          {t('clear_notes')}
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<Save />}
          onClick={saveNotes}
          disabled={!hasUnsavedChanges}
          fullWidth
        >
          {t('save_notes')}
        </Button>
      </Stack>
    </Box>
  );
}