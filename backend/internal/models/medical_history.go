package models

import (
	"gorm.io/gorm"
)

type HereditaryDisease struct {
	gorm.Model
	UserID uint   `json:"user_id"`
	Name   string `json:"name"`
	User   *User  `json:"user" gorm:"foreignKey:UserID"`
}

type Disability struct {
	gorm.Model
	UserID uint   `json:"user_id"`
	Name   string `json:"name"`
	Type   string `json:"type"` // disability, impairment, allergy
	User   *User  `json:"user" gorm:"foreignKey:UserID"`
}

type MedicalImage struct {
	gorm.Model
	UserID      uint   `json:"user_id"`
	ImageURL    string `json:"image_url"`
	Description string `json:"description"`
	CenterName  string `json:"center_name"`
	Date        string `json:"date"`
	User        *User  `json:"user" gorm:"foreignKey:UserID"`
}

type Surgery struct {
	gorm.Model
	UserID      uint   `json:"user_id"`
	Name        string `json:"name"`
	Date        string `json:"date"`
	Description string `json:"description"`
	User        *User  `json:"user" gorm:"foreignKey:UserID"`
}

type Allergy struct {
	gorm.Model
	UserID         uint   `json:"user_id"`
	Name           string `json:"name"`
	Reaction       string `json:"reaction"`
	Severity       string `json:"severity"` // mild, moderate, severe
	Diagnosis      string `json:"diagnosis"`
	DiagnosisDate  string `json:"diagnosis_date"`
	TreatmentNotes string `json:"treatment_notes"`
	User           *User  `json:"user" gorm:"foreignKey:UserID"`
}

type ChronicCondition struct {
	gorm.Model
	UserID         uint   `json:"user_id"`
	Name           string `json:"name"`
	Diagnosis      string `json:"diagnosis"`
	DiagnosisDate  string `json:"diagnosis_date"`
	Medications    string `json:"medications"`
	TreatmentNotes string `json:"treatment_notes"`
	User           *User  `json:"user" gorm:"foreignKey:UserID"`
}
