package service

import (
	"encoding/json"
	errpkg "errors"

	"gorm.io/gorm"
	"palace/db"
	"palace/errors"
	"palace/model"
	"palace/model/request"
	"palace/model/response"
	"palace/utils"
)

type CategoryService struct{}

func (s *CategoryService) validate(cate response.CategoryRes) error {
	if cate.Name == "" {
		return errors.ValidateErr
	}
	return nil
}

func (s *CategoryService) Add(cate request.AlbumAddParam) error {
	if err := s.validate(response.CategoryRes{Name: cate.Name}); err != nil {
		return err
	}
	return db.DB.Model(&model.Category{}).Create(&model.Category{
		Name:         cate.Name,
		CateDate:     cate.CateDate,
		CateInfo:     cate.CateInfo,
		CatePosition: cate.CatePosition,
		Cover:        cate.Cover,
		Theme:        "",
		Tags:         "",
		NeedPassword: 0,
		Password:     "",
		DeleteFlag:   0,
		Creator:      "",
		Editor:       "",
		LastEditor:   "",
		Comments:     "",
	}).Error
}

// Cover 设置封面
func (s *CategoryService) Cover(cate response.CategoryRes) error {
	updateMaps := map[string]any{
		"cover": utils.CalcCoverUrl(cate.Cover),
	}
	return db.DB.Model(&model.Category{}).Where("id=?", cate.ID).Updates(updateMaps).Error
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
		"cover":         utils.CalcCoverUrl(cate.Cover),
		"need_hide":     cate.NeedHide,
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
	if err := tx.Where("id=?", cate.ID).Where("name=?", cate.Name).Delete(&model.Category{}).Error; err != nil {
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

func (s *CategoryService) Get(name string, id string) response.CategoryRes {
	var category model.Category
	if name != "" {
		if err := db.DB.Model(&model.Category{}).Where("name=?", name).First(&category).Error; err != nil {
			return response.CategoryRes{}
		}
		res := category.ToResponse()
		res.ImageCount = s.GeCateImageCount(category.ID)
		return res
	}
	if id != "" {
		if err := db.DB.Model(&model.Category{}).Where("id=?", id).First(&category).Error; err != nil {
			return response.CategoryRes{}
		}
		res := category.ToResponse()
		res.ImageCount = s.GeCateImageCount(category.ID)
		return res
	}
	return response.CategoryRes{}
}

func (s *CategoryService) GetList() []response.CategoryRes {
	var categories []model.Category
	if err := db.DB.Model(&model.Category{}).Order("create_at asc").Find(&categories).Error; err != nil {
		return []response.CategoryRes{}
	}
	result := make([]response.CategoryRes, 0)
	for _, category := range categories {
		res := category.ToResponse()
		res.ImageCount = s.GeCateImageCount(category.ID)
		result = append(result, res)
	}
	return result
}

func (s *CategoryService) GetCateImages(cateName string) []response.ImageRes {
	if cateName == "" {
		return nil
	}
	cateRow := s.Get(cateName, "")
	if cateRow.Name == "" {
		return nil
	}
	// 查询所有符合标签的图片id
	var i2c []string
	if err := db.DB.Model(&model.ImageCate{}).Where("cate=?", cateRow.ID).Select("uuid").Find(&i2c).Error; err != nil {
		return nil
	}
	var images []model.Image
	if err := db.DB.Model(&model.Image{}).Where("delete_flag <> 1 OR delete_flag IS NULL").Where("uuid IN ?", i2c).Order("create_at desc").Find(&images).Error; err != nil {
		return nil
	}
	result := make([]response.ImageRes, 0)
	for _, image := range images {
		result = append(result, image.ToResponse())
	}
	return result
}

func (s *CategoryService) GeCateImageCount(cateId int) int64 {
	if cateId < 0 {
		return 0
	}
	var count int64
	db.DB.Model(&model.ImageCate{}).Where("cate=?", cateId).Count(&count)
	return count
}

func (s *CategoryService) Hidden(req request.AlbumHiddenReq) error {
	isHidden := 0
	switch req.Hide {
	case model.HiddenLevel1:
		isHidden = model.HiddenLevel1
	case model.HiddenLevel2:
		isHidden = model.HiddenLevel2
	default:
		isHidden = 0
	}
	updateMap := map[string]interface{}{
		"need_hide": isHidden,
	}
	// 隐藏相册
	if err := db.DB.Model(&model.Category{}).Where("id=?", req.Cate).Updates(updateMap).Error; err != nil {
		return err
	}
	// 隐藏相册内的图片
	var cateImages []model.ImageCate
	if err := db.DB.Model(&model.ImageCate{}).Where("cate=?", req.Cate).Find(&cateImages).Error; err != nil {
		if errpkg.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}
	// 是否需要隐藏
	if isHidden > 0 {
		for _, image := range cateImages {
			if err := db.DB.Model(&model.Image{}).Where("uuid=?", image.UUID).Updates(updateMap); err != nil {
				continue
			}
			HiddenImage(image.UUID)
		}
	} else {
		for _, image := range cateImages {
			if err := db.DB.Model(&model.Image{}).Where("uuid=?", image.UUID).Updates(updateMap); err != nil {
				continue
			}
			UnHiddenImage(image.UUID)
		}
	}

	return nil
}

// IsHidden 相册是否隐藏
func (s *CategoryService) IsHidden(id int) int {
	var cate model.Category
	if err := db.DB.Model(&model.Category{}).Where("id=?", id).First(&cate).Error; err != nil {
		return 0
	}
	return cate.NeedHide
}
