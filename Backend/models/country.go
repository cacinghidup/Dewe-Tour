package models

type Countries struct {
	ID   int    `json:"id"`
	Name string `json:"name" gorm:"varchar(255)"`
}

// Relasi BelongsTo dari TRIP
type CountriesResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (CountriesResponse) TableName() string {
	return "countries"
}
