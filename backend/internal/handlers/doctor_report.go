package handlers

import (
	"net/http"

	"barman/internal/database"
	"barman/internal/models"

	"github.com/gin-gonic/gin"
)

func CreateDoctorReport(c *gin.Context) {
	var diagnosis models.Diagnosis
	if err := c.ShouldBindJSON(&diagnosis); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Create(&diagnosis)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, diagnosis)
}

func GetDoctorReport(c *gin.Context) {
	id := c.Param("id")
	var diagnosis models.Diagnosis

	result := database.DB.First(&diagnosis, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Doctor report not found"})
		return
	}

	c.JSON(http.StatusOK, diagnosis)
}

func UpdateDoctorReport(c *gin.Context) {
	id := c.Param("id")
	var diagnosis models.Diagnosis

	if err := database.DB.First(&diagnosis, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Doctor report not found"})
		return
	}

	if err := c.ShouldBindJSON(&diagnosis); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&diagnosis)
	c.JSON(http.StatusOK, diagnosis)
}

func DeleteDoctorReport(c *gin.Context) {
	id := c.Param("id")
	var diagnosis models.Diagnosis

	if err := database.DB.First(&diagnosis, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Doctor report not found"})
		return
	}

	database.DB.Delete(&diagnosis)
	c.JSON(http.StatusOK, gin.H{"message": "Doctor report deleted successfully"})
}

func GetVisitDoctorReport(c *gin.Context) {
	visitID := c.Param("visit_id")
	var diagnosis models.Diagnosis

	result := database.DB.Where("visit_id = ?", visitID).First(&diagnosis)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Doctor report not found for this visit"})
		return
	}

	c.JSON(http.StatusOK, diagnosis)
}

func GetUserDoctorReports(c *gin.Context) {
	userID := c.Param("user_id")
	var diagnoses []models.Diagnosis

	result := database.DB.Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&diagnoses)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, diagnoses)
}
