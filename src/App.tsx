import React from 'react';
import { Container, AppBar, Toolbar, Typography, Box, ThemeProvider, createTheme, CssBaseline, Paper } from '@mui/material';
import FileUpload from './components/FileUpload';
import { blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Informes de Cardiología
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', backgroundColor: 'white' }}>
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 3
                }}
              >
                Generador de Informes
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4,
                  color: 'text.secondary',
                  fontSize: '1.1rem'
                }}
              >
                Suba los archivos del ecodoppler para generar el informe automáticamente
              </Typography>
              <FileUpload />
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
