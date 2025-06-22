/*
   Create: 2025/6/13
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package utils

import (
	"fmt"
	"os/exec"
	"path/filepath"

	"palace/config"
)

func CreateImageThumbnailOld(imagePath string) error {
	realImagePath, err := filepath.Abs(filepath.Join(config.UploadPath, imagePath))
	if err != nil {
		return err
	}
	newImagePath, err := filepath.Abs(filepath.Join(config.ThumbnailPath, imagePath))
	cmd := exec.Command("bash", "-c", fmt.Sprintf("convert %s -quality 60 -resize 50%% %s", realImagePath, newImagePath))
	return cmd.Run()
}
