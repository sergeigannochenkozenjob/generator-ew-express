#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VERSION="${1:-latest}"

docker build --no-cache -t <%- vendorName %>/<%- applicationCodeGlobal %>:$VERSION -f infra/production.dockerfile .;
docker push <%- vendorName %>/<%- applicationCodeGlobal %>:$VERSION
# docker rmi <%- vendorName %>/<%- applicationCodeGlobal %>:$VERSION
