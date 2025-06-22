/*
   Create: 2025/6/13
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package utils

import (
	"path/filepath"
	"strings"
)

// 返回标准化的后缀名

func GetImageExt(fileName string) string {
	ext := strings.ToLower(filepath.Ext(fileName))
	switch ext {
	case ".jpg", ".jpeg":
		return ".jpg"
	case ".png":
		return ".png"
	case ".gif":
		return ".gif"
	case ".webp":
		return ".webp"
	case ".bmp":
		return ".bmp"
	case ".heic":
		return ".heic"
	default:
		return ext
	}
}
