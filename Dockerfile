FROM node:22-alpine AS base
ARG ENV_FILE=.env.development

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure .env file is copied, with fallback if missing
COPY ${ENV_FILE:-.env.development} .env
RUN corepack enable pnpm && pnpm run build
# Debug: List contents of /app and /app/build to verify build output
RUN ls -la /app && ls -la /app/build || echo "build directory not found"

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 svelte
# Copy the build output
COPY --from=builder --chown=svelte:nodejs /app/build ./build
# Copy node_modules for runtime dependencies
COPY --from=builder --chown=svelte:nodejs /app/node_modules ./node_modules
# Copy static assets for SvelteKit
COPY --from=builder --chown=svelte:nodejs /app/static ./static
# Copy .env file for runtime environment variables
COPY --from=builder --chown=svelte:nodejs /app/.env ./.env

USER svelte

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "build/index.js"]