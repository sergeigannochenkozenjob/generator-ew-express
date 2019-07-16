#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VERSION="${1:-latest}"

docker build --no-cache -t <%- vendorName %>/<%- applicationCodeGlobal %>:$VERSION -f docker/production.dockerfile .;
