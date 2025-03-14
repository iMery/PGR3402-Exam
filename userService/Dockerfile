FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5004
CMD ["npm", "run", "start"]
