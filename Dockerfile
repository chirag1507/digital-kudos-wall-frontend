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

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set default backend URL
ENV BACKEND_URL=http://localhost:3001

# Create a script to substitute environment variables and start nginx
COPY <<EOF /docker-entrypoint.sh
#!/bin/sh
envsubst '\${BACKEND_URL}' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.tmp
mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'
EOF

RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start Nginx using our entrypoint script
CMD ["/docker-entrypoint.sh"] 