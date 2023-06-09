package models

type Transaction struct {
	ID         int    `json:"id" gnorm:"constraint:OnDelete:CASCADE,OnUpdate:CASCADE"`
	CounterQty int32  `json:"counter_qty" gnorm:"int(32)"`
	Total      int64  `json:"total" gnorm:"int(64)"`
	Status     string `json:"status" gnorm:"varchar(100)"`
	Attachment string `json:"attachment" gnorm:"varchar(100)"`
	TripID     int    `json:"trip_id"`
	Trip       Trip
	UserId     int  `json:"user_id"`
	User       User `gnorm:"foreignKey:UserId"`
}

// type TransactionRelation struct {
// 	ID         int    `json:"id"`
// 	CounterQty int32  `json:"counter_qty"`
// 	Total      int64  `json:"total"`
// 	Status     string `json:"status"`
// 	Attachment string `json:"attachment"`
// 	TripID     int    `json:"trip_id"`
// 	UserId     int    `json:"user_id"`
// 	Trip       TripResponseRelation
// }

// func (TransactionRelation) TableName() string {
// 	return "transactions"
// }
