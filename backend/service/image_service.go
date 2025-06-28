package service

import (
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strconv"
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

// InitHiddenImages 初始化隐藏图片仅执行一次
func InitHiddenImages() {
	var images []model.Image
	if err := db.DB.Model(&model.Image{}).Where("need_hide >= 1").Find(&images).Error; err == nil {
		for _, image := range images {
			HiddenImage(image.UUID)
		}
	}
}

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

func (i *ImageService) Upload(c *gin.Context, form *multipart.Form, cate string) error {
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

		// 相册的添加使用异步任务
		go func() {
			if cate != "" {
				cateId, err := strconv.Atoi(cate)
				if err != nil {
					log.Logger.ErrorF("add image with cate: %d to db error: %s", cateId, err.Error())
				}
				if err := i.AddCate(request.ImageCate{Cate: cateId, UUID: imageId}); err != nil {
					log.Logger.ErrorF("add image with cate: %d to db error: %s", cateId, err.Error())
					return
				}
				log.Logger.InfoF("add image with cate: %d to db success", cateId)
			}
		}()

		go func(fileName, ext string) {
			// 存库后开始生成缩略图和格式转换任务
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
	if err := db.DB.Model(&model.Image{}).Where("delete_flag <> 1 OR delete_flag IS NULL").Order("create_at desc").Find(&images).Error; err != nil {
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
	result := image.ToResponse()
	// 查询所属相册
	var cateIds []int
	var cates []model.Category
	if db.DB.Model(&model.ImageCate{}).Where("uuid=?", image.UUID).Select("cate").Find(&cateIds).Error == nil {
		db.DB.Model(&model.Category{}).Where("id IN ?", cateIds).Find(&cates)
	}
	if len(cates) > 0 {
		var ic []string
		for _, cate := range cates {
			ic = append(ic, cate.Name)
		}
		result.Category = ic
	}
	// 查询所属标签
	var tagIds []int
	var tags []model.Tag
	if db.DB.Model(&model.ImageTag{}).Where("uuid=?", image.UUID).Select("tag").Find(&tagIds).Error == nil {
		db.DB.Model(&model.Tag{}).Where("id IN ?", tagIds).Find(&tags)
	}
	if len(tags) > 0 {
		var it []string
		for _, tag := range tags {
			it = append(it, tag.Name)
		}
		result.Tags = it
	}
	return result
}

func (i *ImageService) RecycleList() []response.ImageRes {
	var images []model.Image
	if err := db.DB.Model(&model.Image{}).Where("delete_flag = ?", 1).Order("create_at desc").Find(&images).Error; err != nil {
		log.Logger.ErrorF("get image list error: %s", err.Error())
		return []response.ImageRes{}
	}
	result := make([]response.ImageRes, 0, len(images))
	for _, image := range images {
		result = append(result, image.ToResponse())
	}
	return result
}

// Recycle 回收删除图片 传入图片的UUID
func (i *ImageService) Recycle(ids []string) error {
	var images []model.Image
	if err := db.DB.Model(&model.Image{}).Where("delete_flag = ?", 1).Where("uuid IN ?", ids).Find(&images).Error; err != nil {
		log.Logger.ErrorF("get image list error: %s", err.Error())
		return err
	}
	var err error
	for _, image := range images {
		err = db.DB.Model(&model.Image{}).Where("uuid = ?", image.UUID).Delete(&model.Image{}).Error
		if err != nil {
			log.Logger.ErrorF("delete image [%s] error: %s", image.UUID, err.Error())
			return err
		}
		fileName := fmt.Sprintf("%s%s", image.UUID, image.Ext)
		originFile := filepath.Join(config.UploadPath, fileName)
		thumbnailFile := filepath.Join(config.ThumbnailPath, fileName)
		err = os.RemoveAll(originFile)
		if err != nil {
			log.Logger.ErrorF("delete image [%s] error: %s", image.UUID, err.Error())
			return err
		}
		err = os.RemoveAll(thumbnailFile)
		if err != nil {
			log.Logger.ErrorF("delete image [%s] error: %s", image.UUID, err.Error())
			return err
		}
	}
	return err
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
	if err := db.DB.Model(&model.Image{}).Where("uuid=?", req.UUID).Updates(updateMap).Error; err != nil {
		log.Logger.ErrorF("update image hidden error: %s", err.Error())
		return err
	}
	if isHidden > 0 {
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
	// 相册必须存在
	var findCate model.Category
	if err := db.DB.Model(&model.Category{}).Where("id=?", req.Cate).First(&findCate).Error; err != nil {
		log.Logger.ErrorF("find cate: %d error: %s", req.Cate, err.Error())
		return err
	}
	log.Logger.InfoF("find cate: %d -> %s", req.Cate, findCate.Name)
	if err := db.DB.Model(&model.ImageCate{}).Where("uuid=?", req.UUID).Where("cate=?", req.Cate).First(&ic).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
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
