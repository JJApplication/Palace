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

// 压缩图片基于imagemagisk

const (
	TaskCompressScript = "scripts/compress.sh"
)

func taskCompress() {
	if !canTaskRun(TaskCompress) {
		fmt.Printf("[%s] is running\n", TaskCompress)
		return
	}
	fmt.Printf("[%s] is start\n", TaskCompress)
	err := cmd.Cmd.Exec(TaskCompressScript)
	if err != nil {
		fmt.Printf("Run task compress error: %s\n", err.Error())
	}
	taskSetDone(TaskCompress)
}
