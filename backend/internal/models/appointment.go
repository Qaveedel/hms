package models

import (
	"time"
	"gorm.io/gorm"
)

type Appointment struct {
	gorm.Model
	UserID    uint      `json:"user_id"`
	Date      time.Time `json:"date"`
	Status    string    `json:"status"` // scheduled, completed, cancelled
	Notes     string    `json:"notes"`
	User      *User     `json:"user" gorm:"foreignKey:UserID"`
} 