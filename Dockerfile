# our base image
FROM node:14.20.0

# tells Docker to create a directory called /app and redirect us to that directory. It basically quite similar to mkdir /app && cd /app.
WORKDIR /app

# tells Docker to copy package.json file from our project on local computer to /app
COPY package.json .

# tells Docker to install all dependencies needed for our API.
RUN npm i

# tells Docker to copy all files from our project on local computer to /app directory inside our container.
COPY . .

# tells Docker to open port 3000 for external access
EXPOSE 8080

# tells Docker to execute this command whenever we run our image.
CMD ["npm", "run", "start:prod"]
