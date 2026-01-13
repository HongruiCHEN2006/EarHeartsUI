import React, { useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Divider, 
  Stack,
  Tooltip
} from '@mui/material';
import { 
  CloudDownload as ExportIcon, 
  CloudUpload as ImportIcon,
  Description as ReportIcon 
} from '@mui/icons-material';
import { usePatients } from '../../contexts/PatientContext';
import { exportToZip, importFromZip, exportAllPatients } from '../../utils/dataExport';

export const DataManagement: React.FC = () => {
  const { patients, importAllPatients } = usePatients();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 处理：导出完整备份 (.zip) ---
  const handleExportZip = async () => {
    try {
      await exportToZip(patients);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出备份失败，请检查控制台。');
    }
  };

  // --- 处理：导出文字报告 (.txt + .json) ---
  const handleExportReport = () => {
    exportAllPatients(patients);
  };

  // --- 处理：导入备份 ---
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (window.confirm('导入备份将覆盖当前所有数据，确定要继续吗？')) {
      try {
        await importFromZip(file, (data) => {
          importAllPatients(data);
          alert('✅ 数据恢复成功！');
        });
      } catch (error) {
        console.error('导入失败:', error);
        alert('导入失败：文件格式不正确或已损坏。');
      }
    }
    // 清空 input，防止无法连续选择同一个文件
    event.target.value = '';
  };

  return (
    <Box sx={{ p: 2, mt: 'auto' }}>
      <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
        数据管理
      </Typography>
      
      <Stack spacing={1}>
        {/* 导出 ZIP 按钮 */}
        <Tooltip title="包含患者信息和波形录音">
          <Button
            variant="contained"
            fullWidth
            startIcon={<ExportIcon />}
            onClick={handleExportZip}
            size="small"
          >
            导出完整备份
          </Button>
        </Tooltip>

        {/* 导入 ZIP 按钮 */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<ImportIcon />}
          onClick={handleImportClick}
          size="small"
        >
          恢复备份文件
        </Button>

        {/* 仅导出报告 */}
        <Button
          variant="text"
          fullWidth
          startIcon={<ReportIcon />}
          onClick={handleExportReport}
          size="small"
          sx={{ fontSize: '0.75rem' }}
        >
          导出文字报告
        </Button>
      </Stack>

      {/* 隐藏的上传控件 */}
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