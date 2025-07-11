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
	"os"
	"palace/config"
	"path/filepath"
	"strings"
)

func uploadImages(c *http.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		fmt.Printf("upload images error: %s\n", err.Error())
		c.ResponseStr(200, err.Error())
		return
	}

	for index, file := range form.File["files"] {
		fmt.Printf("process [%d] image: %s\n", index, file.Filename)
		err = c.SaveUploadedFile(file, filepath.Join(config.UploadPath, file.Filename))
		if err != nil {
			fmt.Printf("process [%d] image %s error: %s\n", index, file.Filename, err.Error())
			continue
		}
	}

	// generate after upload
	go generatePhotoJSON(config.UploadPath, config.PhotoOutput, config.UploadPrefix, config.ThumbnailPrefix, config.UploadSize)
	c.ResponseStr(200, "")
	return
}

type deleteModel struct {
	DeleteId   int    `json:"deleteId"`
	DeleteName string `json:"deleteName"`
}

func deleteImages(c *http.Context) {
	var body deleteModel
	err := c.BindJSON(&body)
	if err != nil {
		c.ResponseStr(500, err.Error())
		return
	}
	fmt.Printf("delete photo: [%d] [%s]\n", body.DeleteId, body.DeleteName)
	realImagePath := filepath.Join(".", body.DeleteName)
	err = os.Remove(realImagePath)
	fmt.Println("remove image", realImagePath, err)
	// try to remove thumbnail
	realThumbnailPath := filepath.Join(".", strings.ReplaceAll(body.DeleteName, config.UploadPrefix, config.ThumbnailPrefix))
	err = os.Remove(realThumbnailPath)
	fmt.Println("remove thumbnail", realThumbnailPath, err)
	go generatePhotoJSON(config.UploadPath, config.PhotoOutput, config.UploadPrefix, config.ThumbnailPrefix, config.UploadSize)
	c.ResponseStr(200, "")
	return
}

func generateImages(c *http.Context) {
	go generatePhotoJSON(config.UploadPath, config.PhotoOutput, config.UploadPrefix, config.ThumbnailPrefix, config.UploadSize)
	c.ResponseStr(200, "")
	return
}

func resizeImages(c *http.Context) {
	//go taskCompress()
	c.ResponseStr(200, "")
	return
}

func convertImages(c *http.Context) {
	//go taskConvert()
	c.ResponseStr(200, "")
	return
}

func renameImages(c *http.Context) {
	//go taskRename()
	c.ResponseStr(200, "")
	return
}
