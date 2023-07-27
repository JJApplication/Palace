/*
   Create: 2023/7/27
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"encoding/json"
	"fmt"
	"os"
)

// 生成最终的图片信息列表文件

func generatePhotoJSON(imgPath, output, prefix, thumb string, imgMax int) {
	fmt.Println("Palace Image Tools")
	fmt.Println("====================")
	fmt.Printf("image path: %s\nimage size: %d\noutput: %s\n",
		imgPath, imgMax, output)

	imgList := getImgList(imgPath)
	photos := generateImagesList(imgPath, imgList, imgMax, prefix, thumb)
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
