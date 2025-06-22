package response

// ImageRes 图片模型
type ImageRes struct {
	BaseRes
	Name        string `json:"name"`
	UUID        string `json:"uuid" `
	Ext         string `json:"ext"`
	Size        int64  `json:"size" `
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	Like        int    `json:"like"`
	Description string `json:"description" `
	Thumbnail   string `json:"thumbnail"`
	// 关联属性
	Tags         []string `json:"tags"` // 标签列表JSON数组
	Category     []string `json:"category"`
	NeedHide     int      `json:"need_hide"`     // 是否隐藏 隐藏后仅内部用户可以看到
	NeedPassword int      `json:"need_password"` // 访客是否需要口令
	Password     string   `json:"password"`      // 返回值中默认清除
}
