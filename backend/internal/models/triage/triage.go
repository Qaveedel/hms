package triage

import (
	"gorm.io/gorm"
)

type Triage struct {
	gorm.Model
	VisitID          uint    `json:"visit_id"`
	HeartRate        int     `json:"heart_rate"`
	BloodPressure    string  `json:"blood_pressure"`
	Temperature      float64 `json:"temperature"`
	RespiratoryRate  int     `json:"respiratory_rate"`
	OxygenSaturation int     `json:"oxygen_saturation"`
	PainLevel        int     `json:"pain_level"`
	Symptoms         string  `json:"symptoms"`
	PriorityLevel    string  `json:"priority_level" gorm:"default:'normal'"`
	Type             string  `json:"type" gorm:"default:'pending'"` // pending, completed, cancelled
}
