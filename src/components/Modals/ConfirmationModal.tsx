import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePatients } from '../../contexts/PatientContext';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConfirmationModal({ open, onClose }: ConfirmationModalProps) {
  const { t } = useLanguage();
  const { confirmSwitchWithSave, confirmSwitchWithoutSave, setPendingPatientSwitch } = usePatients();

  const handleDiscard = () => {
    confirmSwitchWithoutSave();
    onClose();
  };

  const handleSave = () => {
    confirmSwitchWithSave();
    onClose();
  };

  const handleCancel = () => {
    setPendingPatientSwitch(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{t('unsaved_changes')}</DialogTitle>
      <DialogContent>
        <Typography>{t('unsaved_warning')}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={handleDiscard} color="error">
          {t('discard')}
        </Button>
        <div>
          <Button onClick={handleCancel} sx={{ mr: 1 }}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} variant="contained" color="success">
            {t('save_switch')}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

