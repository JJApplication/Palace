#!/bin/bash
list=($( find /renj.io/app/Palace/images -name *.HEIC ))

for file in "${list[@]}"
do
  new_name=$(echo "$file" | sed 's/HEIC/jpg/g')
  echo "convert $file -> $new_name"
  heif-convert "$file" "$new_name"
  echo "remove $file"
  if [ -n "$file" ];then
    rm -f "$file"
  fi
done