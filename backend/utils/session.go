/*
   Create: 2025/6/28
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package utils

import (
	"crypto/sha1"
	"fmt"
)

func CalcSession(data string) string {
	hash := sha1.New()
	// 写入数据
	hash.Write([]byte(data))
	// 计算哈希值
	bytes := hash.Sum(nil)
	// 转换为十六进制字符串
	hashString := fmt.Sprintf("%x", bytes)

	return hashString
}
