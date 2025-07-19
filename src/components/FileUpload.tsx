import React, { useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const FileUpload: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const processFiles = async () => {
    try {
      // TODO: Replace with production backend URL
      // const response = await fetch('http://localhost:5001/api/hello', {
      //   method: 'POST',
      // });
      // const data = await response.json();
      // setMessage(data.message);
      setMessage('Backend en construcción');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al procesar los archivos');
    }
  };

  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoading(true);
    setMessage('');
    const fileNames = Array.from(files).map(file => file.name);
    setUploadedFiles(fileNames);

    try {
      setMessage('Archivos cargados exitosamente. Haga clic en Procesar para continuar.');
    } catch (error) {
      setMessage('Error al generar el informe. Por favor intente nuevamente.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const items = e.dataTransfer.items;
    if (items) {
      const fileInput = document.getElementById('folder-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.files = e.dataTransfer.files;
        handleFolderUpload({ target: fileInput } as any);
      }
    }
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <input
        type="file"
        id="folder-upload"
        multiple
        // @ts-ignore - webkitdirectory is a non-standard attribute
        webkitdirectory=""
        style={{ display: 'none' }}
        onChange={handleFolderUpload}
      />
      <Paper
        elevation={0}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 6,
          backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            borderColor: 'primary.main',
          },
        }}
      >
        <label htmlFor="folder-upload" style={{ cursor: 'pointer' }}>
          <Box sx={{ mb: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          </Box>
          {!isLoading && !message && (
            <>
              <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
                Arrastre la carpeta aquí o haga clic para seleccionar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Se procesarán todos los archivos de ecodoppler contenidos en la carpeta
              </Typography>
            </>
          )}
          {isLoading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress size={32} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Procesando {uploadedFiles.length} archivos...
              </Typography>
            </Box>
          )}
        </label>
      </Paper>
      
      {message && (
        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            borderRadius: 2,
            backgroundColor: message.includes('Error') ? 'error.main' : 'success.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          {message.includes('Error') ? (
            <ErrorIcon />
          ) : (
            <CheckCircleIcon />
          )}
          <Typography>
            {message}
          </Typography>
        </Box>
      )}

      {(uploadedFiles.length > 0 || message) && !isLoading && (
        <Box sx={{ mt: 3, textAlign: 'left' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Archivos seleccionados ({uploadedFiles.length}):
          </Typography>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
            {uploadedFiles.slice(0, 3).map((file, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                {file}
              </Typography>
            ))}
            {uploadedFiles.length > 3 && (
              <Typography variant="body2" color="text.secondary">
                ...y {uploadedFiles.length - 3} archivos más
              </Typography>
            )}
          </Paper>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={processFiles}
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              Procesar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
