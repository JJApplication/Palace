package log

import (
	"github.com/JJApplication/fushin/log"
)

var Logger *log.Logger

func InitLogger() {
	Logger = log.New("Palace", log.Option{
		Development:  false,
		Level:        log.InfoLevel,
		EnableCaller: false,
		StackTrace:   false,
		Encoding:     log.EncodingConsole,
		Output:       []string{"stdout"},
		EncodeConfig: log.DefaultEncodeConfig(),
		RotateOption: log.DefaultRotateOption,
	})
}
