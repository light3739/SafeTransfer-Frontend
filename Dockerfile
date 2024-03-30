# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:16-alpine AS builder

# Set the working directory in the Docker container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of your app's source code
COPY . .

ARG REACT_APP_BACK_END_API_BASE_URL
ENV REACT_APP_BACK_END_API_BASE_URL $REACT_APP_BACK_END_API_BASE_URL

# Build the React app
RUN npm run build

# Use a minimal nginx image for serving the built app
FROM nginx:stable-alpine

# Copy the built app from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the port on which nginx listens
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
