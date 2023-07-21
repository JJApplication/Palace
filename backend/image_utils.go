/*
   Create: 2023/7/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"encoding/json"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io/fs"
	"math"
	"os"
	"path/filepath"
	"strconv"
)

const (
	DefaultPath   = "images"
	DefaultSize   = 1024
	DefaultOutput = "photos.json"
	DefaultPrefix = "/images"
)

type Photo struct {
	Src    string `json:"src"`
	Height int    `json:"height"`
	Width  int    `json:"width"`
}

func generatePhotoJSON(imgPath, output, prefix string, imgMax int) {
	fmt.Println("Palace Image Tools")
	fmt.Println("====================")
	fmt.Printf("image path: %s\nimage size: %d\noutput: %s\n",
		imgPath, imgMax, output)

	imgList := getImgList(imgPath)
	photos := generateImagesList(imgPath, imgList, imgMax, prefix)
	data, err := json.MarshalIndent(photos, "", "  ")
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	err = os.WriteFile(output, data, 0644)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println("done")
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
	reader, err := os.Open(file)
	if err != nil {
		return 0, 0, err
	}
	im, _, err := image.DecodeConfig(reader)
	if err != nil {
		return 0, 0, err
	}

	height, width = calcSize(im.Height, im.Width, imgMax)
	return height, width, nil
}

func addPrefix(s string, prefix string) string {
	return fmt.Sprintf("%s/%s", prefix, s)
}

func generateImagesList(imgPath string, list []string, imgMax int, prefix string) []Photo {
	var phs []Photo
	for _, f := range list {
		h, w, e := getImageSize(filepath.Join(imgPath, f), imgMax)
		if e == nil {
			phs = append(phs, Photo{
				Src:    addPrefix(f, prefix),
				Height: h,
				Width:  w,
			})
		} else {
			fmt.Printf("convert [%s] error: %s\n", f, e.Error())
		}
	}
	return phs
}
