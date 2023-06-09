package repository

import (
	"dumbmerch/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	FindTransaction() ([]models.Transaction, error)
	CreateTransaction(Transaction models.Transaction) (models.Transaction, error)
	UpdateTransaction(Transaction models.Transaction) (models.Transaction, error)
	GetTransactionTrip(ID int) (models.Trip, error)
	GetTransactionUser(ID int) (models.User, error)
	GetTransaction(ID int) (models.Transaction, error)
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

func (r *repositoriesTransaction) UpdateTransaction(Transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Preload("Trip").Save(&Transaction).Error

	return Transaction, err
}

func (r *repositoriesTransaction) GetTransaction(ID int) (models.Transaction, error) {
	var Transaction models.Transaction
	err := r.db.Preload("User").Preload("Trip").First(&Transaction, ID).Error

	return Transaction, err
}
