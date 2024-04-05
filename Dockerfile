# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:16-alpine

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project directory to the working directory
COPY . .

# Set the backend API base URL as an environment variable
ARG REACT_APP_BACK_END_API_BASE_URL
ENV REACT_APP_BACK_END_API_BASE_URL $REACT_APP_BACK_END_API_BASE_URL

# Expose the port on which the frontend application will run
EXPOSE 3000

# Run the frontend application
CMD ["npm", "run", "start"]
