# FROM oven/bun as builder

# ARG PUBLIC_DATABASE
# ENV PUBLIC_DATABASE=${PUBLIC_DATABASE}

# WORKDIR /app

# COPY . .
# ENV ORIGIN=https://zerzinator.cc-web.cloud

# RUN bun i
# RUN bun run build

# FROM oven/bun
# COPY --from=builder /app/build .

# ENV ORIGIN=https://zerzinator.cc-web.cloud

# EXPOSE 3001

# CMD [ "bun", "index.js" ]

#Dockerfile

# Use this image as the platform to build the app
FROM node:lts-alpine AS builder

# A small line inside the image to show who made it
LABEL Developers="Markus Hamacher"

ARG PUBLIC_DATABASE
ENV PUBLIC_DATABASE=${PUBLIC_DATABASE}
ENV TZ=Europe/Berlin

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /usr/src/app

# Copy all local files into the image
COPY . .

# Clean install all node modules
RUN npm ci

# remove potential security issues
RUN npm audit fix

# Build SvelteKit app
RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /usr/src/app/package*.json ./

RUN npm ci --omit dev

# remove potential security issues
RUN npm audit fix

# The USER instruction sets the user name to use as the default user for the remainder of the current stage
USER node:node
ENV TZ=Europe/Berlin

COPY --from=builder /usr/src/app/build ./build/

EXPOSE 3000

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node","build/index.js"]