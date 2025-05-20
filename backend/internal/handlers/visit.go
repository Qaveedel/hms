package handlers

import (
	"net/http"
	"time"

	"barman/internal/database"
	"barman/internal/models"
	"barman/internal/models/triage"

	"github.com/gin-gonic/gin"
)

func CreateVisit(c *gin.Context) {
	var visitReq struct {
		UserID     uint                    `json:"user_id" binding:"required"`
		Type       string                  `json:"type" binding:"required"`
		Date       time.Time               `json:"date"`
		TriageData *map[string]interface{} `json:"triage_data"`
	}

	if err := c.ShouldBindJSON(&visitReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create the visit
	visit := models.Visit{
		UserID: visitReq.UserID,
		Type:   visitReq.Type,
		Date:   time.Now(),
	}

	// Start a transaction
	tx := database.DB.Begin()

	// Create the visit first
	if err := tx.Create(&visit).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// If triage data is provided, create it
	if visitReq.TriageData != nil {
		data := *visitReq.TriageData

		// Create a new triage record
		triageData := triage.Triage{
			VisitID:          visit.ID,
			HeartRate:        int(data["heart_rate"].(float64)),
			BloodPressure:    data["blood_pressure"].(string),
			Temperature:      data["temperature"].(float64),
			RespiratoryRate:  int(data["respiratory_rate"].(float64)),
			OxygenSaturation: int(data["oxygen_saturation"].(float64)),
			PainLevel:        int(data["pain_level"].(float64)),
			Symptoms:         data["symptoms"].(string),
			PriorityLevel:    data["priority_level"].(string),
			Type:             "completed",
		}

		if err := tx.Create(&triageData).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Load the created visit with its relationships
	database.DB.Preload("TriageData").
		Preload("DoctorReport").
		First(&visit, visit.ID)

	c.JSON(http.StatusCreated, visit)
}

func GetVisit(c *gin.Context) {
	id := c.Param("id")
	var visit models.Visit

	result := database.DB.Preload("TriageData").
		Preload("DoctorReport").
		First(&visit, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Visit not found"})
		return
	}

	c.JSON(http.StatusOK, visit)
}

func UpdateVisit(c *gin.Context) {
	id := c.Param("id")
	var visit models.Visit

	if err := database.DB.First(&visit, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Visit not found"})
		return
	}

	if err := c.ShouldBindJSON(&visit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&visit)
	c.JSON(http.StatusOK, visit)
}

func GetLatestTriage(c *gin.Context) {
	userID := c.Param("user_id")
	var visit models.Visit

	// Find the latest visit with triage data
	result := database.DB.Where("user_id = ?", userID).
		Joins("JOIN triage_triages ON visits.id = triage_triages.visit_id").
		Order("visits.created_at DESC").
		Preload("TriageData").
		First(&visit)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No triage data found"})
		return
	}

	if visit.TriageData == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No triage data found"})
		return
	}

	c.JSON(http.StatusOK, visit.TriageData)
}

func GetUserVisits(c *gin.Context) {
	userID := c.Param("user_id")
	var visits []models.Visit

	result := database.DB.Where("user_id = ?", userID).
		Preload("TriageData").
		Preload("DoctorReport").
		Order("created_at DESC").
		Find(&visits)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, visits)
}
