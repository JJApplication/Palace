/*
   Create: 2025/6/13
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package utils

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"palace/config"
)

// 传入图片地址用于格式转换
// 当执行时需要在生成缩略图前执行,避免缩略图创建失败

// ConvertImage eg: uuid.HEIC -> uuid.jpg
func ConvertImage(imagePath string) error {
	if !strings.HasPrefix(imagePath, ".heic") {
		return nil
	}
	imagePath, err := filepath.Abs(filepath.Join(config.UploadPath, imagePath))
	if err != nil {
		return err
	}
	newImagePath, err := filepath.Abs(filepath.Join(config.UploadPath, strings.Replace(imagePath, ".heic", ".jpg", 1)))
	if err != nil {
		return err
	}
	cmd := exec.Command("bash", "-c", fmt.Sprintf("heif-convert %s %s", imagePath, newImagePath))
	if err := cmd.Run(); err != nil {
		return err
	}
	return os.Remove(imagePath)
}
