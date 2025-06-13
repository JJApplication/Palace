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

	// 静态文件
	fileGroup := server.Group("/static", AccessHidden)
	{
		fileGroup.Static("", config.UploadPath)
	}
	// 按逻辑分组
	imageGroup := server.Group("/api/image")
	{
		imageGroup.Handle(http.POST, "/info")
		imageGroup.Handle(http.POST, "/upload", CheckLogin)
		imageGroup.Handle(http.POST, "/hidden")
		imageGroup.Handle(http.POST, "/modify")
		imageGroup.Handle(http.POST, "/delete")
	}

	taskGroup := server.Group("/api/task")
	{
		taskGroup.Handle(http.POST, "/generate") // 重新生成索引
		taskGroup.Handle(http.POST, "/list")     // 任务列表
	}

	server.Route(http.POST, "/api/check", checkLogin)
	server.Route(http.POST, "/api/upload", checkLogin, uploadImages)
	server.Route(http.POST, "/api/delete", checkLogin, deleteImages)
	server.Route(http.POST, "/api/generate", checkLogin, generateImages)
	server.Route(http.POST, "/api/resize", checkLogin, resizeImages)
	server.Route(http.POST, "/api/convert", checkLogin, convertImages)
	server.Route(http.POST, "/api/rename", checkLogin, renameImages)
	server.Run()
}
