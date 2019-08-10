#!/usr/bin/env bash

# usage:
# ./script/migrate.sh local

if [ $1 == "local" ]
then
    export TYPEORM_URL="postgres://root:123@db:5432/<%- applicationCode %>"
else
    URL=
    USERNAME=
    PASSWORD=

    URL_PART=$(echo "${URL}" | sed -e "s/^postgres:\/\///")

    export TYPEORM_URL="postgres://${USERNAME}:${PASSWORD}@${URL_PART}"
fi

export TYPEORM_CONNECTION="postgres"
export TYPEORM_ENTITIES="src/database/entities/*.ts"
export TYPEORM_MIGRATIONS="src/database/entities/*.ts"

yarn run migrate
