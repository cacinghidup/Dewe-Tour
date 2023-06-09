package repository

import (
	"dumbmerch/models"

	"gorm.io/gorm"
)

type TripRepository interface {
	FindTrip() ([]models.Trip, error)
	GetTrip(ID int) (models.Trip, error)
	CreateTrip(Trip models.Trip) (models.Trip, error)
	// GetCountryTrip(ID int) (models.Countries, error)
	UpdateTrip(Trip models.Trip) (models.Trip, error)
	DeleteTrip(Trip models.Trip) (models.Trip, error)
}

type repositoriesTrip struct {
	db *gorm.DB
}

func RepositoryTrip(db *gorm.DB) *repositoriesTrip {
	return &repositoriesTrip{db}
}

func (r *repositoriesTrip) FindTrip() ([]models.Trip, error) {
	var Trips []models.Trip
	err := r.db.Find(&Trips).Error

	return Trips, err
}

func (r *repositoriesTrip) GetTrip(ID int) (models.Trip, error) {
	var Trip models.Trip
	err := r.db.First(&Trip, ID).Error

	return Trip, err
}

func (r *repositoriesTrip) CreateTrip(Trip models.Trip) (models.Trip, error) {
	err := r.db.Create(&Trip).Error

	return Trip, err
}

// func (r *repositoriesTrip) GetCountryTrip(ID int) (models.Countries, error) {
// 	var Country models.Countries
// 	err := r.db.First(&Country, ID).Error

// 	return Country, err
// }

func (r *repositoriesTrip) UpdateTrip(Trip models.Trip) (models.Trip, error) {
	err := r.db.Save(&Trip).Error

	return Trip, err
}

func (r *repositoriesTrip) DeleteTrip(Trip models.Trip) (models.Trip, error) {
	err := r.db.Delete(&Trip).Error

	return Trip, err
}
