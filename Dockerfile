FROM node:14 AS development

RUN apt-get update -y \
    && apt-get install -y libreoffice \
    && apt-get clean

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

FROM node:14 as production

RUN apt-get update -y \
    && apt-get install -y libreoffice \
    && apt-get clean

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
