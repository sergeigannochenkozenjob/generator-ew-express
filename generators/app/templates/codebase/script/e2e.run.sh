#!/bin/bash

# use this file to run inside your CI/CD

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

docker stop $(docker ps -aq) > /dev/null
docker-compose -f ${DIR}/../infra/e2e/composition.yml build --no-cache
docker-compose -f ${DIR}/../infra/e2e/composition.yml up --build --abort-on-container-exit
