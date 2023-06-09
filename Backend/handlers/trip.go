package handlers

import (
	dto "dumbmerch/dto/result"
	tripdto "dumbmerch/dto/trip"
	"dumbmerch/models"
	"dumbmerch/repository"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type handlerTrip struct {
	TripRepository repository.TripRepository
}

func HandlerTrip(TripRepository repository.TripRepository) *handlerTrip {
	return &handlerTrip{TripRepository}
}

func (h *handlerTrip) FindTrip(c echo.Context) error {
	trips, err := h.TripRepository.FindTrip()

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: trips,
	})
}

func (h *handlerTrip) GetTrip(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	trip, err := h.TripRepository.GetTrip(id)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseTrips(trip)})
}

func (h *handlerTrip) CreateTrip(c echo.Context) error {
	// CountriesID, _ := strconv.Atoi(c.FormValue("countries_id"))
	Day, _ := strconv.Atoi(c.FormValue("day"))
	Night, _ := strconv.Atoi(c.FormValue("night"))
	Price, _ := strconv.Atoi(c.FormValue("price"))
	Quota, _ := strconv.Atoi(c.FormValue("quota"))

	UploadImage := c.Get("dataFile").(string)

	// TripCountry, _ := h.TripRepository.GetCountryTrip(CountriesID)

	request := tripdto.TripResquest{
		Title:          c.FormValue("title"),
		Country:        c.FormValue("country"),
		Accomodation:   c.FormValue("accomodation"),
		Transportation: c.FormValue("transportation"),
		Eat:            c.FormValue("eat"),
		Day:            int32(Day),
		Night:          int32(Night),
		DateTrip:       c.FormValue("date_trip"),
		Price:          int64(Price),
		Quota:          int32(Quota),
		Description:    c.FormValue("description"),
		Image:          UploadImage,
	}

	validation := validator.New()
	err := validation.Struct(request)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	trip := models.Trip{
		Title:          request.Title,
		Country:        request.Country,
		Accomodation:   request.Accomodation,
		Transportation: request.Transportation,
		Eat:            request.Eat,
		Day:            request.Day,
		Night:          request.Night,
		DateTrip:       request.DateTrip,
		Price:          request.Price,
		Quota:          request.Quota,
		Description:    request.Description,
		Image:          UploadImage,
	}

	data, err := h.TripRepository.CreateTrip(trip)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseTrips(data)})
}

func (h *handlerTrip) UpdateTrip(c echo.Context) error {
	request := new(tripdto.UpdateTrip)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	id, _ := strconv.Atoi(c.Param("id"))
	trip, err := h.TripRepository.GetTrip(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	if request.Title != "" {
		trip.Title = request.Title
	}
	if request.Country != "" {
		trip.Country = request.Country
	}
	if request.Accomodation != "" {
		trip.Accomodation = request.Accomodation
	}
	if request.Transportation != "" {
		trip.Transportation = request.Transportation
	}
	if request.Eat != "" {
		trip.Eat = request.Eat
	}
	if request.Day != 0 {
		trip.Day = request.Day
	}
	if request.Night != 0 {
		trip.Night = request.Night
	}
	if request.DateTrip != "" {
		trip.DateTrip = request.DateTrip
	}
	if request.Price != 0 {
		trip.Price = request.Price
	}
	if request.Quota != 0 {
		trip.Quota = request.Quota
	}
	if request.Description != "" {
		trip.Description = request.Description
	}
	if request.Image != "" {
		trip.Image = request.Image
	}

	data, err := h.TripRepository.UpdateTrip(trip)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseTrips(data)})
}

func (h *handlerTrip) DeleteTrip(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	trip, err := h.TripRepository.GetTrip(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	data, err := h.TripRepository.DeleteTrip(trip)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseDeleteTrip(data)})
}

// convert response data
func convertResponseTrips(trip models.Trip) tripdto.TripResponse {
	return tripdto.TripResponse{
		ID:             trip.ID,
		Title:          trip.Title,
		Country:        trip.Country,
		Accomodation:   trip.Accomodation,
		Transportation: trip.Transportation,
		Eat:            trip.Eat,
		Day:            trip.Day,
		Night:          trip.Night,
		DateTrip:       trip.DateTrip,
		Price:          trip.Price,
		Quota:          trip.Quota,
		Description:    trip.Description,
		Image:          trip.Image,
	}
}

func convertResponseDeleteTrip(trip models.Trip) tripdto.TripResponseDelete {
	return tripdto.TripResponseDelete{
		ID: trip.ID,
	}
}
