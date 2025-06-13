package response

import "time"

type BaseRes struct {
	ID       int       `json:"id"`
	CreateAt time.Time `json:"create_at"`
	UpdateAt time.Time `json:"update_at"`
}
