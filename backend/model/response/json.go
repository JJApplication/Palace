/*
   Create: 2025/6/21
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package response

type JSON struct {
	Data  any    `json:"data"`
	Error string `json:"error"`
}
