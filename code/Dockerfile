FROM node:alpine3.20 AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run test

FROM node:alpine3.20 AS production-stage

WORKDIR /app

COPY --from=build-stage /app .

EXPOSE 3000

CMD ["npm", "start"]