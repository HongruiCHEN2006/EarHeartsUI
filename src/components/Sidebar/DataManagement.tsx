import React, { useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Stack, 
  Tooltip 
} from '@mui/material';
import { 
  CloudDownload as ExportIcon, 
  CloudUpload as ImportIcon,
  Description as ReportIcon 
} from '@mui/icons-material';

// 引入你的两个核心 Hook
import { useLanguage } from '../../contexts/LanguageContext';
import { usePatients } from '../../contexts/PatientContext';
import { exportToZip, importFromZip, exportAllPatients } from '../../utils/dataExport';

export const DataManagement: React.FC = () => {
  // 1. 统一使用你喜欢的 t 函数
  const { t } = useLanguage(); 
  const { patients, importAllPatients } = usePatients();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 辅助函数：处理翻译中的 {} 占位符（如果你的 t 函数还没内置这个功能）
  const format = (str: string, val: string | number) => str.replace('{}', String(val));

  const handleExportZip = async () => {
    try {
      await exportToZip(patients);
      // 调用翻译：export_success
      alert(t('export_success'));
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleExportReport = () => {
    if (Object.keys(patients).length === 0) {
      alert(t('no_patients_export'));
      return;
    }
    exportAllPatients(patients);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 调用翻译：confirm_import
    // 这里如果不知道具体人数，可以先简单提示
    if (confirm(t('import_data') + "?")) {
      try {
        await importFromZip(file, (data) => {
          importAllPatients(data);
          alert(t('import_success'));
        });
      } catch (error) {
        console.error('Import failed:', error);
      }
    }
    event.target.value = '';
  };

  return (
    <Box sx={{ p: 2, mt: 'auto' }}>
      {/* 使用 t('data_management') */}
      <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
        {t('data_management')}
      </Typography>
      
      <Stack spacing={1}>
        {/* 导出 ZIP：使用 t('export_all') */}
        <Tooltip title={t('export_all')}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ExportIcon />}
            onClick={handleExportZip}
            size="small"
            color="primary"
          >
            {t('export_all')}
          </Button>
        </Tooltip>

        {/* 导入 ZIP：使用 t('import_data') */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<ImportIcon />}
          onClick={handleImportClick}
          size="small"
        >
          {t('import_data')}
        </Button>

        {/* 导出报告：使用 t('export_patient') */}
        <Button
          variant="text"
          fullWidth
          startIcon={<ReportIcon />}
          onClick={handleExportReport}
          size="small"
          sx={{ fontSize: '0.75rem' }}
        >
          {t('export_patient')}
        </Button>
      </Stack>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip"
        style={{ display: 'none' }}
      />
    </Box>
  );
};