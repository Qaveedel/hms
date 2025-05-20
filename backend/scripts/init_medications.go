package main

import (
	"barman/internal/database"
	"barman/internal/models"
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database
	database.InitDB()

	// Create medication catalog entries
	medications := []models.MedicationCatalog{
		{
			GenericName:       "Acetaminophen",
			BrandName:         "Paracetamol",
			Form:              "Tablet",
			Strength:          "500mg",
			Category:          "Analgesic",
			Description:       "Used to treat pain and reduce fever",
			ContraIndications: "Liver disease, alcohol abuse",
			SideEffects:       "Nausea, stomach pain, loss of appetite",
			Interactions:      "May interact with warfarin, isoniazid, carbamazepine",
			Manufacturer:      "Generic",
			Active:            true,
		},
		{
			GenericName:       "Amoxicillin",
			BrandName:         "Amoxil",
			Form:              "Capsule",
			Strength:          "500mg",
			Category:          "Antibiotic",
			Description:       "Antibiotic to treat bacterial infections",
			ContraIndications: "Allergy to penicillin, kidney disease",
			SideEffects:       "Diarrhea, rash, nausea",
			Interactions:      "May interact with birth control pills, warfarin",
			Manufacturer:      "GSK",
			Active:            true,
		},
		{
			GenericName:       "Metformin",
			BrandName:         "Glucophage",
			Form:              "Tablet",
			Strength:          "500mg",
			Category:          "Antidiabetic",
			Description:       "Used to control blood sugar in type 2 diabetes",
			ContraIndications: "Kidney disease, metabolic acidosis",
			SideEffects:       "Nausea, diarrhea, abdominal discomfort",
			Interactions:      "May interact with diuretics, corticosteroids",
			Manufacturer:      "Merck",
			Active:            true,
		},
		{
			GenericName:       "Lisinopril",
			BrandName:         "Zestril",
			Form:              "Tablet",
			Strength:          "10mg",
			Category:          "Antihypertensive",
			Description:       "ACE inhibitor used to treat high blood pressure",
			ContraIndications: "Pregnancy, history of angioedema",
			SideEffects:       "Dry cough, dizziness, headache",
			Interactions:      "May interact with potassium supplements, NSAIDs",
			Manufacturer:      "AstraZeneca",
			Active:            true,
		},
		{
			GenericName:       "Atorvastatin",
			BrandName:         "Lipitor",
			Form:              "Tablet",
			Strength:          "20mg",
			Category:          "Statin",
			Description:       "Used to lower cholesterol",
			ContraIndications: "Liver disease, pregnancy",
			SideEffects:       "Muscle pain, liver dysfunction",
			Interactions:      "May interact with grapefruit juice, macrolide antibiotics",
			Manufacturer:      "Pfizer",
			Active:            true,
		},
	}

	// Insert medications into database
	for _, med := range medications {
		result := database.DB.Create(&med)
		if result.Error != nil {
			log.Printf("Error creating medication %s: %v", med.BrandName, result.Error)
		} else {
			fmt.Printf("Added medication: %s (%s)\n", med.BrandName, med.GenericName)
		}
	}

	fmt.Println("Medication catalog initialization complete")
}
