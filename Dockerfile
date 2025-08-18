# Stage 1: Build stage
FROM node:22.16.0 AS builder

# Set working directory
WORKDIR /app

# Install dependencies using Yarn
COPY package.json yarn.lock ./
RUN yarn install

# Copy source code and config
COPY . .

# Build the TypeScript project
RUN yarn build

# Copy doc folder into the dist directory
RUN cp -r doc dist/

# Stage 2: Production image
FROM node:22.16.0-alpine

# Set working directory
WORKDIR /app

# Copy compiled files and package info
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Set environment variable (optional)
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/src/index.js"]

