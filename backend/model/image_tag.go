package model

type ImageTag struct {
	Base
	UUID  string `json:"uuid" gorm:"column:uuid;not null"`
	TagID int    `json:"tag" gorm:"column:tag"` // 确保不受名称改变影响
}
