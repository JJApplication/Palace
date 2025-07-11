package like

import (
	"palace/db"
	"palace/log"
	"palace/model"
	"sync"
	"sync/atomic"
	"time"
)

const (
	Photo = iota
	Album
)

var PhotoLike likePool
var AlbumLike likePool

func init() {
	PhotoLike = NewPool(Photo, "PhotoLike")
	AlbumLike = NewPool(Album, "AlbumLike")
}

type likePool struct {
	Type      int
	Name      string
	lock      *sync.Mutex
	dataCount map[string]int64
}

func NewPool(t int, name string) likePool {
	return likePool{
		Type:      t,
		Name:      name,
		lock:      new(sync.Mutex),
		dataCount: make(map[string]int64),
	}
}

// Add Photo: uuid Album: id
func (pool *likePool) Add(id string) {
	pool.lock.Lock()
	if count, ok := pool.dataCount[id]; ok {
		pool.dataCount[id] = atomic.AddInt64(&count, 1)
	} else {
		pool.dataCount[id] = 1
	}
	pool.lock.Unlock()
}

func (pool *likePool) Sync() {
	pool.lock.Lock()
	defer pool.lock.Unlock()
	for id, _ := range pool.dataCount {
		if count, ok := pool.dataCount[id]; ok {
			if pool.Type == Photo {
				var originCount int64
				db.DB.Model(&model.Image{}).Where("uuid=?", id).Select("like").First(&originCount)
				newCount := originCount + count
				if err := db.DB.Model(&model.Image{}).Where("uuid=?", id).Update("like", newCount).Error; err != nil {
					log.Logger.ErrorF("failed to sync %s:like count, err:%v ", pool.Name, err)
					return
				}
			} else if pool.Type == Album {
				var originCount int64
				db.DB.Model(&model.Category{}).Where("id=?", id).Select("like").First(&originCount)
				newCount := originCount + count
				if err := db.DB.Model(&model.Category{}).Where("id=?", id).Update("like", newCount).Error; err != nil {
					log.Logger.ErrorF("failed to sync %s:like count, err:%v ", pool.Name, err)
					return
				}
			}

			// 成功后清空
			pool.dataCount[id] = 0
		}
	}
	log.Logger.InfoF("sync %s:like", pool.Name)
}

func InitPool() {
	tick := time.NewTicker(time.Hour * 12)
	go func() {
		for {
			select {
			case <-tick.C:
				PhotoLike.Sync()
				AlbumLike.Sync()
			}
		}
	}()
}
