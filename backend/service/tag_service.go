package service

import (
	"palace/db"
	"palace/errors"
	"palace/model"
	"palace/model/response"
)

type TagService struct{}

func (s *TagService) validate(tag response.TagRes) error {
	if tag.Name == "" {
		return errors.ValidateErr
	}
	return nil
}

func (s *TagService) Add(tag response.TagRes) error {
	if err := s.validate(tag); err != nil {
		return err
	}
	return db.DB.Model(&model.Tag{}).Create(&model.Tag{
		Name:    tag.Name,
		Like:    tag.Like,
		TagDate: tag.TagDate,
		TagInfo: tag.TagInfo,
	}).Error
}

// Update 根据主键更新
func (s *TagService) Update(tag response.TagRes) error {
	if err := s.validate(tag); err != nil {
		return err
	}
	updateMaps := map[string]any{
		"name":     tag.Name,
		"like":     tag.Like,
		"tag_date": tag.TagDate,
		"tag_info": tag.TagInfo,
	}
	// 如果更新了名称，无需更新关系表因为基于ID关联
	return db.DB.Model(&model.Tag{}).Where("id=?", tag.ID).Updates(updateMaps).Error
}

func (s *TagService) Delete(tag response.TagRes) error {
	tx := db.DB.Begin()
	if err := tx.Where("id=?", tag.ID).Delete(&model.Tag{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	// 删除关系表
	if err := tx.Where("tag=?", tag.ID).Delete(&model.ImageTag{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
}

func (s *TagService) Get(name string) response.TagRes {
	if name == "" {
		return response.TagRes{}
	}
	var tag model.Tag
	if err := db.DB.Model(&model.Tag{}).Where("name=?", name).First(&tag).Error; err != nil {
		return response.TagRes{}
	}
	res := tag.ToResponse()
	res.ImageCount = s.GetTagImageCount(tag.ID)
	return res
}

func (s *TagService) GetList() []response.TagRes {
	var tags []model.Tag
	if err := db.DB.Model(&model.Tag{}).Order("create_at asc").Find(&tags).Error; err != nil {
		return []response.TagRes{}
	}
	result := make([]response.TagRes, 0)
	for _, tag := range tags {
		res := tag.ToResponse()
		res.ImageCount = s.GetTagImageCount(tag.ID)
		result = append(result, res)
	}
	return result
}

func (s *TagService) GetTagImages(tagName string) []response.ImageRes {
	if tagName == "" {
		return nil
	}
	tagRow := s.Get(tagName)
	if tagRow.Name == "" {
		return nil
	}
	// 查询所有符合标签的图片id
	var i2t []string
	if err := db.DB.Model(&model.ImageTag{}).Where("tag=?", tagRow.ID).Select("uuid").Find(&i2t).Error; err != nil {
		return nil
	}
	var images []model.Image
	if err := db.DB.Model(&model.Image{}).Where("delete_flag <> 1 OR delete_flag IS NULL").Where("uuid IN ?", i2t).Order("create_at desc").Find(&images).Error; err != nil {
		return nil
	}
	result := make([]response.ImageRes, 0)
	for _, image := range images {
		result = append(result, image.ToResponse())
	}
	return result
}

func (s *TagService) GetTagImageCount(tagId int) int64 {
	if tagId < 0 {
		return 0
	}
	var count int64
	db.DB.Model(&model.ImageTag{}).Where("tag=?", tagId).Count(&count)
	return count
}
