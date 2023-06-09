package models

// import "time"

type Trip struct {
	ID      int    `json:"id"`
	Title   string `json:"title" gorm:"varchar(100)"`
	Country string `json:"country" gorm:"varchar(100)"`
	// Countries      CountriesResponse
	Accomodation   string `json:"accomodation" gorm:"varchar(100)"`
	Transportation string `json:"transportation" gorm:"varchar(100)"`
	Eat            string `json:"eat" gorm:"varchar(100)"`
	Day            int32  `json:"day" gorm:"int(32)"`
	Night          int32  `json:"night" gorm:"int(32)"`
	DateTrip       string `json:"dateTrip" gorm:"varchar(100)"`
	Price          int64  `json:"price" gorm:"int(64)"`
	Quota          int32  `json:"quota" gorm:"int(32)"`
	Description    string `json:"description" gorm:"varchar(255)"`
	Image          string `json:"image" gorm:"varchar(100)"`
}

// type TripResponseRelation struct {
// 	ID      int    `json:"id"`
// 	Title   string `json:"title"`
// 	Country string `json:"country"`
// 	// Countries      CountriesResponse
// 	Accomodation   string `json:"accomodation"`
// 	Transportation string `json:"transportation"`
// 	Eat            string `json:"eat"`
// 	Day            int32  `json:"day"`
// 	Night          int32  `json:"night"`
// 	DateTrip       string `json:"dateTrip"`
// 	Price          int64  `json:"price"`
// 	Quota          int32  `json:"quota"`
// 	Description    string `json:"description"`
// 	Image          string `json:"image"`
// }

// func (TripResponseRelation) TableName() string {
// 	return "trips"
// }
