package handlers

import (
	"net/http"
	"time"

	"barman/internal/database"
	"barman/internal/models"

	"github.com/gin-gonic/gin"
)

func CreateAppointment(c *gin.Context) {
	var appointment models.Appointment
	if err := c.ShouldBindJSON(&appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate appointment date is not in the past
	if appointment.Date.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot schedule appointment in the past"})
		return
	}

	result := database.DB.Create(&appointment)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, appointment)
}

func GetAppointment(c *gin.Context) {
	id := c.Param("id")
	var appointment models.Appointment

	result := database.DB.First(&appointment, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Appointment not found"})
		return
	}

	c.JSON(http.StatusOK, appointment)
}

func UpdateAppointment(c *gin.Context) {
	id := c.Param("id")
	var appointment models.Appointment

	if err := database.DB.First(&appointment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Appointment not found"})
		return
	}

	if err := c.ShouldBindJSON(&appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate appointment date is not in the past
	if appointment.Date.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot schedule appointment in the past"})
		return
	}

	database.DB.Save(&appointment)
	c.JSON(http.StatusOK, appointment)
}

func DeleteAppointment(c *gin.Context) {
	id := c.Param("id")
	var appointment models.Appointment

	if err := database.DB.First(&appointment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Appointment not found"})
		return
	}

	database.DB.Delete(&appointment)
	c.JSON(http.StatusOK, gin.H{"message": "Appointment deleted successfully"})
}

func GetUserAppointments(c *gin.Context) {
	userID := c.Param("user_id")
	var appointments []models.Appointment

	result := database.DB.Where("user_id = ? AND date >= ?", userID, time.Now()).
		Order("date ASC").
		Find(&appointments)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

func GetUpcomingAppointments(c *gin.Context) {
	var appointments []models.Appointment

	result := database.DB.Where("date >= ?", time.Now()).
		Preload("User").
		Order("date ASC").
		Find(&appointments)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, appointments)
}
