package utils

import "os"

// 计算目录大小

func CalcDirSize(dir string) int64 {
	var totalSize int64

	entries, err := os.ReadDir(dir)
	if err != nil {
		return totalSize
	}
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		info, err := entry.Info()
		if err != nil {
			continue
		}
		totalSize += info.Size()
	}
	return totalSize
}

func CalcDirFileCount(dir string) int {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return 0
	}

	return len(entries)
}

func CalcFileSize(file string) int64 {
	info, err := os.Stat(file)
	if err != nil {
		return 0
	}
	return info.Size()
}
