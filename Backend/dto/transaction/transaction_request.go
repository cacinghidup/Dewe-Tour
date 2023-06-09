package dtotransaction

type TransactionRequest struct {
	CounterQty int32  `json:"counter_qty" form:"counter_qty" validate:"required"`
	Total      int64  `json:"total" form:"total" validate:"required"`
	Status     string `json:"status" form:"status" validate:"required"`
	Attachment string `json:"attachment" form:"attachment" validate:"required"`
	TripID     int    `json:"trip_id" validate:"required"`
	UserId     int    `json:"user_id" form:"user_id"`
}

type UpdateTransaction struct {
	Status string `json:"status" form:"status"`
}
