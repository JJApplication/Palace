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
	AvatarPath      string
	NoAccessPhoto   string
	DBPath          string
	DBRetryTime     int
	DBMaxRetry      int
	AESKey          string
	CookieDomain    string
	MaxSpace        int
	PackagePath     string
)

const (
	DefaultHost         = "0.0.0.0"
	DefaultPort         = 12345
	DefaultCode         = "123456"
	DefaultDB           = "palace.db"
	DefaultRetryTime    = 5
	DefaultMaxRetry     = 10
	DefaultAESKey       = "PalacePalacePalacePalacePalaceXX"
	DefaultCookieDomain = ""
)

const (
	DefaultPath          = "images"
	DefaultThumbnailPath = "thumbnails"
	DefaultAvatarPath    = "avatars"
	DefaultSize          = 1024
	DefaultOutput        = "photos.json"
	DefaultPrefix        = "/images"
	DefaultThumbnail     = "/thumbnails"
	DefaultNoAccessPhoto = "no-access.jpg"
	DefaultMaxSpaceSize  = 1024 * 1024 * 1024 * 5
	DefaultPackagePath   = "package"
)

func InitConfig() {
	loader := env.EnvLoader{}
	Host = loader.Get("Host").MustString(DefaultHost)
	Port = loader.Get("Port").MustInt(DefaultPort)
	UploadPath = loader.Get("UploadPath").MustString(DefaultPath)
	UploadSize = loader.Get("UploadSize").MustInt(DefaultSize)
	UploadPrefix = loader.Get("UploadPrefix").MustString(DefaultPrefix)
	PhotoOutput = loader.Get("PhotoOutput").MustString(DefaultOutput)
	NoAccessPhoto = loader.Get("NoAccessPhoto").MustString(DefaultNoAccessPhoto)
	PalaceCode = loader.Get("PalaceCode").MustString(DefaultCode)
	ThumbnailPath = loader.Get("ThumbnailPath").MustString(DefaultThumbnailPath)
	ThumbnailPrefix = loader.Get("ThumbnailPrefix").MustString(DefaultThumbnail)
	AvatarPath = loader.Get("AvatarPath").MustString(DefaultAvatarPath)
	DBPath = loader.Get("DBPath").MustString(DefaultDB)
	DBRetryTime = loader.Get("DBRetryTime").MustInt(DefaultRetryTime)
	DBMaxRetry = loader.Get("DBMaxRetry").MustInt(DefaultMaxRetry)
	AESKey = loader.Get("AESKey").MustString(DefaultAESKey)
	CookieDomain = loader.Get("CookieDomain").MustString(DefaultCookieDomain)
	MaxSpace = loader.Get("MaxSpace").MustInt(DefaultMaxSpaceSize)
	PackagePath = loader.Get("PackagePath").MustString(DefaultPackagePath)
}
