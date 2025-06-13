package model

import (
	"encoding/json"
	"palace/model/response"
)

// Category 分类
type Category struct {
	Base
	Name string `json:"name" gorm:"column:name;not null;unique"`
	Like int    `json:"like" gorm:"column:like"`
	// 常用的分类属性
	CateDate     string `json:"cate_date" gorm:"column:cate_date;type:varchar(50)"`  // 纪念日期
	CateInfo     string `json:"cate_info" gorm:"column:cate_info;type:text"`         // 描述
	CatePosition string `json:"cate_position" gorm:"column:cate_position;type:text"` // 地点
	Cover        string `json:"cover" gorm:"column:cover;type:varchar(200)"`         // 封面（图片的直链uuid)
	Theme        string `json:"theme" gorm:"column:theme;type:varchar(50)"`          // 背景主题
	Tags         string `json:"tags" gorm:"column:tags;type:text"`                   // 标签列表JSON数组
	// 高级特性
	NeedHide     int    `json:"need_hide" gorm:"column:need_hide;type:int"`         // 是否隐藏 隐藏后仅内部用户可以看到
	NeedPassword int    `json:"need_password" gorm:"column:need_password;type:int"` // 访客是否需要口令
	Password     string `json:"password" gorm:"column:password;type:text"`          // 设置的口令
	DeleteFlag   int    `json:"delete_flag" gorm:"column:delete_flag;type:int"`     // 删除标识符
	// 后期扩展
	Creator    string `json:"creator" gorm:"column:creator;type:varchar(50)"`         // 创建者
	Editor     string `json:"editor" gorm:"column:editor;type:varchar(50)"`           // 编辑者
	LastEditor string `json:"last_editor" gorm:"column:last_editor;type:varchar(50)"` // 最后编辑者
	Comments   string `json:"comments" gorm:"column:comments;type:text"`              // 评论 JSON数组
}

func (i *Category) ToResponse() response.CategoryRes {
	var tags []string

	_ = json.Unmarshal([]byte(i.Tags), &tags)
	return response.CategoryRes{
		BaseRes: response.BaseRes{
			ID:       i.ID,
			CreateAt: i.CreateAt,
			UpdateAt: i.UpdateAt,
		},
		Name:         i.Name,
		Like:         i.Like,
		CateDate:     i.CateDate,
		CateInfo:     i.CateInfo,
		CatePosition: i.CatePosition,
		Tags:         tags,
		NeedHide:     i.NeedHide,
		NeedPassword: i.NeedPassword,
		Password:     "",
		DeleteFlag:   i.DeleteFlag,
	}
}
