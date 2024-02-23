FROM bcgovimages/alpine-node-libreoffice AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

FROM development as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Instalar OpenJDK para resolver el problema de Java
RUN apk add --no-cache openjdk11

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
