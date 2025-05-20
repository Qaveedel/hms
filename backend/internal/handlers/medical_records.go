package handlers

import (
	"barman/internal/database"
	"barman/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// HereditaryDisease handlers

func AddHereditaryDisease(c *gin.Context) {
	var disease models.HereditaryDisease
	if err := c.ShouldBindJSON(&disease); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Create(&disease)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, disease)
}

func GetHereditaryDisease(c *gin.Context) {
	id := c.Param("id")
	var disease models.HereditaryDisease

	result := database.DB.First(&disease, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hereditary disease not found"})
		return
	}

	c.JSON(http.StatusOK, disease)
}

func UpdateHereditaryDisease(c *gin.Context) {
	id := c.Param("id")
	var disease models.HereditaryDisease

	if err := database.DB.First(&disease, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hereditary disease not found"})
		return
	}

	if err := c.ShouldBindJSON(&disease); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&disease)
	c.JSON(http.StatusOK, disease)
}

func DeleteHereditaryDisease(c *gin.Context) {
	id := c.Param("id")
	var disease models.HereditaryDisease

	if err := database.DB.First(&disease, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hereditary disease not found"})
		return
	}

	database.DB.Delete(&disease)
	c.JSON(http.StatusOK, gin.H{"message": "Hereditary disease deleted successfully"})
}

func GetUserHereditaryDiseases(c *gin.Context) {
	userID := c.Param("user_id")
	var diseases []models.HereditaryDisease

	result := database.DB.Where("user_id = ?", userID).Find(&diseases)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, diseases)
}

// Disability handlers

func AddDisability(c *gin.Context) {
	var disability models.Disability
	if err := c.ShouldBindJSON(&disability); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Create(&disability)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, disability)
}

func GetDisability(c *gin.Context) {
	id := c.Param("id")
	var disability models.Disability

	result := database.DB.First(&disability, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Disability not found"})
		return
	}

	c.JSON(http.StatusOK, disability)
}

func UpdateDisability(c *gin.Context) {
	id := c.Param("id")
	var disability models.Disability

	if err := database.DB.First(&disability, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Disability not found"})
		return
	}

	if err := c.ShouldBindJSON(&disability); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&disability)
	c.JSON(http.StatusOK, disability)
}

func DeleteDisability(c *gin.Context) {
	id := c.Param("id")
	var disability models.Disability

	if err := database.DB.First(&disability, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Disability not found"})
		return
	}

	database.DB.Delete(&disability)
	c.JSON(http.StatusOK, gin.H{"message": "Disability deleted successfully"})
}

func GetUserDisabilities(c *gin.Context) {
	userID := c.Param("user_id")
	var disabilities []models.Disability

	result := database.DB.Where("user_id = ?", userID).Find(&disabilities)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, disabilities)
}

// Medical Image handlers

func AddMedicalImage(c *gin.Context) {
	var image models.MedicalImage
	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Create(&image)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, image)
}

func GetMedicalImage(c *gin.Context) {
	id := c.Param("id")
	var image models.MedicalImage

	result := database.DB.First(&image, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medical image not found"})
		return
	}

	c.JSON(http.StatusOK, image)
}

func UpdateMedicalImage(c *gin.Context) {
	id := c.Param("id")
	var image models.MedicalImage

	if err := database.DB.First(&image, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medical image not found"})
		return
	}

	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&image)
	c.JSON(http.StatusOK, image)
}

func DeleteMedicalImage(c *gin.Context) {
	id := c.Param("id")
	var image models.MedicalImage

	if err := database.DB.First(&image, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medical image not found"})
		return
	}

	database.DB.Delete(&image)
	c.JSON(http.StatusOK, gin.H{"message": "Medical image deleted successfully"})
}

func GetUserMedicalImages(c *gin.Context) {
	userID := c.Param("user_id")
	var images []models.MedicalImage

	result := database.DB.Where("user_id = ?", userID).Find(&images)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, images)
}

// Surgery handlers

