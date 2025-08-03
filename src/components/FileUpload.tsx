import React, { useState } from 'react';
import { Box, Button, Paper, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const FileUpload: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Solo aceptar archivos .docx y solo uno
    const docxFile = files.find(file => file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx'));
    if (docxFile) {
      setUploadedFiles([docxFile]);
      setMessage('');
    } else {
      setUploadedFiles([]);
      setMessage('Solo se permiten archivos .docx');
    }
  };



  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      setMessage('Por favor, seleccione un archivo .docx primero');
      return;
    }

    setIsLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', uploadedFiles[0]); // solo uno

      const response = await fetch('https://eco3.onrender.com/generar_informe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'informe_procesado.docx';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage('Informe generado exitosamente');
      setUploadedFiles([]);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error instanceof Error ?
        `Error: ${error.message}` :
        'Error al generar el informe');
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar mensaje después de 3 segundos
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'primary.light',
          borderRadius: 3,
          p: 8,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'primary.50' : 'background.default',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
            transform: 'translateY(-2px)'
          },
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          type="file"
          id="fileInput"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Arrastra y suelta archivos aquí
        </Typography>
        <Typography variant="body1" color="textSecondary">
          o haz clic para seleccionar
        </Typography>
      </Paper>

      {uploadedFiles.length > 0 && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Archivos seleccionados:
          </Typography>
          {uploadedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 1,
                p: 1,
                borderRadius: 1,
                backgroundColor: 'background.default',
              }}
            >
              <CheckCircleIcon
                sx={{ mr: 1, color: 'success.main' }}
                fontSize="small"
              />
              <Typography variant="body2">{file.name}</Typography>
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={processFiles}
            disabled={isLoading}
            fullWidth
            sx={{ 
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              boxShadow: 2,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 3
              }
            }}
          >
            {isLoading ? 'Procesando...' : 'Procesar Archivos'}
          </Button>
        </Paper>
      )}

      {isLoading && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}



      {message && (
        <Paper sx={{ mt: 2, p: 2 }}>
          {message.includes('Error') ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ErrorIcon sx={{ mr: 1, color: 'error.main' }} />
              <Typography color="error">{message}</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography>{message}</Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default FileUpload;
