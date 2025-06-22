package service

import (
	"errors"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"palace/config"
	"palace/db"
	"palace/log"
	"palace/model"
	"palace/model/request"
	"palace/model/response"
	"palace/utils"
)

type ImageService struct{}

const (
	JPEG = ".jpeg"
	JPG  = ".jpg"
	PNG  = ".png"
	BMP  = ".bmp"
	GIF  = ".gif"
	WEBP = ".webp"
)

var (
	HiddenImagesMap = sync.Map{} // 图片uuid值为键
)

func IsHidden(fileName string) bool {
	fileName = strings.ToLower(fileName)
	if _, ok := HiddenImagesMap.Load(fileName); ok {
		return true
	}
	return false
}

func HiddenImage(uuid string) {
	HiddenImagesMap.Store(uuid+JPEG, struct{}{})
	HiddenImagesMap.Store(uuid+JPG, struct{}{})
	HiddenImagesMap.Store(uuid+PNG, struct{}{})
	HiddenImagesMap.Store(uuid+WEBP, struct{}{})
	HiddenImagesMap.Store(uuid+GIF, struct{}{})
	HiddenImagesMap.Store(uuid+BMP, struct{}{})
}

func UnHiddenImage(uuid string) {
	HiddenImagesMap.Delete(uuid + JPEG)
	HiddenImagesMap.Delete(uuid + JPG)
	HiddenImagesMap.Delete(uuid + PNG)
	HiddenImagesMap.Delete(uuid + WEBP)
	HiddenImagesMap.Delete(uuid + GIF)
	HiddenImagesMap.Delete(uuid + BMP)
}

func (i *ImageService) Upload(c *gin.Context, form *multipart.Form) error {
	for index, file := range form.File["files"] {
		log.Logger.InfoF("process [%d] image: %s", index, file.Filename)
		// 重新生成图片名称
		imageId := utils.CreateImageUUID()
		ext := filepath.Ext(file.Filename)
		fileName := fmt.Sprintf("%s%s", imageId, ext)
		saveFile := filepath.Join(config.UploadPath, fileName)
		if err := c.SaveUploadedFile(file, saveFile); err != nil {
			log.Logger.ErrorF("process [%d] image %s->[%s] error: %s", index, file.Filename, fileName, err.Error())
			continue
		}
		// 保存成功后存库
		log.Logger.InfoF("process [%d] image: %s->[%s] success", index, file.Filename, fileName)
		height, width := utils.GetImageEXIF(saveFile)
		if err := db.DB.Create(&model.Image{
			Name:         file.Filename,
			UUID:         imageId,
			Ext:          ext,
			Size:         file.Size,
			Width:        width,
			Height:       height,
			Like:         0,
			Description:  "",
			Thumbnail:    fileName,
			NeedHide:     0,
			NeedPassword: 0,
			Password:     "",
			DeleteFlag:   0,
			Comments:     "",
		}).Error; err != nil {
			log.Logger.ErrorF("save image to db error: %s", err.Error())
			return err
		}

		go func(fileName, ext string) {
			// 存库后开始生成缩略图和格式转换任务
			//if err := utils.ConvertImage(fileName); err != nil {
			//	log.Logger.ErrorF("convert image thumb: [%s] error: %s", fileName, err.Error())
			//	return
			//}
			if err := utils.CreateImageThumbnail(fileName, ext); err != nil {
				log.Logger.ErrorF("create thumbnail thumb: [%s] error: %s", fileName, err.Error())
				return
			}
			log.Logger.InfoF("create thumbnail image: %s success", fileName)
		}(fileName, ext)
	}

	return nil
}

func (i *ImageService) Count() int64 {
	var count int64
	if err := db.DB.Model(&model.Image{}).Count(&count).Error; err != nil {
		log.Logger.ErrorF("get image list count error: %s", err.Error())
		return 0
	}
	return count
}

func (i *ImageService) List() []response.ImageRes {
	var images []model.Image
	if err := db.DB.Model(&model.Image{}).Order("create_at desc").Find(&images).Error; err != nil {
		log.Logger.ErrorF("get image list error: %s", err.Error())
		return []response.ImageRes{}
	}
	result := make([]response.ImageRes, 0, len(images))
	for _, image := range images {
		result = append(result, image.ToResponse())
	}
	return result
}

func (i *ImageService) Info(uuid string) response.ImageRes {
	var image model.Image
	if err := db.DB.Where(&model.Image{UUID: uuid}).First(&image).Error; err != nil {
		log.Logger.ErrorF("get image info error: %s", err.Error())
		return response.ImageRes{}
	}
	return image.ToResponse()
}

func (i *ImageService) Modify(image response.ImageRes) error {
	updateMap := map[string]interface{}{
		"name":          image.Name,
		"like":          image.Like,
		"description":   image.Description,
		"need_hide":     image.NeedHide,
		"need_password": image.NeedPassword,
		"password":      image.Password,
	}
	if err := db.DB.Model(&model.Image{}).Where("uuid=?", image.UUID).Updates(updateMap).Error; err != nil {
		log.Logger.ErrorF("update image info error: %s", err.Error())
		return err
	}
	return nil
}

func (i *ImageService) Hidden(req request.ImageHiddenReq) error {
	isHidden := 0
	if req.Hide {
		isHidden = 1
	}
	updateMap := map[string]interface{}{
		"need_hide": isHidden,
	}
	if err := db.DB.Model(&model.Image{}).Where("uuid=?", req.UUID).Updates(updateMap).Error; err != nil {
		log.Logger.ErrorF("update image hidden error: %s", err.Error())
		return err
	}
	if req.Hide {
		HiddenImage(req.UUID)
	} else {
		UnHiddenImage(req.UUID)
	}
	return nil
}

func (i *ImageService) Delete(req request.ImageDelReq) error {
	if req.LogicalDelete {
		updateMap := map[string]interface{}{
			"delete_flag": 1,
		}
		if err := db.DB.Model(&model.Image{}).Where("uuid=?", req.UUID).Updates(updateMap).Error; err != nil {
			log.Logger.ErrorF("image delete error: %s", err.Error())
			return err
		}
	} else {
		// 物理删除
		if err := db.DB.Model(&model.Image{}).Where("uuid=?", req.UUID).Delete(&model.Image{}).Error; err != nil {
			log.Logger.ErrorF("image delete error: %s", err.Error())
			return err
		}
		// 本地存储的删除使用定时任务处理
	}
	return nil
}

func (i *ImageService) AddCate(req request.ImageCate) error {
	var ic model.ImageCate
	if err := db.DB.Model(&model.ImageCate{}).Where("uuid=?", req.UUID).Where("cate=?", req.Cate).First(&ic).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return db.DB.Model(&model.ImageCate{}).Create(&model.ImageCate{
				UUID:   req.UUID,
				CateID: req.Cate,
			}).Error
		}
		log.Logger.ErrorF("add cate error: %s", err.Error())
		return err
	}
	// 已经存在默认返回
	return nil
}
