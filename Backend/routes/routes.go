package routes

import "github.com/labstack/echo/v4"

func RouteInit(e *echo.Group) {
	UserRoutes(e)
	// CountryRoutes(e)
	TripRoutes(e)
	AuthRoutes(e)
	TransactionRoutes(e)
}
