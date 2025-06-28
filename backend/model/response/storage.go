package response

type StorageRes struct {
	TotalUpload        int   `json:"total_upload"`         // 上传目录总数量
	TotalUploadSize    int64 `json:"total_upload_size"`    // 上传目录总大小
	TotalThumbnail     int   `json:"total_thumbnail"`      // 缩略图总数量
	TotalThumbnailSize int64 `json:"total_thumbnail_size"` // 缩略图总大小
	MaxSpace           int   `json:"max_space"`            // 允许的最大存储值
	DBSize             int64 `json:"db_size"`              // 数据库大小
}
