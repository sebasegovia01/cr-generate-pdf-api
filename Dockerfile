# our base image
FROM node:14.20.0 as build

WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:14.20.0
WORKDIR /app
COPY package.json ./
RUN npm i --only=production
COPY --from=build /app/dist ./dist
CMD npm run start:prod
