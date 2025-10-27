import { useRef } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { Download, Upload } from '@mui/icons-material';
import { usePatients } from '../../contexts/PatientContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { exportPatient, exportAllPatients } from '../../utils/dataExport';

export function DataManagement() {
  const { patients, selectedPatient, addPatient } = usePatients();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPatient = () => {
    if (!selectedPatient) {
      alert(t('select_patient_warning'));
      return;
    }

    const patient = patients[selectedPatient];
    exportPatient(selectedPatient, patient);
    alert(t('export_success'));
  };

  const handleExportAll = () => {
    if (Object.keys(patients).length === 0) {
      alert(t('no_patients_export'));
      return;
    }

    exportAllPatients(patients);
    alert(t('export_success'));
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        if (importedData.patients) {
          // Import all patients
          const importCount = Object.keys(importedData.patients).length;
          if (
            confirm(t('confirm_import').replace('{}', importCount.toString()))
          ) {
            let actualImported = 0;
            for (const name in importedData.patients) {
              try {
                addPatient(
                  name,
                  importedData.patients[name].age || '',
                  importedData.patients[name].sex || ''
                );
                // Update notes separately if needed
                actualImported++;
              } catch (err) {
                // Patient already exists, skip
              }
            }
            alert(`${t('import_success')} (${actualImported} patients)`);
          }
        } else if (importedData.name) {
          // Import single patient
          if (confirm(`Import patient "${importedData.name}"?`)) {
            try {
              addPatient(
                importedData.name,
                importedData.age || '',
                importedData.sex || ''
              );
              alert(t('import_success'));
            } catch (err) {
              alert(t('patient_exists'));
            }
          }
        } else {
          alert('Invalid file format!');
        }
      } catch (error) {
        alert(
          'Error importing file: ' +
            (error instanceof Error ? error.message : 'Unknown error')
        );
      }
    };
    reader.readAsText(file);

    // Clear input to allow re-importing the same file
    event.target.value = '';
  };

  return (
    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" color="primary" gutterBottom>
        {t('data_management')}
      </Typography>

      <Stack spacing={1}>
        <Button
          variant="contained"
          color="info"
          startIcon={<Download />}
          onClick={handleExportPatient}
          fullWidth
        >
          {t('export_patient')}
        </Button>

        <Button
          variant="contained"
          color="info"
          startIcon={<Download />}
          onClick={handleExportAll}
          fullWidth
        >
          {t('export_all')}
        </Button>

        <Button
          variant="outlined"
          startIcon={<Upload />}
          onClick={handleImportClick}
          fullWidth
        >
          {t('import_data')}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileImport}
        />
      </Stack>
    </Box>
  );
}

