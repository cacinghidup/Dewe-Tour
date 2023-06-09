package database

import (
	"dumbmerch/models"
	"dumbmerch/pkg/mysql"
	"fmt"
)

// automatic migrate
func RunMigration() {
	err := mysql.DB.AutoMigrate(
		&models.User{},
		// &models.Countries{},
		&models.Trip{},
		&models.Transaction{},
	)

	if err != nil {
		panic("Migration Failed")
	}

	fmt.Println("Migration Success")
}
