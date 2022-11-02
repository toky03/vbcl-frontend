FROM node:18.10.0-slim AS build

RUN mkdir /app
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm ci
COPY  . /app/
# this will build the browser and server files:
RUN npm run build
 

FROM nginx:latest AS frontend-browser
COPY --from=build /app/dist/frontend-volley/ /usr/share/nginx/html
COPY angular-server.nginx.conf /etc/nginx/conf.d/default.conf