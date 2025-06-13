package service

import (
	"crypto/sha256"
	"encoding/hex"
	"palace/db"
	"palace/model"
)

// 用户的创建只能本地创建

type UserService struct{}

func (s *UserService) GetUser(name string) model.User {
	var user model.User
	if err := db.DB.Model(&model.User{}).Where("name=?", name).First(&user).Error; err != nil {
		return model.User{}
	}
	return user
}

func (s *UserService) CheckUser(user model.User) bool {
	hash := sha256.New()
	hash.Write([]byte(user.Password))
	hashData := hash.Sum(nil)
	hexString := hex.EncodeToString(hashData)

	dbUser := s.GetUser(user.Name)
	if dbUser.Password == hexString {
		return true
	}
	return false
}
