/*
   Create: 2023/7/20
   Project: imgTools
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"encoding/json"
	"flag"
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

// 传入路径

var (
	imgPath = flag.String("path", "images", "images path")
	imgMax  = flag.Int("size", 1024, "image max size")
	output  = flag.String("o", "photos.json", "output file")
	prefix  = flag.String("prefix", "/images", "web prefix")
)

type Photo struct {
	Src    string `json:"src"`
	Height int    `json:"height"`
	Width  int    `json:"width"`
}

func main() {
	flag.Parse()
	fmt.Println("Palace Image Tools")
	fmt.Println("====================")
	fmt.Printf("image path: %s\nimage size: %d\noutput: %s\n",
		*imgPath, *imgMax, *output)

	imgList := getImgList(*imgPath)
	photos := generateImagesList(imgList)
	data, err := json.MarshalIndent(photos, "", "  ")
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	err = os.WriteFile(*output, data, 0644)
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

func calcSize(h, w int) (int, int) {
	var scale float64
	if h > *imgMax {
		scale, _ = strconv.ParseFloat(fmt.Sprintf("%.2f", float64(*imgMax)/float64(h)), 64)
		return int(math.Ceil(scale * float64(h))), int(math.Ceil(scale * float64(w)))

	} else if w > *imgMax {
		scale, _ = strconv.ParseFloat(fmt.Sprintf("%.2f", float64(*imgMax)/float64(w)), 64)
		return int(math.Ceil(scale * float64(h))), int(math.Ceil(scale * float64(w)))
	}

	return h, w
}

func getImageSize(file string) (height int, width int, err error) {
	reader, err := os.Open(file)
	if err != nil {
		return 0, 0, err
	}
	im, _, err := image.DecodeConfig(reader)
	if err != nil {
		return 0, 0, err
	}

	height, width = calcSize(im.Height, im.Width)
	return height, width, nil
}

func addPrefix(s string) string {
	return fmt.Sprintf("%s/%s", *prefix, s)
}

func generateImagesList(list []string) []Photo {
	var phs []Photo
	for _, f := range list {
		h, w, e := getImageSize(filepath.Join(*imgPath, f))
		if e == nil {
			phs = append(phs, Photo{
				Src:    addPrefix(f),
				Height: h,
				Width:  w,
			})
		} else {
			fmt.Printf("convert [%s] error: %s\n", f, e.Error())
		}
	}
	return phs
}
