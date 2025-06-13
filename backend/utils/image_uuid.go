package utils

import "github.com/google/uuid"

// 创建图片的唯一标识，后续更新基于标识更新

func CreateImageUUID() string {
	return uuid.NewString()
}
