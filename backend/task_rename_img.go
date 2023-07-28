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

// 转换JPG->jpg PNG->png

const (
	TaskRenameScript = "scripts/rename.sh"
)

func taskRename() {
	if !canTaskRun(TaskRename) {
		fmt.Printf("[%s] is running\n", TaskRename)
		return
	}
	fmt.Printf("[%s] is start\n", TaskRename)
	err := cmd.Cmd.Exec(TaskRenameScript)
	if err != nil {
		fmt.Printf("Run task rename error: %s\n", err.Error())
	}
	taskSetDone(TaskRename)
}
