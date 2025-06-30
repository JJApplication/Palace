package main

import (
	"strconv"

	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-gonic/gin"
	"palace/config"
	"palace/log"
	"palace/service"
)

/*
AccessHidden 隐藏图片检查中间件 仅管理员可以查看
默认返回全部图片列表：UUID+hidden属性，所有用户看缩略图均为hidden图标
此时就算通过/static/uuid查看图片也会提示无权限
为避免正常图片加载需要走校验，内部维护隐藏图片的字典
*/

func AccessHidden(c *http.Context) {
	// 简化文件判断，默认添加所有的后缀名避免split影响性能
	path := c.Param("path")
	// 时间戳参数为必须项
	timestamp := c.Query("timestamp")
	if path == "" || timestamp == "" {
		c.Set("shouldHide", true)
		c.Next()
		return
	}
	if service.IsHidden(path) {
		http.ToWrapperFunc(CheckCookieValid)(c)
	} else {
		c.Next()
	}
}

// CheckLogin 前置校验中间件，权限对应编辑者，允许删除图片到回收站
// 在图片和相册隐藏场景下无法获取到token所以需要使用cookie验证
func CheckLogin(c *gin.Context) {
	code := c.Query("palaceCode")
	if code == "" {
		log.Logger.Info("palaceCode query-code is empty")
	}
	code = c.GetHeader("token")
	if code == "" {
		log.Logger.Info("palaceCode token-code is empty")
		c.AbortWithStatus(403)
		return
	}

	// 旧的认证机制
	var valid bool
	if code == config.PalaceCode {
		c.Next()
		return
	}
	if service.UserServiceApp.CheckUser(code) {
		valid = true
	}

	if !valid {
		c.AbortWithStatus(403)
		return
	}
	c.Next()
}

// CheckCookieValid 仅通过cookie判断是否是admin以上用户
// 不屏蔽在后端直接返回禁用的图片数据
func CheckCookieValid(c *gin.Context) {
	// 通过query查询
	session := c.Query("session")
	timestamp := c.Query("timestamp")
	// 时间必须是当天的图片否则无效
	if session != "" && timestamp != "" {
		_, err := strconv.Atoi(timestamp)
		if err != nil {
			c.Set("shouldHide", true)
			c.Next()
			return
		}
		// 需要保证服务器时间和当前时间一致
		if service.UserServiceApp.CheckUserAdmin(session) {
			c.Set("shouldHide", false)
			c.Next()
			return
		}
	}
	cookieCode, err := c.Cookie("palaceCode")
	if err != nil {
		// 未携带cookie
		log.Logger.Info("palaceCode cookie is empty")
		c.Set("shouldHide", true)
		c.Next()
		return
	}
	if !service.UserServiceApp.CheckUserAdmin(cookieCode) {
		c.Set("shouldHide", true)
		c.Next()
		return
	}
	c.Set("shouldHide", false)
	c.Next()
}
