# Stage 1: Build
FROM node:22-alpine AS build

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy lockfile and package.json
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
# We assume 'pnpm build' generates the .output directory (TanStack Start default)
RUN pnpm build

# Stage 2: Production
FROM node:22-alpine AS runner

# Install pnpm for serving
RUN npm install -g pnpm

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy built assets from the build stage
# TanStack Start typically uses .output for the production server
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json

# Expose the default port (usually 3000 for TanStack Start)
EXPOSE 3000

# Command to start the production server
CMD ["pnpm", "start"]
