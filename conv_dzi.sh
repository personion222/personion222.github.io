for file in src/assets/images/jpeg/*; do
	echo "$file"
	base=${file##*/}
	vips dzsave $file public/dzi/${base%.*}
done
