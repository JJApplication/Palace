package controller

import (
	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-gonic/gin"
	"palace/model/response"
	"palace/service"
	"palace/service/like"
)

type TaskController struct{}

func (t *TaskController) List(c *gin.Context) {
	ctx := http.Context{Context: c}
	result := service.TaskServiceApp.ListTasks()
	ctx.ResponseREST(200, response.JSON{Data: result})
}

func (t *TaskController) ClearTasks(c *gin.Context) {
	ctx := http.Context{Context: c}
	if err := service.TaskServiceApp.ClearTasks(); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (t *TaskController) RemovePosition(c *gin.Context) {
	ctx := http.Context{Context: c}
	ctx.ResponseREST(200, response.JSON{})
}

func (t *TaskController) ClearImages(c *gin.Context) {
	ctx := http.Context{Context: c}
	ctx.ResponseREST(200, response.JSON{})
}

func (t *TaskController) SyncHidden(c *gin.Context) {
	ctx := http.Context{Context: c}
	if err := service.TaskServiceApp.SyncHiddenImages(); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (t *TaskController) SyncImageLike(c *gin.Context) {
	like.PhotoLike.Sync()
	ctx := http.Context{Context: c}
	ctx.ResponseREST(200, response.JSON{})
}

func (t *TaskController) SyncAlbumLike(c *gin.Context) {
	like.AlbumLike.Sync()
	ctx := http.Context{Context: c}
	ctx.ResponseREST(200, response.JSON{})
}

// PackageImageVersion 获取当前打包版本，只能存在一个版本
func (t *TaskController) PackageImageVersion(c *gin.Context) {
	ctx := http.Context{Context: c}
	version := service.TaskServiceApp.PackageImageVersion()
	ctx.ResponseREST(200, response.JSON{Data: version})
}

func (t *TaskController) PackageImage(c *gin.Context) {
	ctx := http.Context{Context: c}
	if err := service.TaskServiceApp.PackageImages(); err != nil {
		ctx.ResponseREST(400, response.JSON{})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}
