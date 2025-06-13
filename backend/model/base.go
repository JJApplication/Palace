package model

import "time"

type Base struct {
	ID       int       `json:"id" gorm:"primary_key;AUTO_INCREMENT"`
	CreateAt time.Time `json:"create_at" gorm:"autoCreateTime"`
	UpdateAt time.Time `json:"update_at" gorm:"autoUpdateTime"`
}
