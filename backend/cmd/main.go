package main

import (
	"log"
	"os"

	"barman/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database
	database.InitDB()

	// Create Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// API routes
	api := r.Group("/api")
	{
		// User routes
		api.POST("/users", createUser)
		api.GET("/users/:id", getUser)
		api.PUT("/users/:id", updateUser)

		// Visit routes
		api.POST("/visits", createVisit)
		api.GET("/visits/:id", getVisit)
		api.PUT("/visits/:id", updateVisit)

		// Prescription routes
		api.POST("/prescriptions", createPrescription)
		api.GET("/prescriptions/:id", getPrescription)

		// Medical records routes
		api.POST("/medical-images", uploadMedicalImage)
		api.GET("/medical-images/:id", getMedicalImages)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

// Handler functions will be implemented in separate files
func createUser(c *gin.Context)    {}
func getUser(c *gin.Context)       {}
func updateUser(c *gin.Context)    {}
func createVisit(c *gin.Context)   {}
func getVisit(c *gin.Context)      {}
func updateVisit(c *gin.Context)   {}
func createPrescription(c *gin.Context) {}
func getPrescription(c *gin.Context)    {}
func uploadMedicalImage(c *gin.Context) {}
func getMedicalImages(c *gin.Context)   {} 