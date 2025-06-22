/*
   Create: 2025/6/22
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package request

type ImageCate struct {
	UUID string `json:"uuid"`
	Cate int    `json:"cate,omitempty"`
}
