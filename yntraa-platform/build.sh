#!/bin/bash
# Builds a new middleware image

# Uncomment to default to your new derivative image name...
image="registry.devcloud.yntraa.com/middleware"

[ "$1" != "" ] && image="$1"

if [ "$image" == "" ]; then
  echo "Usage: ./build.sh <image-name>"
  exit 1
else
  echo Building "$image" ...
fi

if [ ! -f Dockerfile ]; then
  echo "Expecting to find Dockerfile in $PWD ... not found!"
  exit 1
fi

# Do the build
docker build -t $image .