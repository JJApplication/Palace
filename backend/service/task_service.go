package service

// TaskService task服务 用于创建后台运行的异步任务
type TaskService struct{}

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
