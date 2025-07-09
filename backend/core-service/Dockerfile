# FROM node:18

# WORKDIR /app

# COPY core-service/package*.json ./
# RUN npm install
# RUN npm install nodemon --save-dev

# EXPOSE 3001
# CMD ["npm", "run", "dev"]
FROM node:18

WORKDIR /app

COPY core-service/package*.json ./ 
RUN npm install
RUN npm install nodemon --save-dev

EXPOSE 3001
CMD ["npm", "run", "dev"]
