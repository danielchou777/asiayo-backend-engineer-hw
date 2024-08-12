# Stage 1: Build and Test
FROM node:20 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm test

# Stage 2: Production
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
EXPOSE 3000
CMD ["npm", "start"]