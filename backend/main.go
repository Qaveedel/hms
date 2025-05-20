package main

import (
	"barman/internal/database"
	"barman/internal/handlers"
	"barman/internal/models"
	"barman/internal/models/triage"
	"log"

	"github.com/gin-contrib/cors"
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

	// Auto migrate database schema
	database.DB.AutoMigrate(
		&models.User{},
		&models.Visit{},
		&triage.Triage{},
		&models.Diagnosis{},
		&models.Prescription{},
		&models.Medication{},
		&models.MedicationCatalog{},
		&models.Appointment{},
		&models.HereditaryDisease{},
		&models.Disability{},
		&models.MedicalImage{},
		&models.Surgery{},
		&models.Allergy{},
		&models.ChronicCondition{},
	)

	// Initialize router
	router := gin.Default()

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * 3600, // 12 hours
	}))

	// Initialize handlers
	medicationHandler := handlers.NewMedicationHandler(database.DB)

	// Stats route
	router.GET("/api/stats", handlers.GetStats)

	// User routes
	userRoutes := router.Group("/api/users")
	{
		userRoutes.POST("", handlers.CreateUser)
		userRoutes.GET("", handlers.GetAllUsers)
		userRoutes.GET("/:id", handlers.GetUser)
		userRoutes.GET("/national-id/:national_id", handlers.GetUserByNationalID)
		userRoutes.PUT("/:id", handlers.UpdateUser)
		userRoutes.DELETE("/:id", handlers.DeleteUser)
	}

	// Visit routes
	visitRoutes := router.Group("/api/visits")
	{
		visitRoutes.POST("", handlers.CreateVisit)
		visitRoutes.GET("/:id", handlers.GetVisit)
		visitRoutes.PUT("/:id", handlers.UpdateVisit)
		visitRoutes.GET("/user/:user_id", handlers.GetUserVisits)
		visitRoutes.GET("/user/:user_id/latest-triage", handlers.GetLatestTriage)
	}

	// Triage routes
	triageRoutes := router.Group("/api/triage")
	{
		triageRoutes.POST("", handlers.CreateTriage)
		triageRoutes.GET("/:id", handlers.GetTriage)
		triageRoutes.PUT("/:id", handlers.UpdateTriage)
		triageRoutes.GET("/user/:user_id/history", handlers.GetUserTriageHistory)
		triageRoutes.GET("/user/:user_id/latest", handlers.GetLatestTriageByUser)
		triageRoutes.GET("/pending", handlers.GetPendingTriage)
	}

	// Doctor report routes
	reportRoutes := router.Group("/api/reports")
	{
		reportRoutes.POST("", handlers.CreateDoctorReport)
		reportRoutes.GET("/:id", handlers.GetDoctorReport)
		reportRoutes.PUT("/:id", handlers.UpdateDoctorReport)
		reportRoutes.GET("/user/:user_id", handlers.GetUserDoctorReports)
		reportRoutes.GET("/visit/:visit_id", handlers.GetVisitDoctorReport)
	}

	// Prescription routes
	prescriptionRoutes := router.Group("/api/prescriptions")
	{
		prescriptionRoutes.POST("", handlers.CreatePrescription)
		prescriptionRoutes.GET("/:id", handlers.GetPrescription)
		prescriptionRoutes.PUT("/:id", handlers.UpdatePrescription)
		prescriptionRoutes.DELETE("/:id", handlers.DeletePrescription)
		prescriptionRoutes.GET("/user/:user_id", handlers.GetPrescriptionsByUser)
	}

	// Medication catalog routes
	medicationRoutes := router.Group("/api/medications")
	{
		medicationRoutes.GET("/search", medicationHandler.SearchMedications)
		medicationRoutes.GET("/:id", medicationHandler.GetMedication)
		medicationRoutes.POST("/prescriptions", medicationHandler.CreatePrescription)
		medicationRoutes.GET("/prescriptions/:id", medicationHandler.GetPrescription)
		medicationRoutes.GET("/prescriptions/user/:userId", medicationHandler.GetUserPrescriptions)
	}

	// Appointment routes
	appointmentRoutes := router.Group("/api/appointments")
	{
		appointmentRoutes.POST("", handlers.CreateAppointment)
		appointmentRoutes.GET("/:id", handlers.GetAppointment)
		appointmentRoutes.PUT("/:id", handlers.UpdateAppointment)
		appointmentRoutes.DELETE("/:id", handlers.DeleteAppointment)
		appointmentRoutes.GET("/user/:user_id", handlers.GetUserAppointments)
		appointmentRoutes.GET("/upcoming", handlers.GetUpcomingAppointments)
	}

	// Hereditary Disease routes
	hereditaryDiseaseRoutes := router.Group("/api/hereditary-diseases")
	{
		hereditaryDiseaseRoutes.POST("", handlers.AddHereditaryDisease)
		hereditaryDiseaseRoutes.GET("/:id", handlers.GetHereditaryDisease)
		hereditaryDiseaseRoutes.PUT("/:id", handlers.UpdateHereditaryDisease)
		hereditaryDiseaseRoutes.DELETE("/:id", handlers.DeleteHereditaryDisease)
		hereditaryDiseaseRoutes.GET("/user/:user_id", handlers.GetUserHereditaryDiseases)
	}

	// Disability routes
	disabilityRoutes := router.Group("/api/disabilities")
	{
		disabilityRoutes.POST("", handlers.AddDisability)
		disabilityRoutes.GET("/:id", handlers.GetDisability)
		disabilityRoutes.PUT("/:id", handlers.UpdateDisability)
		disabilityRoutes.DELETE("/:id", handlers.DeleteDisability)
		disabilityRoutes.GET("/user/:user_id", handlers.GetUserDisabilities)
	}

	// Medical Image routes
	medicalImageRoutes := router.Group("/api/medical-images")
	{
		medicalImageRoutes.POST("", handlers.AddMedicalImage)
		medicalImageRoutes.GET("/:id", handlers.GetMedicalImage)
		medicalImageRoutes.PUT("/:id", handlers.UpdateMedicalImage)
		medicalImageRoutes.DELETE("/:id", handlers.DeleteMedicalImage)
		medicalImageRoutes.GET("/user/:user_id", handlers.GetUserMedicalImages)
	}

	// Surgery routes
	surgeryRoutes := router.Group("/api/surgeries")
	{
		surgeryRoutes.POST("", handlers.AddSurgery)
		surgeryRoutes.GET("/:id", handlers.GetSurgery)
		surgeryRoutes.PUT("/:id", handlers.UpdateSurgery)
		surgeryRoutes.DELETE("/:id", handlers.DeleteSurgery)
		surgeryRoutes.GET("/user/:user_id", handlers.GetUserSurgeries)
	}

	// Allergy routes
	allergyRoutes := router.Group("/api/allergies")
	{
		allergyRoutes.POST("", handlers.AddAllergy)
		allergyRoutes.GET("/:id", handlers.GetAllergy)
		allergyRoutes.PUT("/:id", handlers.UpdateAllergy)
		allergyRoutes.DELETE("/:id", handlers.DeleteAllergy)
		allergyRoutes.GET("/user/:user_id", handlers.GetUserAllergies)
	}

	// Chronic Condition routes
	chronicConditionRoutes := router.Group("/api/chronic-conditions")
	{
		chronicConditionRoutes.POST("", handlers.AddChronicCondition)
		chronicConditionRoutes.GET("/:id", handlers.GetChronicCondition)
		chronicConditionRoutes.PUT("/:id", handlers.UpdateChronicCondition)
		chronicConditionRoutes.DELETE("/:id", handlers.DeleteChronicCondition)
		chronicConditionRoutes.GET("/user/:user_id", handlers.GetUserChronicConditions)
	}

	// Start server
	router.Run(":8080")
}
