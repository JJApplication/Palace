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
		//AllowAllOrigins: true,
		AllowOrigins:     []string{"http://localhost:5173", "http://gallery.renj.io", "https://gallery.renj.io"},
		AllowHeaders:     []string{"Token", "token", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowCredentials: true,
	}))

	// 静态文件
	fileGroup := server.Group("/static")
	{
		fileGroup.GET("/image/:path", AccessHidden, controller.StaticControllerApp.FileImage)
		fileGroup.GET("/thumbnail/:path", AccessHidden, controller.StaticControllerApp.FileThumbnail)
		fileGroup.GET("/avatar/:path", controller.StaticControllerApp.FileAvatar)
	}
	// 按逻辑分组
	imageGroup := server.Group("/api/image")
	{
		imageGroup.Handle(http.GET, "/count", controller.ImageControllerApp.Count)                          // 图片总数
		imageGroup.Handle(http.GET, "/list", controller.ImageControllerApp.List)                            // 图片列表
		imageGroup.Handle(http.GET, "/info", controller.ImageControllerApp.Info)                            // 图片信息
		imageGroup.Handle(http.POST, "/upload", CheckLogin, controller.ImageControllerApp.Upload)           // 上传图片
		imageGroup.Handle(http.GET, "/recycle", CheckLogin, controller.ImageControllerApp.RecycleList)      // 获取回收站图片列表
		imageGroup.Handle(http.POST, "/recycle/delete", CheckLogin, controller.ImageControllerApp.Recycle)  // 删除回收站图片列表
		imageGroup.Handle(http.POST, "/recycle/restore", CheckLogin, controller.ImageControllerApp.Restore) // 恢复回收站图片列表
		imageGroup.Handle(http.POST, "/hidden", CheckLogin, controller.ImageControllerApp.Hidden)           // 隐藏|取消隐藏图片
		imageGroup.Handle(http.POST, "/modify", CheckLogin, controller.ImageControllerApp.Modify)           // 修改图片信息
		imageGroup.Handle(http.POST, "/delete", CheckLogin, controller.ImageControllerApp.Delete)           // 删除图片
		imageGroup.Handle(http.POST, "/tag/modify", CheckLogin, controller.ImageControllerApp.ModifyTags)   // 编辑图片的标签
		imageGroup.Handle(http.POST, "/tag/delete", CheckLogin, controller.ImageControllerApp.Upload)       // 编辑图片的标签
		imageGroup.Handle(http.POST, "/tag/add", CheckLogin, controller.ImageControllerApp.Upload)          // 编辑图片的标签
		imageGroup.Handle(http.POST, "/cate/modify", CheckLogin, controller.ImageControllerApp.Upload)      // 编辑图片的分类相册
		imageGroup.Handle(http.POST, "/cate/delete", CheckLogin, controller.ImageControllerApp.Upload)      // 编辑图片的分类相册
		imageGroup.Handle(http.POST, "/cate/add", CheckLogin, controller.ImageControllerApp.AddCate)        // 编辑图片的分类相册

		imageGroup.Handle(http.GET, "/storage", CheckLogin, controller.ImageControllerApp.Storage) // 存储详情
	}
	tagGroup := server.Group("/api/tag")
	{
		tagGroup.Handle(http.GET, "/list", controller.TagControllerApp.List)                  // 查询标签列表 (返回标签下的图片数)
		tagGroup.Handle(http.GET, "/info", controller.TagControllerApp.Get)                   // 查询标签详情
		tagGroup.Handle(http.GET, "/images", controller.TagControllerApp.GetImages)           // 查询标签下的图片列表
		tagGroup.Handle(http.POST, "/add", CheckLogin, controller.TagControllerApp.Add)       // 新增标签
		tagGroup.Handle(http.POST, "/update", CheckLogin, controller.TagControllerApp.Update) // 更新标签
		tagGroup.Handle(http.POST, "/delete", CheckLogin, controller.TagControllerApp.Delete) // 删除标签

	}
	albumGroup := server.Group("/api/album")
	{
		albumGroup.Handle(http.GET, "/list", controller.CategoryControllerApp.List)                  // 查询相册列表 (返回相册下的图片数)
		albumGroup.Handle(http.GET, "/info", controller.CategoryControllerApp.Get)                   // 查询相册详情
		albumGroup.Handle(http.GET, "/images", controller.CategoryControllerApp.GetImages)           // 查询相册下的图片列表
		albumGroup.Handle(http.POST, "/add", CheckLogin, controller.CategoryControllerApp.Add)       // 新增相册
		albumGroup.Handle(http.POST, "/update", CheckLogin, controller.CategoryControllerApp.Update) // 更新相册
		albumGroup.Handle(http.POST, "/cover", CheckLogin, controller.CategoryControllerApp.Cover)   // 设置相册封面
		albumGroup.Handle(http.POST, "/hidden", CheckLogin, controller.CategoryControllerApp.Hidden) // 隐藏相册
		albumGroup.Handle(http.POST, "/delete", CheckLogin, controller.CategoryControllerApp.Delete) // 删除相册
	}

	// 不再处理重命名和格式转换任务，默认自动转换为jpg
	taskGroup := server.Group("/api/task")
	{
		taskGroup.Handle(http.GET, "/list", CheckLogin, controller.TaskControllerApp.List)                 // 任务列表
		taskGroup.Handle(http.POST, "/clear/task", CheckLogin, controller.TaskControllerApp.ClearTasks)    // 清理任务
		taskGroup.Handle(http.POST, "/clear/image", CheckLogin, controller.TaskControllerApp.ClearImages)  // 清理不存在的图片
		taskGroup.Handle(http.POST, "/removepos", CheckLogin, controller.TaskControllerApp.RemovePosition) // 删除图片的位置信息
		taskGroup.Handle(http.POST, "/package", CheckLogin, controller.TaskControllerApp.PackageImage)     // 打包图片
		taskGroup.Handle(http.POST, "/sync/hide", CheckLogin, controller.TaskControllerApp.SyncHidden)     // 同步隐藏的图片
		taskGroup.Handle(http.POST, "/sync/image", CheckLogin, controller.TaskControllerApp.SyncImageLike) // 同步图片的赞
		taskGroup.Handle(http.POST, "/sync/album", CheckLogin, controller.TaskControllerApp.SyncAlbumLike) // 同步相册的赞
	}
	userGroup := server.Group("/api/user")
	{
		userGroup.Handle(http.GET, "/check", controller.UserControllerApp.Check) // 检查用户登录状态
		userGroup.Handle(http.POST, "/login", controller.UserControllerApp.Login)
		userGroup.Handle(http.POST, "/logout", controller.UserControllerApp.Logout)
		userGroup.Handle(http.GET, "/info", controller.UserControllerApp.Info)           // 获取用户信息
		userGroup.Handle(http.GET, "/get", CheckLogin, controller.UserControllerApp.Get) // 根据名称获取用户信息
		userGroup.Handle(http.POST, "/reset", CheckLogin, controller.UserControllerApp.Reset)
		userGroup.Handle(http.POST, "/update", CheckLogin, controller.UserControllerApp.Update)
		userGroup.Handle(http.POST, "/avatar/upload", CheckLogin, controller.UserControllerApp.UploadAvatar) // 上传并设置头像
		userGroup.Handle(http.POST, "/avatar/reset", CheckLogin, controller.UserControllerApp.ReSetAvatar)   // 重置头像
	}

	server.Run()
}
