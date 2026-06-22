# Use Node.js LTS version as the base image for the cron job runner
FROM node:23-slim

# Set working directory inside the container
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Command to run the scheduled cron jobs
CMD ["npm", "run", "cronJob"]
