package handlers

import (
	dto "dumbmerch/dto/result"
	dtotransaction "dumbmerch/dto/transaction"
	"dumbmerch/models"
	"dumbmerch/repository"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"gopkg.in/gomail.v2"
)

type handlerTransaction struct {
	TransactionRepository repository.TransactionRepository
}

func HandlerTransaction(TransactionRepository repository.TransactionRepository) *handlerTransaction {
	return &handlerTransaction{
		TransactionRepository,
	}
}

func (h *handlerTransaction) FindTransaction(c echo.Context) error {
	transaction, err := h.TransactionRepository.FindTransaction()

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: transaction,
	})

}

func (h *handlerTransaction) CreateTransaction(c echo.Context) error {
	request := new(dtotransaction.TransactionRequest)
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

	var transactionIsMatch = false
	var transactionId int
	for !transactionIsMatch {
		transactionId = int(time.Now().Unix())
		transactionData, _ := h.TransactionRepository.GetTransaction(transactionId)
		if transactionData.ID == 0 {
			transactionIsMatch = true
		}
	}

	TransactionTrip, _ := h.TransactionRepository.GetTransactionTrip(request.TripID)
	TransactionUser, _ := h.TransactionRepository.GetTransactionUser(request.UserId)

	// fmt.Println(TransactionUser)

	transaction := models.Transaction{
		ID:         transactionId,
		CounterQty: request.CounterQty,
		Total:      request.Total,
		Status:     request.Status,
		Attachment: request.Attachment,
		TripID:     request.TripID,
		Trip:       models.Trip(TransactionTrip),
		UserId:     request.UserId,
		User:       models.User(TransactionUser),
	}

	data, err := h.TransactionRepository.CreateTransaction(transaction)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	// 1. Initiate Snap client
	var s = snap.Client{}
	s.New("SB-Mid-server-oJV_KaHcxWG50Oz_2Hwwp4oR", midtrans.Sandbox)
	// Use to midtrans.Production if you want Production Environment (accept real transaction).

	// 2. Initiate Snap request param
	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(data.ID),
			GrossAmt: int64(data.Total),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: data.User.Name,
			Email: data.User.Email,
			Phone: data.User.Phone,
		},
	}

	// 3. Execute request create Snap transaction to Midtrans Snap API
	snapResp, _ := s.CreateTransaction(req)

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: snapResp,
	})
}

func (h *handlerTransaction) UpdateTransaction(c echo.Context) error {
	request := new(dtotransaction.UpdateTransaction)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	id, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetTransaction(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	if request.Status != "" {
		transaction.Status = request.Status
	}
	if request.ID != 0 {
		transaction.ID = request.ID
	}

	data, err := h.TransactionRepository.UpdateTransaction(request.Status, request.ID)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseTransaction(data),
	})
}

func (h *handlerTransaction) GetTransaction(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetTransaction(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseTransaction(transaction),
	})
}

func (h *handlerTransaction) Notification(c echo.Context) error {
	var notificationPayload map[string]interface{}

	if err := c.Bind(&notificationPayload); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId := notificationPayload["order_id"].(string)

	// fmt.Println("Payload ygy di handler notification", transactionStatus, fraudStatus, orderId)

	order_id, _ := strconv.Atoi(orderId)

	transaction, _ := h.TransactionRepository.GetTransaction(order_id)

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			// TODO set transaction status on your database to 'challenge'
			// e.g: 'Payment status challenged. Please take action on your Merchant Administration Portal
			h.TransactionRepository.UpdateTransaction("Pending", order_id)
		} else if fraudStatus == "accept" {
			// TODO set transaction status on your database to 'success'
			SendMail("Success", transaction)
			h.TransactionRepository.UpdateTransaction("Success", order_id)
		}
	} else if transactionStatus == "settlement" {
		// TODO set transaction status on your databaase to 'success'
		SendMail("Success", transaction)
		h.TransactionRepository.UpdateTransaction("Success", order_id)
	} else if transactionStatus == "deny" {
		// TODO you can ignore 'deny', because most of the time it allows payment retries
		// and later can become success
		h.TransactionRepository.UpdateTransaction("Failed", order_id)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		// TODO set transaction status on your databaase to 'failure'
		h.TransactionRepository.UpdateTransaction("Failed", order_id)
	} else if transactionStatus == "pending" {
		// TODO set transaction status on your databaase to 'pending' / waiting payment
		h.TransactionRepository.UpdateTransaction("Pending", order_id)
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: notificationPayload})
}

