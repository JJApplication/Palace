/*
   Create: 2023/7/27
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"github.com/rwcarlsen/goexif/exif"
	"os"
	"strconv"
)

const (
	ERR                   = -1
	RotateRight90Horizon  = 5
	RotateRight90         = 6
	RotateRight90Vertical = 7
	RotateLeft90          = 8
)

// 获取图片的陀螺仪旋转信息
func getExif(img string) int {
	reader, err := os.Open(img)
	if err != nil {
		return -1
	}
	x, err := exif.Decode(reader)
	if err != nil {
		return ERR
	}

	orientation, err := x.Get(exif.Orientation)
	if err != nil {
		return ERR
	}

	res, err := strconv.ParseInt(orientation.String(), 10, 64)
	if err != nil {
		return ERR
	}

	return int(res)
}

func getHWByExif(exif, h, w int) (int, int) {
	if exif == RotateRight90 || exif == RotateRight90Horizon ||
		exif == RotateRight90Vertical || exif == RotateLeft90 {
		return w, h
	}

	return h, w
}
