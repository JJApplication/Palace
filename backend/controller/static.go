package controller

import (
	"errors"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/JJApplication/fushin/server/http"
	"github.com/gin-gonic/gin"
	"palace/config"
	"palace/log"
	"palace/service"
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

func (s *StaticController) FileAvatar(c *gin.Context) {
	ctx := http.Context{Context: c}
	path := ctx.Param("path")
	if path == "" {
		ctx.ResponseREST(200, nil)
		return
	}
	path = strings.ReplaceAll(path, "..", "")
	imagePath := filepath.Join(config.AvatarPath, path)
	ctx.ResponseFile(200, imagePath)
}

func (s *StaticController) Package(c *gin.Context) {
	ctx := http.Context{Context: c}
	ver := service.TaskServiceApp.PackageImageVersion()
	if ver == "" {
		ctx.AbortWithStatus(404)
		return
	}
	filePath := filepath.Join(config.PackagePath, ver)
	fileName := ver
	file, err := os.Open(filePath)
	if err != nil {
		ctx.AbortWithStatus(404)
		return
	}
	defer file.Close()
	stat, err := file.Stat()
	if err != nil {
		ctx.AbortWithStatus(404)
		return
	}
	c.Writer.Header().Set("Content-Disposition", "attachment; filename="+fileName)
	c.Writer.Header().Set("Content-Type", "application/octet-stream")
	c.Writer.Header().Set("Content-Length", strconv.FormatInt(stat.Size(), 10))
	c.Writer.Flush()
	var offset int64 = 0
	var bufSize int64 = 1024 * 1024 // 1MB
	buf := make([]byte, bufSize)
	rangeHeader := c.Request.Header.Get("Range")
	if rangeHeader != "" {
		parts := strings.Split(rangeHeader, "=")
		if len(parts) == 2 && parts[0] == "bytes" {
			rangeStr := parts[1]
			ranges := strings.Split(rangeStr, "-")
			if len(ranges) == 2 {
				offset, _ = strconv.ParseInt(ranges[0], 10, 64)
				if offset >= stat.Size() {
					ctx.AbortWithError(416, errors.New("requested Range Not Satisfiable"))
					return
				}
				if ranges[1] != "" {
					endOffset, _ := strconv.ParseInt(ranges[1], 10, 64)
					if endOffset >= stat.Size() {
						endOffset = stat.Size() - 1
					}
					c.Writer.Header().Set("Content-Range", "bytes "+ranges[0]+"-"+strconv.FormatInt(endOffset, 10)+"/"+strconv.FormatInt(stat.Size(), 10))
					c.Writer.Header().Set("Content-Length", strconv.FormatInt(endOffset-offset+1, 10))
					file.Seek(offset, 0)
				} else {
					c.Writer.Header().Set("Content-Range", "bytes "+ranges[0]+"-"+strconv.FormatInt(stat.Size()-1, 10)+"/"+strconv.FormatInt(stat.Size(), 10))
					c.Writer.Header().Set("Content-Length", strconv.FormatInt(stat.Size()-offset, 10))
					file.Seek(offset, 0)
				}
				c.Writer.WriteHeader(206)
			}
		}
	}
	for {
		n, err := file.ReadAt(buf, offset)
		if err != nil && err != io.EOF {
			log.Logger.ErrorF("read file error: %s", err.Error())
			break
		}
		if n == 0 {
			break
		}
		_, err = c.Writer.Write(buf[:n])
		if err != nil {
			log.Logger.ErrorF("write file error: %s", err.Error())
			break
		}
		c.Writer.Flush()
		offset += int64(n)
	}
	c.Writer.Flush()
}
