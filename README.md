# Heart Audio Recorder - React TypeScript Application

A modern React TypeScript application for recording and analyzing heart sounds, featuring patient management, audio signal processing, and multi-language support.

## Features

- **Patient Management**: Add, edit, delete, and manage patient information
- **Audio Recording**: 60-second heart sound recording with real-time timer
- **Signal Processing**: Advanced digital signal processing with bandpass filtering (10-100Hz)
- **Waveform Visualization**: Interactive chart display using Recharts
- **Doctor's Notes**: Save and manage clinical observations for each patient
- **Data Import/Export**: Export patient data as medical reports (TXT) and JSON backups
- **Multi-language Support**: English and German (Deutsch)
- **Data Persistence**: LocalStorage for patient data across sessions

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI)** for modern UI components
- **Recharts** for data visualization
- **Context API** for state management
- **MediaRecorder API** for audio recording

## Project Structure

```
src/
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
├── contexts/
│   ├── PatientContext.tsx    # Patient data & state management
│   └── LanguageContext.tsx   # Internationalization
├── components/
│   ├── Sidebar/
│   │   ├── Sidebar.tsx       # Main sidebar container
│   │   ├── PatientList.tsx   # Patient list with status indicators
│   │   ├── PatientInfo.tsx   # Patient information form
│   │   └── DataManagement.tsx # Import/Export controls
│   ├── MainPanel/
│   │   ├── MainPanel.tsx     # Main content container
│   │   ├── RecordingControls.tsx # Audio recording controls
│   │   ├── WaveformChart.tsx # Heart sound waveform chart
│   │   └── NotesSection.tsx  # Doctor's notes editor
│   └── Modals/
│       ├── AddPatientModal.tsx # New patient dialog
│       └── ConfirmationModal.tsx # Unsaved changes warning
├── hooks/
│   ├── useAudioRecorder.ts   # Audio recording hook
│   └── useLocalStorage.ts    # LocalStorage sync hook
├── utils/
│   ├── audioProcessing.ts    # Signal processing utilities
│   └── dataExport.ts         # Export/import utilities
├── types/
│   └── index.ts              # TypeScript type definitions
└── i18n/
    └── translations.ts       # Language translations
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Adding a Patient

1. Click "Add Patient" button in the sidebar
2. Enter patient name (required), age, and sex
3. Click "Add Patient" to save

### Recording Heart Sounds

1. Select a patient from the list
2. Click "Start Recording" button
3. Recording automatically stops after 60 seconds
4. Audio file is automatically downloaded
5. Waveform is displayed in the chart

### Managing Notes

1. Select a patient
2. Enter clinical observations in the notes section
3. Click "Save Notes" to persist changes
4. Notes status indicator shows saved/modified state

### Exporting Data

- **Export Patient**: Export current patient's data as TXT report and JSON backup
- **Export All**: Export all patients as combined report and JSON backup

### Importing Data

1. Click "Import Data"
2. Select a JSON backup file
3. Confirm import (will merge with existing data)

## Audio Processing Pipeline

The application uses advanced signal processing techniques:

1. **DC Offset Removal**: Centers the signal around zero
2. **Zero-Phase Bandpass Filter**: 10-100Hz range for heart sounds
3. **Hanning Window**: Reduces edge artifacts
4. **Segment Extraction**: Analyzes 30-40 second segment (10 seconds displayed)
5. **Downsampling**: Reduces data points for efficient visualization

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari (with getUserMedia support)

**Note**: Requires HTTPS or localhost for microphone access.

## LocalStorage Data

Patient data (excluding audio waveforms) is automatically saved to browser LocalStorage:
- Patient information (name, age, sex)
- Doctor's notes
- Recording timestamps
- Last modified dates

## Migrated from Original HTML

This application is a complete refactor of the original standalone HTML file, now built with:
- Modern React architecture with TypeScript
- Component-based design
- Context API for state management
- Material-UI for consistent design system
- Recharts for improved data visualization
- Better code organization and maintainability

## License

ISC

## Author

Heart Audio Recorder Development Team

