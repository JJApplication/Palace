/*
   Create: 2025/6/30
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package utils

import (
	"net/url"
)

// CalcCoverUrl 计算cover地址
func CalcCoverUrl(rawURL string) string {
	u, err := url.Parse(rawURL)
	if err != nil {
		return ""
	}
	// 清空 query 参数
	u.RawQuery = ""
	// 重新构建 URL（不含 query 参数）
	return u.String()
}
