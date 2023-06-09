package dtotransaction

import "dumbmerch/models"

type TransactionResponse struct {
	ID         int64  `json:"id" form:"id"`
	CounterQty int32  `json:"counter_qty" form:"counter_qty" `
	Total      int64  `json:"total" form:"total" `
	Status     string `json:"status" form:"status" `
	Attachment string `json:"attachment" form:"attachment" `
	TripID     int    `json:"trip_id" `
	Trip       models.Trip
	UserId     int `json:"user_id"`
	User       models.User
}
