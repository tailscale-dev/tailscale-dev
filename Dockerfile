# -*- mode: dockerfile-mode; docker-image-name: "tailscale-dev"; -*-
# Install dependencies only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
# RUN npm ci

ENV NEXT_TELEMETRY_DISABLED 1

# Add `ARG` instructions below if you need `NEXT_PUBLIC_` variables
# then put the value on your fly.toml
# Example:
# ARG NEXT_PUBLIC_EXAMPLE="value here"

RUN yarn build

FROM golang:1.19 AS go
WORKDIR /usr/src/tailscale-dev

RUN apt update; apt install -y curl

# build main binary
COPY . .
ENV CGO_ENABLED=0
RUN ./tool/go build -v -o /usr/local/bin/tsdev-web ./cmd/web

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app ./
COPY --from=go /usr/local/bin/tsdev-web /usr/local/bin/tsdev-web

USER nextjs

CMD ["/usr/local/bin/tsdev-web"]
