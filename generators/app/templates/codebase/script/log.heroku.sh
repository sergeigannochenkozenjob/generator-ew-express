#!/usr/bin/env bash

VENDOR="<%- vendorNameKebab %>"
APPLICATION_NAME="<%- applicationCodeKebab %>"

heroku logs --tail -a ${VENDOR}-${APPLICATION_NAME}
