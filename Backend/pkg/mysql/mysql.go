package mysql

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Connection Database
func DatabaseConnection() {
	var err error
	// dsn := "root:@tcp(localhost:3307)/dumbmerchh?charset=utf8mb4&parseTime=True&loc=Local"
	// DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	dsn := "host=localhost user=postgres password=142004 dbname=dumbmerch port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	fmt.Println("Connected to database")
}

// "{USER}:{PASSWORD}@tcp({HOST}:{PORT})/{DATABASE}?charset=utf8mb4&parseTime=True&loc=Local"
