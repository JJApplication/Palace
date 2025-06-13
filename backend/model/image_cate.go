package model

// ImageCate 关系表
type ImageCate struct {
	Base
	UUID   string `json:"uuid" gorm:"column:uuid;not null"`
	CateID int    `json:"cate" gorm:"column:cate"`
}
