/*
   Create: 2023/7/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"github.com/JJApplication/fushin/server/http"
	"palace/config"
)

// web handler

func Start() {
	server := http.Server{
		EnableLog: true,
		Debug:     false,
		Address: http.Address{
			Host: config.Host,
			Port: config.Port,
		},
		Copyright: "renj.io",
		PProf:     false,
	}

	server.Init()
	server.RegMiddle(http.Wrapper{Name: "cors", WrapperFunc: http.MiddleWareCors()})
	server.GetEngine().MaxMultipartMemory = 128 << 20

	server.Route(http.POST, "/api/check", checkLogin)
	server.Route(http.POST, "/api/upload", checkLogin, uploadImages)
	server.Route(http.POST, "/api/delete", checkLogin, deleteImages)
	server.Route(http.POST, "/api/generate", checkLogin, generateImages)
	server.Route(http.POST, "/api/resize", checkLogin, resizeImages)
	server.Route(http.POST, "/api/convert", checkLogin, convertImages)
	server.Route(http.POST, "/api/rename", checkLogin, renameImages)
	server.Run()
}
