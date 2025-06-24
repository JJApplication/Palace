/*
   Create: 2023/7/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-contrib/cors"
	"palace/config"
	"palace/controller"
	"palace/service"
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
	server.GetEngine().MaxMultipartMemory = 128 << 20
	server.GetEngine().Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowHeaders:    []string{"Token", "token", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token"},
		AllowMethods:    []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
	}))

	// 静态文件
	fileGroup := server.Group("/static", AccessHidden)
	{
		fileGroup.Static("/image", config.UploadPath)
		fileGroup.Static("/thumbnail", config.ThumbnailPath)
	}
	// 按逻辑分组
	imageGroup := server.Group("/api/image")
	{
		imageGroup.Handle(http.GET, "/count", controller.ImageControllerApp.Count)                     // 图片总数
		imageGroup.Handle(http.GET, "/list", controller.ImageControllerApp.List)                       // 图片列表
		imageGroup.Handle(http.GET, "/info", controller.ImageControllerApp.Info)                       // 图片信息
		imageGroup.Handle(http.POST, "/upload", CheckLogin, controller.ImageControllerApp.Upload)      // 上传图片
		imageGroup.Handle(http.POST, "/hidden", CheckLogin, controller.ImageControllerApp.Hidden)      // 隐藏|取消隐藏图片
		imageGroup.Handle(http.POST, "/modify", CheckLogin, controller.ImageControllerApp.Modify)      // 修改图片信息
		imageGroup.Handle(http.POST, "/delete", CheckLogin, controller.ImageControllerApp.Delete)      // 删除图片
		imageGroup.Handle(http.POST, "/tag/modify", CheckLogin, controller.ImageControllerApp.Upload)  // 编辑图片的标签
		imageGroup.Handle(http.POST, "/tag/delete", CheckLogin, controller.ImageControllerApp.Upload)  // 编辑图片的标签
		imageGroup.Handle(http.POST, "/tag/add", CheckLogin, controller.ImageControllerApp.Upload)     // 编辑图片的标签
		imageGroup.Handle(http.POST, "/cate/modify", CheckLogin, controller.ImageControllerApp.Upload) // 编辑图片的分类相册
		imageGroup.Handle(http.POST, "/cate/delete", CheckLogin, controller.ImageControllerApp.Upload) // 编辑图片的分类相册
		imageGroup.Handle(http.POST, "/cate/add", CheckLogin, controller.ImageControllerApp.AddCate)   // 编辑图片的分类相册
	}
	tagGroup := server.Group("/api/tag")
	{
		tagGroup.Handle(http.GET, "/list", controller.TagControllerApp.List)             // 查询标签列表 (返回标签下的图片数)
		tagGroup.Handle(http.GET, "/info", controller.TagControllerApp.Get)              // 查询标签详情
		tagGroup.Handle(http.GET, "/images", controller.TagControllerApp.GetImages)      // 查询标签下的图片列表
		tagGroup.Handle(http.POST, "/add", controller.TagControllerApp.Add)              // 新增标签
		tagGroup.Handle(http.POST, "/update", controller.TagControllerApp.Update)        // 更新标签
		tagGroup.Handle(http.POST, "/delete", controller.TagControllerApp.Delete)        // 删除标签
		tagGroup.Handle(http.POST, "/images/delete", controller.TagControllerApp.Delete) // 删除标签下的图片(新增只能在图片页面操作)

	}
	albumGroup := server.Group("/api/album")
	{
		albumGroup.Handle(http.GET, "/list", controller.CategoryControllerApp.List)             // 查询相册列表 (返回相册下的图片数)
		albumGroup.Handle(http.GET, "/info", controller.CategoryControllerApp.Get)              // 查询相册详情
		albumGroup.Handle(http.GET, "/images", controller.CategoryControllerApp.GetImages)      // 查询相册下的图片列表
		albumGroup.Handle(http.POST, "/add", controller.CategoryControllerApp.Add)              // 新增相册
		albumGroup.Handle(http.POST, "/update", controller.CategoryControllerApp.Update)        // 更新相册
		albumGroup.Handle(http.POST, "/delete", controller.CategoryControllerApp.Delete)        // 删除相册
		albumGroup.Handle(http.POST, "/images/delete", controller.CategoryControllerApp.Delete) // 删除相册下的图片(新增只能在图片页面操作)
	}

	// 不再处理重命名和格式转换任务，默认自动转换为jpg
	taskGroup := server.Group("/api/task")
	{
		taskGroup.Handle(http.GET, "/list", CheckLogin, service.TaskServiceApp.ListTasks)    // 任务列表
		taskGroup.Handle(http.POST, "/generate", CheckLogin)                                 // 重新生成索引
		taskGroup.Handle(http.POST, "/resize", CheckLogin)                                   // 重新调整图片大小
		taskGroup.Handle(http.POST, "/clean", CheckLogin, service.TaskServiceApp.CleanImage) // 重新调整图片大小
	}
	userGroup := server.Group("/api/user")
	{
		userGroup.Handle(http.GET, "/check", controller.UserControllerApp.Check) // 检查用户登录状态
		userGroup.Handle(http.POST, "/login", controller.UserControllerApp.Login)
		userGroup.Handle(http.GET, "/info", controller.UserControllerApp.Info)           // 获取用户信息
		userGroup.Handle(http.GET, "/get", CheckLogin, controller.UserControllerApp.Get) // 根据名称获取用户信息
		userGroup.Handle(http.POST, "/reset", CheckLogin, controller.UserControllerApp.Reset)
		userGroup.Handle(http.POST, "/update", CheckLogin, controller.UserControllerApp.Update)
	}

	server.Run()
}
