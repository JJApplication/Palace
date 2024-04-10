#!/bin/bash
# 分为image和thumb图片 二者保持一样的名字
# 只压缩thumb
# 每次压缩前先copy image到thumb

# 不再删除源文件
#rm -rf /renj.io/app/Palace/thumbnails/*

# 创建压缩标识
flag=palace.compress.flag
if [ -f $flag ];then
  exit 0
fi

touch $flag
cp -n -R /renj.io/app/Palace/images/* /renj.io/app/Palace/thumbnails
find /renj.io/app/Palace/thumbnails -regex '.*\(jpg\|JPG\|PNG\|png\|jpeg\|JPEG\)' -size +100k -exec convert -resize 800x600 -quality 60 {} {} \;

rm -f $flag
# resize only +1mb
#find /renj.io/app/Palace/thumbnails -regex '.*\(jpg\|JPG\|PNG\|png\|jpeg\|JPEG\)' -size +1024k -exec convert -resize 75%x75% -quality 75 {} {} \;