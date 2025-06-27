package model

import (
	"palace/model/response"
)

const (
	HiddenLevel1 = 1 // guest可见 无法查看
	HiddenLevel2 = 2 // guest不可见
)

// Image 图片模型
type Image struct {
	Base
	Name        string `json:"name" gorm:"column:name;not null"`
	UUID        string `json:"uuid" gorm:"column:uuid;not null"`
	Ext         string `json:"ext" gorm:"column:ext"`
	Size        int64  `json:"size" gorm:"column:size"`
	Width       int    `json:"width" gorm:"column:width;not null"`
	Height      int    `json:"height" gorm:"column:height;not null"`
	Like        int    `json:"like" gorm:"column:like"`
	Description string `json:"description" gorm:"column:description;type:text"`
	Thumbnail   string `json:"thumbnail" gorm:"column:thumbnail;type:text"`
	// 高级特性
	NeedHide     int    `json:"need_hide" gorm:"column:need_hide;type:int"`         // 是否隐藏 隐藏后仅内部用户可以看到 1 访客可见 2 访客不可见
	NeedPassword int    `json:"need_password" gorm:"column:need_password;type:int"` // 访客是否需要口令
	Password     string `json:"password" gorm:"column:password;type:text"`          // 设置的口令
	DeleteFlag   int    `json:"delete_flag" gorm:"column:delete_flag;type:int"`     // 删除标识符
	// 扩展属性
	Comments string `json:"comments" gorm:"column:comments;type:text"`
}

func (i *Image) ToResponse() response.ImageRes {
	return response.ImageRes{
		BaseRes: response.BaseRes{
			ID:       i.ID,
			CreateAt: i.CreateAt,
			UpdateAt: i.UpdateAt,
		},
		Name:         i.Name,
		UUID:         i.UUID,
		Ext:          i.Ext,
		Size:         i.Size,
		Width:        i.Width,
		Height:       i.Height,
		Like:         i.Like,
		Description:  i.Description,
		Thumbnail:    i.Thumbnail,
		NeedHide:     i.NeedHide,
		NeedPassword: i.NeedPassword,
		Password:     "",
	}
}
