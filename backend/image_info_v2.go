/*
   Create: 2023/7/28
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"github.com/disintegration/imaging"
)

func getImageSizeV2(f string) (height int, width int) {
	img, err := imaging.Open(f, imaging.AutoOrientation(true))
	if err != nil {
		return 0, 0
	}

	return img.Bounds().Dy(), img.Bounds().Dx()
}
