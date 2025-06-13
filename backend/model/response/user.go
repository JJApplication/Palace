package response

// UserRes 内置管理员用户类
type UserRes struct {
	BaseRes
	Name        string `json:"name"`
	Description string `json:"description"`

	// 扩展属性
	Theme     string `json:"theme"`     // 偏好主题
	Avatar    string `json:"avatar"`    // 头像地址
	Privilege int    `json:"privilege"` // 权限
}
