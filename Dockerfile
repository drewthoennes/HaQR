FROM node:9

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm run build-full

COPY . .
# COPY config .
# COPY dist .
# COPY src .
# COPY .babelrc .
# COPY .env .
# COPY Procfile .
# COPY server.js .

EXPOSE 8080
CMD ["npm", "start"]