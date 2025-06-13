package response

// TagRes 标签
type TagRes struct {
	BaseRes
	Name string `json:"name"`
	Like int    `json:"like"`
	// 常用的标签属性
	TagDate string `json:"tag_date"` // 纪念日期
	TagInfo string `json:"tag_info"`
}
