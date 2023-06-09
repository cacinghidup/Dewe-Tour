package dtocountry

type CountryResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type CountryResponseDelete struct {
	ID int `json:"id"`
}
