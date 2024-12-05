# Use the Node.js image to build the application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build

# Use a lightweight image to serve the build files
FROM node:18-alpine

# Install a lightweight HTTP server (http-server)
RUN npm install -g http-server

# Set the working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/build ./build

# Expose the desired port
EXPOSE 8370

# Start the HTTP server to serve the build directory
CMD ["http-server", "build", "-p", "8370"]
