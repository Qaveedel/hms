package database

import (
	"barman/internal/models"
	"barman/internal/models/triage"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto Migrate the schema
	err = db.AutoMigrate(
		&models.User{},
		&models.HereditaryDisease{},
		&models.Disability{},
		&models.MedicalImage{},
		&models.Surgery{},
		&models.Visit{},
		&triage.Triage{},
		&models.Diagnosis{},
		&models.Prescription{},
		&models.Medication{},
		&models.Appointment{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = db
}
