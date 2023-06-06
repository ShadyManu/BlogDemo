FROM node:alpine AS stub
ARG ENV
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

# stage 2

FROM nginx
ARG ENV
COPY --from=stub /app/dist/front-end-blog-demo /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80