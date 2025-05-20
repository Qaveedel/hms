package models

import (
	"barman/internal/models/triage"
	"time"

	"gorm.io/gorm"
)

type Visit struct {
	gorm.Model
	UserID       uint           `json:"user_id"`
	Date         time.Time      `json:"date"`
	Type         string         `json:"type"` // regular, emergency, follow-up
	TriageData   *triage.Triage `json:"triage_data" gorm:"foreignKey:VisitID"`
	DoctorReport *Diagnosis     `json:"doctor_report" gorm:"foreignKey:VisitID"`
	Prescription *Prescription  `json:"prescription" gorm:"foreignKey:VisitID"`
	User         *User          `json:"user" gorm:"foreignKey:UserID"`
}
