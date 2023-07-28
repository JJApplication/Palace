/*
   Create: 2023/7/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"fmt"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io/fs"
	"math"
	"path/filepath"
	"strconv"
)

const (
	DefaultPath          = "images"
	DefaultThumbnailPath = "thumbnails"
	DefaultSize          = 1024
	DefaultOutput        = "photos.json"
	DefaultPrefix        = "/images"
	DefaultThumbnail     = "/thumbnails"
)

type Photo struct {
	Thumbnail string `json:"thumbnail"`
	Image     string `json:"image"`
	Height    int    `json:"height"`
	Width     int    `json:"width"`
}

func getImgList(p string) []string {
	var list []string
	fmt.Printf("start at dir: %s\n", p)
	filepath.WalkDir(p, func(path string, d fs.DirEntry, err error) error {
		if d.IsDir() {
			return nil
		}

		fmt.Printf("process image [%s]\n", d.Name())
		list = append(list, d.Name())
		return nil
	})
	return list
}

func calcSize(h, w int, imgMax int) (int, int) {
	var scale float64
	if h > imgMax {
		scale, _ = strconv.ParseFloat(fmt.Sprintf("%.2f", float64(imgMax)/float64(h)), 64)
		return int(math.Ceil(scale * float64(h))), int(math.Ceil(scale * float64(w)))

	} else if w > imgMax {
		scale, _ = strconv.ParseFloat(fmt.Sprintf("%.2f", float64(imgMax)/float64(w)), 64)
		return int(math.Ceil(scale * float64(h))), int(math.Ceil(scale * float64(w)))
	}

	return h, w
}

func getImageSize(file string, imgMax int) (height int, width int, err error) {
	//EXHeight, EXWidth := getHWByExif(exifVal, im.Height, im.Width)
	EXHeight, EXWidth := getImageSizeV2(file)
	height, width = calcSize(EXHeight, EXWidth, imgMax)
	fmt.Printf("Height: %d Width: %d File: %s\n", height, width, file)
	return height, width, nil
}

func addPrefix(s string, prefix string) string {
	return fmt.Sprintf("%s/%s", prefix, s)
}

func generateImagesList(imgPath string, list []string, imgMax int, prefix, thumbnail string) []Photo {
	var phs []Photo
	fmt.Printf("image list: %d\n", len(list))
	for _, f := range list {
		h, w, e := getImageSize(filepath.Join(imgPath, f), imgMax)
		if e == nil {
			phs = append(phs, Photo{
				Thumbnail: addPrefix(f, thumbnail),
				Image:     addPrefix(f, prefix),
				Height:    h,
				Width:     w,
			})
		} else {
			fmt.Printf("convert [%s] error: %s\n", f, e.Error())
		}
	}
	return phs
}
