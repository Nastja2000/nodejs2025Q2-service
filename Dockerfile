FROM node:20-alpine as base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p migrations

RUN npx nest build

FROM node:20-alpine

WORKDIR /app

COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./
COPY --from=base /app/migrations ./migrations

CMD ["node", "dist/main.js"]
