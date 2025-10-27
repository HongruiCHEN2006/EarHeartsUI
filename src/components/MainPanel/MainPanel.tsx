import { Box } from '@mui/material';
import { RecordingControls } from './RecordingControls';
import { WaveformChart } from './WaveformChart';
import { NotesSection } from './NotesSection';

export function MainPanel() {
  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <RecordingControls />
      <WaveformChart />
      <NotesSection />
    </Box>
  );
}

