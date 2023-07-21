/*
   Create: 2023/7/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import "github.com/JJApplication/fushin/utils/env"

// 初始化配置

var (
	Host         string
	Port         int
	UploadPath   string
	UploadSize   int
	UploadPrefix string
	PhotoOutput  string
	PalaceCode   string
)

const (
	DefaultHost = "127.0.0.1"
	DefaultPort = 12345
	DefaultCode = "123456"
)

func initConfig() {
	loader := env.EnvLoader{}
	Host = loader.Get("Host").MustString(DefaultHost)
	Port = loader.Get("Port").MustInt(DefaultPort)
	UploadPath = loader.Get("UploadPath").MustString(DefaultPath)
	UploadSize = loader.Get("UploadSize").MustInt(DefaultSize)
	UploadPrefix = loader.Get("UploadPrefix").MustString(DefaultPrefix)
	PhotoOutput = loader.Get("PhotoOutput").MustString(DefaultOutput)
	PalaceCode = loader.Get("PalaceCode").MustString(DefaultCode)
}
