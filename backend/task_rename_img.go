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
	err := cmd.Cmd.Exec(TaskRenameScript)
	if err != nil {
		fmt.Printf("Run task rename error: %s\n", err.Error())
	}
}
