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
  FormHelperText,
} from '@mui/material';
import { Search as SearchIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import axios from 'axios';

function Appointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [dateError, setDateError] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    type: 'regular',
    notes: '',
    status: 'scheduled',
  });

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

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
        navigate(`/appointment/${response.data.id || response.data.ID}`);
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
    
    // Clear date error when user changes the date
    if (name === 'date') {
      setDateError('');
    }
    
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDate = () => {
    // Check if date is in the past
    if (appointmentData.date && appointmentData.time) {
      const appointmentDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
      const now = new Date();
      
      if (appointmentDateTime <= now) {
        setDateError('زمان نوبت نمی‌تواند در گذشته باشد');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate date is not in the past
    if (!validateDate()) {
      return;
    }
    
    try {
      const appointmentDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
      
      const response = await axios.post(`http://localhost:8080/api/appointments`, {
        user_id: parseInt(id, 10), // Ensure user_id is sent as a number
        date: appointmentDateTime.toISOString(),
        type: appointmentData.type,
        notes: appointmentData.notes,
        status: 'scheduled',
      });
      
      navigate(`/patients/${id}`);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      setError(error.response?.data?.error || 'خطا در ثبت نوبت');
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
              navigate('/appointment');
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
            جستجو با کد ملی برای نوبت‌دهی
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
              mb: 2,
              height: '50px', 
              borderRadius: 2,
              fontSize: '1rem',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
              boxShadow: '0 4px 6px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #0FAFD8 90%)',
              }
            }}
            startIcon={<SearchIcon />}
          >
            جستجو
          </Button>
          
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/patients/new')}
            sx={{ width: '60%', mt: 2 }}
            startIcon={<PersonAddIcon />}
          >
            ثبت بیمار جدید
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          ثبت نوبت
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
                label="تاریخ"
                name="date"
                type="date"
                value={appointmentData.date}
                onChange={handleInputChange}
                required
                error={!!dateError}
                helperText={dateError}
                InputLabelProps={{
                  shrink: true,
                }}
                // Set minimum date to today
                inputProps={{
                  min: today
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ساعت"
                name="time"
                type="time"
                value={appointmentData.time}
                onChange={handleInputChange}
                required
                error={!!dateError}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>نوع ویزیت</InputLabel>
                <Select
                  name="type"
                  value={appointmentData.type}
                  onChange={handleInputChange}
                  label="نوع ویزیت"
                >
                  <MenuItem value="regular">معمولی</MenuItem>
                  <MenuItem value="follow-up">پیگیری</MenuItem>
                  <MenuItem value="emergency">اورژانس</MenuItem>
                  <MenuItem value="specialist">متخصص</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="توضیحات"
                name="notes"
                value={appointmentData.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/patients/${id}`)}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  ثبت نوبت
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default Appointment; 