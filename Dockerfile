# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the frontend
# This creates the 'dist' folder which the server will serve
RUN bun run build

# Expose the port the server listens on
EXPOSE 3020

# Start the server
CMD ["bun", "run", "server/index.ts"]
