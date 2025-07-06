FROM node:18

WORKDIR /app

COPY core-service/package*.json ./
RUN npm install

COPY shared ./shared
COPY core-service/. .

EXPOSE 3001
CMD ["node", "server.js"]
