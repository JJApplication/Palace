package utils

import (
	"os"

	"palace/config"
)

// 初始化必须的目录

func InitDirs() {
	_, err := os.Stat(config.UploadPath)
	if err != nil && os.IsNotExist(err) {
		_ = os.Mkdir(config.UploadPath, os.ModePerm)
	}
	_, err = os.Stat(config.ThumbnailPath)
	if err != nil && os.IsNotExist(err) {
		_ = os.Mkdir(config.ThumbnailPath, os.ModePerm)
	}
	_, err = os.Stat(config.AvatarPath)
	if err != nil && os.IsNotExist(err) {
		_ = os.Mkdir(config.AvatarPath, os.ModePerm)
	}
	_, err = os.Stat(config.PackagePath)
	if err != nil && os.IsNotExist(err) {
		_ = os.Mkdir(config.PackagePath, os.ModePerm)
	}
}