func SendMail(status string, transaction models.Transaction) {

	// fmt.Println("Ini fungsi send email ", transaction.Status, status)

	if status != transaction.Status && status == "Success" {
		var CONFIG_SMTP_HOST = "smtp.gmail.com"
		var CONFIG_SMTP_PORT = 587
		var CONFIG_SENDER_NAME = "Dewe_Tour <demo.dumbways@gmail.com>"
		var CONFIG_AUTH_EMAIL = "yogaaneh1@gmail.com"
		var CONFIG_AUTH_PASSWORD = "gsewligowbgudhpz"

		var productName = transaction.Trip.Title
		var price = strconv.Itoa(int(transaction.Total))

		mailer := gomail.NewMessage()
		mailer.SetHeader("From", CONFIG_SENDER_NAME)
		mailer.SetHeader("To", transaction.User.Email)
		mailer.SetHeader("Subject", "Transaction Status")
		mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
	  <html lang="en">
		<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		<style>
		  h1 {
		  color: brown;
		  }
		</style>
		</head>
		<body>
		<h2>Product payment :</h2>
		<ul style="list-style-type:none;">
		  <li>Trip : %s</li>
		  <li>Total payment: Rp.%s</li>
		  <li>Status : <b>%s</b></li>
		</ul>
		</body>
	  </html>`, productName, price, status))

		dialer := gomail.NewDialer(
			CONFIG_SMTP_HOST,
			CONFIG_SMTP_PORT,
			CONFIG_AUTH_EMAIL,
			CONFIG_AUTH_PASSWORD,
		)

		err := dialer.DialAndSend(mailer)
		if err != nil {
			log.Fatal(err.Error())
		}

		log.Println("Mail sent! to " + transaction.User.Email)
	}
}

// convert response data
func convertResponseTransaction(transaction models.Transaction) dtotransaction.TransactionResponse {
	return dtotransaction.TransactionResponse{
		ID:         int64(transaction.ID),
		CounterQty: transaction.CounterQty,
		Total:      transaction.Total,
		Status:     transaction.Status,
		Attachment: transaction.Attachment,
		TripID:     transaction.TripID,
		Trip:       transaction.Trip,
		UserId:     transaction.UserId,
		User:       transaction.User,
	}
}

// --------------------------------------------------------------- //
func (h *handlerTransaction) CreateBooking(c echo.Context) error {
	request := new(dtotransaction.TransactionRequest)
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

	TransactionTrip, _ := h.TransactionRepository.GetTransactionTrip(request.TripID)
	TransactionUser, _ := h.TransactionRepository.GetTransactionUser(request.UserId)

	booking := models.Booking{
		CounterQty: request.CounterQty,
		Total:      request.Total,
		Status:     request.Status,
		Attachment: request.Attachment,
		TripID:     request.TripID,
		Trip:       models.Trip(TransactionTrip),
		UserId:     request.UserId,
		User:       models.User(TransactionUser),
	}

	data, err := h.TransactionRepository.CreateBooking(booking)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: data,
	})
}

func (h *handlerTransaction) DeleteBooking(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	booking, err := h.TransactionRepository.GetBooking(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	data, err := h.TransactionRepository.DeleteBooking(booking)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: data})
}

func (h *handlerTransaction) FindBooking(c echo.Context) error {
	transaction, err := h.TransactionRepository.FindBooking()

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: transaction,
	})

}

func (h *handlerTransaction) GetBooking(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetBooking(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: transaction,
	})
}
