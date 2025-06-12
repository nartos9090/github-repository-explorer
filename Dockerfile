# Use Node.js LTS version as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install nginx web server
RUN apk update && apk add nginx

# Remove the default Nginx configuration file
RUN rm /etc/nginx/nginx.conf

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Create the directory for the built application
RUN mkdir -p /var/www/html

# Copy package.json and package-lock.json to the working directory
COPY package.json .
COPY pnpm-lock.yaml .

# Install dependencies
RUN npm i pnpm
RUN npx pnpm install

# Copy the rest of the application code
COPY . .

# Test to build the application
# This step is optional, but it ensures that the application builds correctly
# .env file is not copied here, as it should be provided at runtime
RUN npm run build

# Expose port 80
EXPOSE 5173

# Start Nginx
CMD rm -rf /var/www/html/* && \
    npm run build && \
    cp -r dist/* /var/www/html && \
    nginx -g 'daemon off;'

# Notes: npm run build in the cmd will read the .env file
# if exists. For example, stack.env in portainer will be used
# only on runtime.