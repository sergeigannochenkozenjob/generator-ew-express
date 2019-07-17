#!/usr/bin/env bash

## To install heroku-cli:
# curl https://cli-assets.heroku.com/install.sh | sh;
## Don't forget to authenticate with:
# heroku login -i

docker login --username=_ --password=`heroku auth:token 2> stdout` registry.heroku.com

docker build -t registry.heroku.com/<%- vendorNameKebab %>-<%- applicationCodeKebab %>/web -f docker/production.dockerfile .
docker push registry.heroku.com/<%- vendorNameKebab %>-<%- applicationCodeKebab %>/web

heroku container:release web -a <%- vendorNameKebab %>-<%- applicationCodeKebab %>

echo "Check out https://<%- vendorNameKebab %>-<%- applicationCodeKebab %>.herokuapp.com";
