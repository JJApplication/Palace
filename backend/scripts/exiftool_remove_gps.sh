#!/usr/bin/env bash

IMAGE_ROOT=/renj.io/app/Palace/images
IMAGE_ROOT_NEW=/renj.io/app/Palace/images_new

if [ ! -d "${IMAGE_ROOT}" ];then
  echo "image root is not exist"
  exit 1
fi

if ! command -v exiftool &> /dev/null;then
  echo "command is not installed"
  exit 1
fi

echo "start remove gps"

file_array=()

while IFS= read -r -d '' file; do
  file_array+=("$file")

done < <(find "$IMAGE_ROOT" -type f -print0)

if [ ${#file_array[@]} -eq 0 ];then
  echo "empty file list"
  exit 0
fi

echo "find ${#file_array[@]} files"
echo "start process files"

for file in "${file_array[@]}"; do
  echo "process: $file"
  res=$(exiftool "$file" | grep -i "gps")
  if [ -n "$res" ];then
      exiftool -overwrite_original -gps:all= "$file"
  fi
done

echo "complete"
exit 0