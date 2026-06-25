# Use Node.js LTS version as the base image for the worker
FROM node:23-slim

# Set working directory inside the container
WORKDIR /app


COPY package*.json ./

# Install production dependencies for the worker
RUN npm install --legacy-peer-deps

# Copy the rest of the application code, specifically the worker directory
COPY . .

# Command to run the worker application
CMD ["npm", "run", "emailWorker"]
