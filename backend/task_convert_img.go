//go:build linux

/*
   Create: 2023/7/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"fmt"
	"github.com/JJApplication/fushin/utils/cmd"
)

// 转换HEIC图片

const (
	TaskConvertScript = "scripts/convert.sh"
)

func taskConvert() {
	err := cmd.Cmd.Exec(TaskConvertScript)
	if err != nil {
		fmt.Printf("Run task convert error: %s\n", err.Error())
	}
}
