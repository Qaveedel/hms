import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    national_id: '',
    father_name: '',
    mobile_phone: '',
    landline_phone: '',
    address: '',
    emergency_contact1: '',
    emergency_contact2: '',
    height: '',
    weight: '',
    blood_type: '',
    insurance: '',
    hair_color: '',
    eye_color: '',
    skin_color: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/api/users');
      console.log('Raw API response:', response); // Debug log
      const processedData = response.data.map(patient => ({
        ...patient,
        fullName: `${patient.first_name} ${patient.last_name}`,
      }));
      console.log('Processed patients data:', processedData); // Debug log
      setPatients(processedData);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleClickOpen = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setNewPatient({
        ...patient,
        height: patient.height || '',
        weight: patient.weight || '',
      });
    } else {
      setEditingPatient(null);
      setNewPatient({
        first_name: '',
        last_name: '',
        national_id: '',
        father_name: '',
        mobile_phone: '',
        landline_phone: '',
        address: '',
        emergency_contact1: '',
        emergency_contact2: '',
        height: '',
        weight: '',
        blood_type: '',
        insurance: '',
        hair_color: '',
        eye_color: '',
        skin_color: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPatient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این بیمار اطمینان دارید؟')) {
      try {
        await api.delete(`/api/users/${id}`);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert(error.response?.data?.error || 'Error deleting patient');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const patientData = {
        ...newPatient,
        height: newPatient.height ? parseFloat(newPatient.height) : 0,
        weight: newPatient.weight ? parseFloat(newPatient.weight) : 0,
      };

      if (editingPatient) {
        await api.put(`/api/users/${editingPatient.id}`, patientData);
      } else {
        await api.post('/api/users', patientData);
      }
      
      handleClose();
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
      alert(error.response?.data?.error || 'Error saving patient');
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.national_id.includes(searchTerm)
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, direction: 'rtl' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          لیست بیماران
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleClickOpen()}
          sx={{
            direction: 'rtl',
            '& .MuiButton-startIcon': {
              marginLeft: '8px',
              marginRight: '-4px',
            },
          }}
        >
          افزودن بیمار جدید
        </Button>
      </Box>

      <Box sx={{ mb: 3, direction: 'rtl' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="جستجو بر اساس نام یا کد ملی..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ ml: 1, color: 'text.secondary' }} />,
            dir: 'rtl',
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ direction: 'rtl' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>نام و نام خانوادگی</TableCell>
              <TableCell>کد ملی</TableCell>
              <TableCell>شماره تماس</TableCell>
              <TableCell>گروه خونی</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id || patient.ID}>
                <TableCell>{patient.fullName}</TableCell>
                <TableCell>{patient.national_id}</TableCell>
                <TableCell>{patient.mobile_phone}</TableCell>
                <TableCell>{patient.blood_type}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/patients/${patient.id || patient.ID}`)}
                    sx={{ ml: 1 }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleClickOpen(patient)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(patient.id || patient.ID)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { direction: 'rtl' } }}
      >
        <DialogTitle>
          {editingPatient ? 'ویرایش بیمار' : 'افزودن بیمار جدید'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="نام"
                name="first_name"
                value={newPatient.first_name}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="نام خانوادگی"
                name="last_name"
                value={newPatient.last_name}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="کد ملی"
                name="national_id"
                value={newPatient.national_id}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="نام پدر"
                name="father_name"
                value={newPatient.father_name}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="شماره موبایل"
                name="mobile_phone"
                value={newPatient.mobile_phone}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="شماره ثابت"
                name="landline_phone"
                value={newPatient.landline_phone}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="آدرس"
                name="address"
                value={newPatient.address}
                onChange={handleInputChange}
                multiline
                rows={2}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="شماره تماس اضطراری ۱"
                name="emergency_contact1"
                value={newPatient.emergency_contact1}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="شماره تماس اضطراری ۲"
                name="emergency_contact2"
                value={newPatient.emergency_contact2}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="قد (سانتی‌متر)"
                name="height"
                type="number"
                value={newPatient.height}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="وزن (کیلوگرم)"
                name="weight"
                type="number"
                value={newPatient.weight}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth dir="rtl">
                <InputLabel>گروه خونی</InputLabel>
                <Select
                  name="blood_type"
                  value={newPatient.blood_type}
                  onChange={handleInputChange}
                  label="گروه خونی"
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="نوع بیمه"
                name="insurance"
                value={newPatient.insurance}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="رنگ مو"
                name="hair_color"
                value={newPatient.hair_color}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="رنگ چشم"
                name="eye_color"
                value={newPatient.eye_color}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="رنگ پوست"
                name="skin_color"
                value={newPatient.skin_color}
                onChange={handleInputChange}
                InputProps={{ dir: 'rtl' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ direction: 'rtl' }}>
          <Button onClick={handleClose}>انصراف</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPatient ? 'ویرایش' : 'ذخیره'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PatientList; 