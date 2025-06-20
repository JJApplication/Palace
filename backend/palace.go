/*
   Create: 2023/7/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package main

import (
	"palace/config"
	"palace/db"
	"palace/log"
	"palace/service"
	"palace/task"
)

func main() {
	config.InitConfig()
	log.InitLogger()
	db.InitDB()
	task.InitTaskGroup()
	service.InitService()
	initTaskMap()
	Start()
}
