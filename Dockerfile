# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:16-alpine AS builder

# Set the working directory in the Docker container
WORKDIR /app


COPY package*.json ./
RUN npm ci --only=production


COPY . .


ARG REACT_APP_BACK_END_API_BASE_URL
ENV REACT_APP_BACK_END_API_BASE_URL $REACT_APP_BACK_END_API_BASE_URL

RUN npm run build


FROM nginx:stable-alpine


COPY --from=builder /app/build /usr/share/nginx/html


EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
