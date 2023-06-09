package handlers

import (
	dtocountry "dumbmerch/dto/country"
	dto "dumbmerch/dto/result"
	"dumbmerch/models"
	"strconv"

	// userdto "dumbmerch/dto/user"
	// "dumbmerch/models"
	"dumbmerch/repository"
	"net/http"

	// "time"

	"github.com/go-playground/validator/v10"

	"github.com/labstack/echo/v4"
)

type handlerCountries struct {
	CountryRepository repository.CountryRepository
}

func HandlerCountry(CountryRepository repository.CountryRepository) *handlerCountries {
	return &handlerCountries{CountryRepository}
}

func (h *handlerCountries) FindCountries(c echo.Context) error {
	country, err := h.CountryRepository.FindCountries()

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: country})
}

func (h *handlerCountries) GetCountry(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	country, err := h.CountryRepository.GetCountry(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: country})
}

func (h *handlerCountries) CreateCountry(c echo.Context) error {
	request := new(dtocountry.CreateCountry)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	country := models.Countries{
		Name: request.Name,
	}

	data, err := h.CountryRepository.CreateCountry(country)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseCountry(data)})
}

func (h *handlerCountries) UpdateCountry(c echo.Context) error {
	request := new(dtocountry.UpdateCountry)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	id, _ := strconv.Atoi(c.Param("id"))
	country, err := h.CountryRepository.GetCountry(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	if request.Name != "" {
		country.Name = request.Name
	}

	data, err := h.CountryRepository.UpdateCountry(country)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseCountry(data)})
}

func (h *handlerCountries) DeleteCountry(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	country, err := h.CountryRepository.GetCountry(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	data, err := h.CountryRepository.DeleteCountry(country)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseCountryDelete(data)})
}

func convertResponseCountry(country models.Countries) dtocountry.CountryResponse {
	return dtocountry.CountryResponse{
		ID:   country.ID,
		Name: country.Name,
	}
}

func convertResponseCountryDelete(country models.Countries) dtocountry.CountryResponseDelete {
	return dtocountry.CountryResponseDelete{
		ID: country.ID,
	}
}
