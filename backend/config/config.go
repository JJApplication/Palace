/*
   Create: 2023/7/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package config

import (
	"github.com/JJApplication/fushin/utils/env"
)

// 初始化配置

var (
	Host            string
	Port            int
	UploadPath      string
	UploadSize      int
	UploadPrefix    string
	PhotoOutput     string
	PalaceCode      string
	ThumbnailPath   string
	ThumbnailPrefix string
	DBPath          string
	DBRetryTime     int
	DBMaxRetry      int
)

const (
	DefaultHost      = "127.0.0.1"
	DefaultPort      = 12345
	DefaultCode      = "123456"
	DefaultDB        = "palace.db"
	DefaultRetryTime = 5
	DefaultMaxRetry  = 10
)

const (
	DefaultPath          = "images"
	DefaultThumbnailPath = "thumbnails"
	DefaultSize          = 1024
	DefaultOutput        = "photos.json"
	DefaultPrefix        = "/images"
	DefaultThumbnail     = "/thumbnails"
)

func InitConfig() {
	loader := env.EnvLoader{}
	Host = loader.Get("Host").MustString(DefaultHost)
	Port = loader.Get("Port").MustInt(DefaultPort)
	UploadPath = loader.Get("UploadPath").MustString(DefaultPath)
	UploadSize = loader.Get("UploadSize").MustInt(DefaultSize)
	UploadPrefix = loader.Get("UploadPrefix").MustString(DefaultPrefix)
	PhotoOutput = loader.Get("PhotoOutput").MustString(DefaultOutput)
	PalaceCode = loader.Get("PalaceCode").MustString(DefaultCode)
	ThumbnailPath = loader.Get("ThumbnailPath").MustString(DefaultThumbnailPath)
	ThumbnailPrefix = loader.Get("ThumbnailPrefix").MustString(DefaultThumbnail)
	DBPath = loader.Get("DBPath").MustString(DefaultDB)
	DBRetryTime = loader.Get("DBRetryTime").MustInt(DefaultRetryTime)
	DBMaxRetry = loader.Get("DBMaxRetry").MustInt(DefaultMaxRetry)
}
