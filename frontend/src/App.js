import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';

// Theme
import { ThemeProvider as AppThemeProvider } from './theme/ThemeContext';
import { useTheme } from './theme/ThemeContext';
import { getTheme, cacheRtl } from './theme/ThemeConfig';

// Layout
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientDetails from './pages/PatientDetails';
import Triage from './pages/Triage';
import DoctorVisit from './pages/DoctorVisit';
import Prescription from './pages/Prescription';
import Appointment from './pages/Appointment';

// Theme wrapper to apply the theme based on the context
function ThemedApp() {
  const { darkMode } = useTheme();
  const theme = getTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/triage" element={<Triage />} />
            <Route path="/triage/:id" element={<Triage />} />
            <Route path="/doctor-visit" element={<DoctorVisit />} />
            <Route path="/doctor-visit/:id" element={<DoctorVisit />} />
            <Route path="/prescription" element={<Prescription />} />
            <Route path="/prescription/:id" element={<Prescription />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/appointment/:id" element={<Appointment />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <AppThemeProvider>
        <ThemedApp />
      </AppThemeProvider>
    </CacheProvider>
  );
}

export default App; 