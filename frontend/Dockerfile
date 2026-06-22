# Stage 1: Builder (Node.js for building the frontend)
FROM node:23-alpine AS builder

WORKDIR /app

# Copy only package.json and package-lock.json for efficient caching
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application (assuming 'npm run build' creates a 'dist' folder)
RUN npm run build

# Stage 2: Production (Nginx for serving static content)
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]