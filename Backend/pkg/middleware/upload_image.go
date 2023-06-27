package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
	"github.com/labstack/echo/v4"
)

func UploadFile(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		var ctx = context.Background()

		file, err := c.FormFile("uploadImage")

		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		src, err := file.Open()

		if err != nil {
			return c.JSON(http.StatusBadRequest, err)
		}

		defer src.Close()

		// tempFile, err := os.CreateTemp("./upload", "image-*.png") // upload/image-3e10e160.png
		// if err != nil {
		// 	return c.JSON(http.StatusInternalServerError, err)
		// }

		// defer tempFile.Close()

		// if _, err = io.Copy(tempFile, src); err != nil {
		// 	return c.JSON(http.StatusInternalServerError, err)
		// }

		var CLOUD_NAME = os.Getenv("CLOUD_NAME")
		var API_KEY = os.Getenv("API_KEY")
		var API_SECRET = os.Getenv("API_SECRET")

		// Add your Cloudinary credentials ...
		cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

		// Upload file to Cloudinary ...
		resp, err := cld.Upload.Upload(ctx, src, uploader.UploadParams{Folder: "dewe-tour"})

		if err != nil {
			fmt.Println(err.Error())
		}

		// fmt.Println("ini upload file", resp.SecureURL)
		// ctx := tempFile.Name() // upload/image-3e10e160.png

		c.Set("dataFile", resp.SecureURL)

		return next(c)
	}
}