func AddSurgery(c *gin.Context) {
	var surgery models.Surgery
	if err := c.ShouldBindJSON(&surgery); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Create(&surgery)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, surgery)
}

func GetSurgery(c *gin.Context) {
	id := c.Param("id")
	var surgery models.Surgery

	result := database.DB.First(&surgery, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Surgery not found"})
		return
	}

	c.JSON(http.StatusOK, surgery)
}

func UpdateSurgery(c *gin.Context) {
	id := c.Param("id")
	var surgery models.Surgery

	if err := database.DB.First(&surgery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Surgery not found"})
		return
	}

	if err := c.ShouldBindJSON(&surgery); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&surgery)
	c.JSON(http.StatusOK, surgery)
}

func DeleteSurgery(c *gin.Context) {
	id := c.Param("id")
	var surgery models.Surgery

	if err := database.DB.First(&surgery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Surgery not found"})
		return
	}

	database.DB.Delete(&surgery)
	c.JSON(http.StatusOK, gin.H{"message": "Surgery deleted successfully"})
}

func GetUserSurgeries(c *gin.Context) {
	userID := c.Param("user_id")
	var surgeries []models.Surgery

	result := database.DB.Where("user_id = ?", userID).Find(&surgeries)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, surgeries)
}

// Allergy handlers

func AddAllergy(c *gin.Context) {
	var allergy models.Allergy
	if err := c.ShouldBindJSON(&allergy); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Create(&allergy)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, allergy)
}

func GetAllergy(c *gin.Context) {
	id := c.Param("id")
	var allergy models.Allergy

	result := database.DB.First(&allergy, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Allergy not found"})
		return
	}

	c.JSON(http.StatusOK, allergy)
}

func UpdateAllergy(c *gin.Context) {
	id := c.Param("id")
	var allergy models.Allergy

	if err := database.DB.First(&allergy, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Allergy not found"})
		return
	}

	if err := c.ShouldBindJSON(&allergy); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&allergy)
	c.JSON(http.StatusOK, allergy)
}

func DeleteAllergy(c *gin.Context) {
	id := c.Param("id")
	var allergy models.Allergy

	if err := database.DB.First(&allergy, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Allergy not found"})
		return
	}

	database.DB.Delete(&allergy)
	c.JSON(http.StatusOK, gin.H{"message": "Allergy deleted successfully"})
}

func GetUserAllergies(c *gin.Context) {
	userID := c.Param("user_id")
	var allergies []models.Allergy

	result := database.DB.Where("user_id = ?", userID).Find(&allergies)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, allergies)
}

// Chronic Condition handlers

func AddChronicCondition(c *gin.Context) {
	var condition models.ChronicCondition
	if err := c.ShouldBindJSON(&condition); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := database.DB.Create(&condition)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, condition)
}

func GetChronicCondition(c *gin.Context) {
	id := c.Param("id")
	var condition models.ChronicCondition

	result := database.DB.First(&condition, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chronic condition not found"})
		return
	}

	c.JSON(http.StatusOK, condition)
}

func UpdateChronicCondition(c *gin.Context) {
	id := c.Param("id")
	var condition models.ChronicCondition

	if err := database.DB.First(&condition, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chronic condition not found"})
		return
	}

	if err := c.ShouldBindJSON(&condition); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database.DB.Save(&condition)
	c.JSON(http.StatusOK, condition)
}

func DeleteChronicCondition(c *gin.Context) {
	id := c.Param("id")
	var condition models.ChronicCondition

	if err := database.DB.First(&condition, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Chronic condition not found"})
		return
	}

	database.DB.Delete(&condition)
	c.JSON(http.StatusOK, gin.H{"message": "Chronic condition deleted successfully"})
}

func GetUserChronicConditions(c *gin.Context) {
	userID := c.Param("user_id")
	var conditions []models.ChronicCondition

	result := database.DB.Where("user_id = ?", userID).Find(&conditions)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, conditions)
}
