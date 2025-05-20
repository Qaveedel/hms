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
  ListItemIcon,
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
  MedicalServices as SurgeryIcon,
  AddAPhoto as AddAPhotoIcon,
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

  // Update state to include user profile photo
  const [profilePhoto, setProfilePhoto] = useState(null);

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
      
      // Set profile photo if available - ensure we check all possible property names
      if (patientRes.data.profile_photo) {
        setProfilePhoto(patientRes.data.profile_photo);
        console.log('Profile photo URL loaded:', patientRes.data.profile_photo);
      } else if (patientRes.data.profilePhoto) {
        setProfilePhoto(patientRes.data.profilePhoto);
        console.log('Profile photo URL loaded (from profilePhoto):', patientRes.data.profilePhoto);
      } else if (patientRes.data.photo) {
        setProfilePhoto(patientRes.data.photo);
        console.log('Profile photo URL loaded (from photo):', patientRes.data.photo);
      } else {
        console.log('No profile photo found in patient data');
      }

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
    
    if (type === 'patient-info') {
      setDialogData({ ...patient });
    } else {
      setDialogData({ ...data, user_id: parseInt(id) });
    }
    
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
      let imageData = null;
      
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
          
          // If there's a photo uploaded with the surgery, create a medical image record as well
          if (uploadedFile) {
            const imageUrl = URL.createObjectURL(uploadedFile);
            data.image_url = imageUrl; // Add image URL to surgery data
            
            // Save image data to create a medical image after surgery record is created
            imageData = {
              user_id: parseInt(id),
              image_url: imageUrl,
              description: `تصویر مرتبط با جراحی: ${data.name}`,
              center_name: data.center_name || 'نامشخص',
              date: data.date,
              related_record_type: 'surgery',
              related_record_id: data.id || null // Will be updated for new records
            };
          }
          break;
        case 'patient-info':
          endpoint = '/api/users';
          updateFunction = setPatient;
          
          // Sanitize insurance field to ensure it's a valid value
          if (data.insurance && 
              data.insurance !== 'بیمه ایران' && 
              data.insurance !== 'بیمه آسیا' && 
              data.insurance !== 'بیمه پاسارگاد') {
            data.insurance = ''; // Reset to empty if invalid
          }
          
          // Handle profile photo if updated
          if (data.photo_file) {
            // In a real app, you'd upload the file to server
            // For now, just update the URL
            data.profile_photo = data.profile_photo || URL.createObjectURL(data.photo_file);
            
            // Update the profile photo state
            setProfilePhoto(data.profile_photo);
            
            // Remove the file object before sending to API
            delete data.photo_file;
          }
          break;
        default:
          closeDialog();
          return;
      }

      let response;
      
      if (data.id || dialogType === 'patient-info') {
        // Handle ID properly when updating - remove ID to prevent sending duplicate key in SQL
        const dataId = data.id || id;
        
        // For patient info updates, ensure we're using PUT to update the user
        if (dialogType === 'patient-info') {
          console.log('Updating patient info with ID:', dataId);
          try {
            response = await axios.put(`http://localhost:8080${endpoint}/${dataId}`, data);
            // Update local state with the returned data
            const updatedPatient = response.data;
            
            // Make sure profile photo is preserved
            if (data.profile_photo && !updatedPatient.profile_photo) {
              updatedPatient.profile_photo = data.profile_photo;
            }
            
            setPatient(updatedPatient);
            setProfilePhoto(updatedPatient.profile_photo);
            console.log('Patient info updated successfully:', updatedPatient);
          } catch (updateError) {
            console.error('Error updating patient info:', updateError);
            throw updateError;
          }
        } else if (dialogType === 'surgery') {
          const { id, ...dataToUpdate } = data;
          // Update existing record
          response = await axios.put(`http://localhost:8080${endpoint}/${dataId}`, dataToUpdate);
        } else {
          // Update existing record
          response = await axios.put(`http://localhost:8080${endpoint}/${dataId}`, data);
        }
        
        if (updateFunction && dialogType !== 'patient-info') {
          updateFunction(prev => 
            prev.map(item => item.id === dataId ? response.data : item)
          );
        }
        
        // If this is a surgery with an image, add or update related medical image
        if (dialogType === 'surgery' && imageData) {
          imageData.related_record_id = dataId;
          const imageResponse = await axios.post(`http://localhost:8080/api/medical-images`, imageData);
          setMedicalImages(prev => [...prev, imageResponse.data]);
        }
      } else {
        // Create new record
        response = await axios.post(`http://localhost:8080${endpoint}`, data);
        
        if (updateFunction) {
          updateFunction(prev => [...prev, response.data]);
        }
        
        // If this is a surgery with an image, create related medical image
        if (dialogType === 'surgery' && imageData) {
          imageData.related_record_id = response.data.id;
          const imageResponse = await axios.post(`http://localhost:8080/api/medical-images`, imageData);
          setMedicalImages(prev => [...prev, imageResponse.data]);
        }
      }
      
      // Reset file upload state
      setUploadedFile(null);
      setImagePreview('');
      
      closeDialog();
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.');
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
            <FormControl fullWidth margin="normal">
              <InputLabel>مرتبط با</InputLabel>
              <Select
                name="related_record_type"
                value={dialogData.related_record_type || ''}
                label="مرتبط با"
                onChange={handleDialogInputChange}
              >
                <MenuItem value="">بدون ارتباط</MenuItem>
                <MenuItem value="surgery">جراحی</MenuItem>
                <MenuItem value="visit">ویزیت</MenuItem>
              </Select>
            </FormControl>
            
            {dialogData.related_record_type === 'surgery' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>انتخاب جراحی</InputLabel>
                <Select
                  name="related_record_id"
                  value={dialogData.related_record_id || ''}
                  label="انتخاب جراحی"
                  onChange={handleDialogInputChange}
                >
                  {surgeries.map(surgery => (
                    <MenuItem key={surgery.id} value={surgery.id}>
                      {surgery.name} - {formatDate(surgery.date)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            {dialogData.related_record_type === 'visit' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>انتخاب ویزیت</InputLabel>
                <Select
                  name="related_record_id"
                  value={dialogData.related_record_id || ''}
                  label="انتخاب ویزیت"
                  onChange={handleDialogInputChange}
                >
                  {visits.map((visit, index) => (
                    <MenuItem key={visit.id || visit.ID || index} value={visit.id || visit.ID || index}>
                      {visit.type === 'triage' ? 'تریاژ' : 
                       visit.type === 'doctor_visit' ? 'ویزیت پزشک' : 
                       'ویزیت'} - {formatDate(visit.date || visit.Date || visit.created_at || visit.CreatedAt)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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
            <TextField
              fullWidth
              margin="normal"
              label="مرکز درمانی"
              name="center_name"
              value={dialogData.center_name || ''}
              onChange={handleDialogInputChange}
            />
            
            {/* Add photo upload option for surgeries */}
            <Box sx={{ mt: 3, mb: 2, border: '1px dashed #ccc', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                تصویر مرتبط با جراحی
              </Typography>
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
                    انتخاب تصویر جراحی
                    <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                  </Button>
                )}
              </Box>
            </Box>
          </>
        );
        
      case 'patient-info':
        return (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle2" gutterBottom>عکس پروفایل</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Avatar
                      sx={{
                        width: 100, 
                        height: 100, 
                        mb: 2,
                        bgcolor: dialogData.profile_photo ? 'transparent' : '#00bcd4'
                      }}
                      src={dialogData.profile_photo || profilePhoto}
                    >
                      {!dialogData.profile_photo && !profilePhoto && <PersonIcon sx={{ fontSize: 50 }} />}
                    </Avatar>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<UploadIcon />}
                    >
                      انتخاب عکس پروفایل
                      <VisuallyHiddenInput type="file" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const photoUrl = URL.createObjectURL(file);
                          setDialogData({
                            ...dialogData,
                            profile_photo: photoUrl,
                            photo_file: file
                          });
                        }
                      }} />
                    </Button>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="نام"
                  name="first_name"
                  value={dialogData.first_name || ''}
                  onChange={handleDialogInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="نام خانوادگی"
                  name="last_name"
                  value={dialogData.last_name || ''}
                  onChange={handleDialogInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="نام پدر"
                  name="father_name"
                  value={dialogData.father_name || ''}
                  onChange={handleDialogInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="کد ملی"
                  name="national_id"
                  value={dialogData.national_id || ''}
                  onChange={handleDialogInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="تلفن همراه"
                  name="mobile_phone"
                  value={dialogData.mobile_phone || ''}
                  onChange={handleDialogInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="تلفن ثابت"
                  name="landline_phone"
                  value={dialogData.landline_phone || ''}
                  onChange={handleDialogInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="قد (سانتی‌متر)"
                  name="height"
                  type="number"
                  value={dialogData.height || ''}
                  onChange={handleDialogInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="وزن (کیلوگرم)"
                  name="weight"
                  type="number"
                  value={dialogData.weight || ''}
                  onChange={handleDialogInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="گروه خونی"
                  name="blood_type"
                  value={dialogData.blood_type || ''}
                  onChange={handleDialogInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>بیمه</InputLabel>
                  <Select
                    name="insurance"
                    value={dialogData.insurance || ''}
                    label="بیمه"
                    onChange={handleDialogInputChange}
                  >
                    <MenuItem value="">بدون بیمه</MenuItem>
                    <MenuItem value="بیمه ایران">بیمه ایران</MenuItem>
                    <MenuItem value="بیمه آسیا">بیمه آسیا</MenuItem>
                    <MenuItem value="بیمه پاسارگاد">بیمه پاسارگاد</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="آدرس"
                  name="address"
                  multiline
                  rows={3}
                  value={dialogData.address || ''}
                  onChange={handleDialogInputChange}
                />
              </Grid>
            </Grid>
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
      case 'patient-info':
        return 'ویرایش اطلاعات بیمار';
      default:
        return 'فرم';
    }
  };

  // Update the date formatting function to use Iranian calendar and 24h format
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    // Parse the input date
    const date = new Date(dateString);
    
    // Function to convert to Persian date
    function gregorianToJalali(gy, gm, gd) {
      var g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      var jy = (gy <= 1600) ? 0 : 979;
      gy -= (gy <= 1600) ? 621 : 1600;
      var gy2 = (gm > 2) ? (gy + 1) : gy;
      var days = (365 * gy) + (parseInt((gy2 + 3) / 4)) - (parseInt((gy2 + 99) / 100)) + 
                (parseInt((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
      jy += 33 * (parseInt(days / 12053));
      days %= 12053;
      jy += 4 * (parseInt(days / 1461));
      days %= 1461;
      jy += parseInt((days - 1) / 365);
      if (days > 365) days = (days - 1) % 365;
      var jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
      var jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
      return [jy, jm, jd];
    }
    
    // Convert date to Persian calendar
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const [jYear, jMonth, jDay] = gregorianToJalali(year, month, day);
    
    // Format day and month to always have two digits
    const formattedDay = jDay < 10 ? `0${jDay}` : `${jDay}`;
    const formattedMonth = jMonth < 10 ? `0${jMonth}` : `${jMonth}`;
    
    return `${formattedDay}-${formattedMonth}-${jYear}`;
  };
  
  // Format time separately with 24h format
  const formatTime = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    // Use 24-hour format (no AM/PM)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Add function to handle profile photo upload
  const handleProfilePhotoUpload = async (file) => {
    if (!file) return;

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('user_id', id);

      // Create object URL for preview
      const photoUrl = URL.createObjectURL(file);
      
      // Update patient data with new photo
      const updatedPatient = {
        ...patient,
        profile_photo: photoUrl
      };
      
      console.log('Updating profile photo for user:', id);
      
      // Update API with the profile photo URL
      try {
        await axios.put(`http://localhost:8080/api/users/${id}`, {
          ...patient,
          profile_photo: photoUrl
        });
        console.log('Profile photo URL saved to server');
      } catch (apiError) {
        console.error('Error saving profile photo URL to server:', apiError);
      }
      
      // Update local state
      setProfilePhoto(photoUrl);
      setPatient(updatedPatient);
    } catch (error) {
      console.error('Error uploading profile photo:', error);
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!patient) {
    return <Typography>در حال بارگذاری...</Typography>;
  }

  const PersonalInfoItem = ({ label, value, icon }) => (
    <ListItem sx={{ textAlign: 'right', direction: 'rtl', paddingY: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
      <ListItemIcon sx={{ minWidth: 'auto', color: 'primary.main', ml: 2 }}> {/* Adjusted margins */}
        {icon}
      </ListItemIcon>
      <ListItemText 
        primaryTypographyProps={{ fontWeight: 'medium', textAlign: 'right', color: 'text.secondary' }} 
        secondaryTypographyProps={{ fontWeight: 'bold', textAlign: 'right', color: 'text.primary' }}
        primary={label} 
        secondary={value || 'ثبت نشده'} 
        sx={{ textAlign: 'right', m: 0 }} /* Ensure ListItemText itself is aligned and remove default margins */
      />
    </ListItem>
  );

  return (
    <Box sx={{ 
      p: 3,
      background: (theme) => theme.palette.mode === 'dark' 
        ? theme.palette.background.default
        : 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
      minHeight: '100vh',
      color: (theme) => theme.palette.text.primary
    }}>
      {/* Top Section: Patient Basic Info */}
      <Paper sx={{ 
        p: 3,
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'rgba(30, 30, 30, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '15px',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Changed from flex-end to space-between
        direction: 'rtl',
        mb: 4  // Increase bottom margin for more spacing
      }}>
        {/* User Text Content - Move to first position for RTL */}
        <Box sx={{ flex: 1, textAlign: 'right', mr: 0 }}> {/* Changed mr: 3 to mr: 0 */}
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, overflowWrap: 'break-word', direction: 'rtl' }}>
            {patient.first_name} {patient.last_name}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#555', overflowWrap: 'break-word', direction: 'rtl' }}>
            کد ملی: {patient.national_id}
          </Typography>
        </Box>
        
        {/* User Photo with Upload capability - Moved to second position */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: profilePhoto ? 'transparent' : '#00bcd4',
              border: (theme) => `2px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            src={profilePhoto}
          >
            {!profilePhoto && <PersonIcon sx={{ fontSize: 40 }} />}
          </Avatar>
          <IconButton 
            size="small" 
            sx={{ 
              position: 'absolute', 
              bottom: -5, 
              right: -5, 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
              boxShadow: 1
            }}
            component="label"
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleProfilePhotoUpload(e.target.files[0]);
                }
              }}
            />
            <AddAPhotoIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>

      {/* Three Column Layout */}
      <Grid container spacing={4} direction="row-reverse">  {/* Increased spacing between grid items */}

        {/* Right Column: Actions and Quick Info */}
        <Grid item xs={12} md={4}>
          {/* Action buttons section */}
          <Paper sx={{ 
            p: 3, 
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            direction: 'rtl'
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2, 
              justifyContent: 'flex-end',
              width: '100%',
              direction: 'rtl'
            }}>
              <HospitalIcon sx={{ ml: 1.5 }} /> عملیات و دسترسی سریع
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/triage/${id}`)}
              startIcon={<DescriptionIcon />}
              fullWidth
              sx={{ 
                mb: 1.5,
                direction: 'rtl',
                textAlign: 'right',
                justifyContent: 'flex-start',
                '& .MuiButton-startIcon': {
                  marginLeft: 1,
                  marginRight: -1
                }
              }}
            >
              ثبت تریاژ
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/doctor-visit/${id}`)}
              startIcon={<HistoryEduIcon />}
              fullWidth
              sx={{ 
                mb: 1.5,
                direction: 'rtl',
                textAlign: 'right',
                justifyContent: 'flex-start',
                '& .MuiButton-startIcon': {
                  marginLeft: 1,
                  marginRight: -1
                }
              }}
            >
              ثبت ویزیت پزشک
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/prescription/${id}`)}
              startIcon={<MedicationIcon />}
              fullWidth
              sx={{ 
                mb: 1.5,
                direction: 'rtl',
                textAlign: 'right',
                justifyContent: 'flex-start',
                '& .MuiButton-startIcon': {
                  marginLeft: 1,
                  marginRight: -1
                }
              }}
            >
              ثبت نسخه
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/appointment/${id}`)}
              startIcon={<EventIcon />}
              fullWidth
              sx={{ 
                mb: 1.5,
                direction: 'rtl',
                textAlign: 'right',
                justifyContent: 'flex-start',
                '& .MuiButton-startIcon': {
                  marginLeft: 1,
                  marginRight: -1
                }
              }}
            >
              نوبت‌دهی
            </Button>
          </Paper>

          {/* Recent Visits section */}
          <Paper sx={{ 
            p: 3, 
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            mb: 3,
            direction: 'rtl'
          }}>
                        <Typography variant="h6" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2, 
              justifyContent: 'flex-end',
              width: '100%',
              direction: 'rtl'
            }}>              
              <HistoryEduIcon sx={{ ml: 1.5 }} color="primary" /> مراجعات اخیر
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
                             'مراجعه'} - {formatDate(visit.date || visit.Date || visit.created_at || visit.CreatedAt)}
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
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            mb: 3,
            direction: 'rtl'
          }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>              <MedicationIcon sx={{ ml: 1.5 }} color="primary" /> نسخه‌های اخیر            </Typography>
            
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
                            نسخه {index + 1} - {formatDate(prescription.created_at || prescription.CreatedAt)}
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
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            direction: 'rtl',
            textAlign: 'right'
          }}>
             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>              
               <MedicalInfoIcon sx={{ ml: 1.5 }} /> خلاصه سوابق پزشکی            
             </Typography>
            
            {allergies.length > 0 && (
              <Alert severity="warning" variant="filled" sx={{ mb: 2, direction: 'rtl', textAlign: 'right' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AllergyIcon sx={{ ml: 1.5 }} fontSize="small" /> <strong>آلرژی‌ها:</strong> {allergies.map(a => a.name).join('، ')}
            </Typography>
              </Alert>
            )}
            
            {chronicConditions.length > 0 && (
              <Alert severity="info" sx={{ mb: 2, direction: 'rtl', textAlign: 'right' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <HeartIcon sx={{ ml: 1.5 }} fontSize="small" /> <strong>بیماری‌های مزمن:</strong> {chronicConditions.map(c => c.name).join('، ')}
                </Typography>
              </Alert>
            )}
            
            {hereditaryDiseases.length > 0 && (
              <Box sx={{ mb: 2, p: 1, backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <MedicalInfoIcon sx={{ ml: 1.5 }} fontSize="small" /> <strong>بیماری‌های وراثتی:</strong> {hereditaryDiseases.map(d => d.name).join('، ')}
                </Typography>
            </Box>
            )}
            
            {disabilities.length > 0 && (
              <Box sx={{ mb: 1, p: 1, backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessibilityIcon sx={{ ml: 1.5 }} fontSize="small" /> <strong>معلولیت‌ها:</strong> {disabilities.map(d => d.name).join('، ')}
                </Typography>
            </Box>
            )}
          </Paper>
        </Grid>

        {/* Middle and Left Columns */}
        <Grid item xs={12} md={8}>
          {/* Main patient info tabs */}
           <Paper sx={{ 
            p: 3, 
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderRadius: '15px',
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            mb: 3
          }}>
             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ ml: 1.5 }} /> بخش‌های پرونده پزشکی
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(0)}
                >
                  <PersonIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>اطلاعات فردی</Typography>
            </Box>
              </Grid>
              
              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(1)}
                >
                  <MedicalInfoIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>بیماری‌های وراثتی</Typography>
            </Box>
              </Grid>
              
              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(2)}
                >
                  <HeartIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>بیماری‌های مزمن</Typography>
            </Box>
              </Grid>
              
              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(3)}
                >
                  <AccessibilityIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>معلولیت‌ها</Typography>
            </Box>
              </Grid>
              
              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(4)}
                >
                  <AllergyIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>آلرژی‌ها</Typography>
            </Box>
              </Grid>
              
              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(5)}
                >
                  <ImageIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>تصاویر پزشکی</Typography>
            </Box>
        </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(6)}
                >
                  <SurgeryIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>سوابق جراحی</Typography>
                </Box>
      </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(7)}
                >
                  <HistoryEduIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>سوابق مراجعات</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(8)}
                >
                  <CalendarIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>نوبت‌ها</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={4} md={3}>
                <Box 
                  sx={{ 
                    p: 2, 
                    border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 188, 212, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setActiveTab(9)}
                >
                  <MedicationIcon sx={{ mb: 1, fontSize: '2rem', color: 'primary.main' }} />
                  <Typography>نسخه‌ها</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Content for the selected tab */}
      <Paper sx={{ 
        p: 3,
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 30, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '15px',
            border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
              sx={{ display: 'none' }}
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
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => {
                      // Open dialog to edit patient info
                      setDialogType('patient-info');
                      setDialogData({ ...patient });
                      setDialogOpen(true);
                    }}
                  >
                    ویرایش اطلاعات بیمار
                  </Button>
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
                        <TableCell>مرتبط با</TableCell>
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
                          <TableCell>{formatDate(image.date || image.created_at)}</TableCell>
                          <TableCell>
                            {image.related_record_type === 'surgery' && (
                              <Chip 
                                size="small" 
                                icon={<SurgeryIcon />} 
                                label="جراحی"
                                color="primary" 
                                variant="outlined"
                                onClick={() => setActiveTab(6)} // Navigate to surgeries tab
                              />
                            )}
                            {image.related_record_type === 'visit' && (
                              <Chip 
                                size="small" 
                                icon={<HistoryEduIcon />} 
                                label="ویزیت"
                                color="secondary" 
                                variant="outlined"
                                onClick={() => setActiveTab(7)} // Navigate to visits tab
                              />
                            )}
                          </TableCell>
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
            
            {/* Surgery Records Tab */}
            <TabPanel value={activeTab} index={6}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => openDialog('surgery')}
                >
                  افزودن سابقه جراحی
                </Button>
              </Box>
              
              {surgeries.length === 0 ? (
                <Typography align="center" color="text.secondary">اطلاعاتی ثبت نشده است</Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>عنوان جراحی</TableCell>
                        <TableCell>تاریخ</TableCell>
                        <TableCell>توضیحات</TableCell>
                        <TableCell>عملیات</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {surgeries.map((surgery) => (
                        <TableRow key={surgery.id}>
                          <TableCell>{surgery.name || '-'}</TableCell>
                          <TableCell>{formatDate(surgery.date)}</TableCell>
                          <TableCell>{surgery.description || '-'}</TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => openDialog('surgery', surgery)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete('surgery', surgery.id)}>
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
                                {formatDate(visit.date || visit.Date || visit.created_at || visit.CreatedAt)}
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
                                {formatDate(appointment.date || appointment.Date)}
                              </TableCell>
                              <TableCell>
                                {formatTime(appointment.date || appointment.Date)}
                              </TableCell>
                              <TableCell>{appointment.type || appointment.Type || 'ویزیت'}</TableCell>
                              <TableCell>{appointment.notes || appointment.Notes || appointment.description || appointment.Description || '-'}</TableCell>
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
                                {formatDate(appointment.date || appointment.Date)}
                              </TableCell>
                              <TableCell>
                                {formatTime(appointment.date || appointment.Date)}
                              </TableCell>
                              <TableCell>{appointment.type || appointment.Type || 'ویزیت'}</TableCell>
                              <TableCell>{appointment.notes || appointment.Notes || appointment.description || appointment.Description || '-'}</TableCell>
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
                              {formatDate(prescription.created_at || prescription.CreatedAt)}
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
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.9)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '15px',
          border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
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
                          {formatDate(visit.date || visit.Date || visit.created_at || visit.CreatedAt)}
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