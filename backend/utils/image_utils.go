/*
   Create: 2025/6/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package utils

import (
	"image"
	"image/jpeg"
	"image/png"
	"path/filepath"
	"strings"

	"github.com/disintegration/imaging"
	"palace/config"
)

// 高级图像处理

// 压缩 重整大小

// CreateImageThumbnail 生成缩略图， imagePath = UUID+ext
func CreateImageThumbnail(imagePath string, ext string) error {
	ext = strings.ToLower(ext)
	realImagePath, err := filepath.Abs(filepath.Join(config.UploadPath, imagePath))
	if err != nil {
		return err
	}
	newImagePath, err := filepath.Abs(filepath.Join(config.ThumbnailPath, imagePath))
	src, err := imaging.Open(realImagePath, imaging.AutoOrientation(true))
	if err != nil {
		return err
	}

	width := src.Bounds().Dx()
	height := src.Bounds().Dy()

	// 按照默认大小调整600宽度 800高度
	var dst *image.NRGBA
	// 调整图像大小 默认低画质
	if width > 600 {
		dst = imaging.Resize(src, 600, 0, imaging.Linear)
	} else if height > 800 {
		dst = imaging.Resize(src, 0, 900, imaging.Linear)
	} else {
		// 以原图输出
		dst = imaging.Resize(src, 400, 0, imaging.Linear)
	}
	switch ext {
	case ".jpg", ".jpeg":
		return imaging.Save(dst, newImagePath, imaging.JPEGQuality(jpeg.DefaultQuality))
	case ".png":
		return imaging.Save(dst, newImagePath, imaging.PNGCompressionLevel(png.BestSpeed))
	case "gif":
		return imaging.Save(dst, newImagePath)
	default:
		return imaging.Save(dst, newImagePath)
	}
}
