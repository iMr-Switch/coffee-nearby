FROM nginx:1.13.3-alpine
RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf
COPY prod/default.conf /etc/nginx/conf.d
COPY / /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]