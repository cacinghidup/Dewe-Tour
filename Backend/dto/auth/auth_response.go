package authdto

type LoginResponse struct {
	Email  string `gorm:"type: varchar(255)" json:"email"`
	Token  string `gorm:"type: varchar(255)" json:"token"`
	Role   string `json:"role" gorm:"type:varchar(50)"`
	UserId int    `json:"user_id"`
}

type AuthResponse struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
}

type CheckAuthResponse struct {
	UserId int    `json:"user_id"`
	Role   string `json:"role"`
}
