package models

import "time"

type User struct {
	UserId      int    `json:"user_id" gorm:"primary_key"`
	Name        string `json:"name" gorm:"varchar(255)"`
	Email       string `json:"email" gorm:"varchar(255)"`
	Password    string `json:"password" gorm:"varchar(255)"`
	Phone       string `json:"phone" gorm:"varchar(255)"`
	Address     string `json:"address" gorm:"varchar(255)"`
	Role        string `json:"role" gorm:"varchar(50)"`
	Transaction []Transaction
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// type UserRelation struct {
// 	UserId    int       `json:"user_id" gorm:"primary_key"`
// 	Name      string    `json:"name" gorm:"varchar(255)"`
// 	Email     string    `json:"email" gorm:"varchar(255)"`
// 	Password  string    `json:"password" gorm:"varchar(255)"`
// 	Phone     string    `json:"phone" gorm:"varchar(255)"`
// 	Address   string    `json:"address" gorm:"varchar(255)"`
// 	CreatedAt time.Time `json:"created_at"`
// 	UpdatedAt time.Time `json:"updated_at"`
// }

// func (UserRelation) TableName() string {
// 	return "user"
// }
