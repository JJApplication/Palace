package controller

import (
	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-gonic/gin"
	"palace/model/response"
	"palace/service"
)

type TagController struct{}

func (t *TagController) List(c *gin.Context) {
	ctx := http.Context{Context: c}
	result := service.TagServiceApp.GetList()
	ctx.ResponseREST(200, response.JSON{Data: result})
}

func (t *TagController) Add(c *gin.Context) {
	ctx := http.Context{Context: c}
	var tag response.TagRes
	if err := c.ShouldBindJSON(&tag); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	if err := service.TagServiceApp.Add(tag); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (t *TagController) Get(c *gin.Context) {
	ctx := http.Context{Context: c}
	name := c.Query("tag")
	if name == "" {
		ctx.ResponseREST(400, response.JSON{Error: "tag name is null"})
		return
	}
	result := service.TagServiceApp.Get(name)
	ctx.ResponseREST(200, response.JSON{Data: result})
}

func (t *TagController) Delete(c *gin.Context) {
	ctx := http.Context{Context: c}
	var tag response.TagRes
	if err := c.ShouldBindJSON(&tag); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	if tag.Name == "" || tag.ID < 0 {
		ctx.ResponseREST(400, response.JSON{Error: "tag name or id is null"})
		return
	}
	if err := service.TagServiceApp.Delete(tag); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (t *TagController) Update(c *gin.Context) {
	ctx := http.Context{Context: c}
	var tag response.TagRes
	if err := c.ShouldBindJSON(&tag); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	if tag.Name == "" || tag.ID < 0 {
		ctx.ResponseREST(400, response.JSON{Error: "tag name or id is null"})
		return
	}
	if err := service.TagServiceApp.Update(tag); err != nil {
		ctx.ResponseREST(400, response.JSON{Error: err.Error()})
		return
	}
	ctx.ResponseREST(200, response.JSON{})
}

func (t *TagController) GetImages(c *gin.Context) {
	ctx := http.Context{Context: c}
	name := c.Query("tag")
	if name == "" {
		ctx.ResponseREST(400, response.JSON{Error: "tag name is null"})
		return
	}
	result := service.TagServiceApp.GetTagImages(name)
	ctx.ResponseREST(200, response.JSON{Data: result})
}
