/*
   Create: 2025/6/18
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package controller

import (
	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-gonic/gin"
	"palace/config"
	"palace/model/request"
	"palace/model/response"
	"palace/service"
)

type UserController struct{}

func (u *UserController) Get(c *gin.Context) {
	ctx := http.Context{Context: c}
	name := ctx.Query("name")
	if name == "" {
		ctx.ResponseREST(400, response.JSON{
			Error: "name is null",
		})
		return
	}
	user := service.UserServiceApp.GetUser(name)
	ctx.ResponseREST(200, response.JSON{
		Data: user,
	})
}

func (u *UserController) Info(c *gin.Context) {
	ctx := http.Context{Context: c}
	code := c.GetHeader("token")
	if code == "" {
		ctx.ResponseREST(200, response.JSON{
			Data: service.UserServiceApp.DefaultGuest(),
		})
		return
	}
	result := service.UserServiceApp.GetUserInfo(code)
	ctx.ResponseREST(200, response.JSON{
		Data: result,
	})
}

// Check 用户登录状态检查返回200 通过data判断
func (u *UserController) Check(c *gin.Context) {
	ctx := http.Context{Context: c}
	code := c.GetHeader("token")
	if code == "" {
		ctx.ResponseREST(403, response.JSON{
			Data: "ok",
		})
		return
	}
	valid := service.UserServiceApp.CheckUser(code)
	if !valid {
		ctx.ResponseREST(403, response.JSON{
			Data: "bad",
		})
		return
	}
	ctx.ResponseREST(200, response.JSON{
		Data: "ok",
	})
}

func (u *UserController) Login(c *gin.Context) {
	ctx := http.Context{Context: c}
	var req request.ReqUser
	if err := c.ShouldBindJSON(&req); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	result := service.UserServiceApp.Login(req.Username, req.Password)
	ctx.SetCookie("palaceCode", result, 3600, "/", config.CookieDomain, false, true)
	ctx.ResponseREST(200, response.JSON{
		Data: result,
	})
}

func (u *UserController) Logout(c *gin.Context) {
	ctx := http.Context{Context: c}
	ctx.SetCookie("palaceCode", "", -1, "/", config.CookieDomain, false, true)
	ctx.ResponseREST(200, response.JSON{})
}

func (u *UserController) Reset(c *gin.Context) {
	ctx := http.Context{Context: c}
	var req request.ReqUser
	if err := c.ShouldBindJSON(&req); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	code := c.GetHeader("token")
	if code == "" {
		ctx.ResponseREST(200, response.JSON{})
		return
	}
	if err := service.UserServiceApp.ResetPassword(code, req.Password); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
	}

	ctx.ResponseREST(200, response.JSON{})
}

func (u *UserController) Update(c *gin.Context) {
	ctx := http.Context{Context: c}
	var req request.ReqUser
	if err := c.ShouldBindJSON(&req); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	code := c.GetHeader("token")
	if code == "" {
		ctx.ResponseREST(200, response.JSON{})
		return
	}
	if !service.UserServiceApp.IsSuperAdmin(service.UserServiceApp.GetUserInfo(code)) {
		ctx.ResponseREST(403, response.JSON{})
		return
	}
	if err := service.UserServiceApp.UpdateUser(req.Username, req.Password); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
	}

	ctx.ResponseREST(200, response.JSON{})
}

func (u *UserController) UploadAvatar(c *gin.Context) {
	ctx := http.Context{Context: c}
	code := c.GetHeader("token")
	if code == "" {
		ctx.ResponseREST(200, response.JSON{})
		return
	}
	form, err := c.FormFile("file")
	if err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}

	avatar, err := service.UserServiceApp.UploadAvatar(c, code, form)
	if err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
		return
	}
	ctx.ResponseREST(200, response.JSON{Data: avatar})
}

func (u *UserController) ReSetAvatar(c *gin.Context) {
	ctx := http.Context{Context: c}
	code := c.GetHeader("token")
	if code == "" {
		ctx.ResponseREST(200, response.JSON{})
		return
	}
	if err := service.UserServiceApp.ReSetAvatar(code); err != nil {
		ctx.ResponseREST(400, response.JSON{
			Error: err.Error(),
		})
	}

	ctx.ResponseREST(200, response.JSON{})
}
