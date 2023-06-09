package tripdto

type TripResquest struct {
	Title          string `json:"title" form:"title" validate:"required"`
	Country        string `json:"country" form:"country" validate:"required"`
	Accomodation   string `json:"accomodation" form:"accomodation" validate:"required"`
	Transportation string `json:"transportation" form:"transportation" validate:"required"`
	Eat            string `json:"eat" form:"eat" validate:"required"`
	Day            int32  `json:"day" form:"day" validate:"required"`
	Night          int32  `json:"night" form:"night" validate:"required"`
	DateTrip       string `json:"dateTrip" validate:"required"`
	Price          int64  `json:"price" form:"price" validate:"required"`
	Quota          int32  `json:"quota" form:"quota" validate:"required"`
	Description    string `json:"description" form:"description" validate:"required"`
	Image          string `json:"image" form:"image" validate:"required"`
}

type UpdateTrip struct {
	Title          string `json:"title" form:"title"`
	Country        string `json:"country" form:"country"`
	Accomodation   string `json:"accomodation" form:"accomodation"`
	Transportation string `json:"transportation" form:"transportation"`
	Eat            string `json:"eat" form:"eat"`
	Day            int32  `json:"day" form:"day"`
	Night          int32  `json:"night" form:"night"`
	DateTrip       string `json:"dateTrip"`
	Price          int64  `json:"price" form:"price"`
	Quota          int32  `json:"quota" form:"quota"`
	Description    string `json:"description" form:"description"`
	Image          string `json:"image" form:"image"`
}
