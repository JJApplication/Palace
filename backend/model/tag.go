package model

import (
	"palace/model/response"
)

// Tag 标签
type Tag struct {
	Base
	Name string `json:"name" gorm:"column:name;not null;unique"`
	Like int    `json:"like" gorm:"column:like"`
	// 常用的标签属性
	TagDate  string `json:"tag_date" gorm:"column:tag_date;type:date"` // 纪念日期
	TagInfo  string `json:"tag_info" gorm:"column:tag_info;type:text"`
	TagColor string `json:"tag_color" gorm:"column:tag_color;type:text"` // 标签颜色
}

func (t *Tag) ToResponse() response.TagRes {
	return response.TagRes{
		BaseRes: response.BaseRes{
			ID:       t.ID,
			CreateAt: t.CreateAt,
			UpdateAt: t.UpdateAt,
		},
		Name:     t.Name,
		Like:     t.Like,
		TagDate:  t.TagDate,
		TagInfo:  t.TagInfo,
		TagColor: t.TagColor,
	}
}
