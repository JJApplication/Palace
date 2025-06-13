package service

import (
	"strings"
	"sync"
)

type ImageService struct{}

const (
	JPEG = ".jpeg"
	JPG  = ".jpg"
	PNG  = ".png"
	BMP  = ".bmp"
	GIF  = ".gif"
	WEBP = ".webp"
)

var (
	HiddenImagesMap = sync.Map{} // 图片uuid值为键
)

func IsHidden(fileName string) bool {
	fileName = strings.ToLower(fileName)
	if _, ok := HiddenImagesMap.Load(fileName); ok {
		return true
	}
	return false
}

func HiddenImage(uuid string) {
	HiddenImagesMap.Store(uuid+JPEG, struct{}{})
	HiddenImagesMap.Store(uuid+JPG, struct{}{})
	HiddenImagesMap.Store(uuid+PNG, struct{}{})
	HiddenImagesMap.Store(uuid+WEBP, struct{}{})
	HiddenImagesMap.Store(uuid+GIF, struct{}{})
	HiddenImagesMap.Store(uuid+BMP, struct{}{})
}

func UnHiddenImage(uuid string) {
	HiddenImagesMap.Delete(uuid + JPEG)
	HiddenImagesMap.Delete(uuid + JPG)
	HiddenImagesMap.Delete(uuid + PNG)
	HiddenImagesMap.Delete(uuid + WEBP)
	HiddenImagesMap.Delete(uuid + GIF)
	HiddenImagesMap.Delete(uuid + BMP)
}
