FROM nginx:latest
LABEL authors="gabriel.santos"

# copy nginx configuration file
COPY ./default.conf /etc/nginx/conf.d/default.conf

# export port 80
EXPOSE 80

# start nginx
CMD ["nginx", "-g", "daemon off;"]