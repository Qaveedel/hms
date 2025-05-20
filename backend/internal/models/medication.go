package models

import (
	"gorm.io/gorm"
)

// Medication represents a medication in the system
type Medication struct {
	gorm.Model
	PrescriptionID uint          `json:"prescription_id" gorm:"index"`
	GenericName    string        `json:"generic_name" gorm:"index"`
	BrandName      string        `json:"brand_name" gorm:"index"`
	Form           string        `json:"form"`     // e.g. tablet, capsule, liquid
	Strength       string        `json:"strength"` // e.g. 500mg, 10mg/ml
	Dosage         string        `json:"dosage"`
	Frequency      string        `json:"frequency"`
	Duration       string        `json:"duration"`
	Instructions   string        `json:"instructions"`
	Category       string        `json:"category"`
	Quantity       int           `json:"quantity"`
	Description    string        `json:"description,omitempty"`
	SideEffects    string        `json:"side_effects,omitempty"`
	Interactions   string        `json:"interactions,omitempty"`
	Prescription   *Prescription `json:"prescription,omitempty" gorm:"foreignKey:PrescriptionID"`
}

// MedicationCatalog represents medications available in the system catalog
// This is separate from actual prescribed medications
type MedicationCatalog struct {
	gorm.Model
	GenericName       string `json:"generic_name" gorm:"index"`
	BrandName         string `json:"brand_name" gorm:"index"`
	Form              string `json:"form"`     // e.g. tablet, capsule, liquid
	Strength          string `json:"strength"` // e.g. 500mg, 10mg/ml
	Category          string `json:"category"`
	Description       string `json:"description"`
	ContraIndications string `json:"contra_indications"`
	SideEffects       string `json:"side_effects"`
	Interactions      string `json:"interactions"`
	Manufacturer      string `json:"manufacturer"`
	Active            bool   `json:"active" gorm:"default:true"`
}

// Prescription represents a doctor's prescription for a patient
type Prescription struct {
	gorm.Model
	UserID       uint               `json:"user_id" gorm:"index"`
	User         User               `json:"user"`
	VisitID      uint               `json:"visit_id" gorm:"index"`
	Visit        Visit              `json:"visit"`
	DiagnosisID  uint               `json:"diagnosis_id" gorm:"index"`
	Diagnosis    *Diagnosis         `json:"diagnosis" gorm:"foreignKey:DiagnosisID"`
	Items        []PrescriptionItem `json:"items" gorm:"foreignKey:PrescriptionID"`
	Notes        string             `json:"notes"`
	Date         string             `json:"date"`
	DoctorName   string             `json:"doctor_name"`
	Status       string             `json:"status"` // e.g. active, completed, cancelled
	Instructions string             `json:"instructions"`
}

// PrescriptionItem represents a single medication in a prescription
type PrescriptionItem struct {
	gorm.Model
	PrescriptionID uint       `json:"prescription_id" gorm:"index"`
	MedicationID   uint       `json:"medication_id" gorm:"index"`
	Medication     Medication `json:"medication"`
	Dosage         string     `json:"dosage"`
	Frequency      string     `json:"frequency"`
	Duration       string     `json:"duration"`
	Instructions   string     `json:"instructions"`
	Quantity       int        `json:"quantity"`
}
