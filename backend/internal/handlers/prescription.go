package handlers

import (
	"net/http"
	"strconv"
	"time"

	"barman/internal/database"
	"barman/internal/models"

	"github.com/gin-gonic/gin"
)

// CreatePrescription handles the creation of a new prescription
func CreatePrescription(c *gin.Context) {
	var prescription models.Prescription
	if err := c.ShouldBindJSON(&prescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "details": "Invalid prescription data format"})
		return
	}

	// Validate required fields
	if prescription.UserID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Check if visit ID is valid
	if prescription.VisitID > 0 {
		var visit models.Visit
		if err := database.DB.First(&visit, prescription.VisitID).Error; err != nil {
			// Visit doesn't exist, create a new one
			visit = models.Visit{
				UserID: prescription.UserID,
				Type:   "prescription",
				Date:   time.Now(),
			}
			if err := database.DB.Create(&visit).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create visit"})
				return
			}
			prescription.VisitID = visit.ID
		}
	} else {
		// No visit ID provided, create a new one
		visit := models.Visit{
			UserID: prescription.UserID,
			Type:   "prescription",
			Date:   time.Now(),
		}
		if err := database.DB.Create(&visit).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create visit"})
			return
		}
		prescription.VisitID = visit.ID
	}

	// Set the creation time
	prescription.CreatedAt = time.Now()
	prescription.UpdatedAt = time.Now()

	// Start a transaction
	tx := database.DB.Begin()

	// Create the prescription
	if err := tx.Create(&prescription).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "details": "Failed to create prescription"})
		return
	}

	// Create medications if provided
	if len(prescription.Items) > 0 {
		for i := range prescription.Items {
			// Create a new medication using the correct fields
			medication := models.Medication{
				PrescriptionID: prescription.ID,
				GenericName:    prescription.Items[i].Medication.GenericName,
				BrandName:      prescription.Items[i].Medication.BrandName,
				Dosage:         prescription.Items[i].Dosage,
				Instructions:   prescription.Items[i].Instructions,
				Frequency:      prescription.Items[i].Frequency,
				Duration:       prescription.Items[i].Duration,
				Quantity:       prescription.Items[i].Quantity,
			}

			if err := tx.Create(&medication).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "details": "Failed to create medication"})
				return
			}
		}
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "details": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, prescription)
}

// GetPrescription retrieves a prescription by ID
func GetPrescription(c *gin.Context) {
	id := c.Param("id")
	var prescription models.Prescription

	result := database.DB.Preload("User").First(&prescription, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	c.JSON(http.StatusOK, prescription)
}

// GetPrescriptionsByUser retrieves all prescriptions for a specific user
func GetPrescriptionsByUser(c *gin.Context) {
	userID := c.Param("user_id")
	var prescriptions []models.Prescription

	// First check if the prescription_items table exists
	hasTable := database.DB.Migrator().HasTable(&models.PrescriptionItem{})

	// Get prescriptions without items first
	result := database.DB.Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&prescriptions)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Only preload items if the table exists
	if hasTable {
		for i := range prescriptions {
			database.DB.Model(&prescriptions[i]).Association("Items").Find(&prescriptions[i].Items)
		}
	}

	c.JSON(http.StatusOK, prescriptions)
}

// UpdatePrescription updates an existing prescription
func UpdatePrescription(c *gin.Context) {
	id := c.Param("id")
	var prescription models.Prescription

	if err := database.DB.First(&prescription, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	if err := c.ShouldBindJSON(&prescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&prescription)
	c.JSON(http.StatusOK, prescription)
}

// DeletePrescription deletes a prescription
func DeletePrescription(c *gin.Context) {
	id := c.Param("id")
	var prescription models.Prescription

	if err := database.DB.First(&prescription, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	database.DB.Delete(&prescription)
	c.JSON(http.StatusOK, gin.H{"message": "Prescription deleted successfully"})
}

// AddMedicationToPrescription adds a medication to an existing prescription
func AddMedicationToPrescription(c *gin.Context) {
	prescriptionID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid prescription ID"})
		return
	}

	var prescriptionItem models.PrescriptionItem
	if err := c.ShouldBindJSON(&prescriptionItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prescriptionItem.PrescriptionID = uint(prescriptionID)

	result := database.DB.Create(&prescriptionItem)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, prescriptionItem)
}

// RemoveMedicationFromPrescription removes a medication from a prescription
func RemoveMedicationFromPrescription(c *gin.Context) {
	medicationID := c.Param("medication_id")
	var prescriptionItem models.PrescriptionItem

	if err := database.DB.First(&prescriptionItem, medicationID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medication not found"})
		return
	}

	database.DB.Delete(&prescriptionItem)
	c.JSON(http.StatusOK, gin.H{"message": "Medication removed successfully"})
}
