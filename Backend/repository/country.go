package repository

import (
	"dumbmerch/models"

	"gorm.io/gorm"
)

type CountryRepository interface {
	FindCountries() ([]models.Countries, error)
	GetCountry(ID int) (models.Countries, error)
	CreateCountry(country models.Countries) (models.Countries, error)
	UpdateCountry(country models.Countries) (models.Countries, error)
	DeleteCountry(country models.Countries) (models.Countries, error)
}

// Save Connection
type repositoriesCountry struct {
	db *gorm.DB
}

// Fungsi Koneksi
func RepositoryCountry(db *gorm.DB) *repositoriesCountry {
	return &repositoriesCountry{db}
}

// Method Query
func (r *repositoriesCountry) FindCountries() ([]models.Countries, error) {
	var Countries []models.Countries
	err := r.db.Find(&Countries).Error

	return Countries, err
}

func (r *repositoriesCountry) GetCountry(ID int) (models.Countries, error) {
	var Country models.Countries
	err := r.db.First(&Country, ID).Error

	return Country, err
}

func (r *repositoriesCountry) CreateCountry(country models.Countries) (models.Countries, error) {
	err := r.db.Create(&country).Error

	return country, err
}

func (r *repositoriesCountry) UpdateCountry(country models.Countries) (models.Countries, error) {
	err := r.db.Save(&country).Error

	return country, err
}

func (r *repositoriesCountry) DeleteCountry(country models.Countries) (models.Countries, error) {
	err := r.db.Delete(&country).Error

	return country, err
}
