#### builder
FROM node:18 as builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

ENV NODE_ENV production

COPY ./ ./
RUN npm run build

#### runner
FROM node:18 as runner
WORKDIR /app

RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/local/bin/dumb-init

ENV NODE_ENV production
EXPOSE 4000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist/

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

CMD ["node", "dist/index.mjs"]
