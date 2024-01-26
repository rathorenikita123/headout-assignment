FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 8080

ENV NODE_OPTIONS="--max-old-space-size=1500"

CMD ["node", "index.js"]