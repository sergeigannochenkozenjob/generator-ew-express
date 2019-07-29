#!/usr/bin/env bash

VENDOR="<%- vendorName %>"
APPLICATION_NAME="<%- applicationCodeGlobal %>"
PORT="<%- port %>"

# this script runs a standalone image built with script/image.build.sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VERSION="${1:-latest}"

docker run -d -p ${PORT}:${PORT} ${VENDOR}/${APPLICATION_NAME}:${VERSION}
