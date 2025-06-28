package controller

import (
	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-gonic/gin"
	"palace/config"
	"path/filepath"
	"strings"
)

type StaticController struct{}

func (s *StaticController) FileImage(c *gin.Context) {
	ctx := http.Context{Context: c}
	path := ctx.Param("path")
	if path == "" {
		ctx.ResponseREST(200, nil)
		return
	}
	shouldHide, ok := ctx.Get("shouldHide")
	if ok && shouldHide.(bool) {
		ctx.AbortWithStatus(403)
		return
	}
	path = strings.ReplaceAll(path, "..", "")
	imagePath := filepath.Join(config.UploadPath, path)
	ctx.ResponseFile(200, imagePath)
}

func (s *StaticController) FileThumbnail(c *gin.Context) {
	ctx := http.Context{Context: c}
	path := ctx.Param("path")
	if path == "" {
		ctx.ResponseREST(200, nil)
		return
	}
	shouldHide, ok := ctx.Get("shouldHide")
	if ok && shouldHide.(bool) {
		ctx.ResponseFile(200, filepath.Join(config.ThumbnailPath, config.NoAccessPhoto))
		return
	}
	path = strings.ReplaceAll(path, "..", "")
	imagePath := filepath.Join(config.ThumbnailPath, path)
	ctx.ResponseFile(200, imagePath)
}
