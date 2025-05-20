import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import CssBaseline from '@mui/material/CssBaseline';

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

// Create RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  direction: 'rtl',
});

function App() {
  return (
    <CacheProvider value={cacheRtl}>
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
    </CacheProvider>
  );
}

export default App; 