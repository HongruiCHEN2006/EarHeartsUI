import { useState } from 'react';
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Language } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePatients } from '../../contexts/PatientContext';
import { PatientList } from './PatientList';
import { PatientInfo } from './PatientInfo';
import { DataManagement } from './DataManagement';
import { AddPatientModal } from '../Modals/AddPatientModal';

export function Sidebar() {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { selectedPatient, deletePatient } = usePatients();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleDeletePatient = () => {
    if (!selectedPatient) {
      alert(t('select_patient_warning'));
      return;
    }

    if (confirm(t('confirm_delete_patient').replace('{}', selectedPatient))) {
      deletePatient(selectedPatient);
    }
  };

  return (
    <Box
      sx={{
        width: 380,
        height: '100vh',
        p: 2,
        bgcolor: 'rgba(255, 255, 255, 0.7)',
        borderRight: '1px solid',
        borderColor: 'divider',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Language</InputLabel>
        <Select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value as Language)}
          label="Language"
        >
          <MenuItem value={Language.English}>English</MenuItem>
          <MenuItem value={Language.Deutsch}>Deutsch</MenuItem>
        </Select>
      </FormControl>

      <Stack spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddModalOpen(true)}
          fullWidth
        >
          {t('add_patient')}
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={handleDeletePatient}
          fullWidth
        >
          {t('delete_patient')}
        </Button>
      </Stack>

      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
        {t('list_label')}
      </Typography>

      <PatientList />

      <PatientInfo />

      <DataManagement />

      <AddPatientModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </Box>
  );
}

