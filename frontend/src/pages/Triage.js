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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Triage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [triageData, setTriageData] = useState({
    heart_rate: '',
    blood_pressure: '',
    temperature: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    pain_level: '',
    symptoms: '',
    priority_level: 'normal',
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError('خطا در دریافت اطلاعات بیمار');
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
        navigate(`/triage/${response.data.id || response.data.ID}`);
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
    setTriageData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert string values to appropriate types
      const formattedTriageData = {
        heart_rate: parseInt(triageData.heart_rate, 10),
        blood_pressure: triageData.blood_pressure,
        temperature: parseFloat(triageData.temperature),
        respiratory_rate: parseInt(triageData.respiratory_rate, 10),
        oxygen_saturation: parseInt(triageData.oxygen_saturation, 10),
        pain_level: parseInt(triageData.pain_level, 10),
        symptoms: triageData.symptoms,
        priority_level: triageData.priority_level
      };

      await axios.post(`http://localhost:8080/api/visits`, {
        user_id: parseInt(id, 10), // Ensure user_id is a number
        type: 'triage',
        triage_data: formattedTriageData,
        date: new Date().toISOString(),
      });
      
      navigate(`/patients/${id}`);
    } catch (error) {
      console.error('Error submitting triage:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      setError('خطا در ثبت تریاژ');
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
              navigate('/triage');
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
            sx={{ 
              backgroundColor: '#1976d2',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
              }
            }}
          >
            جستجو
          </Button>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/patients')}
            >
              افزودن بیمار جدید
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // If patient data is loaded, show triage form
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          تریاژ
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          بیمار: {patient.first_name} {patient.last_name}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          کد ملی: {patient.national_id}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ضربان قلب"
                name="heart_rate"
                type="number"
                value={triageData.heart_rate}
                onChange={handleInputChange}
                required
                InputProps={{
                  endAdornment: <Typography variant="caption">ضربه در دقیقه</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="فشار خون"
                name="blood_pressure"
                value={triageData.blood_pressure}
                onChange={handleInputChange}
                required
                placeholder="مثال: 120/80"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="دمای بدن"
                name="temperature"
                type="number"
                value={triageData.temperature}
                onChange={handleInputChange}
                required
                InputProps={{
                  endAdornment: <Typography variant="caption">درجه سانتی‌گراد</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="تعداد تنفس"
                name="respiratory_rate"
                type="number"
                value={triageData.respiratory_rate}
                onChange={handleInputChange}
                required
                InputProps={{
                  endAdornment: <Typography variant="caption">تنفس در دقیقه</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="اشباع اکسیژن"
                name="oxygen_saturation"
                type="number"
                value={triageData.oxygen_saturation}
                onChange={handleInputChange}
                required
                InputProps={{
                  endAdornment: <Typography variant="caption">درصد</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="سطح درد"
                name="pain_level"
                type="number"
                value={triageData.pain_level}
                onChange={handleInputChange}
                required
                inputProps={{
                  min: 0,
                  max: 10,
                }}
                InputProps={{
                  endAdornment: <Typography variant="caption">از ۱۰</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="علائم"
                name="symptoms"
                value={triageData.symptoms}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>سطح اولویت</InputLabel>
                <Select
                  name="priority_level"
                  value={triageData.priority_level}
                  onChange={handleInputChange}
                  label="سطح اولویت"
                >
                  <MenuItem value="critical">بحرانی</MenuItem>
                  <MenuItem value="urgent">فوری</MenuItem>
                  <MenuItem value="normal">عادی</MenuItem>
                  <MenuItem value="non-urgent">غیر فوری</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setPatient(null);
                    setNationalId('');
                    navigate('/triage');
                  }}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  ثبت تریاژ
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default Triage; 