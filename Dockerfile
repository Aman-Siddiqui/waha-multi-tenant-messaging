FROM node:18-alpine AS base
WORKDIR /usr/src/app
ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS run
WORKDIR /usr/src/app
COPY --from=base /usr/src/app /usr/src/app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
