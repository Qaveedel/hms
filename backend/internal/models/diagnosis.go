package models

import (
	"gorm.io/gorm"
)

type Diagnosis struct {
	gorm.Model
	VisitID   uint   `json:"visit_id"`
	Diagnosis string `json:"diagnosis"`
	Notes     string `json:"notes"`
	Visit     *Visit `json:"visit" gorm:"foreignKey:VisitID"`
	// Remove the incorrect foreign key relationship
	// Prescription *Prescription `json:"prescription" gorm:"foreignKey:DiagnosisID"`
}
