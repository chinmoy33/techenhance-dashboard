FROM node:18

WORKDIR /app

COPY recommendation-service/package*.json ./
RUN npm install
RUN npm install nodemon --save-dev

EXPOSE 3002
CMD ["npm", "run", "dev"]