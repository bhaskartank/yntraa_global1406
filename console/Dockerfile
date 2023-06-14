# Stage 1 - the build react app
# FROM  coredgeio/yntraa_console_base as build-deps
# WORKDIR /app
# COPY . .
# RUN npm run build


FROM node:12.22.10-alpine as build-deps
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.13.12-alpine as production-stage
ADD default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /app/build /usr/share/nginx/html
EXPOSE 80

COPY ./run.sh /
RUN chmod +x /run.sh
CMD ["/run.sh"]
