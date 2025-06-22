/*
   Create: 2025/6/22
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package request

type AlbumAddParam struct {
	Name         string `json:"name"`
	CateDate     string `json:"cate_date,omitempty"`      // 纪念日期
	CateInfo     string `json:"cate_info,omitempty"`      // 描述
	CatePosition string `json:"cate_position,omitempty" ` // 地点
	Cover        string `json:"cover,omitempty"`          // 封面图
}
