package userdto

type UserResponse struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
	Role     string `json:"role"`
	// CreatedAt     time.Time `json:"created_at"`
	// UpdateAtYear  int       `json:"update_at"`
	// UpdateAtMonth int       `json:"update_at_month"`
}

type UserResponseDelete struct {
	ID int `json:"id"`
}
