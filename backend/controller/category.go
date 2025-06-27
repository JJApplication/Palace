package controller

import (
	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-gonic/gin"
	"palace/model/request"
	"palace/model/response"
	"palace/service"
)

type CategoryController struct{}

func (cate *CategoryController) List(c *gin.Context) {
	ctx := http.Context{Context: c}
	result := service.CategoryServiceApp.GetList()
	ctx.ResponseREST(200, response.JSON{Data: result})
}

func (cate *CategoryController) Get(c *gin.Context) {
	ctx := http.Context{Context: c}
	name := c.Query("cate")
	id := c.Query("id")
	if name == "" && id == "" {
		ctx.ResponseREST(400, response.JSON{Error: "cate or id is null"})
		return
	}
	result := service.CategoryServiceApp.Get(name, id)
	ctx.ResponseREST(200, response.JSON{Data: result})
}

func (cate *CategoryController) Add(c *gin.Context) {
	ctx := http.Context{Context: c}
	var category request.AlbumAddParam
	if err := c.ShouldBindJSON(&category); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	if err := service.CategoryServiceApp.Add(category); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (cate *CategoryController) Delete(c *gin.Context) {
	ctx := http.Context{Context: c}
	var category response.CategoryRes
	if err := c.ShouldBindJSON(&category); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	if err := service.CategoryServiceApp.Delete(category); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (cate *CategoryController) Update(c *gin.Context) {
	ctx := http.Context{Context: c}
	var category response.CategoryRes
	if err := c.ShouldBindJSON(&category); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	if category.ID < 0 || category.Name == "" {
		ctx.ResponseREST(400, response.JSON{Error: "id or name is null"})
		return
	}
	if err := service.CategoryServiceApp.Update(category); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (cate *CategoryController) Cover(c *gin.Context) {
	ctx := http.Context{Context: c}
	var category response.CategoryRes
	if err := c.ShouldBindJSON(&category); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	if category.ID < 0 {
		ctx.ResponseREST(400, response.JSON{Error: "id is null"})
		return
	}
	if err := service.CategoryServiceApp.Cover(category); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (cate *CategoryController) Hidden(c *gin.Context) {
	ctx := http.Context{Context: c}
	var req request.AlbumHiddenReq
	if err := c.ShouldBindJSON(&req); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	if req.Cate < 0 {
		ctx.ResponseREST(400, response.JSON{Error: "id is null"})
		return
	}
	if err := service.CategoryServiceApp.Hidden(req); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (cate *CategoryController) GetImages(c *gin.Context) {
	ctx := http.Context{Context: c}
	name := c.Query("cate")
	if name == "" {
		ctx.ResponseREST(400, response.JSON{Error: "cate is null"})
		return
	}
	result := service.CategoryServiceApp.GetCateImages(name)
	ctx.ResponseREST(200, response.JSON{Data: result})
}
