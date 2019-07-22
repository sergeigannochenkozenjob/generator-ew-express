FROM node:11
RUN apt-get update && apt-get install -y --no-install-recommends vim && apt-get clean

WORKDIR /app

COPY ../docker .
RUN yarn

ENV NODE_ENV=production

RUN yarn run build

EXPOSE <%- port %>
CMD [ "yarn", "start" ]
