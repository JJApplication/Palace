/*
   Create: 2023/7/28
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import "sync"

// 避免多次执行任务 导致进程阻塞
const (
	TaskCompress = "task-compress-image"
	TaskConvert  = "task-convert-image"
	TaskRename   = "task-rename-image"
	TaskGenerate = "task-generate-image"
)

const (
	Running = 1
	Done    = 0
)

var TaskSyncMap = sync.Map{}

func initTaskMap() {
	TaskSyncMap.Store(TaskCompress, Done)
	TaskSyncMap.Store(TaskConvert, Done)
	TaskSyncMap.Store(TaskRename, Done)
	TaskSyncMap.Store(TaskGenerate, Done)
}

func canTaskRun(task string) bool {
	val, ok := TaskSyncMap.Load(task)
	if ok {
		status := val.(int)
		if status == Running {
			return false
		}
		return true
	}

	TaskSyncMap.Store(TaskRename, Running)
	return true
}

func taskSetDone(task string) {
	_, ok := TaskSyncMap.Load(task)
	if ok {
		TaskSyncMap.Store(TaskRename, Done)
	} else {
		TaskSyncMap.Store(TaskRename, Done)
	}
}
