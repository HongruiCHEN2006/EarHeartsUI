import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { usePatients } from '../../contexts/PatientContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDate } from '../../utils/dataExport';

export function PatientList() {
  const { patients, selectedPatient, selectPatient } = usePatients();
  const { t } = useLanguage();

  return (
    <Paper
      elevation={0}
      sx={{
        maxHeight: 300,
        overflow: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <List disablePadding>
        {Object.keys(patients).length === 0 ? (
          <ListItem>
            <ListItemText
              secondary={t('list_label')}
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            />
          </ListItem>
        ) : (
          Object.entries(patients).map(([name, patient]) => (
            <ListItem
              key={name}
              disablePadding
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 },
              }}
            >
              <ListItemButton
                selected={selectedPatient === name}
                onClick={() => selectPatient(name)}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight="bold">
                        {name}
                      </Typography>
                      {patient.waveform && (
                        <Chip
                          label={t('recorded')}
                          size="small"
                          color="success"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                      {!patient.waveform && (
                        <Chip
                          label={t('no_recording')}
                          size="small"
                          color="error"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                      {patient.note && patient.note.trim() && (
                        <Chip
                          label={t('notes_saved')}
                          size="small"
                          color="info"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {t('age')}{' '}
                      {patient.age || 'N/A'} | {t('sex')}{' '}
                      {patient.sex || 'N/A'}
                      {patient.lastModified &&
                        ` | Modified: ${formatDate(patient.lastModified)}`}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
}

