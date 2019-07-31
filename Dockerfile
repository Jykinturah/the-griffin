FROM node:alpine

RUN apk add --no-cache ffmpeg

RUN mkdir -p /usr/src/the-griffin
WORKDIR /usr/src/the-griffin

COPY package.json /usr/src/the-griffin
RUN npm install

COPY . /usr/src/the-griffin

CMD ["node","birb.js"]