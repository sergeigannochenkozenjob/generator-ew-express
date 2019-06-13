FROM node:11
RUN apt-get update && apt-get install -y --no-install-recommends vim && apt-get clean

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN yarn

COPY . .
CMD [ "yarn", "run", "test:i" ]
