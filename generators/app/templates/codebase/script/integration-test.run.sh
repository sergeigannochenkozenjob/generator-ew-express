#!/bin/bash

# use this file to run inside your CI/CD

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

docker stop $(docker ps -aq) > /dev/null
docker-compose -f ${DIR}/../infra/test:i/composition.yml build --no-cache
docker-compose -f ${DIR}/../infra/test:i/composition.yml up --build --abort-on-container-exit
