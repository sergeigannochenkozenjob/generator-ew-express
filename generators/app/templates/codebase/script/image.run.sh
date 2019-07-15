#!/usr/bin/env bash

# this script runs a standalone image built with script/image.build.sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VERSION="${1:-latest}"

docker run -d -p <%- port %>:<%- port %> <%- vendorName %>/<%- applicationCodeGlobal %>:$VERSION
