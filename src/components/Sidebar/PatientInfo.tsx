import {
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { Sex } from '../../types';
import { usePatients } from '../../contexts/PatientContext';
import { useLanguage } from '../../contexts/LanguageContext';

export function PatientInfo() {
  const { patients, selectedPatient, updatePatientInfo } = usePatients();
  const { t } = useLanguage();

  if (!selectedPatient || !patients[selectedPatient]) {
    return null;
  }

  const patient = patients[selectedPatient];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="h6" color="primary" gutterBottom>
        {t('patient_info')}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label={t('name')}
          value={selectedPatient}
          disabled
          size="small"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label={t('age')}
          type="number"
          value={patient.age}
          onChange={(e) => updatePatientInfo('age', e.target.value)}
          inputProps={{ min: 0, max: 150 }}
          size="small"
          placeholder="Enter age"
        />
      </Box>

      <FormControl fullWidth size="small">
        <InputLabel>{t('sex')}</InputLabel>
        <Select
          value={patient.sex}
          onChange={(e) => updatePatientInfo('sex', e.target.value)}
          label={t('sex')}
        >
          <MenuItem value="">{t('select')}</MenuItem>
          <MenuItem value={Sex.Male}>{t('male')}</MenuItem>
          <MenuItem value={Sex.Female}>{t('female')}</MenuItem>
          <MenuItem value={Sex.Other}>{t('other')}</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
}

