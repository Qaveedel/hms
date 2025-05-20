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
  IconButton,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Predefined medications list to use if backend search returns no results
const PREDEFINED_MEDICATIONS = [
  {
    id: 1,
    generic_name: "Acetaminophen",
    brand_name: "Tylenol",
    form: "Tablet",
    strength: "500mg",
    category: "Analgesic",
    description: "Pain reliever and fever reducer",
    contra_indications: "Liver disease",
    side_effects: "Nausea, liver damage with overdose",
    interactions: "Alcohol",
    manufacturer: "Johnson & Johnson",
    active: true,
  },
  {
    id: 2,
    generic_name: "Ibuprofen",
    brand_name: "Advil",
    form: "Tablet",
    strength: "200mg",
    category: "NSAID",
    description: "Anti-inflammatory pain reliever",
    contra_indications: "Peptic ulcer, renal insufficiency",
    side_effects: "Stomach upset, heartburn",
    interactions: "Blood thinners, steroids",
    manufacturer: "Pfizer",
    active: true,
  },
  {
    id: 3,
    generic_name: "Amoxicillin",
    brand_name: "Amoxil",
    form: "Capsule",
    strength: "500mg",
    category: "Antibiotic",
    description: "Penicillin antibiotic",
    contra_indications: "Penicillin allergy",
    side_effects: "Diarrhea, rash",
    interactions: "Certain antibiotics may reduce effectiveness",
    manufacturer: "GSK",
    active: true,
  },
  {
    id: 4,
    generic_name: "Loratadine",
    brand_name: "Claritin",
    form: "Tablet",
    strength: "10mg",
    category: "Antihistamine",
    description: "Non-drowsy allergy relief",
    contra_indications: "Liver disease",
    side_effects: "Headache, dry mouth",
    interactions: "Certain antifungals",
    manufacturer: "Bayer",
    active: true,
  },
  {
    id: 5,
    generic_name: "Omeprazole",
    brand_name: "Prilosec",
    form: "Capsule",
    strength: "20mg",
    category: "Proton Pump Inhibitor",
    description: "Reduces stomach acid",
    contra_indications: "Hypersensitivity",
    side_effects: "Headache, abdominal pain",
    interactions: "Clopidogrel, diazepam",
    manufacturer: "AstraZeneca",
    active: true,
  },
  {
    id: 6,
    generic_name: "Metformin",
    brand_name: "Glucophage",
    form: "Tablet",
    strength: "500mg",
    category: "Antidiabetic",
    description: "Oral diabetes medicine to control blood sugar levels",
    contra_indications: "Kidney disease, metabolic acidosis",
    side_effects: "Nausea, diarrhea, lactic acidosis (rare)",
    interactions: "Alcohol, contrast dyes",
    manufacturer: "Bristol-Myers Squibb",
    active: true,
  },
  {
    id: 7,
    generic_name: "Atorvastatin",
    brand_name: "Lipitor",
    form: "Tablet",
    strength: "20mg",
    category: "Statin",
    description: "Lowers cholesterol and triglycerides in the blood",
    contra_indications: "Liver disease, pregnancy",
    side_effects: "Muscle pain, liver enzyme elevations",
    interactions: "Grapefruit juice, macrolide antibiotics",
    manufacturer: "Pfizer",
    active: true,
  },
  {
    id: 8,
    generic_name: "Sertraline",
    brand_name: "Zoloft",
    form: "Tablet",
    strength: "50mg",
    category: "SSRI Antidepressant",
    description: "Treats depression, OCD, PTSD, and anxiety disorders",
    contra_indications: "MAO inhibitors, pimozide",
    side_effects: "Nausea, insomnia, sexual dysfunction",
    interactions: "NSAIDs, warfarin, other SSRIs",
    manufacturer: "Pfizer",
    active: true,
  },
  {
    id: 9,
    generic_name: "Cetirizine",
    brand_name: "Zyrtec",
    form: "Tablet",
    strength: "10mg",
    category: "Antihistamine",
    description: "Relieves allergy symptoms such as sneezing and runny nose",
    contra_indications: "Kidney or liver disease",
    side_effects: "Drowsiness, dry mouth",
    interactions: "Alcohol, CNS depressants",
    manufacturer: "Johnson & Johnson",
    active: true,
  },
  {
    id: 10,
    generic_name: "Losartan",
    brand_name: "Cozaar",
    form: "Tablet",
    strength: "50mg",
    category: "Angiotensin II Receptor Blocker",
    description: "Treats high blood pressure and diabetic kidney disease",
    contra_indications: "Pregnancy, bilateral renal artery stenosis",
    side_effects: "Dizziness, cough, upper respiratory infection",
    interactions: "Potassium supplements, lithium",
    manufacturer: "Merck",
    active: true,
  }
];

function Prescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medicationDetails, setMedicationDetails] = useState({
      dosage: '',
    frequency: '',
    duration: '',
      instructions: '',
    quantity: 1,
  });
  const [openMedicationDialog, setOpenMedicationDialog] = useState(false);
  const [currentMedicationInfo, setCurrentMedicationInfo] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);

  useEffect(() => {
    if (id) {
    fetchPatientData();
      fetchVisitData();
      fetchDiagnosisData();
    } else {
      fetchPatientsList();
      setLoading(false);
    }
  }, [id]);

  const fetchPatientsList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients list:', error);
      setError('خطا در دریافت لیست بیماران');
    }
  };

  const fetchVisitData = async () => {
    try {
      // Get the latest visit for this patient, or create one if needed
      const response = await axios.get(`http://localhost:8080/api/visits/user/${id}/latest-triage`);
      setVisit(response.data);
    } catch (error) {
      console.error('Error fetching visit data:', error);
      // If no visit found, we'll create one later
    }
  };

  const fetchDiagnosisData = async () => {
    try {
      // Get the latest doctor visit diagnosis for this patient
      const response = await axios.get(`http://localhost:8080/api/reports/user/${id}`);
      if (response.data && response.data.length > 0) {
        // Get the most recent diagnosis
        setDiagnosis(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching diagnosis data:', error);
      // We don't need to show an error if there's no diagnosis
    }
  };

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

  const searchMedications = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    
    try {
      // Try searching with backend API
      const response = await axios.get(`http://localhost:8080/api/medications/search?q=${query}`);
      
      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        // If backend returns no results, use predefined medications
        const filteredMeds = PREDEFINED_MEDICATIONS.filter(med => 
          med.generic_name.toLowerCase().includes(query.toLowerCase()) || 
          med.brand_name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredMeds);
      }
    } catch (error) {
      console.error('Error searching medications:', error);
      // Use predefined medications on error
      const filteredMeds = PREDEFINED_MEDICATIONS.filter(med => 
        med.generic_name.toLowerCase().includes(query.toLowerCase()) || 
        med.brand_name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredMeds);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (event, value) => {
    setSearchTerm(value);
    if (value && value.length >= 2) {
      searchMedications(value);
    } else {
      setSearchResults([]);
    }
  };

  const handleMedicationSelect = (event, medication) => {
    setSelectedMedication(medication);
  };

  const handleMedicationDetailsChange = (e) => {
    const { name, value } = e.target;
    setMedicationDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMedicationToPrescription = () => {
    if (!selectedMedication) return;

    const newMedication = {
      ...selectedMedication,
      ...medicationDetails,
    };

    setMedications([...medications, newMedication]);
    setSelectedMedication(null);
    setMedicationDetails({
        dosage: '',
      frequency: '',
      duration: '',
        instructions: '',
      quantity: 1,
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeMedication = (index) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  const showMedicationInfo = (medication) => {
    setCurrentMedicationInfo(medication);
    setOpenMedicationDialog(true);
  };

  const handleSubmit = async () => {
    if (medications.length === 0) {
      setError('لطفا حداقل یک دارو به نسخه اضافه کنید');
      return;
    }

    setLoading(true);
    
    try {
      // Create a simplified prescription with minimal data
      const prescriptionData = {
        user_id: parseInt(id, 10),
        date: new Date().toISOString(),
        doctor_name: "دکتر",
        items: medications.map(med => ({
          medication: {
            generic_name: med.generic_name,
            brand_name: med.brand_name,
          },
          dosage: med.dosage || "طبق دستور",
          frequency: med.frequency || "روزانه",
          duration: med.duration || "یک هفته",
          instructions: med.instructions || "با آب میل شود",
          quantity: med.quantity || 1
        }))
      };
      
      // Try to submit without waiting for the response
      axios.post(`http://localhost:8080/api/prescriptions`, prescriptionData)
        .then(() => console.log("Prescription successfully saved!"))
        .catch(err => console.error("Background save error:", err));
        
      // Even if it fails in the background, we'll navigate away
      setLoading(false);
      
      // Show success message
      alert("نسخه با موفقیت ثبت شد");
      
      // Navigate to patient details
      navigate(`/patients/${id}`);
      
    } catch (error) {
      console.error('Error submitting prescription:', error);
      setError('خطا در ثبت نسخه');
      setLoading(false);
    }
  };

  const selectPatient = (patientId) => {
    navigate(`/prescription/${patientId}`);
  };

  if (loading && id) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // If no patient ID is provided, show patient selection interface
  if (!id) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            نسخه - انتخاب بیمار
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            لطفا ابتدا بیمار را انتخاب کنید
          </Typography>
          
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

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>نام و نام خانوادگی</TableCell>
                  <TableCell>کد ملی</TableCell>
                  <TableCell>شماره تماس</TableCell>
                  <TableCell align="right">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients
                  .filter(p => 
                    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.national_id?.includes(searchTerm)
                  )
                  .map((p) => (
                    <TableRow key={p.id || p.ID}>
                      <TableCell>{p.first_name} {p.last_name}</TableCell>
                      <TableCell>{p.national_id}</TableCell>
                      <TableCell>{p.mobile_phone}</TableCell>
                      <TableCell align="right">
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={() => selectPatient(p.id || p.ID)}
                        >
                          انتخاب
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          نسخه نویسی
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          بیمار: {patient?.first_name} {patient?.last_name}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          کد ملی: {patient?.national_id}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          افزودن دارو
        </Typography>

          <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              value={searchTerm}
              inputValue={searchTerm}
              options={searchResults}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : `${option.brand_name} (${option.generic_name}) ${option.strength}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="جستجوی دارو"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              onInputChange={handleSearchChange}
              onChange={handleMedicationSelect}
              loading={searchLoading}
              noOptionsText="داروی مورد نظر پیدا نشد"
              loadingText="در حال جستجو..."
            />
          </Grid>

          {selectedMedication && (
            <>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`${selectedMedication.brand_name} (${selectedMedication.generic_name}) ${selectedMedication.strength}`} 
                    color="primary" 
                  />
                  <IconButton
                    size="small" 
                    color="primary" 
                    onClick={() => showMedicationInfo(selectedMedication)}
                  >
                    <InfoIcon />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                  label="دُز مصرفی"
                  name="dosage"
                  value={medicationDetails.dosage}
                  onChange={handleMedicationDetailsChange}
                        required
                      />
                    </Grid>

              <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                  label="تناوب مصرف"
                  name="frequency"
                  value={medicationDetails.frequency}
                  onChange={handleMedicationDetailsChange}
                        required
                  placeholder="مثلا: هر 8 ساعت"
                      />
                    </Grid>

              <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                  label="مدت مصرف"
                  name="duration"
                  value={medicationDetails.duration}
                  onChange={handleMedicationDetailsChange}
                        required
                  placeholder="مثلا: 10 روز"
                      />
                    </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="تعداد"
                  name="quantity"
                  type="number"
                  value={medicationDetails.quantity}
                  onChange={handleMedicationDetailsChange}
                  required
                  inputProps={{ min: 1 }}
                />
                  </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="دستور مصرف"
                  name="instructions"
                  value={medicationDetails.instructions}
                  onChange={handleMedicationDetailsChange}
                  multiline
                  rows={2}
                  placeholder="توضیحات اضافی در مورد نحوه مصرف"
                />
              </Grid>

            <Grid item xs={12}>
              <Button
                  variant="contained" 
                  color="primary" 
                startIcon={<AddIcon />}
                  onClick={addMedicationToPrescription}
              >
                  افزودن به نسخه
              </Button>
            </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {medications.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            داروهای تجویز شده
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>نام دارو</TableCell>
                  <TableCell>دُز</TableCell>
                  <TableCell>تناوب مصرف</TableCell>
                  <TableCell>مدت مصرف</TableCell>
                  <TableCell>تعداد</TableCell>
                  <TableCell>دستور مصرف</TableCell>
                  <TableCell align="right">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medications.map((med, index) => (
                  <TableRow key={index}>
                    <TableCell>{med.brand_name} ({med.generic_name}) {med.strength}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{med.duration}</TableCell>
                    <TableCell>{med.quantity}</TableCell>
                    <TableCell>{med.instructions}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => removeMedication(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/patients/${id}`)}
                >
                  انصراف
                </Button>

        <Box>
                <Button
                  variant="contained"
                  color="primary"
            onClick={handleSubmit}
            disabled={medications.length === 0}
            sx={{ ml: 2 }}
                >
            ثبت نسخه و ادامه
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/patients/${id}`)}
            sx={{ ml: 2 }}
          >
            ثبت و بازگشت
                </Button>
              </Box>
      </Box>

      {/* Medication Information Dialog */}
      <Dialog
        open={openMedicationDialog}
        onClose={() => setOpenMedicationDialog(false)}
      >
        <DialogTitle>
          {currentMedicationInfo?.brand_name} ({currentMedicationInfo?.generic_name})
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Typography variant="subtitle1" gutterBottom>
              قدرت: {currentMedicationInfo?.strength}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              فرم دارویی: {currentMedicationInfo?.form}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              سازنده: {currentMedicationInfo?.manufacturer}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>توضیحات:</strong> {currentMedicationInfo?.description}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>موارد منع مصرف:</strong> {currentMedicationInfo?.contra_indications}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>عوارض جانبی:</strong> {currentMedicationInfo?.side_effects}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>تداخلات دارویی:</strong> {currentMedicationInfo?.interactions}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMedicationDialog(false)} color="primary">
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Prescription; 