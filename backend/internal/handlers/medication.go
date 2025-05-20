package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"barman/internal/models"
)

// MedicationHandler handles medication-related endpoints
type MedicationHandler struct {
	DB *gorm.DB
}

// NewMedicationHandler creates a new medication handler
func NewMedicationHandler(db *gorm.DB) *MedicationHandler {
	return &MedicationHandler{DB: db}
}

// SearchMedications searches medications in the catalog
func (h *MedicationHandler) SearchMedications(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}

	var medications []models.MedicationCatalog
	result := h.DB.Where("generic_name LIKE ? OR brand_name LIKE ?", "%"+query+"%", "%"+query+"%").
		Limit(20).
		Find(&medications)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search medications"})
		return
	}

	c.JSON(http.StatusOK, medications)
}

// GetMedication gets a medication by ID
func (h *MedicationHandler) GetMedication(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid medication ID"})
		return
	}

	var medication models.MedicationCatalog
	result := h.DB.First(&medication, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medication not found"})
		return
	}

	c.JSON(http.StatusOK, medication)
}

// CreatePrescription creates a new prescription
func (h *MedicationHandler) CreatePrescription(c *gin.Context) {
	var input struct {
		UserID       uint                `json:"user_id" binding:"required"`
		VisitID      uint                `json:"visit_id" binding:"required"`
		Notes        string              `json:"notes"`
		Date         string              `json:"date" binding:"required"`
		DoctorName   string              `json:"doctor_name"`
		Instructions string              `json:"instructions"`
		Medications  []models.Medication `json:"medications"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify user exists
	var user models.User
	if result := h.DB.First(&user, input.UserID); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Verify visit exists
	var visit models.Visit
	if result := h.DB.First(&visit, input.VisitID); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid visit ID"})
		return
	}

	// Create prescription
	prescription := models.Prescription{
		UserID:       input.UserID,
		VisitID:      input.VisitID,
		Notes:        input.Notes,
		Date:         input.Date,
		DoctorName:   input.DoctorName,
		Instructions: input.Instructions,
	}

	if result := h.DB.Create(&prescription); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create prescription"})
		return
	}

	// Add medications to prescription
	for _, med := range input.Medications {
		med.PrescriptionID = prescription.ID
		if result := h.DB.Create(&med); result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add medication to prescription"})
			return
		}
	}

	// Return created prescription with medications
	var createdPrescription models.Prescription
	h.DB.Preload("User").Preload("Visit").Preload("Medications").First(&createdPrescription, prescription.ID)

	c.JSON(http.StatusCreated, createdPrescription)
}

// GetPrescription gets a prescription by ID
func (h *MedicationHandler) GetPrescription(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prescription ID"})
		return
	}

	var prescription models.Prescription
	result := h.DB.Preload("User").Preload("Visit").Preload("Medications").First(&prescription, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	c.JSON(http.StatusOK, prescription)
}

// GetUserPrescriptions gets all prescriptions for a user
func (h *MedicationHandler) GetUserPrescriptions(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("userId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var prescriptions []models.Prescription
	result := h.DB.Where("user_id = ?", userID).
		Preload("User").Preload("Visit").Preload("Medications").
		Find(&prescriptions)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get prescriptions"})
		return
	}

	c.JSON(http.StatusOK, prescriptions)
}
