package service

import (
	"encoding/json"
	"palace/db"
	"palace/errors"
	"palace/model"
	"palace/model/response"
)

type CategoryService struct{}

func (s *CategoryService) validate(cate response.CategoryRes) error {
	if cate.Name == "" {
		return errors.ValidateErr
	}
	return nil
}

func (s *CategoryService) Add(cate response.CategoryRes) error {
	if err := s.validate(cate); err != nil {
		return err
	}
	tags, err := json.Marshal(cate.Tags)
	if err != nil {
		return err
	}
	return db.DB.Model(&model.Category{}).Create(model.Category{
		Name:         cate.Name,
		CateDate:     cate.CateDate,
		CateInfo:     cate.CateInfo,
		CatePosition: cate.CatePosition,
		Cover:        "",
		Theme:        "",
		Tags:         string(tags),
		NeedPassword: 0,
		Password:     "",
		DeleteFlag:   0,
		Creator:      "",
		Editor:       "",
		LastEditor:   "",
		Comments:     "",
	}).Error
}

// Update 根据主键更新
func (s *CategoryService) Update(cate response.CategoryRes) error {
	if err := s.validate(cate); err != nil {
		return err
	}
	tags, err := json.Marshal(cate.Tags)
	if err != nil {
		return err
	}
	updateMaps := map[string]any{
		"name":          cate.Name,
		"cate_date":     cate.CateDate,
		"cate_info":     cate.CateInfo,
		"cate_position": cate.CatePosition,
		"tags":          string(tags),
		"need_password": cate.NeedPassword,
		"password":      cate.Password,
	}
	return db.DB.Model(&model.Category{}).Where("id=?", cate.ID).Updates(updateMaps).Error
}

func (s *CategoryService) Delete(cate response.CategoryRes) error {
	if err := s.validate(cate); err != nil {
		return err
	}
	tx := db.DB.Begin()
	if err := tx.Where("id=?", cate.ID).Delete(&model.Category{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	// 删除关系表
	if err := tx.Where("cate=?", cate.ID).Delete(&model.ImageCate{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
}

func (s *CategoryService) Get(name string) response.CategoryRes {
	if name == "" {
		return response.CategoryRes{}
	}
	var category model.Category
	if err := db.DB.Model(&model.Category{}).Where("name=?", name).First(&category).Error; err != nil {
		return response.CategoryRes{}
	}
	return category.ToResponse()
}

func (s *CategoryService) GetList() []response.CategoryRes {
	var categories []model.Category
	if err := db.DB.Model(&model.Category{}).Find(&categories).Error; err != nil {
		return nil
	}
	result := make([]response.CategoryRes, 0)
	for _, category := range categories {
		result = append(result, category.ToResponse())
	}
	return result
}

func (s *CategoryService) GetCateImages(cateName string) []response.ImageRes {
	if cateName == "" {
		return nil
	}
	cateRow := s.Get(cateName)
	if cateRow.Name == "" {
		return nil
	}
	// 查询所有符合标签的图片id
	var i2c []string
	if err := db.DB.Model(&model.ImageCate{}).Where("cate=?", cateRow.ID).Select("uuid").Find(&i2c).Error; err != nil {
		return nil
	}
	var images []model.Image
	if err := db.DB.Model(&model.Image{}).Where("uuid IN ?", i2c).Find(&images).Error; err != nil {
		return nil
	}
	result := make([]response.ImageRes, 0)
	for _, image := range images {
		result = append(result, image.ToResponse())
	}
	return result
}
