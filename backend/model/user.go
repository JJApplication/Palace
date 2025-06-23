package model

import "palace/model/response"

// User 内置管理员用户类
type User struct {
	Base
	Name        string `json:"name" gorm:"column:name;unique;not null"`
	Password    string `json:"password" gorm:"column:password;not null"` // sha256计算后的值
	Description string `json:"description" gorm:"column:description"`

	// 扩展属性
	Theme     string `json:"theme" gorm:"column:theme"`         // 偏好主题
	Avatar    string `json:"avatar" gorm:"column:avatar"`       // 头像地址
	Privilege int    `json:"privilege" gorm:"column:privilege"` // 权限
}

func (u *User) ToResponse() response.UserRes {
	return response.UserRes{
		BaseRes: response.BaseRes{
			ID:       u.ID,
			CreateAt: u.CreateAt,
			UpdateAt: u.UpdateAt,
		},
		Name:        u.Name,
		Description: u.Description,
		Theme:       u.Theme,
		Avatar:      u.Avatar,
		Privilege:   u.Privilege,
	}
}

const (
	Guest = iota
	SuperAdmin
	Admin
	Editor
)
