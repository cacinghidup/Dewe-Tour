package repository

import (
	"dumbmerch/models"

	"gorm.io/gorm"
)

// interface => kontrak
type UserRepository interface {
	FindUsers() ([]models.User, error)
	// CreateUser(user models.User) (models.User, error)
	GetUser(ID int) (models.User, error)
	UpdateUser(user models.User) (models.User, error)
	DeleteUser(user models.User) (models.User, error)
}

// struct save connetion
type repositories struct {
	db *gorm.DB
}

// function connection
func RepositoryUser(db *gorm.DB) *repositories {
	return &repositories{db}
}

// method query
func (r *repositories) FindUsers() ([]models.User, error) {
	var Users []models.User
	err := r.db.Preload("Transaction.Trip").Preload("Transaction.User").Find(&Users).Error
	// err := r.db.Raw("SELECT * FROM users").Scan(&Users).Error

	return Users, err
}

func (r *repositories) GetUser(ID int) (models.User, error) {
	var User models.User
	err := r.db.Preload("Transaction.Trip").Preload("Transaction.User").First(&User, ID).Error
	// err := r.db.Raw("SELECT * FROM users WHERE id=?", ID).Scan(&User).Error

	return User, err
}

// func (r *repositories) CreateUser(user models.User) (models.User, error) {
// 	err := r.db.Create(&user).Error

// 	return user, err
// }

func (r *repositories) UpdateUser(user models.User) (models.User, error) {
	err := r.db.Save(&user).Error
	// err := r.db.Raw("UPDATE users SET name=?,email=?,password=?, updated_at=? WHERE id=?", user.Name, user.Email, user.Password, user.UpdatedAt, ID).Scan(&user).Error

	return user, err
}

func (r *repositories) DeleteUser(user models.User) (models.User, error) {
	err := r.db.Delete(&user).Error
	// err := r.db.Raw("DELETE FROM users WHERE id=?", ID).Scan(&user).Error

	return user, err
}
