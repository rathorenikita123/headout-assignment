# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Set resource constraints
ENV NODE_OPTIONS="--max-old-space-size=1500"

# Define the command to run your application
CMD ["node", "index.js"]