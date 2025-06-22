/*
   Create: 2025/6/13
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package utils

import (
	"github.com/disintegration/imaging"
)

func GetImageEXIF(f string) (height int, width int) {
	img, err := imaging.Open(f, imaging.AutoOrientation(true))
	if err != nil {
		return 0, 0
	}

	return img.Bounds().Dy(), img.Bounds().Dx()
}
