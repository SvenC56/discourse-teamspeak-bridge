# frontend builder
FROM node:latest as frontend
WORKDIR /home/node/app
COPY ./frontend .
RUN yarn install --silent
RUN yarn generate

# backend builder
FROM node:latest as backend
WORKDIR /home/node/app
COPY . .
RUN yarn install --silent
# Generate Prisma Client
RUN yarn db:generate
RUN yarn build

# Node.JS Runner
FROM node:alpine as runner
LABEL maintainer="SvenC56 <https://github.com/svenc56>"

ENV PORT 3000
ENV NODE_ENV production

RUN mkdir -p /home/node/app && chown node /home/node/app
USER node
WORKDIR /home/node/app
# Copy Frontend Build
COPY --chown=node:node --from=frontend /home/node/app/dist ./frontend/dist
# Copy Backend Build
COPY --chown=node:node --from=backend /home/node/app/dist ./dist

# Install Production Dependencies
COPY --chown=node:node package.json package.json
COPY --chown=node:node yarn.lock yarn.lock
RUN yarn install --silent

# Prisma
RUN yarn global add prisma prisma-dbml-generator --non-interactive --silent
COPY --chown=node:node prisma .
RUN yarn db:generate

CMD ["sh", "-c", "yarn start:prod"]
EXPOSE ${PORT}