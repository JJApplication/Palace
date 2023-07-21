/*
   Create: 2023/7/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"fmt"
	"github.com/JJApplication/fushin/server/http"
	"path/filepath"
)

// service
func checkLogin(c *http.Context) {
	code := c.Query("palaceCode")
	fmt.Printf("palaceCode code: %s\n", code)
	if code != PalaceCode {
		c.AbortWithStatus(403)
		return
	}

	c.Next()
}

func uploadImages(c *http.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		fmt.Printf("upload images error: %s\n", err.Error())
		c.ResponseStr(200, err.Error())
		return
	}

	for index, file := range form.File["files"] {
		fmt.Printf("process [%d] image: %s\n", index, file.Filename)
		err = c.SaveUploadedFile(file, filepath.Join(UploadPath, file.Filename))
		if err != nil {
			fmt.Printf("process [%d] image %s error: %s\n", index, file.Filename, err.Error())
			continue
		}
	}

	c.ResponseStr(200, "")
	return
}

func deleteImages(c *http.Context) {

}

func generateImages(c *http.Context) {
	go generatePhotoJSON(UploadPath, PhotoOutput, UploadPrefix, UploadSize)
	c.ResponseStr(200, "")
	return
}

func resizeImages(c *http.Context) {
	go taskCompress()
	c.ResponseStr(200, "")
	return
}

func convertImages(c *http.Context) {
	go taskConvert()
	c.ResponseStr(200, "")
	return
}

func renameImages(c *http.Context) {
	go taskRename()
	c.ResponseStr(200, "")
	return
}
