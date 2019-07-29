#!/usr/bin/env bash

VENDOR="<%- vendorNameKebab %>"
APPLICATION_NAME="<%- applicationCodeKebab %>"

## To install heroku-cli:
# curl https://cli-assets.heroku.com/install.sh | sh;
## Don't forget to authenticate with:
# heroku login -i

docker login --username=_ --password=`heroku auth:token 2> /dev/null` registry.heroku.com

docker build -t registry.heroku.com/${VENDOR}-${APPLICATION_NAME}/web -f infra/production.dockerfile .
docker push registry.heroku.com/${VENDOR}-${APPLICATION_NAME}/web

heroku container:release web -a ${VENDOR}-${APPLICATION_NAME}

echo "Check out https://${VENDOR}-${APPLICATION_NAME}.herokuapp.com";
