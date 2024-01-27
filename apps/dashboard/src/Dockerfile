FROM nginx:1.23.1-alpine as production
WORKDIR /usr/src/app

COPY . /var/www/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
