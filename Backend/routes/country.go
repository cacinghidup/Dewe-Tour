package routes

import (
	"dumbmerch/handlers"
	midlleware "dumbmerch/pkg/middleware"
	"dumbmerch/pkg/mysql"
	"dumbmerch/repository"

	"github.com/labstack/echo/v4"
)

func CountryRoutes(e *echo.Group) {
	countryRepository := repository.RepositoryCountry(mysql.DB)
	h := handlers.HandlerCountry(countryRepository)

	e.GET("/countries", h.FindCountries)
	e.GET("/countries/:id", h.GetCountry)
	e.POST("/countries", midlleware.Auth(h.CreateCountry))
	e.PATCH("/countries/:id", midlleware.Auth(h.UpdateCountry))
	e.DELETE("/countries/:id", midlleware.Auth(h.DeleteCountry))
}
