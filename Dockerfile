# Step 1: Use the official Node.js image as the base image
FROM node:16-alpine as development

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./
COPY .env .


# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
