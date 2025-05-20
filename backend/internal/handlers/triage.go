package handlers

import (
	"barman/internal/database"
	"barman/internal/models"
	"barman/internal/models/triage"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateTriage(c *gin.Context) {
	var triageData triage.Triage
	if err := c.ShouldBindJSON(&triageData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Create(&triageData)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, triageData)
}

func GetTriage(c *gin.Context) {
	id := c.Param("id")
	var triageData triage.Triage

	result := database.DB.First(&triageData, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Triage not found"})
		return
	}

	c.JSON(http.StatusOK, triageData)
}

func UpdateTriage(c *gin.Context) {
	id := c.Param("id")
	var triageData triage.Triage

	if err := database.DB.First(&triageData, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Triage not found"})
		return
	}

	if err := c.ShouldBindJSON(&triageData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&triageData)
	c.JSON(http.StatusOK, triageData)
}

func DeleteTriage(c *gin.Context) {
	id := c.Param("id")
	var triageData triage.Triage

	if err := database.DB.First(&triageData, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Triage not found"})
		return
	}

	database.DB.Delete(&triageData)
	c.JSON(http.StatusOK, gin.H{"message": "Triage deleted successfully"})
}

func GetVisitTriage(c *gin.Context) {
	visitID := c.Param("visit_id")
	var triageData triage.Triage

	result := database.DB.Where("visit_id = ?", visitID).First(&triageData)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Triage not found for this visit"})
		return
	}

	c.JSON(http.StatusOK, triageData)
}

func GetUserTriageHistory(c *gin.Context) {
	userID := c.Param("user_id")
	var triageHistory []triage.Triage

	result := database.DB.Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&triageHistory)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, triageHistory)
}

func GetLatestTriageByUser(c *gin.Context) {
	userID := c.Param("user_id")

	// First find the latest visit with triage data
	var visit models.Visit
	result := database.DB.Where("user_id = ? AND type = ?", userID, "triage").
		Preload("TriageData").
		Order("created_at DESC").
		First(&visit)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No triage found for this user"})
		return
	}

	if visit.TriageData == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No triage data found"})
		return
	}

	// Add visit_id to the response
	triageData := map[string]interface{}{
		"visit_id":          visit.ID,
		"heart_rate":        visit.TriageData.HeartRate,
		"blood_pressure":    visit.TriageData.BloodPressure,
		"temperature":       visit.TriageData.Temperature,
		"respiratory_rate":  visit.TriageData.RespiratoryRate,
		"oxygen_saturation": visit.TriageData.OxygenSaturation,
		"pain_level":        visit.TriageData.PainLevel,
		"symptoms":          visit.TriageData.Symptoms,
		"priority_level":    visit.TriageData.PriorityLevel,
		"created_at":        visit.CreatedAt,
	}

	c.JSON(http.StatusOK, triageData)
}

func GetPendingTriage(c *gin.Context) {
	var pendingTriage []triage.Triage

	result := database.DB.Where("status = ?", "pending").
		Order("created_at ASC").
		Find(&pendingTriage)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, pendingTriage)
}
