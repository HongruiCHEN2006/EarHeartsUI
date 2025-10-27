import { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LanguageProvider } from './contexts/LanguageContext';
import { PatientProvider, usePatients } from './contexts/PatientContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MainPanel } from './components/MainPanel/MainPanel';
import { ConfirmationModal } from './components/Modals/ConfirmationModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E86AB',
    },
    background: {
      default: '#e6f0fa',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

function AppContent() {
  const { pendingPatientSwitch, hasUnsavedNotes } = usePatients();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (pendingPatientSwitch) {
      setConfirmModalOpen(true);
    } else {
      setConfirmModalOpen(false);
    }
  }, [pendingPatientSwitch]);

  // Handle beforeunload event for unsaved notes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedNotes()) {
        e.preventDefault();
        e.returnValue =
          'You have unsaved notes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedNotes]);

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <MainPanel />
      </Box>
      <ConfirmationModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <PatientProvider>
          <AppContent />
        </PatientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

