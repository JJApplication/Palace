package controller

import (
	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-gonic/gin"
	"palace/log"
	"palace/model/request"
	"palace/model/response"
	"palace/service"
)

type ImageController struct{}

func (i *ImageController) Upload(c *gin.Context) {
	ctx := http.Context{Context: c}
	form, err := c.MultipartForm()
	// 允许按相册上传
	cate := c.Query("cate") // 以ID查询相册
	if err != nil {
		log.Logger.ErrorF("upload images error: %s", err.Error())
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}

	if err := service.ImageServiceApp.Upload(c, form, cate); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (i *ImageController) Count(c *gin.Context) {
	ctx := http.Context{Context: c}
	result := service.ImageServiceApp.Count()
	ctx.ResponseREST(200, response.JSON{
		Data: result,
	})
}

func (i *ImageController) List(c *gin.Context) {
	ctx := http.Context{Context: c}
	result := service.ImageServiceApp.List()
	ctx.ResponseREST(200, response.JSON{
		Data: result,
	})
}

// Info 返回图片信息和所属的相册, 标签
func (i *ImageController) Info(c *gin.Context) {
	ctx := http.Context{Context: c}
	uuid := c.Query("uuid")
	if uuid == "" {
		ctx.ResponseREST(400, "uuid is null")
		return
	}
	result := service.ImageServiceApp.Info(uuid)
	ctx.ResponseREST(200, response.JSON{
		Data: result,
	})
}

func (i *ImageController) Storage(c *gin.Context) {
	ctx := http.Context{Context: c}
	result := service.ImageServiceApp.Storage()
	ctx.ResponseREST(200, response.JSON{
		Data: result,
	})
}

func (i *ImageController) RecycleList(c *gin.Context) {
	ctx := http.Context{Context: c}
	result := service.ImageServiceApp.RecycleList()
	ctx.ResponseREST(200, response.JSON{
		Data: result,
	})
}

func (i *ImageController) Recycle(c *gin.Context) {
	ctx := http.Context{Context: c}
	var ids []string
	if err := c.ShouldBindJSON(&ids); err != nil {
		log.Logger.ErrorF("bind json error: %s", err.Error())
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	if err := service.ImageServiceApp.Recycle(ids); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (i *ImageController) Restore(c *gin.Context) {
	ctx := http.Context{Context: c}
	var ids []string
	if err := c.ShouldBindJSON(&ids); err != nil {
		log.Logger.ErrorF("bind json error: %s", err.Error())
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	if err := service.ImageServiceApp.Restore(ids); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (i *ImageController) Modify(c *gin.Context) {
	ctx := http.Context{Context: c}
	var image response.ImageRes
	if err := c.ShouldBindJSON(&image); err != nil {
		log.Logger.ErrorF("bind json error: %s", err.Error())
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	if err := service.ImageServiceApp.Modify(image); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (i *ImageController) Hidden(c *gin.Context) {
	ctx := http.Context{Context: c}
	var req request.ImageHiddenReq
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Logger.ErrorF("bind json error: %s", err.Error())
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	if req.UUID == "" {
		ctx.ResponseREST(400, response.JSON{
			Error: "uuid is null",
		})
		return
	}
	if err := service.ImageServiceApp.Hidden(req); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (i *ImageController) Delete(c *gin.Context) {
	ctx := http.Context{Context: c}
	var req request.ImageDelReq
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Logger.ErrorF("bind json error: %s", err.Error())
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	if req.UUID == "" {
		ctx.ResponseREST(400, response.JSON{
			Error: "uuid is null",
		})
		return
	}
	if err := service.ImageServiceApp.Delete(req); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}

	ctx.ResponseREST(200, response.JSON{})
}

func (i *ImageController) AddCate(c *gin.Context) {
	ctx := http.Context{Context: c}
	var req request.ImageCate
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Logger.ErrorF("bind json error: %s", err.Error())
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	if req.UUID == "" || req.Cate < 0 {
		ctx.ResponseREST(400, response.JSON{
			Error: "uuid is null",
		})
		return
	}
	if err := service.ImageServiceApp.AddCate(req); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}

	ctx.ResponseREST(200, response.JSON{})
}
