FROM node:12-alpine

COPY ./ /app

WORKDIR /app

RUN mkdir -p data

RUN yarn


WORKDIR /app
CMD [ "yarn", "start" ]
