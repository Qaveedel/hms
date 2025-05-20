import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';

function DoctorVisit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastTriage, setLastTriage] = useState(null);
  const [visitData, setVisitData] = useState({
    diagnosis: '',
  });

  useEffect(() => {
    if (id && id !== 'undefined') {
      setLoading(true);
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${id}`);
      setPatient(response.data);
      fetchLatestTriage(id);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError('خطا در دریافت اطلاعات بیمار');
      setLoading(false);
    }
  };

  const fetchLatestTriage = async (userId) => {
    try {
      if (userId && userId !== 'undefined') {
        const response = await axios.get(`http://localhost:8080/api/triage/user/${userId}/latest`);
        setLastTriage(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching latest triage:', error);
      setLoading(false);
    }
  };

  const searchByNationalId = async () => {
    if (!nationalId.trim()) {
      setError('لطفا کد ملی را وارد کنید');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`http://localhost:8080/api/users/national-id/${nationalId}`);
      if (response.data && (response.data.id || response.data.ID)) {
        navigate(`/doctor-visit/${response.data.id || response.data.ID}`);
      } else {
        setError('بیمار با این کد ملی یافت نشد');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error searching by national ID:', error);
      setError('بیمار با این کد ملی یافت نشد');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (navigateToPrescription = false) => {
    if (!visitData.diagnosis.trim()) {
      setError('لطفا تشخیص را وارد کنید');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`http://localhost:8080/api/visits`, {
        user_id: parseInt(id, 10),
        type: 'doctor_visit',
        doctor_report: visitData,
        date: new Date().toISOString(),
      });
      
      if (navigateToPrescription) {
        navigate(`/prescription/${id}`);
      } else {
        // Show success message or navigate back to patient details
        navigate(`/patients/${id}`);
      }
    } catch (error) {
      console.error('Error submitting visit:', error);
      setError('خطا در ثبت ویزیت');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => {
              setError('');
              setNationalId('');
              navigate('/doctor-visit');
            }}
          >
            بازگشت
          </Button>
        </Box>
      </Box>
    );
  }

  // If no patient is loaded, show the National ID search interface
  if (!patient) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)'
      }}>
        <Paper sx={{ 
          p: 4,
          width: '90%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 3,
          borderRadius: 2
        }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            جستجو با کد ملی
          </Typography>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="کد ملی بیمار را وارد کنید..."
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            sx={{ mb: 3 }}
            inputProps={{ style: { textAlign: 'center' } }}
          />
          
          <Button 
            variant="contained"
            fullWidth
            size="large"
            onClick={searchByNationalId}
          >
            جستجو
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Patient Info Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          ویزیت پزشک
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          بیمار: {patient.first_name} {patient.last_name}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          کد ملی: {patient.national_id}
        </Typography>
      </Paper>

      {/* TRIAGE DATA SECTION - Displayed prominently at the top */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#f9f9ff', border: '1px solid #e0e0ff' }}>
        <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #3f51b5', pb: 1, color: '#3f51b5' }}>
          اطلاعات تریاژ بیمار
        </Typography>

        {lastTriage ? (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={1} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    علائم حیاتی
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">ضربان قلب:</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lastTriage.heart_rate} ضربه در دقیقه
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">فشار خون:</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lastTriage.blood_pressure}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">دمای بدن:</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lastTriage.temperature} درجه
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={1} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    وضعیت تنفسی
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">تعداد تنفس:</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lastTriage.respiratory_rate} تنفس در دقیقه
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">اشباع اکسیژن:</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lastTriage.oxygen_saturation}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">سطح درد:</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lastTriage.pain_level} از ۱۰
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={1} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    وضعیت اولویت
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">سطح اولویت:</Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{
                        color: lastTriage.priority_level === 'critical' ? 'error.main' : 
                               lastTriage.priority_level === 'urgent' ? 'warning.main' : 
                               lastTriage.priority_level === 'normal' ? 'success.main' : 'info.main'
                      }}
                    >
                      {lastTriage.priority_level === 'critical' ? 'بحرانی' : 
                       lastTriage.priority_level === 'urgent' ? 'فوری' : 
                       lastTriage.priority_level === 'normal' ? 'عادی' : 'غیر فوری'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    علائم و نشانه‌ها
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Typography variant="body1">
                    {lastTriage.symptoms}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">اطلاعات تریاژ برای این بیمار یافت نشد.</Alert>
        )}
        
        {lastTriage && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            تاریخ تریاژ: {new Date(lastTriage.created_at).toLocaleString('fa-IR')}
          </Typography>
        )}
      </Paper>

      {/* DIAGNOSIS SECTION - Clearly below the triage data */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #4caf50', pb: 1, color: '#2e7d32' }}>
          تشخیص پزشک
        </Typography>
        
        <TextField
          fullWidth
          label="تشخیص"
          name="diagnosis"
          value={visitData.diagnosis}
          onChange={handleInputChange}
          multiline
          rows={6}
          required
          inputProps={{ dir: 'rtl' }}
          sx={{ mb: 3, mt: 2 }}
          placeholder="لطفا تشخیص خود را اینجا وارد کنید..."
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setPatient(null);
              setNationalId('');
              navigate('/doctor-visit');
            }}
          >
            انصراف
          </Button>
          
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSave(false)}
              sx={{ ml: 1 }}
            >
              ذخیره
            </Button>
            
            <Button
              variant="contained"
              color="success"
              onClick={() => handleSave(true)}
              sx={{ ml: 1 }}
            >
              ذخیره و تجویز دارو
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default DoctorVisit; 