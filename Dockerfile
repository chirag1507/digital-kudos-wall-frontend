# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Set default backend URL
ENV BACKEND_URL=http://localhost:3001

# Expose port 80
EXPOSE 80

# Use the official Nginx Docker entrypoint which handles template substitution
CMD ["nginx", "-g", "daemon off;"] 