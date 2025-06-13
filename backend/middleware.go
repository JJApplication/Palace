package main

import (
	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-gonic/gin"
	"palace/config"
	"palace/log"
	"palace/service"
	"strings"
)

/*
AccessHidden 隐藏图片检查中间件 仅管理员可以查看
默认返回全部图片列表：UUID+hidden属性，所有用户看缩略图均为hidden图标
此时就算通过/static/uuid查看图片也会提示无权限
为避免正常图片加载需要走校验，内部维护隐藏图片的字典
*/

func AccessHidden(c *http.Context) {
	url := c.Request.URL
	// 简化文件判断，默认添加所有的后缀名避免split影响性能
	filePath := strings.ReplaceAll(url.Path, "/static/", "")
	if service.IsHidden(filePath) {
		http.ToWrapperFunc(CheckLogin)(c)
	} else {
		c.Next()
	}
}

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

	if code != config.PalaceCode {
		c.AbortWithStatus(403)
		return
	}

	c.Next()
}
