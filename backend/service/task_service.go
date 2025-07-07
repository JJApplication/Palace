package service

import (
	"errors"
	"gorm.io/gorm"
	"os/exec"
	"palace/db"
	"palace/log"
	"palace/model"
	"palace/utils"
	"time"
)

// TaskService task服务 用于创建后台运行的异步任务
type TaskService struct{}

// ListTasks 列举任务列表
func (s *TaskService) ListTasks() []model.Task {
	var tasks []model.Task
	if err := db.DB.Model(&model.Task{}).Order("create_at asc").Find(&tasks).Error; err != nil {
		return nil
	}
	return tasks
}

// CreateImagesIndex 重新索引全部图片 创建缩略图
func (s *TaskService) CreateImagesIndex() {

}

// CreateImageIndex 为新图片创建索引
func (s *TaskService) CreateImageIndex() {

}

// CompressAllImages 压缩所有原
func (s *TaskService) CompressAllImages() {

}

// CompressImage 压缩新图片的原图
func (s *TaskService) CompressImage() {

}

// CreateImageThumbnail 创建新图片的缩略图
func (s *TaskService) CreateImageThumbnail() {

}

// ConvertImage 为新图片做格式转换
func (s *TaskService) ConvertImage() {

}

// ClearImage 清理已经被物理删除的图片文件
func (s *TaskService) ClearImage() {

}

func (s *TaskService) ClearTasks() error {
	return db.DB.Model(&model.Task{}).Where("task_status = ?", model.TaskSuccess).Or("task_status = ?", model.TaskFail).Delete(&model.Task{}).Error
}

func (s *TaskService) SyncHiddenImages() error {
	task, err := s.createTask("SYNC_HIDDEN_IMAGES")
	if err != nil {
		return err
	}
	if err := db.DB.Model(&model.Task{}).Create(task).Error; err != nil {
		return err
	}
	go func(taskID string) {
		RefreshHiddenImages()
		s.completeTask(taskID)
	}(task.TaskID)

	return nil
}

func (s *TaskService) RemoveImagePosition() error {
	task, err := s.createTask("REMOVE_IMAGE_POSITION")
	if err != nil {
		return err
	}
	if err := db.DB.Model(&model.Task{}).Create(task).Error; err != nil {
		return err
	}
	go func(taskID string) {
		if err := s.taskRemoveImagePosition(); err != nil {
			s.failTask(taskID, err.Error())
			return
		}
		s.completeTask(taskID)
	}(task.TaskID)

	return nil
}

func (s *TaskService) PackageImages() {}

func (s *TaskService) ForceSyncImageLike() {}

func (s *TaskService) ForceSyncAlbumLike() {}

func (s *TaskService) createTask(name string) (*model.Task, error) {
	var result model.Task
	err := db.DB.Model(&model.Task{}).Where("task_name = ?", name).Where("task_status = ?", model.TaskRunning).First(&result).Error
	if err != nil && errors.Is(err, gorm.ErrRecordNotFound) {
		// 不存在正在运行的任务
		return &model.Task{
			TaskName:   name,
			TaskID:     utils.NewUUID(),
			TaskStatus: model.TaskRunning,
		}, nil
	} else if err != nil {
		return nil, err
	}
	return nil, errors.New("task already exists")
}

func (s *TaskService) completeTask(taskID string) {
	updateMap := map[string]interface{}{
		"task_status":   model.TaskSuccess,
		"task_end_time": time.Now(),
	}
	db.DB.Model(&model.Task{}).Where(&model.Task{TaskID: taskID}).Updates(updateMap)
}

func (s *TaskService) failTask(taskID string, err string) {
	updateMap := map[string]interface{}{
		"task_status":   model.TaskFail,
		"task_end_time": time.Now(),
		"task_error":    err,
	}
	db.DB.Model(&model.Task{}).Where(&model.Task{TaskID: taskID}).Updates(updateMap)
}

// 任务

func (s *TaskService) taskRemoveImagePosition() error {
	shellPath := "scripts/exiftool_remove_gps.sh"
	cmd := exec.Command("bash", "-c", shellPath)
	_, err := cmd.Output()
	if err != nil {
		log.Logger.ErrorF("remove image position err: %v", err)
		return err
	}
	log.Logger.Info("remove image position success")
	return nil
}
