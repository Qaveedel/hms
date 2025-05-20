package handlers

import (
	"net/http"

	"barman/internal/database"
	"barman/internal/models"

	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if user.FirstName == "" || user.LastName == "" || user.NationalID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "First name, last name, and national ID are required"})
		return
	}

	// Convert empty string numeric fields to zero
	if user.Height == 0 {
		user.Height = 0
	}
	if user.Weight == 0 {
		user.Weight = 0
	}

	result := database.DB.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func GetUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	result := database.DB.Preload("HereditaryDiseases").
		Preload("Disabilities").
		Preload("MedicalImages").
		Preload("Surgeries").
		Preload("Visits").
		Preload("Prescriptions").
		First(&user, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func GetUserByNationalID(c *gin.Context) {
	nationalID := c.Param("national_id")
	var user models.User

	result := database.DB.Where("national_id = ?", nationalID).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&user)
	c.JSON(http.StatusOK, user)
}

func GetAllUsers(c *gin.Context) {
	var users []models.User
	database.DB.Find(&users)
	c.JSON(http.StatusOK, users)
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	database.DB.Delete(&user)
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
