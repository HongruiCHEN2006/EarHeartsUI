import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Sex } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePatients } from '../../contexts/PatientContext';

interface AddPatientModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddPatientModal({ open, onClose }: AddPatientModalProps) {
  const { t } = useLanguage();
  const { addPatient } = usePatients();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex | ''>('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setName('');
    setAge('');
    setSex('');
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError(t('enter_name'));
      return;
    }

    try {
      addPatient(name.trim(), age, sex);
      handleClose();
    } catch (err) {
      setError(t('patient_exists'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('add_patient')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t('name')}
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label={t('age')}
          type="number"
          fullWidth
          value={age}
          onChange={(e) => setAge(e.target.value)}
          inputProps={{ min: 0, max: 150 }}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>{t('sex')}</InputLabel>
          <Select
            value={sex}
            onChange={(e) => setSex(e.target.value as Sex | '')}
            label={t('sex')}
          >
            <MenuItem value="">{t('select')}</MenuItem>
            <MenuItem value={Sex.Male}>{t('male')}</MenuItem>
            <MenuItem value={Sex.Female}>{t('female')}</MenuItem>
            <MenuItem value={Sex.Other}>{t('other')}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {t('add_patient')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

