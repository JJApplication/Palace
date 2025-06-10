package task

import (
	"context"
	"palace/log"
	"sync"
	"time"
)

// 基于wg的任务管理器

var TG *TaskGroup

type TaskGroup struct {
	wl        *sync.Mutex
	statusMap map[string]int
	count     int
}

type handler func(ctx context.Context, done chan error) error

// 所有任务互斥，同类型任务仅能存在一个

func InitTaskGroup() {
	TG = new(TaskGroup)
	TG.wl = new(sync.Mutex)
	TG.statusMap = make(map[string]int)
	TG.count = 0
}

func (tg *TaskGroup) CanAdd(taskName string) bool {
	tg.wl.Lock()
	defer tg.wl.Unlock()
	status, ok := tg.statusMap[taskName]
	if !ok || status <= 0 {
		return true
	}
	return false
}

func (tg *TaskGroup) activeTask(name string) {
	tg.wl.Lock()
	tg.statusMap[name] = 1
	tg.wl.Unlock()
}

func (tg *TaskGroup) deActiveTask(name string) {
	tg.wl.Lock()
	tg.statusMap[name] = 0
	tg.wl.Unlock()
}
func (tg *TaskGroup) Add(taskName string, handler handler) {
	if tg.CanAdd(taskName) {
		tg.count++
		tg.activeTask(taskName)

		ctx, cancel := context.WithTimeout(context.Background(), time.Second*time.Duration(120))
		done := make(chan error, 1)

		go func(cancel context.CancelFunc) {
			select {
			case <-ctx.Done():
				tg.deActiveTask(taskName)
				log.Logger.ErrorF("task [%s] timeout with error: %s", taskName, ctx.Err().Error())
				cancel()
			case err := <-done:
				tg.deActiveTask(taskName)
				log.Logger.WarnF("task execute result: %v", err)
			}
		}(cancel)

		go func(taskName string, ctx context.Context, done chan error) {
			select {
			case <-ctx.Done():
				tg.deActiveTask(taskName)
				log.Logger.ErrorF("task [%s] timeout with error: %s", taskName, ctx.Err().Error())
			default:
			}
			if err := handler(ctx, done); err != nil {
				log.Logger.ErrorF("failed to run task [%s], error: %s", taskName, err)
			} else {
				log.Logger.InfoF("success run task [%s]", taskName)
			}
			tg.deActiveTask(taskName)
		}(taskName, ctx, done)
	}
}
