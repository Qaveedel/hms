package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName         string  `json:"first_name"`
	LastName          string  `json:"last_name"`
	NationalID        string  `json:"national_id" gorm:"unique"`
	FatherName        string  `json:"father_name"`
	Address           string  `json:"address"`
	MobilePhone       string  `json:"mobile_phone"`
	LandlinePhone     string  `json:"landline_phone"`
	EmergencyContact1 string  `json:"emergency_contact1"`
	EmergencyContact2 string  `json:"emergency_contact2"`
	Height            float64 `json:"height"`
	Weight            float64 `json:"weight"`
	HairColor         string  `json:"hair_color"`
	EyeColor          string  `json:"eye_color"`
	SkinColor         string  `json:"skin_color"`
	BloodType         string  `json:"blood_type"`
	Insurance         string  `json:"insurance"`

	// Relationships
	Visits             []Visit             `json:"visits" gorm:"foreignKey:UserID"`
	Prescriptions      []Prescription      `json:"prescriptions" gorm:"foreignKey:UserID"`
	Appointments       []Appointment       `json:"appointments" gorm:"foreignKey:UserID"`
	HereditaryDiseases []HereditaryDisease `json:"hereditary_diseases" gorm:"foreignKey:UserID"`
	Disabilities       []Disability        `json:"disabilities" gorm:"foreignKey:UserID"`
	MedicalImages      []MedicalImage      `json:"medical_images" gorm:"foreignKey:UserID"`
	Surgeries          []Surgery           `json:"surgeries" gorm:"foreignKey:UserID"`
	Allergies          []Allergy           `json:"allergies" gorm:"foreignKey:UserID"`
	ChronicConditions  []ChronicCondition  `json:"chronic_conditions" gorm:"foreignKey:UserID"`
}
