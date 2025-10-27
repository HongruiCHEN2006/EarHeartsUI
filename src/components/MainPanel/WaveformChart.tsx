import { useMemo } from 'react';
import { Paper } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { usePatients } from '../../contexts/PatientContext';
import {
  extractAndProcessMiddleSegment,
  downsample,
} from '../../utils/audioProcessing';

export function WaveformChart() {
  const { patients, selectedPatient } = usePatients();

  const chartData = useMemo(() => {
    if (!selectedPatient || !patients[selectedPatient]?.waveform) {
      return [];
    }

    const waveform = patients[selectedPatient].waveform!;
    let processedData = extractAndProcessMiddleSegment(waveform, 48000);
    processedData = downsample(processedData, 300);

    return processedData.map((value, index) => ({
      time: 30 + (index * 300) / 48000,
      amplitude: value,
    }));
  }, [selectedPatient, patients]);

  return (
    <Paper
      elevation={2}
      sx={{
        flex: 1,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 500,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 2,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis
            dataKey="time"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => Number(value).toFixed(1)}
          >
            <Label value="Time (seconds)" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Amplitude" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip
            formatter={(value: number) => value.toFixed(4)}
            labelFormatter={(label) => `Time: ${Number(label).toFixed(3)}s`}
          />
          <Line
            type="monotone"
            dataKey="amplitude"
            stroke="#2E86AB"
            strokeWidth={2}
            dot={false}
            name="Heartbeat (10-100Hz)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

