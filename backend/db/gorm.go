package db

// 初始化gorm

import (
	"fmt"
	"log"
	"os"
	"palace/config"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	pl "palace/log"
)

// DB 是全局数据库连接实例
var DB *gorm.DB

// InitDB 初始化数据库连接
func InitDB() {
	var err error
	var db *gorm.DB

	maxRetries := config.DBMaxRetry
	retryInterval := config.DBRetryTime
	dsn := config.DBPath

	// 配置 GORM 日志记录器
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second,   // 慢 SQL 阈值
			LogLevel:                  logger.Silent, // 日志级别 (Silent, Error, Warn, Info)
			IgnoreRecordNotFoundError: true,          // 忽略ErrRecordNotFound（记录未找到）错误
			Colorful:                  true,          // 禁用彩色打印
		},
	)

	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})
		if err == nil {
			pl.Logger.Info("success open the db")
			DB = db // 将成功连接的db赋值给全局变量
			return
		}

		fmt.Printf("failed to connect to db (retry %d/%d): %v\n", i+1, maxRetries, err)
		if i < maxRetries-1 {
			pl.Logger.InfoF("will retry in %ds...\n", retryInterval)
			time.Sleep(time.Duration(retryInterval) * time.Second)
		}
	}

	err = db.AutoMigrate(&User{})
	if err != nil {
		pl.Logger.ErrorF("failed to migrate db %v\n", err)
	}
}

// User 示例模型
type User struct {
	gorm.Model
	Name  string
	Email string `gorm:"unique"`
}
