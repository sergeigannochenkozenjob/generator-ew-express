FROM node:11
RUN apt-get update && apt-get install -y --no-install-recommends vim && apt-get clean

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN yarn
COPY . .
RUN yarn run build

EXPOSE 3010
CMD [ "yarn", "start" ]
