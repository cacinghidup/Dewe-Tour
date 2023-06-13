package repository

import (
	"dumbmerch/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	FindTransaction() ([]models.Transaction, error)
	CreateTransaction(Transaction models.Transaction) (models.Transaction, error)
	UpdateTransaction(status string, ID int) (models.Transaction, error)
	GetTransactionTrip(ID int) (models.Trip, error)
	GetTransactionUser(ID int) (models.User, error)
	GetTransaction(ID int) (models.Transaction, error)

	FindBooking() ([]models.Booking, error)
	CreateBooking(Booking models.Booking) (models.Booking, error)
	DeleteBooking(Booking models.Booking) (models.Booking, error)
	GetBooking(ID int) (models.Booking, error)
}

type repositoriesTransaction struct {
	db *gorm.DB
}

func RepositoryTransaction(db *gorm.DB) *repositoriesTransaction {
	return &repositoriesTransaction{db}
}

func (r *repositoriesTransaction) FindTransaction() ([]models.Transaction, error) {
	var Transactions []models.Transaction
	err := r.db.Preload("User").Preload("Trip").Find(&Transactions).Error

	return Transactions, err
}

func (r *repositoriesTransaction) CreateTransaction(Transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&Transaction).Error

	return Transaction, err
}

func (r *repositoriesTransaction) GetTransactionTrip(ID int) (models.Trip, error) {
	var Trip models.Trip
	err := r.db.First(&Trip, ID).Error

	return Trip, err
}

func (r *repositoriesTransaction) GetTransactionUser(ID int) (models.User, error) {
	var User models.User
	err := r.db.First(&User, ID).Error

	return User, err
}

func (r *repositoriesTransaction) UpdateTransaction(status string, ID int) (models.Transaction, error) {
	var transaction models.Transaction
	r.db.Preload("Trip").Preload("User").First(&transaction, ID)

	// fmt.Println("Ini di repo transaksi", status, transaction.Status)

	if status != transaction.Status && status == "Success" {
		var trip models.Trip
		r.db.First(&trip, transaction.Trip.ID)
		trip.Quota = trip.Quota - transaction.CounterQty
		r.db.Save(&trip)
	}

	transaction.Status = status
	err := r.db.Save(&transaction).Error

	return transaction, err
}

func (r *repositoriesTransaction) GetTransaction(ID int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("User").Preload("Trip").First(&Transaction, ID).Error

	return Transaction, err
}

// ---------------------------------------------------------------- //
func (r *repositoriesTransaction) CreateBooking(Booking models.Booking) (models.Booking, error) {
	err := r.db.Create(&Booking).Error

	return Booking, err
}

func (r *repositoriesTransaction) DeleteBooking(Booking models.Booking) (models.Booking, error) {
	err := r.db.Delete(&Booking).Error

	return Booking, err
}

func (r *repositoriesTransaction) FindBooking() ([]models.Booking, error) {
	var Booking []models.Booking
	err := r.db.Preload("User").Preload("Trip").Find(&Booking).Error

	return Booking, err
}

func (r *repositoriesTransaction) GetBooking(ID int) (models.Booking, error) {
	var Booking models.Booking
	err := r.db.First(&Booking, ID).Error

	return Booking, err
}
