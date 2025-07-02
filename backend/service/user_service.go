package service

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"mime/multipart"
	"palace/utils"
	"path/filepath"

	"palace/config"
	"palace/db"
	"palace/log"
	"palace/model"
	"palace/model/response"
)

// 用户的创建只能本地创建

type UserService struct{}

// PKCS#7填充
func pkcs7Padding(data []byte, blockSize int) []byte {
	padding := blockSize - len(data)%blockSize
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(data, padtext...)
}

// PKCS#7去填充
func pkcs7Unpadding(data []byte) ([]byte, error) {
	length := len(data)
	if length == 0 {
		return nil, fmt.Errorf("数据为空")
	}
	padding := int(data[length-1])
	if padding > length {
		return nil, fmt.Errorf("填充无效")
	}
	return data[:length-padding], nil
}

func (s *UserService) get(name string) model.User {
	var user model.User
	if err := db.DB.Model(&model.User{}).Where("name=?", name).First(&user).Error; err != nil {
		return model.User{}
	}
	return user
}

type tokenModel struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

// token计算规则 用户名称+ID+密码的sha256 JSON
func (s *UserService) calcToken(name, password string) string {
	jsonData, err := json.Marshal(tokenModel{
		Name:     name,
		Password: password,
	})
	if err != nil {
		log.Logger.ErrorF("marshal user err: %v", err)
		return ""
	}

	// 2. 创建AES块
	block, err := aes.NewCipher([]byte(config.AESKey))
	if err != nil {
		log.Logger.ErrorF("create cipher fail: %v", err)
		return ""
	}

	// 3. 填充数据到块大小的倍数
	blockSize := block.BlockSize()
	jsonData = pkcs7Padding(jsonData, blockSize)

	// 4. 创建CBC模式的加密器
	ciphertext := make([]byte, blockSize+len(jsonData))
	iv := ciphertext[:blockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		log.Logger.ErrorF("generate IV fail: %v", err)
		return ""
	}

	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks(ciphertext[blockSize:], jsonData)

	// 5. 转换为Base64编码
	return base64.StdEncoding.EncodeToString(ciphertext)
}

func (s *UserService) decryptToken(token string) tokenModel {
	// 1. 从Base64解码
	ciphertext, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		log.Logger.ErrorF("decode token with base64 fail: %v", err)
		return tokenModel{}
	}

	// 2. 创建AES块
	block, err := aes.NewCipher([]byte(config.AESKey))
	if err != nil {
		log.Logger.ErrorF("create AES cipher fail: %v", err)
		return tokenModel{}
	}

	// 3. 验证块大小
	blockSize := block.BlockSize()
	if len(ciphertext) < blockSize {
		log.Logger.Error("cipher text too short")
		return tokenModel{}
	}

	// 4. 提取IV和密文
	iv := ciphertext[:blockSize]
	ciphertext = ciphertext[blockSize:]

	// 5. 验证密文长度
	if len(ciphertext)%blockSize != 0 {
		log.Logger.Error("cipher text is not a multiple of the block size")
		return tokenModel{}
	}

	// 6. 创建CBC模式的解密器
	mode := cipher.NewCBCDecrypter(block, iv)
	mode.CryptBlocks(ciphertext, ciphertext)

	// 7. 去除填充
	jsonData, err := pkcs7Unpadding(ciphertext)
	if err != nil {
		log.Logger.ErrorF("unpadding err: %v", err)
		return tokenModel{}
	}

	// 8. 解析JSON
	var data tokenModel
	if err := json.Unmarshal(jsonData, &data); err != nil {
		log.Logger.ErrorF("unmarshal err: %v", err)
		return tokenModel{}
	}

	return data
}

func (s *UserService) GetUser(name string) response.UserRes {
	var user model.User
	if err := db.DB.Model(&model.User{}).Where("name=?", name).First(&user).Error; err != nil {
		return response.UserRes{}
	}
	return user.ToResponse()
}

func (s *UserService) IsSuperAdmin(user response.UserRes) bool {
	return user.Privilege == model.SuperAdmin
}

func (s *UserService) IsAdmin(user response.UserRes) bool {
	return user.Privilege == model.SuperAdmin || user.Privilege == model.Admin
}

func (s *UserService) DefaultGuest() response.UserRes {
	return response.UserRes{
		Privilege: model.Guest,
	}
}

