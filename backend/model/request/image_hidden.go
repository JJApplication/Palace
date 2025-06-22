/*
   Create: 2025/6/14
   Project: backend
   Github: https://github.com/landers1037
   Copyright Renj
*/

package request

type ImageHiddenReq struct {
	UUID string `json:"uuid"`
	Hide bool   `json:"hide"`
}
