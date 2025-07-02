package model

import "time"

// 后台任务模型

type Task struct {
	Base
	TaskID      string    `json:"task_id" gorm:"column:task_id;type:varchar(50);not null"`
	TaskStatus  string    `json:"task_status" gorm:"column:task_status;type:varchar(50);not null"`
	TaskError   string    `json:"task_error" gorm:"column:task_error;type:varchar(250)"`
	TaskEndTime time.Time `json:"task_end_time" gorm:"column:task_end_time;type:date"`
	// 扩展属性
	TaskCreator string `json:"task_creator" gorm:"column:task_creator;type:varchar(50)"`
	TaskName    string `json:"task_name" gorm:"column:task_name;type:varchar(50)"`
}

const (
	TaskRunning = "running"
	TaskSuccess = "success"
	TaskFail    = "failed"
	TaskTimeout = "timeout"
)