func (s *UserService) GetUserInfo(token string) response.UserRes {
	checkUser := s.decryptToken(token)
	var user model.User
	if err := db.DB.Model(&model.User{}).Where("name=?", checkUser.Name).First(&user).Error; err != nil {
		return s.DefaultGuest()
	}
	if checkUser.Password != user.Password {
		return s.DefaultGuest()
	}
	return user.ToResponse()
}

func (s *UserService) Login(name string, password string) string {
	result := db.DB.Model(&model.User{}).Where("name=?", name).Where("password=?", s.hashPassword(password)).First(&model.User{})
	if result.Error != nil {
		return ""
	}
	if result.RowsAffected == 0 {
		return ""
	}
	return s.calcToken(name, s.hashPassword(password))
}

func (s *UserService) AddUser(name string, password string) error {
	if name == "" || password == "" {
		return nil
	}
	return db.DB.Model(&model.User{}).Create(&model.User{
		Name:     name,
		Password: s.hashPassword(password),
	}).Error
}

// UpdateUser 更新用户信息 更新的是nickName
func (s *UserService) UpdateUser(name string, password string) error {
	if name == "" || password == "" {
		return nil
	}
	return db.DB.Model(&model.User{}).Where("name=?", name).Update("password", s.hashPassword(password)).Error
}

// UploadAvatar 上传用户头像，按照用户名称存储并更新文件
func (s *UserService) UploadAvatar(c *gin.Context, token string, form *multipart.FileHeader) (string, error) {
	// 校验用户
	user := s.GetUserInfo(token)
	if user.Name == "" {
		return "", errors.New("user not found")
	}
	log.Logger.InfoF("process %s avatar image: %s", user.Name, form.Filename)
	// 重新生成图片名称
	avatarId := utils.CreateImageUUID() // avatar的ID
	ext := filepath.Ext(form.Filename)
	fileName := fmt.Sprintf("%s%s", avatarId, ext)
	saveFile := filepath.Join(config.AvatarPath, fileName)
	if err := c.SaveUploadedFile(form, saveFile); err != nil {
		log.Logger.ErrorF("process %s avatar image: %s->[%s] error: %s", user.Name, form.Filename, fileName, err.Error())
		return "", err
	}
	// 保存成功后存库
	log.Logger.InfoF("process %s avatar image: %s->[%s] success", user.Name, form.Filename, fileName)
	// user表存储的avatar是uuid+ext // 或者用户的自定义http的url
	return fileName, db.DB.Model(&model.User{}).Where("name = ?", user.Name).Update("avatar", fileName).Error
}

func (s *UserService) ReSetAvatar(token string) error {
	user := s.GetUserInfo(token)
	if user.Name == "" {
		return errors.New("user not found")
	}
	return db.DB.Model(&model.User{}).Where("name=?", user.Name).Updates(map[string]interface{}{
		"avatar": "",
	}).Error
}

// ResetPassword 重置密码
func (s *UserService) ResetPassword(code string, password string) error {
	user := s.GetUserInfo(code)
	if user.Name == "" {
		return errors.New("user is not exist")
	}
	if password == "" || len(password) < 8 {
		return errors.New("password is invalid")
	}
	return db.DB.Model(&model.User{}).Where("name=?", user.Name).Update("password", s.hashPassword(password)).Error
}

func (s *UserService) DeleteUser(name string) error {
	return nil
}

func (s *UserService) hashPassword(password string) string {
	hash := sha256.New()
	hash.Write([]byte(password))
	hashData := hash.Sum(nil)
	return hex.EncodeToString(hashData)
}

// CheckUser code符合标准的加密格式
func (s *UserService) CheckUser(token string) bool {
	user := s.decryptToken(token)
	dbUser := s.get(user.Name)
	// 比对密码
	if user.Password == dbUser.Password {
		return true
	}
	return false
}

// CheckUserAdmin 检查是否属于admin
func (s *UserService) CheckUserAdmin(token string) bool {
	user := s.decryptToken(token)
	dbUser := s.get(user.Name)
	// 比对密码
	if user.Password != dbUser.Password {
		return false
	}
	if s.IsAdmin(response.UserRes{Privilege: dbUser.Privilege, Name: dbUser.Name}) {
		return true
	}
	return false
}
