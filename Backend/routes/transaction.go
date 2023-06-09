package routes

import (
	"dumbmerch/handlers"
	"dumbmerch/pkg/middleware"
	"dumbmerch/pkg/mysql"
	"dumbmerch/repository"

	"github.com/labstack/echo/v4"
)

func TransactionRoutes(e *echo.Group) {
	transactionRepository := repository.RepositoryTransaction(mysql.DB)
	h := handlers.HandlerTransaction(transactionRepository)

	e.GET("/orders", h.FindTransaction)
	e.POST("/transaction", middleware.Auth(h.CreateTransaction))
	e.GET("/transaction/:id", middleware.Auth(h.GetTransaction))
	e.PATCH("/transaction/:id", middleware.Auth(h.UpdateTransaction))
}
