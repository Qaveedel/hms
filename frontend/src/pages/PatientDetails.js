import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tabs,
  Tab,
  Alert,
  Chip,
  Avatar,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocalHospital as HospitalIcon,
  Event as EventIcon,
  Medication as MedicationIcon,
  Description as DescriptionIcon,
  HistoryEdu as HistoryEduIcon,
  ContactMail as ContactMailIcon,
  FitnessCenter as FitnessCenterIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  AccessibilityNew as AccessibilityIcon,
  MonitorHeart as HeartIcon,
  VaccinesOutlined as AllergyIcon,
  MedicalInformation as MedicalInfoIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  CloudUpload as UploadIcon,
  ZoomIn as ZoomInIcon,
  Surgery as SurgeryIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// First, add some sample medical images data to use
const SAMPLE_MEDICAL_IMAGES = [
  {
    id: 1,
    user_id: 3,
    image_url: "https://tinyurl.com/samplexray1",
    description: "رادیوگرافی قفسه سینه - نمای جانبی",
    center_name: "بیمارستان شهید بهشتی",
    date: "2024-12-15",
    created_at: "2024-12-15T10:30:00Z"
  },
  {
    id: 2, 
    user_id: 3,
    image_url: "https://tinyurl.com/samplemri1",
    description: "MRI مغز - نمای عرضی",
    center_name: "کلینیک تخصصی تصویربرداری مهر",
    date: "2024-11-05",
    created_at: "2024-11-05T14:45:00Z"
  },
  {
    id: 3,
    user_id: 3,
    image_url: "https://tinyurl.com/sampleultrasound1",
    description: "سونوگرافی شکم و لگن",
    center_name: "درمانگاه امام رضا",
    date: "2024-10-22",
    created_at: "2024-10-22T09:15:00Z"
  }
];

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [hereditaryDiseases, setHereditaryDiseases] = useState([]);
  const [disabilities, setDisabilities] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [chronicConditions, setChronicConditions] = useState([]);
  const [medicalImages, setMedicalImages] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogData, setDialogData] = useState({});

  // Add state for file upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    console.log('Fetching data for patient ID:', id);
    
    if (!id) {
      console.error('No patient ID provided');
      setError('شناسه بیمار نامعتبر است');
      return;
    }

    try {
      const patientRes = await axios.get(`http://localhost:8080/api/users/${id}`);
      console.log('Patient data received:', patientRes.data);
      setPatient(patientRes.data);

      try {
        const [
          visitsRes, 
          prescriptionsRes, 
          appointmentsRes,
          hereditaryDiseasesRes,
          disabilitiesRes,
          allergiesRes,
          chronicConditionsRes,
          medicalImagesRes,
          surgeriesRes
        ] = await Promise.allSettled([
          axios.get(`http://localhost:8080/api/visits/user/${id}`),
          axios.get(`http://localhost:8080/api/prescriptions/user/${id}`),
          axios.get(`http://localhost:8080/api/appointments/user/${id}`),
          axios.get(`http://localhost:8080/api/hereditary-diseases/user/${id}`),
          axios.get(`http://localhost:8080/api/disabilities/user/${id}`),
          axios.get(`http://localhost:8080/api/allergies/user/${id}`),
          axios.get(`http://localhost:8080/api/chronic-conditions/user/${id}`),
          axios.get(`http://localhost:8080/api/medical-images/user/${id}`),
          axios.get(`http://localhost:8080/api/surgeries/user/${id}`),
        ]);

        if (visitsRes.status === 'fulfilled') {
          setVisits(visitsRes.value.data);
        } else {
          console.warn('Failed to fetch visits:', visitsRes.reason);
          setVisits([]);
        }

        if (prescriptionsRes.status === 'fulfilled') {
          setPrescriptions(prescriptionsRes.value.data);
        } else {
          console.warn('Failed to fetch prescriptions:', prescriptionsRes.reason);
          setPrescriptions([]);
        }

        if (appointmentsRes.status === 'fulfilled') {
          setAppointments(appointmentsRes.value.data);
        } else {
          console.warn('Failed to fetch appointments:', appointmentsRes.reason);
          setAppointments([]);
        }
        
        // New feature data
        if (hereditaryDiseasesRes.status === 'fulfilled') {
          setHereditaryDiseases(hereditaryDiseasesRes.value.data);
        } else {
          console.warn('Failed to fetch hereditary diseases:', hereditaryDiseasesRes.reason);
          setHereditaryDiseases([]);
        }
        
        if (disabilitiesRes.status === 'fulfilled') {
          setDisabilities(disabilitiesRes.value.data);
        } else {
          console.warn('Failed to fetch disabilities:', disabilitiesRes.reason);
          setDisabilities([]);
        }
        
        if (allergiesRes.status === 'fulfilled') {
          setAllergies(allergiesRes.value.data);
        } else {
          console.warn('Failed to fetch allergies:', allergiesRes.reason);
          setAllergies([]);
        }
        
        if (chronicConditionsRes.status === 'fulfilled') {
          setChronicConditions(chronicConditionsRes.value.data);
        } else {
          console.warn('Failed to fetch chronic conditions:', chronicConditionsRes.reason);
          setChronicConditions([]);
        }
        
        if (medicalImagesRes.status === 'fulfilled') {
          setMedicalImages(medicalImagesRes.value.data);
        } else {
          console.warn('Failed to fetch medical images:', medicalImagesRes.reason);
          setMedicalImages([]);
        }
        
        if (surgeriesRes.status === 'fulfilled') {
          setSurgeries(surgeriesRes.value.data);
        } else {
          console.warn('Failed to fetch surgeries:', surgeriesRes.reason);
          setSurgeries([]);
        }
      } catch (error) {
        console.warn('Error fetching additional data:', error);
      }

      // After all the data is fetched, add sample medical images if none exist
      setTimeout(() => {
        if (medicalImages.length === 0) {
          setMedicalImages(SAMPLE_MEDICAL_IMAGES);
        }
      }, 1000);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      if (error.response?.status === 404) {
        setError('بیمار یافت نشد');
      } else {
        setError('خطا در دریافت اطلاعات بیمار. لطفا دوباره تلاش کنید.');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Dialog handlers
  const openDialog = (type, data = {}) => {
    setDialogType(type);
    setDialogData({ ...data, user_id: parseInt(id) });
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
    setDialogData({});
  };
  
  const handleDialogInputChange = (e) => {
    const { name, value } = e.target;
    setDialogData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add function to handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setDialogData(prev => ({ ...prev, file_name: file.name }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Modify the dialog submit function to handle file uploads
  const handleDialogSubmit = async () => {
    try {
      let endpoint = '';
      let updateFunction;
      let data = { ...dialogData };
      
      switch(dialogType) {
        case 'hereditary-disease':
          endpoint = '/api/hereditary-diseases';
          updateFunction = setHereditaryDiseases;
          break;
        case 'disability':
          endpoint = '/api/disabilities';
          updateFunction = setDisabilities;
          break;
        case 'allergy':
          endpoint = '/api/allergies';
          updateFunction = setAllergies;
          break;
        case 'chronic-condition':
          endpoint = '/api/chronic-conditions';
          updateFunction = setChronicConditions;
          break;
        case 'medical-image':
          endpoint = '/api/medical-images';
          updateFunction = setMedicalImages;
          // Handle file upload for medical images
          if (uploadedFile) {
            // In a real application, you would upload the file to the server
            // For now, we'll just simulate by storing the file name
            data.image_url = URL.createObjectURL(uploadedFile); // This creates a temporary URL for the file
          }
          break;
        case 'surgery':
          endpoint = '/api/surgeries';
          updateFunction = setSurgeries;
          break;
        default:
          closeDialog();
          return;
      }

      let response;
      
      if (dialogData.id) {
        // Update existing record
        response = await axios.put(`http://localhost:8080${endpoint}/${dialogData.id}`, data);
        
        if (updateFunction) {
          updateFunction(prev => 
            prev.map(item => item.id === dialogData.id ? response.data : item)
          );
        }
      } else {
        // Create new record
        response = await axios.post(`http://localhost:8080${endpoint}`, data);
        
        if (updateFunction) {
          updateFunction(prev => [...prev, response.data]);
        }
      }
      
      // Reset file upload state
      setUploadedFile(null);
      setImagePreview('');
      
      closeDialog();
    } catch (error) {
      console.error('Error submitting data:', error);
      // You could show an error message here
    }
  };
  
  const handleDelete = async (type, id) => {
    if (!window.confirm('آیا از حذف این مورد اطمینان دارید؟')) {
      return;
    }
    
    try {
      let endpoint = '';
      let updateFunction;
      
      switch(type) {
        case 'hereditary-disease':
          endpoint = '/api/hereditary-diseases';
          updateFunction = setHereditaryDiseases;
          break;
        case 'disability':
          endpoint = '/api/disabilities';
          updateFunction = setDisabilities;
          break;
        case 'allergy':
          endpoint = '/api/allergies';
          updateFunction = setAllergies;
          break;
        case 'chronic-condition':
          endpoint = '/api/chronic-conditions';
          updateFunction = setChronicConditions;
          break;
        case 'medical-image':
          endpoint = '/api/medical-images';
          updateFunction = setMedicalImages;
          break;
        case 'surgery':
          endpoint = '/api/surgeries';
          updateFunction = setSurgeries;
          break;
        default:
          throw new Error('Invalid type');
      }
      
      await axios.delete(`http://localhost:8080${endpoint}/${id}`);
      updateFunction(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
      setError('خطا در حذف اطلاعات');
    }
  };

  // Render dialog content based on type
  const renderDialogContent = () => {
    switch(dialogType) {
      case 'hereditary-disease':
        return (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="نام بیماری"
              name="name"
              value={dialogData.name || ''}
              onChange={handleDialogInputChange}
              required
            />
          </>
        );
        
      case 'disability':
        return (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="نام معلولیت"
              name="name"
              value={dialogData.name || ''}
              onChange={handleDialogInputChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>نوع</InputLabel>
              <Select
                name="type"
                value={dialogData.type || 'disability'}
                label="نوع"
                onChange={handleDialogInputChange}
              >
                <MenuItem value="disability">معلولیت</MenuItem>
                <MenuItem value="impairment">نقص عضو</MenuItem>
              </Select>
            </FormControl>
          </>
        );
        
      case 'allergy':
        return (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="نام آلرژی"
              name="name"
              value={dialogData.name || ''}
              onChange={handleDialogInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="واکنش"
              name="reaction"
              value={dialogData.reaction || ''}
              onChange={handleDialogInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>شدت</InputLabel>
              <Select
                name="severity"
                value={dialogData.severity || 'mild'}
                label="شدت"
                onChange={handleDialogInputChange}
              >
                <MenuItem value="mild">خفیف</MenuItem>
                <MenuItem value="moderate">متوسط</MenuItem>
                <MenuItem value="severe">شدید</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="تشخیص"
              name="diagnosis"
              value={dialogData.diagnosis || ''}
              onChange={handleDialogInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="تاریخ تشخیص"
              name="diagnosis_date"
              type="datetime-local"
              value={dialogData.diagnosis_date || ''}
              onChange={handleDialogInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="نکات درمانی"
              name="treatment_notes"
              multiline
              rows={3}
              value={dialogData.treatment_notes || ''}
              onChange={handleDialogInputChange}
            />
          </>
        );
        
      case 'chronic-condition':
        return (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="نام بیماری مزمن"
              name="name"
              value={dialogData.name || ''}
              onChange={handleDialogInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="تشخیص"
              name="diagnosis"
              value={dialogData.diagnosis || ''}
              onChange={handleDialogInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="تاریخ تشخیص"
              name="diagnosis_date"
              type="datetime-local"
              value={dialogData.diagnosis_date || ''}
              onChange={handleDialogInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="داروها"
              name="medications"
              value={dialogData.medications || ''}
              onChange={handleDialogInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="نکات درمانی"
              name="treatment_notes"
              multiline
              rows={3}
              value={dialogData.treatment_notes || ''}
              onChange={handleDialogInputChange}
            />
          </>
        );
        
      case 'medical-image':
        return (
          <>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              {imagePreview ? (
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 300, mx: 'auto' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }} 
                  />
                  <IconButton 
                    sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.7)' }}
                    size="small"
                    onClick={() => {
                      setUploadedFile(null);
                      setImagePreview('');
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<UploadIcon />}
                  sx={{ mb: 2 }}
                >
                  انتخاب فایل تصویر
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                </Button>
              )}
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="توضیحات"
              name="description"
              value={dialogData.description || ''}
              onChange={handleDialogInputChange}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              margin="normal"
              label="نام مرکز"
              name="center_name"
              value={dialogData.center_name || ''}
              onChange={handleDialogInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="تاریخ و زمان"
              name="date"
              type="datetime-local"
              value={dialogData.date || ''}
              onChange={handleDialogInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </>
        );
        
      case 'surgery':
        return (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="نام عمل جراحی"
              name="name"
              value={dialogData.name || ''}
              onChange={handleDialogInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="تاریخ و زمان عمل"
              name="date"
              type="datetime-local"
              value={dialogData.date || ''}
              onChange={handleDialogInputChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="توضیحات"
              name="description"
              multiline
              rows={3}
              value={dialogData.description || ''}
              onChange={handleDialogInputChange}
            />
          </>
        );
        
      default:
        return <Typography>لطفا نوع صحیحی انتخاب کنید</Typography>;
    }
  };
  
  const getDialogTitle = () => {
    const action = dialogData.id ? 'ویرایش' : 'افزودن';
    
    switch(dialogType) {
      case 'hereditary-disease':
        return `${action} بیماری وراثتی`;
      case 'disability':
        return `${action} معلولیت`;
      case 'allergy':
        return `${action} آلرژی`;
      case 'chronic-condition':
        return `${action} بیماری مزمن`;
      case 'medical-image':
        return `${action} تصویر پزشکی`;
      case 'surgery':
        return `${action} عمل جراحی`;
      default:
        return 'فرم';
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!patient) {
    return <Typography>در حال بارگذاری...</Typography>;
  }

  return (
    <Box sx={{ 
      p: 3,
      background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
      minHeight: '100vh',
      color: '#333'
    }}>
      {/* Top Section: Patient Basic Info */}
      <Paper sx={{ 
        p: 3,
        mb: 4,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '15px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        direction: 'rtl'
      }}>
        {/* Placeholder for Patient Photo */}
        <Avatar sx={{ width: 80, height: 80, bgcolor: '#00bcd4', ml: 3, flexShrink: 0 }}>
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, overflowWrap: 'break-word' }}>
            {patient.first_name} {patient.last_name}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#555', overflowWrap: 'break-word' }}>
            کد ملی: {patient.national_id}
          </Typography>
        </Box>
      </Paper>

      {/* Three Column Layout */}
      <Grid container spacing={3} direction="row-reverse">

        {/* Right Column: Actions and Quick Info */}
        <Grid item xs={12} md={4}>
          {/* Action buttons section */}
          <Paper sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            direction: 'rtl'
          }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HospitalIcon sx={{ ml: 1 }} /> عملیات و دسترسی سریع
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/triage/${id}`)}
              startIcon={<DescriptionIcon />}
              fullWidth
              sx={{ mb: 1.5, justifyContent: 'flex-start' }}
            >
              ثبت تریاژ
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/doctor-visit/${id}`)}
              startIcon={<HistoryEduIcon />}
              fullWidth
              sx={{ mb: 1.5, justifyContent: 'flex-start' }}
            >
              ثبت ویزیت پزشک
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/prescription/${id}`)}
              startIcon={<MedicationIcon />}
              fullWidth
              sx={{ mb: 1.5, justifyContent: 'flex-start' }}
            >
              ثبت نسخه
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/appointment/${id}`)}
              startIcon={<EventIcon />}
              fullWidth
              sx={{ mb: 1.5, justifyContent: 'flex-start' }}
            >
              نوبت‌دهی
            </Button>
          </Paper>

          {/* Recent Visits section */}
          <Paper sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            mb: 3,
            direction: 'rtl'
          }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HistoryEduIcon sx={{ ml: 1 }} color="primary" /> مراجعات اخیر
            </Typography>
            
            {visits.length === 0 ? (
              <Typography align="center" color="text.secondary">مراجعه‌ای ثبت نشده است</Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {visits
                  .sort((a, b) => new Date(b.date || b.Date || b.created_at || b.CreatedAt) - new Date(a.date || a.Date || a.created_at || a.CreatedAt))
                  .slice(0, 3)
                  .map((visit, index) => (
                    <ListItem key={visit.id || visit.ID || index} sx={{ px: 0, py: 1 }}>
                      <Box sx={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', p: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          {visit.type === 'triage' ? <DescriptionIcon fontSize="small" sx={{ ml: 1, color: 'info.main' }} /> :
                           visit.type === 'doctor_visit' ? <HistoryEduIcon fontSize="small" sx={{ ml: 1, color: 'success.main' }} /> :
                           <MedicationIcon fontSize="small" sx={{ ml: 1, color: 'warning.main' }} />}
                          <Typography variant="subtitle2">
                            {visit.type === 'triage' ? 'تریاژ' : 
                             visit.type === 'doctor_visit' ? 'ویزیت پزشک' : 
                             visit.type === 'prescription' ? 'نسخه‌نویسی' : 
                             'مراجعه'} - {new Date(visit.date || visit.Date || visit.created_at || visit.CreatedAt).toLocaleDateString('fa-IR')}
                          </Typography>
                        </Box>
                        
                        {/* Enhanced triage data display */}
                        {visit.TriageData && (
                          <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              <strong>علائم:</strong> {visit.TriageData.symptoms || visit.TriageData.Symptoms || '-'}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                              <Chip 
                                size="small" 
                                label={`دما: ${visit.TriageData.temperature || visit.TriageData.Temperature}°C`} 
                                color="info"
                                variant="outlined"
                              />
                              <Chip 
                                size="small" 
                                label={`ضربان: ${visit.TriageData.heart_rate || visit.TriageData.HeartRate}`} 
                                color="info"
                                variant="outlined"
                              />
                              <Chip 
                                size="small" 
                                label={`فشار خون: ${visit.TriageData.blood_pressure || visit.TriageData.BloodPressure}`} 
                                color="info"
                                variant="outlined"
                              />
                              <Chip 
                                size="small" 
                                label={
                                  (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'critical' ? 'اولویت: بحرانی' : 
                                  (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'urgent' ? 'اولویت: فوری' : 
                                  'اولویت: عادی'
                                }
                                color={
                                  (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'critical' ? 'error' : 
                                  (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'urgent' ? 'warning' : 
                                  'success'
                                }
                              />
                            </Box>
                          </>
                        )}
                        
                        {/* Enhanced doctor report display */}
                        {visit.DoctorReport && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: '500' }}>
                              <strong>تشخیص:</strong> {visit.DoctorReport.diagnosis || visit.DoctorReport.Diagnosis || '-'}
                            </Typography>
                            {(visit.DoctorReport.notes || visit.DoctorReport.Notes) && (
                              <Typography variant="body2" color="text.secondary" noWrap>
                                <strong>توضیحات:</strong> {visit.DoctorReport.notes || visit.DoctorReport.Notes}
                              </Typography>
                            )}
                            {visit.DoctorReport.follow_up_date && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>پیگیری:</strong> {visit.DoctorReport.follow_up_date}
                              </Typography>
                            )}
                          </Box>
                        )}
                        
                        <Button 
                          size="small" 
                          sx={{ mt: 0.5, fontSize: '0.7rem' }}
                          onClick={() => {
                            setActiveTab(7);
                          }}
                        >
                          مشاهده جزئیات
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
              </List>
            )}
            
            {visits.length > 0 && (
              <Box sx={{ mt: 1, textAlign: 'left' }}>
                <Button 
                  size="small" 
                  onClick={() => setActiveTab(7)}
                  sx={{ fontSize: '0.75rem' }}
                >
                  مشاهده همه
                </Button>
              </Box>
            )}
          </Paper>

          {/* Recent Prescriptions section */}
          <Paper sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            mb: 3,
            direction: 'rtl'
          }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MedicationIcon sx={{ ml: 1 }} color="primary" /> نسخه‌های اخیر
            </Typography>
            
            {prescriptions.length === 0 ? (
              <Typography align="center" color="text.secondary">نسخه‌ای ثبت نشده است</Typography>
            ) : (
              <List sx={{ p: 0 }}>
                {prescriptions
                  .sort((a, b) => new Date(b.created_at || b.CreatedAt) - new Date(a.created_at || a.CreatedAt))
                  .slice(0, 3)
                  .map((prescription, index) => (
                    <ListItem key={prescription.id || prescription.ID || index} sx={{ px: 0, py: 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <AssignmentIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle2">
                            نسخه {index + 1} - {new Date(prescription.created_at || prescription.CreatedAt).toLocaleDateString('fa-IR')}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          پزشک: {prescription.doctor_name || 'نامشخص'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          تعداد داروها: {(prescription.items || []).length || '0'}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
              </List>
            )}
            
            {prescriptions.length > 0 && (
              <Box sx={{ mt: 1, textAlign: 'left' }}>
                <Button 
                  size="small" 
                  onClick={() => setActiveTab(9)}
                  sx={{ fontSize: '0.75rem' }}
                >
                  مشاهده همه
                </Button>
              </Box>
            )}
          </Paper>
          
          {/* Medical Conditions Summary */}
          <Paper sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            direction: 'rtl'
          }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MedicalInfoIcon sx={{ ml: 1 }} /> خلاصه سوابق پزشکی
            </Typography>
            
            {allergies.length > 0 && (
              <Alert severity="warning" variant="filled" sx={{ mb: 2, direction: 'rtl', textAlign: 'right' }}>
                <Typography variant="body2">
                  <strong>آلرژی‌ها:</strong> {allergies.map(a => a.name).join('، ')}
                </Typography>
              </Alert>
            )}
            
            {chronicConditions.length > 0 && (
              <Alert severity="info" sx={{ mb: 2, direction: 'rtl', textAlign: 'right' }}>
                <Typography variant="body2">
                  <strong>بیماری‌های مزمن:</strong> {chronicConditions.map(c => c.name).join('، ')}
                </Typography>
              </Alert>
            )}
            
            {hereditaryDiseases.length > 0 && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>بیماری‌های وراثتی:</strong> {hereditaryDiseases.map(d => d.name).join('، ')}
              </Typography>
            )}
            
            {disabilities.length > 0 && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>معلولیت‌ها:</strong> {disabilities.map(d => d.name).join('، ')}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Middle and Left Columns */}
        <Grid item xs={12} md={8}>
          {/* Main patient info tabs */}
          <Paper sx={{ 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': { 
                  fontSize: '0.85rem',
                  fontWeight: 'medium',
                  px: { xs: 1, sm: 2 },
                }
              }}
            >
              <Tab label="اطلاعات فردی" />
              <Tab label="بیماری‌های وراثتی" />
              <Tab label="بیماری‌های مزمن" />
              <Tab label="معلولیت‌ها" />
              <Tab label="آلرژی‌ها" />
              <Tab label="تصاویر پزشکی" />
              <Tab label="سوابق جراحی" />
              <Tab label="سوابق مراجعات" />
              <Tab label="نوبت‌ها" />
              <Tab label="نسخه‌ها" />
            </Tabs>
            
            {/* Personal Information Tab */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">نام</Typography>
                  <Typography variant="body1">{patient.first_name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">نام خانوادگی</Typography>
                  <Typography variant="body1">{patient.last_name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">نام پدر</Typography>
                  <Typography variant="body1">{patient.father_name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">کد ملی</Typography>
                  <Typography variant="body1">{patient.national_id || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">تلفن همراه</Typography>
                  <Typography variant="body1">{patient.mobile_phone || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">تلفن ثابت</Typography>
                  <Typography variant="body1">{patient.landline_phone || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">قد</Typography>
                  <Typography variant="body1">{patient.height ? `${patient.height} سانتی‌متر` : '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">وزن</Typography>
                  <Typography variant="body1">{patient.weight ? `${patient.weight} کیلوگرم` : '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">گروه خونی</Typography>
                  <Typography variant="body1">{patient.blood_type || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">بیمه</Typography>
                  <Typography variant="body1">{patient.insurance || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">آدرس</Typography>
                  <Typography variant="body1">{patient.address || '-'}</Typography>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Hereditary Diseases Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => openDialog('hereditary-disease')}
                >
                  افزودن بیماری وراثتی
                </Button>
              </Box>
              
              {hereditaryDiseases.length === 0 ? (
                <Typography align="center" color="text.secondary">اطلاعاتی ثبت نشده است</Typography>
              ) : (
                <List>
                  {hereditaryDiseases.map((disease) => (
                    <ListItem 
                      key={disease.id} 
                      divider
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" aria-label="edit" onClick={() => openDialog('hereditary-disease', disease)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete('hereditary-disease', disease.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText 
                        primary={disease.name}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>
            
            {/* Chronic Conditions Tab */}
            <TabPanel value={activeTab} index={2}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => openDialog('chronic-condition')}
                >
                  افزودن بیماری مزمن
                </Button>
              </Box>
              
              {chronicConditions.length === 0 ? (
                <Typography align="center" color="text.secondary">اطلاعاتی ثبت نشده است</Typography>
              ) : (
                <Grid container spacing={2}>
                  {chronicConditions.map((condition) => (
                    <Grid item xs={12} key={condition.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" gutterBottom>
                              {condition.name}
                            </Typography>
                            <Box>
                              <IconButton size="small" onClick={() => openDialog('chronic-condition', condition)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDelete('chronic-condition', condition.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>تشخیص:</strong> {condition.diagnosis || 'ثبت نشده'}
                          </Typography>
                          
                          {condition.diagnosis_date && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>تاریخ تشخیص:</strong> {condition.diagnosis_date}
                            </Typography>
                          )}
                          
                          {condition.medications && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>داروها:</strong> {condition.medications}
                            </Typography>
                          )}
                          
                          {condition.treatment_notes && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>نکات درمانی:</strong> {condition.treatment_notes}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
            
            {/* Disabilities Tab */}
            <TabPanel value={activeTab} index={3}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => openDialog('disability')}
                >
                  افزودن معلولیت
                </Button>
              </Box>
              
              {disabilities.length === 0 ? (
                <Typography align="center" color="text.secondary">اطلاعاتی ثبت نشده است</Typography>
              ) : (
                <List>
                  {disabilities.map((disability) => (
                    <ListItem 
                      key={disability.id} 
                      divider
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" aria-label="edit" onClick={() => openDialog('disability', disability)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDelete('disability', disability.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText 
                        primary={disability.name}
                        secondary={disability.type === 'disability' ? 'معلولیت' : 'نقص عضو'}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>
            
            {/* Allergies Tab */}
            <TabPanel value={activeTab} index={4}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => openDialog('allergy')}
                >
                  افزودن آلرژی
                </Button>
              </Box>
              
              {allergies.length === 0 ? (
                <Typography align="center" color="text.secondary">اطلاعاتی ثبت نشده است</Typography>
              ) : (
                <Grid container spacing={2}>
                  {allergies.map((allergy) => (
                    <Grid item xs={12} sm={6} md={4} key={allergy.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" gutterBottom>
                              {allergy.name}
                            </Typography>
                            <Box>
                              <IconButton size="small" onClick={() => openDialog('allergy', allergy)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDelete('allergy', allergy.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          <Chip 
                            label={allergy.severity === 'severe' ? 'شدید' : allergy.severity === 'moderate' ? 'متوسط' : 'خفیف'} 
                            color={allergy.severity === 'severe' ? 'error' : allergy.severity === 'moderate' ? 'warning' : 'success'}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          
                          {allergy.reaction && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              <strong>واکنش:</strong> {allergy.reaction}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
            
            {/* Medical Images Tab - Enhanced to display as records */}
            <TabPanel value={activeTab} index={5}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => openDialog('medical-image')}
                >
                  افزودن تصویر پزشکی
                </Button>
              </Box>
              
              {medicalImages.length === 0 ? (
                <Typography align="center" color="text.secondary">اطلاعاتی ثبت نشده است</Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>تصویر</TableCell>
                        <TableCell>توضیحات</TableCell>
                        <TableCell>مرکز تصویربرداری</TableCell>
                        <TableCell>تاریخ</TableCell>
                        <TableCell>عملیات</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {medicalImages.map((image) => (
                        <TableRow key={image.id || image.ID}>
                          <TableCell>
                            <Box sx={{ width: 100, height: 70, position: 'relative' }}>
                              {image.image_url ? (
                                <img
                                  src={image.image_url}
                                  alt={image.description || 'تصویر پزشکی'}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                    borderRadius: '4px'
                                  }}
                                />
                              ) : (
                                <Box 
                                  sx={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    bgcolor: '#f5f5f5',
                                    borderRadius: '4px' 
                                  }}
                                >
                                  <ImageIcon color="disabled" />
                                </Box>
                              )}
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  position: 'absolute', 
                                  top: -8, 
                                  right: -8, 
                                  bgcolor: '#fff',
                                  boxShadow: 1,
                                  '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                                onClick={() => {
                                  window.open(image.image_url, '_blank');
                                }}
                              >
                                <ZoomInIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>{image.description || '-'}</TableCell>
                          <TableCell>{image.center_name || '-'}</TableCell>
                          <TableCell>{image.date || (image.created_at && new Date(image.created_at).toLocaleDateString('fa-IR')) || '-'}</TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => openDialog('medical-image', image)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete('medical-image', image.id || image.ID)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
            
            {/* NEW TAB: Visit History */}
            <TabPanel value={activeTab} index={7}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">سوابق مراجعات بیمار</Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/triage/${id}`)}
                >
                  ثبت مراجعه جدید
                </Button>
              </Box>
              
              {visits.length === 0 ? (
                <Typography align="center" color="text.secondary">سابقه مراجعه‌ای ثبت نشده است</Typography>
              ) : (
                <Box>
                  {visits
                    .sort((a, b) => new Date(b.date || b.Date || b.created_at || b.CreatedAt) - new Date(a.date || a.Date || a.created_at || a.CreatedAt))
                    .map((visit, index) => (
                      <Accordion key={visit.id || visit.ID || index} sx={{ mb: 1 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`visit-content-${index}`}
                          id={`visit-header-${index}`}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <Typography variant="subtitle1" sx={{ 
                                color: visit.type === 'triage' ? 'info.main' : 
                                        visit.type === 'doctor_visit' ? 'success.main' : 'warning.main',
                                fontWeight: 'bold'
                              }}>
                                {visit.type === 'triage' ? 'تریاژ' : 
                                 visit.type === 'doctor_visit' ? 'ویزیت پزشک' : 
                                 visit.type === 'prescription' ? 'نسخه‌نویسی' : 
                                 'مراجعه'}
                              </Typography>
                              <Typography variant="subtitle2" color="text.secondary">
                                {new Date(visit.date || visit.Date || visit.created_at || visit.CreatedAt).toLocaleDateString('fa-IR')}
                              </Typography>
                            </Box>
                            
                            {/* Enhanced summary showing triage data */}
                            {visit.TriageData && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>علائم:</strong> {visit.TriageData.symptoms || visit.TriageData.Symptoms || '-'}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                  <Chip 
                                    size="small" 
                                    label={`دما: ${visit.TriageData.temperature || visit.TriageData.Temperature}°C`} 
                                    color="info"
                                    variant="outlined"
                                  />
                                  <Chip 
                                    size="small" 
                                    label={`ضربان: ${visit.TriageData.heart_rate || visit.TriageData.HeartRate}`} 
                                    color="info"
                                    variant="outlined"
                                  />
                                  <Chip 
                                    size="small" 
                                    label={`فشار خون: ${visit.TriageData.blood_pressure || visit.TriageData.BloodPressure}`} 
                                    color="info"
                                    variant="outlined"
                                  />
                                  <Chip 
                                    size="small" 
                                    label={
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'critical' ? 'اولویت: بحرانی' : 
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'urgent' ? 'اولویت: فوری' : 
                                      'اولویت: عادی'
                                    }
                                    color={
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'critical' ? 'error' : 
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'urgent' ? 'warning' : 
                                      'success'
                                    }
                                  />
                                </Box>
                              </Box>
                            )}
                            
                            {/* Enhanced summary showing doctor's diagnosis */}
                            {visit.DoctorReport && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.primary" sx={{ fontWeight: '500' }}>
                                  <strong>تشخیص:</strong> {visit.DoctorReport.diagnosis || visit.DoctorReport.Diagnosis || '-'}
                                </Typography>
                                {(visit.DoctorReport.notes || visit.DoctorReport.Notes) && (
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    <strong>توضیحات:</strong> {visit.DoctorReport.notes || visit.DoctorReport.Notes}
                                  </Typography>
                                )}
                                {visit.DoctorReport.follow_up_date && (
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>پیگیری:</strong> {visit.DoctorReport.follow_up_date}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            {visit.TriageData && (
                              <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>اطلاعات تریاژ</Typography>
                                    <Grid container spacing={1}>
                                      <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">ضربان قلب:</Typography>
                                        <Typography variant="body1">{visit.TriageData.heart_rate || visit.TriageData.HeartRate} bpm</Typography>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">فشار خون:</Typography>
                                        <Typography variant="body1">{visit.TriageData.blood_pressure || visit.TriageData.BloodPressure}</Typography>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">دمای بدن:</Typography>
                                        <Typography variant="body1">{visit.TriageData.temperature || visit.TriageData.Temperature} °C</Typography>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">اشباع اکسیژن:</Typography>
                                        <Typography variant="body1">{visit.TriageData.oxygen_saturation || visit.TriageData.OxygenSaturation}%</Typography>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">سطح درد:</Typography>
                                        <Typography variant="body1">{visit.TriageData.pain_level || visit.TriageData.PainLevel} از 10</Typography>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">تعداد تنفس:</Typography>
                                        <Typography variant="body1">{visit.TriageData.respiratory_rate || visit.TriageData.RespiratoryRate} در دقیقه</Typography>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">علائم:</Typography>
                                        <Typography variant="body1">{visit.TriageData.symptoms || visit.TriageData.Symptoms || '-'}</Typography>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">اولویت:</Typography>
                                        <Chip 
                                          size="small"
                                          label={
                                            (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'critical' ? 'بحرانی' : 
                                            (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'urgent' ? 'فوری' : 
                                            (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'normal' ? 'عادی' : 'غیر فوری'
                                          }
                                          color={
                                            (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'critical' ? 'error' : 
                                            (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'urgent' ? 'warning' : 
                                            (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'normal' ? 'success' : 'info'
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                  </CardContent>
                                </Card>
                              </Grid>
                            )}
                            
                            {visit.DoctorReport && (
                              <Grid item xs={12} md={visit.TriageData ? 6 : 12}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="subtitle1" color="primary" gutterBottom>تشخیص پزشک</Typography>
                                    <Typography variant="body1" paragraph>
                                      {visit.DoctorReport.diagnosis || visit.DoctorReport.Diagnosis}
                                    </Typography>
                                    
                                    {(visit.DoctorReport.notes || visit.DoctorReport.Notes) && (
                                      <>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>توضیحات:</Typography>
                                        <Typography variant="body1" paragraph>
                                          {visit.DoctorReport.notes || visit.DoctorReport.Notes}
                                        </Typography>
                                      </>
                                    )}
                                    
                                    {visit.DoctorReport.recommendations && (
                                      <>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>توصیه‌ها:</Typography>
                                        <Typography variant="body1" paragraph>
                                          {visit.DoctorReport.recommendations}
                                        </Typography>
                                      </>
                                    )}
                                    
                                    {visit.DoctorReport.follow_up_date && (
                                      <>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>تاریخ پیگیری:</Typography>
                                        <Typography variant="body1">
                                          {visit.DoctorReport.follow_up_date}
                                        </Typography>
                                      </>
                                    )}
                                  </CardContent>
                                </Card>
                              </Grid>
                            )}
                          </Grid>
                          
                          {visit.visit_id || visit.VisitID ? (
                            <Box sx={{ mt: 2, textAlign: 'left' }}>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => setActiveTab(9)} // Navigate to prescriptions tab
                              >
                                مشاهده نسخه مرتبط
                              </Button>
                            </Box>
                          ) : null}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                </Box>
              )}
            </TabPanel>
            
            {/* NEW TAB: Appointments */}
            <TabPanel value={activeTab} index={8}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">نوبت‌های بیمار</Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/appointment/${id}`)}
                >
                  ثبت نوبت جدید
                </Button>
              </Box>
              
              {appointments.length === 0 ? (
                <Typography align="center" color="text.secondary">نوبتی ثبت نشده است</Typography>
              ) : (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main' }}>
                    نوبت‌های آینده
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>تاریخ</TableCell>
                          <TableCell>ساعت</TableCell>
                          <TableCell>نوع نوبت</TableCell>
                          <TableCell>توضیحات</TableCell>
                          <TableCell>وضعیت</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {appointments
                          .filter(app => new Date(app.date || app.Date) > new Date())
                          .sort((a, b) => new Date(a.date || a.Date) - new Date(b.date || b.Date))
                          .map((appointment) => (
                            <TableRow key={appointment.id || appointment.ID}>
                              <TableCell>
                                {new Date(appointment.date || appointment.Date).toLocaleDateString('fa-IR')}
                              </TableCell>
                              <TableCell>
                                {new Date(appointment.date || appointment.Date).toLocaleTimeString('fa-IR', {
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </TableCell>
                              <TableCell>{appointment.type || appointment.Type || 'ویزیت'}</TableCell>
                              <TableCell>{appointment.description || appointment.Description || '-'}</TableCell>
                              <TableCell>
                                <Chip 
                                  size="small"
                                  label={appointment.status === 'scheduled' ? 'برنامه‌ریزی شده' : 
                                        appointment.status === 'completed' ? 'انجام شده' : 
                                        appointment.status === 'cancelled' ? 'لغو شده' : 'در انتظار'}
                                  color={appointment.status === 'scheduled' ? 'primary' : 
                                        appointment.status === 'completed' ? 'success' : 
                                        appointment.status === 'cancelled' ? 'error' : 'default'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="subtitle1" sx={{ mb: 2, color: 'primary.main' }}>
                    نوبت‌های گذشته
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>تاریخ</TableCell>
                          <TableCell>ساعت</TableCell>
                          <TableCell>نوع نوبت</TableCell>
                          <TableCell>توضیحات</TableCell>
                          <TableCell>وضعیت</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {appointments
                          .filter(app => new Date(app.date || app.Date) <= new Date())
                          .sort((a, b) => new Date(b.date || b.Date) - new Date(a.date || a.Date))
                          .map((appointment) => (
                            <TableRow key={appointment.id || appointment.ID}>
                              <TableCell>
                                {new Date(appointment.date || appointment.Date).toLocaleDateString('fa-IR')}
                              </TableCell>
                              <TableCell>
                                {new Date(appointment.date || appointment.Date).toLocaleTimeString('fa-IR', {
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </TableCell>
                              <TableCell>{appointment.type || appointment.Type || 'ویزیت'}</TableCell>
                              <TableCell>{appointment.description || appointment.Description || '-'}</TableCell>
                              <TableCell>
                                <Chip 
                                  size="small"
                                  label={appointment.status === 'scheduled' ? 'برنامه‌ریزی شده' : 
                                        appointment.status === 'completed' ? 'انجام شده' : 
                                        appointment.status === 'cancelled' ? 'لغو شده' : 'در انتظار'}
                                  color={appointment.status === 'scheduled' ? 'primary' : 
                                        appointment.status === 'completed' ? 'success' : 
                                        appointment.status === 'cancelled' ? 'error' : 'default'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </TabPanel>
            
            {/* NEW TAB: Prescriptions */}
            <TabPanel value={activeTab} index={9}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">نسخه‌های دارویی بیمار</Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/prescription/${id}`)}
                >
                  ثبت نسخه جدید
                </Button>
              </Box>
              
              {prescriptions.length === 0 ? (
                <Typography align="center" color="text.secondary">نسخه‌ای ثبت نشده است</Typography>
              ) : (
                <Box>
                  {prescriptions
                    .sort((a, b) => new Date(b.created_at || b.CreatedAt) - new Date(a.created_at || a.CreatedAt))
                    .map((prescription, index) => (
                      <Card key={prescription.id || prescription.ID || index} sx={{ mb: 3 }} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">
                              نسخه شماره {index + 1}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(prescription.created_at || prescription.CreatedAt).toLocaleDateString('fa-IR')}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              پزشک: {prescription.doctor_name || prescription.DoctorName || 'نامشخص'}
                            </Typography>
                            
                            {prescription.notes && (
                              <Typography variant="body2">
                                توضیحات: {prescription.notes || prescription.Notes}
                              </Typography>
                            )}
                          </Box>
                          
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>داروهای تجویز شده</Typography>
                          
                          {/* Check for medications in all possible locations */}
                          {(prescription.items?.length > 0 || prescription.Items?.length > 0 || prescription.medications?.length > 0 || prescription.Medications?.length > 0) ? (
                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>نام دارو</TableCell>
                                    <TableCell>مقدار</TableCell>
                                    <TableCell>دستورالعمل</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {/* Try all possible medication data structures */}
                                  {(prescription.items || prescription.Items || prescription.medications || prescription.Medications || []).map((item, idx) => {
                                    // Extract medication data regardless of structure
                                    const med = item.medication || item.Medication || item;
                                    const genericName = med.generic_name || med.GenericName || item.generic_name || item.GenericName || 'نامشخص';
                                    const brandName = med.brand_name || med.BrandName || item.brand_name || item.BrandName || '';
                                    const dosage = item.dosage || item.Dosage || med.dosage || med.Dosage || '-';
                                    const frequency = item.frequency || item.Frequency || med.frequency || med.Frequency || '';
                                    const instructions = item.instructions || item.Instructions || med.instructions || med.Instructions || '-';
                                    
                                    return (
                                      <TableRow key={idx}>
                                        <TableCell>
                                          {brandName ? `${brandName} (${genericName})` : genericName}
                                        </TableCell>
                                        <TableCell>
                                          {dosage} 
                                          {frequency ? ` (${frequency})` : ''}
                                        </TableCell>
                                        <TableCell>{instructions}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Alert severity="info">داروها در ساختار متفاوتی ذخیره شده‌اند و نمایش داده نمی‌شوند.</Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog for adding/editing medical conditions */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogContent>
          {renderDialogContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="inherit">انصراف</Button>
          <Button onClick={handleDialogSubmit} color="primary" variant="contained">ذخیره</Button>
        </DialogActions>
      </Dialog>

      {/* Add a dedicated visits section at the bottom of the entire page */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ 
          p: 3, 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '15px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
              <HistoryEduIcon sx={{ mr: 1 }} /> سوابق مراجعات بیمار
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/triage/${id}`)}
            >
              ثبت مراجعه جدید
            </Button>
          </Box>
          
          {visits.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>هیچ سابقه مراجعه‌ای برای این بیمار ثبت نشده است.</Alert>
          ) : (
            visits
              .sort((a, b) => new Date(b.date || b.Date || b.created_at || b.CreatedAt) - new Date(a.date || a.Date || a.created_at || a.CreatedAt))
              .map((visit, index) => (
                <Accordion key={visit.id || visit.ID || index} sx={{ mb: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`visit-content-${index}`}
                    id={`visit-header-${index}`}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ 
                          color: visit.type === 'triage' ? 'info.main' : 
                                  visit.type === 'doctor_visit' ? 'success.main' : 'warning.main',
                          fontWeight: 'bold'
                        }}>
                          {visit.type === 'triage' ? 'تریاژ' : 
                                   visit.type === 'doctor_visit' ? 'ویزیت پزشک' : 
                                   visit.type === 'prescription' ? 'نسخه‌نویسی' : 
                                   'مراجعه'}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          {new Date(visit.date || visit.Date || visit.created_at || visit.CreatedAt).toLocaleDateString('fa-IR')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
                        {visit.TriageData?.symptoms || visit.TriageData?.Symptoms || 
                         visit.DoctorReport?.diagnosis || visit.DoctorReport?.Diagnosis || 
                         'بدون جزئیات'}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {visit.TriageData && (
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" color="primary" gutterBottom>اطلاعات تریاژ</Typography>
                              <Grid container spacing={1}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">ضربان قلب:</Typography>
                                  <Typography variant="body1">{visit.TriageData.heart_rate || visit.TriageData.HeartRate} bpm</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">فشار خون:</Typography>
                                  <Typography variant="body1">{visit.TriageData.blood_pressure || visit.TriageData.BloodPressure}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">دمای بدن:</Typography>
                                  <Typography variant="body1">{visit.TriageData.temperature || visit.TriageData.Temperature} °C</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">اشباع اکسیژن:</Typography>
                                  <Typography variant="body1">{visit.TriageData.oxygen_saturation || visit.TriageData.OxygenSaturation}%</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">سطح درد:</Typography>
                                  <Typography variant="body1">{visit.TriageData.pain_level || visit.TriageData.PainLevel} از 10</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" color="text.secondary">تعداد تنفس:</Typography>
                                  <Typography variant="body1">{visit.TriageData.respiratory_rate || visit.TriageData.RespiratoryRate} در دقیقه</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="text.secondary">علائم:</Typography>
                                  <Typography variant="body1">{visit.TriageData.symptoms || visit.TriageData.Symptoms || '-'}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="text.secondary">اولویت:</Typography>
                                  <Chip 
                                    size="small"
                                    label={
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'critical' ? 'بحرانی' : 
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'urgent' ? 'فوری' : 
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'normal' ? 'عادی' : 'غیر فوری'
                                    }
                                    color={
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'critical' ? 'error' : 
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'urgent' ? 'warning' : 
                                      (visit.TriageData.priority_level || visit.TriageData.PriorityLevel) === 'normal' ? 'success' : 'info'
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                      
                      {visit.DoctorReport && (
                        <Grid item xs={12} md={visit.TriageData ? 6 : 12}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" color="primary" gutterBottom>تشخیص پزشک</Typography>
                              <Typography variant="body1" paragraph>
                                {visit.DoctorReport.diagnosis || visit.DoctorReport.Diagnosis}
                              </Typography>
                              
                              {(visit.DoctorReport.notes || visit.DoctorReport.Notes) && (
                                <>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>توضیحات:</Typography>
                                  <Typography variant="body1" paragraph>
                                    {visit.DoctorReport.notes || visit.DoctorReport.Notes}
                                  </Typography>
                                </>
                              )}
                              
                              {visit.DoctorReport.recommendations && (
                                <>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>توصیه‌ها:</Typography>
                                  <Typography variant="body1" paragraph>
                                    {visit.DoctorReport.recommendations}
                                  </Typography>
                                </>
                              )}
                              
                              {visit.DoctorReport.follow_up_date && (
                                <>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>تاریخ پیگیری:</Typography>
                                  <Typography variant="body1">
                                    {visit.DoctorReport.follow_up_date}
                                  </Typography>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                    
                    {visit.visit_id || visit.VisitID ? (
                      <Box sx={{ mt: 2, textAlign: 'left' }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => setActiveTab(9)} // Navigate to prescriptions tab
                        >
                          مشاهده نسخه مرتبط
                        </Button>
                      </Box>
                    ) : null}
                  </AccordionDetails>
                </Accordion>
              ))
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default PatientDetails; 