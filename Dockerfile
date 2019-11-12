FROM node:10

WORKDIR /usr/src/app

RUN apt-get update && apt-get install ffmpeg -y

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]