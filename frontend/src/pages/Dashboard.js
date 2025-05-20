import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Event as EventIcon,
  Medication as MedicationIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayVisits: 0,
    todayAppointments: 0,
    todayPrescriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('خطا در دریافت آمار');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        داشبورد
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              کل بیماران
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalPatients}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              ویزیت‌های امروز
            </Typography>
            <Typography component="p" variant="h4">
              {stats.todayVisits}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              نوبت‌های امروز
            </Typography>
            <Typography component="p" variant="h4">
              {stats.todayAppointments}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              نسخه‌های امروز
            </Typography>
            <Typography component="p" variant="h4">
              {stats.todayPrescriptions}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                دسترسی سریع
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate('/patients')}
                    sx={{ mb: 2 }}
                  >
                    لیست بیماران
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<HospitalIcon />}
                    onClick={() => navigate('/triage')}
                    sx={{ mb: 2 }}
                  >
                    تریاژ
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<MedicationIcon />}
                    onClick={() => navigate('/prescription')}
                    sx={{ mb: 2 }}
                  >
                    نسخه
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<EventIcon />}
                    onClick={() => navigate('/appointment')}
                    sx={{ mb: 2 }}
                  >
                    نوبت‌دهی
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ثبت سریع
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/patients/new')}
                    sx={{ mb: 2 }}
                  >
                    ثبت بیمار جدید
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/visits/new')}
                    sx={{ mb: 2 }}
                  >
                    ثبت ویزیت جدید
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 