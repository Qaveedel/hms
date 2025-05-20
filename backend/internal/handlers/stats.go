package handlers

import (
	"net/http"
	"time"

	"barman/internal/database"
	"barman/internal/models"
	"barman/internal/models/triage"

	"github.com/gin-gonic/gin"
)

func GetStats(c *gin.Context) {
	var stats struct {
		TotalPatients        int64 `json:"total_patients"`
		TotalVisits          int64 `json:"total_visits"`
		TotalPrescriptions   int64 `json:"total_prescriptions"`
		TotalAppointments    int64 `json:"total_appointments"`
		TodayVisits          int64 `json:"today_visits"`
		TodayPrescriptions   int64 `json:"today_prescriptions"`
		TodayAppointments    int64 `json:"today_appointments"`
		PendingTriage        int64 `json:"pending_triage"`
		UpcomingAppointments int64 `json:"upcoming_appointments"`
	}

	// Get total counts
	database.DB.Model(&models.User{}).Count(&stats.TotalPatients)
	database.DB.Model(&models.Visit{}).Count(&stats.TotalVisits)
	database.DB.Model(&models.Prescription{}).Count(&stats.TotalPrescriptions)
	database.DB.Model(&models.Appointment{}).Count(&stats.TotalAppointments)

	// Get today's counts
	today := time.Now().Truncate(24 * time.Hour)
	tomorrow := today.Add(24 * time.Hour)

	database.DB.Model(&models.Visit{}).Where("created_at >= ? AND created_at < ?", today, tomorrow).Count(&stats.TodayVisits)
	database.DB.Model(&models.Prescription{}).Where("created_at >= ? AND created_at < ?", today, tomorrow).Count(&stats.TodayPrescriptions)
	database.DB.Model(&models.Appointment{}).Where("date >= ? AND date < ?", today, tomorrow).Count(&stats.TodayAppointments)

	// Get pending triage count - using type instead of status
	database.DB.Model(&triage.Triage{}).Where("type = ?", "pending").Count(&stats.PendingTriage)

	// Get upcoming appointments count
	database.DB.Model(&models.Appointment{}).Where("date >= ? AND status = ?", time.Now(), "scheduled").Count(&stats.UpcomingAppointments)

	c.JSON(http.StatusOK, stats)
}
