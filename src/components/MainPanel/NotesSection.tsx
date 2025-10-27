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
  } = usePatients();

  const getNotesStatus = () => {
    if (!currentNotesContent.trim()) {
      return { label: t('no_notes'), color: 'default' as const };
    } else if (currentNotesContent === originalNotesContent) {
      return { label: t('notes_saved'), color: 'success' as const };
    } else {
      return { label: t('notes_modified'), color: 'warning' as const };
    }
  };

  const status = getNotesStatus();
  const hasUnsavedChanges =
    currentNotesContent !== originalNotesContent &&
    currentNotesContent.trim() !== '';

  const handleClearNotes = () => {
    if (confirm(t('confirm_clear_notes'))) {
      clearNotes();
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
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

      <TextField
        fullWidth
        multiline
        rows={6}
        value={currentNotesContent}
        onChange={(e) => updateNotes(e.target.value)}
        placeholder={t('notes_placeholder')}
        sx={{ mb: 2 }}
      />

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Clear />}
          onClick={handleClearNotes}
          fullWidth
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

