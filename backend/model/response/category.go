package response

// CategoryRes 分类
type CategoryRes struct {
	BaseRes
	Name string `json:"name"`
	Like int    `json:"like"`
	// 常用的分类属性
	CateDate     string   `json:"cate_date"`      // 纪念日期
	CateInfo     string   `json:"cate_info"`      // 描述
	CatePosition string   `json:"cate_position" ` // 地点
	Tags         []string `json:"tags" `          // 标签列表JSON数组
	// 高级特性
	Cover        string `json:"cover"`         // 封面图
	NeedHide     int    `json:"need_hide"`     // 是否隐藏 隐藏后仅内部用户可以看到
	NeedPassword int    `json:"need_password"` // 访客是否需要口令
	Password     string `json:"password"`      // 返回值时置空
	DeleteFlag   int    `json:"delete_flag"`   // 删除标识符
	// 关联属性
	ImageCount int64 `json:"image_count"` // 图片数
}
